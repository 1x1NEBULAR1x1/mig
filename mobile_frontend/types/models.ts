export type City = {
  name: string
  isAvailable: boolean
  id: number
}

export type SubCategory = {
  name: string
  id: number
  products?: Product[]
  imagePath: string
}

export type Category = {
  name: string
  id: number
  subCategories?: SubCategory[]
  imagePath: string
  searches?: Search[]
}

export type Search = {
  name: string
  id: number
  categoryId: number
  subCategoryId: number
}

export type Product = {
  id: number
  name: string
  price: number
  amount: number
  unitsOfMeasure: string
  tags?: Tag[]
  isAvailable: boolean
  description: string
  imagePath: string
  categoryId: number
  subCategoryId?: number
  availableAmount: number
  contains?: ProductContains[]
  compound?: string
  expiration?: string
  storage?: string
  manufacturer?: string
  previousPrice?: number
}

export type ProductContains = {
  id: number
  amount: string
  name: string
}

export type Tag = {
  name: string
  firstColor: string
  secondColor: string
  id: number
}

export type User = {
  name: string
  cityId: number
  phoneNumber: string
  id: number
  isBanned: boolean
  addresses: Address[]
  orders: Order[]
}

export type CartProduct = {
  product: Product
  amount: number
}

export type OrderCreate = {
  address: Address
  products: CartProduct[]
  paymentMethod: string
  deliveryPrice: number
  curierTips: number
  priority: OrderPriority
  totalPrice?: number
  tax: number
}

export type OrderPriority = {
  id: number
  name: string
  priority: number
  extraCost: number
}

export type Address = {
  id?: number
  street: string
  house: string
  floor: string
  flat: string
  comment?: string
  entrance?: string
  latitude?: number
  longitude?: number
  cityId: number
}

export type Order = {
  products: OrderProduct[]
  address: Address
  id: number
  created: Date
  finished?: Date
  status: OrderStatus
  totalPrice: number
  paymentMethod: string
  deliveryPrice: number
  curierTips: number
  priority: OrderPriority
  timeToDelivery: string
  isPaymentAccepted: boolean
  tax: number
  priorityId: number
}

export type OrderStatus = {
  id: number
  name: string
  fullStatus: string
  description: string
}

export type OrderProduct = {
  id: number
  orderId: number
  productId: number
  amount: number
  branchId: number
  product: Product
}