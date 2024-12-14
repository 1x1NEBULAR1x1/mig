export type UserRead = {
  id: number
  phoneNumber: number
  isBanned: boolean
  cityId: number
  addresses: UserAddressRead[]
  orders: OrderRead[]
  city: CityRead
  created: string
  updated: string
}

export type UserUpdate = {
  id: number
  phoneNumber?: number
  isBanned?: boolean
  cityId?: number
  addresses?: UserAddressRead[]
  orders?: OrderRead[]
  city?: CityRead
}

export type CityRead = {
  id: number
  name: string
  users: UserRead[]
  branches: BranchRead[]
  isAvailable: boolean
  curiers: CurierRead[]
  created: string
  updated: string
}

export type CityCreate = {
  name: string
  isAvailable?: boolean
}

export type CityUpdate = {
  id: number
  name?: string
  branches?: BranchRead[]
  curiers?: CurierRead[]
  isAvailable?: boolean
}

export type AddressRead = {
  id: number
  cityId: number
  street: string
  house: string
  floor: string
  flat: string
  comment: string
  entrance: string
  latitude: number
  longitude: number
  created: string
  updated: string
}

export type UserAddressRead = AddressRead & {
  userId: number
}

export type BranchAddressRead = AddressRead & {
  branchId: number
}

export type AddressCreate = {
  cityId: number
  street: string
  house: string
  floor: string
  flat: string
  comment: string
  entrance: string
  latitude: number
  longitude: number
}

export type BranchAddressCreate = AddressCreate & {
  branchId: number
}

export type AddressUpdate = {
  id: number
  cityId?: number
  street?: string
  house?: string
  floor?: string
  flat?: string
  comment?: string
  entrance?: string
  latitude?: number
  longitude?: number
}

export type BranchAddressUpdate = AddressUpdate & {
  branchId?: number
}

export type UserAddressUpdate = AddressUpdate & {
  userId?: number
}

export type BranchRead = {
  id: number
  name: string
  cityId: number
  address: BranchAddressUpdate
  products: BranchProductUpdate[]
  description: string
  created: string
  updated: string
}

export type BranchCreate = {
  name: string
  cityId: number
  address: BranchAddressCreate
  isAvailable?: boolean
  description?: string
}

export type BranchUpdate = {
  id: number
  name?: string
  cityId?: number
  address?: BranchAddressUpdate
  products: BranchProductUpdate[]
}

export type BranchProductRead = {
  id: number
  branchId: number
  productId: number
  amount: number
  isAvailable: boolean
  created: string
  updated: string
  product: ProductRead
  reservation: number
}

export type BranchProductCreate = {
  branchId: number
  productId: number
  amount: number
  isAvailable?: boolean
  reservation?: number
}

export type BranchProductUpdate = {
  id: number
  branchId?: number
  productId?: number
  amount?: number
  isAvailable?: boolean
  reservation?: number
}

export type ProductRead = {
  id: number
  name: string
  price: number
  amount: number
  unitsOfMeasure: string
  isAvailable: boolean
  imagePath: string
  compound: string
  storage: string
  manufacturer: string
  description: string
  tags: ProductTagRead[]
  contains: ProductContainsRead[]
  subCategoryId: number
  expiration: string
  created: string
  updated: string
  previousPrice?: number
}

export type ProductCreate = {
  name: string
  price: number
  amount: number
  unitsOfMeasure: string
  isAvailable?: boolean
  imagePath: string
  compound: string
  storage: string
  manufacturer: string
  description: string
  tags: ProductTagCreate[]
  contains: ProductContainsUpdate[]
  subCategoryId: number
  expiration: string
  previousPrice?: number
}

export type ProductUpdate = {
  id: number
  name?: string
  price?: number
  amount?: number
  unitsOfMeasure?: string
  isAvailable?: boolean
  imagePath?: string
  compound?: string
  storage?: string
  manufacturer?: string
  description?: string
  tags?: ProductTagRead[]
  contains?: ProductContainsRead[]
  subCategoryId?: number
  expiration?: string
  previousPrice?: number
}

export type ProductTagRead = {
  id: number
  name: string
  firstColor: string
  secondColor: string
  isActive: boolean
  created: string
  updated: string
}

export type ProductTagCreate = {
  productId: number
  id: number
  name: string
  firstColor: string
  secondColor: string
}

export type ProductTagUpdate = {
  productId: number
  id: number
  name?: string
  firstColor?: string
  secondColor?: string
  isActive?: boolean
}

export type ProductContainsRead = {
  id: number
  name: string
  amount: string
  productId: number
  created: string
  updated: string
}

export type ProductContainsCreate = {
  name: string
  amount: string
  productId: number
}

