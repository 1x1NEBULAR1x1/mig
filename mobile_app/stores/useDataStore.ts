import { create } from 'zustand'
import {type CartProduct, Category, Order, OrderPriority, User} from "../types/models";


type Values = {
  categories: Category[]
  cart: CartProduct[]
  number?: string
  isVerified?: boolean
  orders: Order[]
  orderPriorities: OrderPriority[]
  user: User | undefined
}


type Actions = {
  setOrderPriorities: (orderPriorities: OrderPriority[] | undefined) => void
  setIsVerified: (isVerified: boolean) => void
  setNumber: (number: string | undefined) => void
  setCategories: (categories: Category[]) => void
  addToCart: (product: CartProduct) => void
  removeAllFromCart: (product: CartProduct) => void
  updateCartProduct: (product: CartProduct) => void
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  logout: () => void
  setUser: (user: User | undefined) => void
  removeAllCart: () => void
}

export const useDataStore = create<Values & Actions>((set) => ({
  categories: [],
  cart: [],
  orders: [],
  orderPriorities: [],
  user: undefined,
  removeAllCart: () => set(() => ({ cart: [] })),
  setOrderPriorities: (orderPriorities) => set(() => ({orderPriorities: orderPriorities})),
  logout: () => set(() => ({ categories: [], cart: [], orders: [], number: undefined, isVerified: false })),
  setOrders: (orders: Order[]) => set(() => ({ orders: orders })),
  addOrder: (order: Order) => set((state) => ({ orders: [...state.orders, order] })),
  setIsVerified: (isVerified) => set(() => ({ isVerified: isVerified })),
  setNumber: (number) => set(() => ({ number: number })),
  setUser: (user) => set(() => ({ user: user})),
  addToCart: (product) => set((state) => {
    const updatedCategories = state.categories.map((category) => {
      if (category.id !== product.product.categoryId) return category;

      return {
        ...category,
        subCategories: category.subCategories?.map((subCategory) => {
          if (subCategory.id !== product.product.subCategoryId) return subCategory;

          return {
            ...subCategory,
            products: subCategory.products?.map((subProduct) => {
              if (subProduct.id !== product.product.id) return subProduct;
              return {
                ...subProduct,
                availableAmount: subProduct.availableAmount - 1,
              };
            }),
          };
        }),
      };
    });

    // Добавляем товар в корзину и обновляем состояние
    return {
      cart: [...state.cart, product],
      categories: updatedCategories,
    };
  }),
  updateCartProduct: (product: CartProduct) => set((state) => {
  const cartIndex = state.cart.findIndex((cartProduct) => cartProduct.product.id === product.product.id);
  if (cartIndex === -1) {
    return state;
  }
  if (product.amount === 0) {
    const updatedCart = state.cart.filter((_, index) => index !== cartIndex);
    return {
      cart: updatedCart,
      categories: state.categories,
    };
  } else if (product.amount > 0 && product.amount <= product.product.availableAmount) {
    const updatedCart = [...state.cart];
    updatedCart[cartIndex] = product;
    return {
      cart: updatedCart,
      categories: state.categories,
    };
  } else {
    console.log('Amount exceeds available amount');
    return state;
  }
}),



  removeAllFromCart: (product) => set((state) => ({ cart: state.cart.filter((cartProduct) => cartProduct.product.id !== product.product.id) })),
  setCategories: (categories: Category[]) => set(() => ({ categories: categories }))
}))