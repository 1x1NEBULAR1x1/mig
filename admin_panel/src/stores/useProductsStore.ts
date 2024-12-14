import {create} from 'zustand'
import {ProductContainsCreate, ProductCreate, ProductRead, ProductTagCreate} from "../models.ts";

type Values = {
  product: ProductRead | undefined
  productAdd: ProductCreate | undefined
  isProductAdd: number
  imageError: boolean
  productContainsAdd: ProductContainsCreate | undefined
  isActionSuccess: boolean
  productTagAdd: ProductTagCreate | undefined
}

type Actions = {
  setProduct: (product: ProductRead | undefined) => void
  setProductAdd: (product: ProductCreate | undefined) => void
  setIsProductAdd: (subCaregoryId: number) => void
  setImageError: (imageError: boolean) => void
  setProductContainsAdd: (productContainsAdd: ProductContainsCreate | undefined) => void
  setIsActionSuccess: (isActionSuccess: boolean) => void
  setProductTagAdd: (productTagAdd: ProductTagCreate | undefined) => void
}

const procuctCreate: ProductCreate = {
  name: '',
  amount: 0,
  unitsOfMeasure: '',
  price: 0,
  previousPrice: 0,
  expiration: '',
  storage: '',
  manufacturer: '',
  compound: '',
  isAvailable: true,
  imagePath: '',
  description: '',
  subCategoryId: 0,
  tags: [],
  contains: []
}

export const useProductsStore = create<Values & Actions>((set) => ({
  product: undefined,
  productAdd: undefined,
  isProductAdd: -1,
  imageError: false,
  productContainsAdd: undefined,
  isActionSuccess: false,
  productTagAdd: undefined,

  setProductTagAdd: (productTagAdd) => set(() => ({productTagAdd: productTagAdd})),
  setIsActionSuccess: (isActionSuccess: boolean) => set({isActionSuccess: isActionSuccess}),
  setProductContainsAdd: (productContainsAdd: ProductContainsCreate | undefined) => set({productContainsAdd: productContainsAdd}),
  setImageError: (imageError: boolean) => set({imageError}),
  setProduct: (product: ProductRead | undefined) => set({product: product, isProductAdd: -1, isActionSuccess: false}),
  setProductAdd: (product: ProductCreate | undefined) => set({isActionSuccess: false, productAdd: product}),
  setIsProductAdd: (subCaregoryId: number) => set({isProductAdd: subCaregoryId, productAdd: procuctCreate, product: undefined}),
}))
