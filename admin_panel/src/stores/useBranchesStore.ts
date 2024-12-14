import {create} from 'zustand'
import {
  BranchAddressCreate,
  BranchAddressUpdate,
  BranchCategory, BranchCreate,
  BranchProductCreate,
  BranchProductRead,
  BranchRead
} from "../models.ts";

type Values = {
  branches: BranchRead[]
  branch: BranchRead | undefined
  branchAdd: BranchCreate | undefined
  branchProductAdd: BranchProductCreate | undefined
  branchProduct: BranchProductRead | undefined
  isActionSuccess: boolean
  branchAddress: BranchAddressUpdate | undefined
  branchAddAddress: BranchAddressCreate | undefined
  productsList: BranchCategory[] | undefined
}

type Actions = {
  setBranches: (branches: BranchRead[]) => void
  setBranch: (branch: BranchRead | undefined) => void
  setBranchAdd: (branch: BranchCreate | undefined) => void
  setBranchProductAdd: (branchProduct: BranchProductCreate | undefined) => void
  setBranchProduct: (branchProduct: BranchProductRead | undefined) => void
  setIsActionSuccess: (isActionSuccess: boolean) => void
  setBranchAddress: (branchAddress: BranchAddressUpdate | undefined) => void
  setBranchAddAddress: (branchAddAddress: BranchAddressCreate | undefined) => void
  setProductsList: (productsList: BranchCategory[] | undefined) => void
}

export const useBranchesStore = create<Values & Actions>((set) => ({
  branches: [],
  branch: undefined,
  branchAdd: undefined,
  branchProductAdd: undefined,
  branchProduct: undefined,
  isActionSuccess: false,
  branchAddress: undefined,
  branchAddAddress: undefined,
  productsList: undefined,

  setProductsList: (productsList) => set({
    productsList: productsList,
    branchAddress: undefined,
    branchAddAddress: undefined


  }),
  setBranchAddress: (branchAddress) => set({
    branchAddress: branchAddress,
    isActionSuccess: false,
    branchAddAddress: undefined,
    branchProduct: undefined,
    branchProductAdd: undefined,
    productsList: undefined
  }),
  setBranchAddAddress: (branchAddAddress) => set({
    branchAddAddress: branchAddAddress,
    isActionSuccess: false,
    branchAddress: undefined,
    branchProduct: undefined,
    branchProductAdd: undefined,
    productsList: undefined
  }),
  setBranches: (branches) => set({branches: branches}),
  setBranch: (branch) => set({
    branch: branch,
    branchAdd: undefined,
    isActionSuccess: false,
    branchProductAdd: undefined,
    branchProduct: undefined,
    branchAddAddress: undefined,
    productsList: undefined
  }),
  setBranchAdd: (branch) => set({
    branchAdd: branch,
    isActionSuccess: false,
    branchProductAdd: undefined,
    branchAddress: undefined,
    branchProduct: undefined,
    branchAddAddress: undefined,
    branch: undefined,
    productsList: undefined
  }),
  setBranchProductAdd: (branchProduct) => set({
    branchProductAdd: branchProduct,
    branchAddress: undefined,
    branchProduct: undefined,
    branchAddAddress: undefined,
    isActionSuccess: false
  }),
  setBranchProduct: (branchProduct) => set({
    branchProduct: branchProduct,
    isActionSuccess: false,
    branchAddAddress: undefined,
    branchProductAdd: undefined,
    branchAddress: undefined,
  }),
  setIsActionSuccess: (isActionSuccess) => set({
    isActionSuccess: isActionSuccess
  }),
}))