export type ProductContainsUpdate = {
  id: number
  name?: string
  amount?: string
  productId: number
}

export type CategoryRead = {
  id: number
  name: string
  imagePath: string
  subCategories: SubCatgeoryRead[]
  searches: SearchRead[]
  created: string
  updated: string
}

export type BranchCategory = {
  id: number
  name: string
  sub_categories: BranchSubCatgeory[]
  image_path: string
}

export type BranchSubCatgeory = {
  id: number
  name: string
  image_path: string
  branch_products: BranchProduct[]
  is_available: boolean
}

export type BranchProduct = {
  id: number
  is_available: boolean
  amount: number
  product: Product
}

export type Product = {
  id: number
  name: string
  price: number
  image_path: string
}

export type SearchRead = {
  id: number
  name: string
  categoryId: number
  subCategoryId: number
  created: string
  updated: string
}

export type SearchCreate = {
  name: string
  categoryId: number
  subCategoryId: number
}

export type SearchUpdate = {
  id: number
  name?: string
  categoryId?: number
  subCategoryId?: number
}

export type CategoryCreate = {
  name: string
  imagePath: string
  subCategories: SubCatgeoryRead[]
}

export type CategoryUpdate = {
  id: number
  name?: string
  imagePath?: string
  subCategories?: SubCatgeoryRead[]
}

export type SubCatgeoryRead = {
  id: number
  name: string
  imagePath: string
  categoryId: number
  products: ProductRead[]
  created: string
  updated: string
  isAvailable: boolean
}

export type SubCatgeoryCreate = {
  name: string
  imagePath: string
  categoryId: number
  isAvailable?: boolean
  products: ProductRead[]
}

export type SubCatgeoryUpdate = {
  id: number
  name?: string
  imagePath?: string
  categoryId?: number
  isAvailable?: boolean
  products?: ProductRead[]
}

export type OrderStatusRead = {
  id: number
  name: string
  fullStatus: string
  description: string
  created: string
  updated: string
}

export type OrderStatusCreate = {
  name: string
  fullStatus: string
  description: string
}

export type OrderStatusUpdate = {
  id: number
  name?: string
  fullStatus?: string
  description?: string
}

export type OrderPriorityRead = {
  id: number
  name: string
  priority: number
  created: string
  updated: string
  extraCost: number
}

export type OrderPriorityCreate = {
  name: string
  priority: number
  extraCost: number
}

export type OrderPriorityUpdate = {
  id: number
  name?: string
  priority?: number
  extraCost?: number
}

export type CurierRead = {
  id: number
  fullName: string
  username: string | undefined
  cityId: number
  phoneNumber: string
  isAvailable: boolean
  isBanned: boolean
  telegramId: number
  balance: number
  created: string
  updated: string
  orderId: number | null
}

export type CurierUpdate = {
  id: number
  fullName?: string
  username?: string
  cityId?: number
  phoneNumber?: string
  isAvailable?: boolean
  isBanned?: boolean
  telegramId?: number
  balance?: number
  orderId?: number | null
}

export type OrderProductRead = {
  id: number
  orderId: number
  productId: number
  product: ProductRead
  amount: number
  branchId: number
  created: string
  updated: string
  isAvailable: boolean
}

export type OrderProductCreate = {
  orderId: number
  productId: number
  amount: number
  branchId: number
  isAvailable?: boolean
}

export type OrderProductUpdate = {
  id: number
  orderId?: number
  productId?: number
  amount?: number
  branchId?: number
  isAvailable?: boolean
}

export type OrderRead = {
  id: number
  statusId: number
  status: OrderStatusRead
  priorityId: number
  priority: OrderPriorityRead
  curierId: number
  curier: CurierRead
  addressId: number
  address: UserAddressRead
  userId: number
  user: UserRead
  products: OrderProductRead[]
  finished: string | undefined
  curierTips: number
  totalPrice: number
  deliveryPrice: number
  paymentMethod: string
  timeToDelivery: string
  created: string
  updated: string
}

export type OrderUpdate = {
  id: number
  statusId?: number
  priorityId?: number
  curierId?: number
  addressId?: number
  userId?: number
  products?: OrderProductUpdate[]
  finished?: string
  cancelled?: boolean
  curierTips?: number
  totalPrice?: number
  deliveryPrice?: number
  paymentMethod?: string
  timeToDelivery?: string
}

export type CurierOrderHistoryRead = {
  id: number
  curierId: number
  curier: CurierRead
  orderId: number
  order: OrderRead
  created: string
  updated: string
}

export type CurierOrderHistoryUpdate = {
  id: number
  curierId?: number
  orderId?: number
}