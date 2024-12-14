import {create} from 'zustand'
import {CategoryRead, SearchCreate, SearchRead, SubCatgeoryRead} from "../models.ts";

type Values = {
  categories: CategoryRead[]
  category?: CategoryRead
  isUpdateSuccess: boolean
  search?: SearchRead
  searchAdd?: SearchCreate
  isSearchAdd: number
  isSearchAddSuccess: boolean
  subCategory?: SubCatgeoryRead
  subCategoryAdd?: SubCatgeoryRead
  isSubCategoryAddSuccess: boolean
  isSubCategoryAdd: number
  imageError: boolean
  isSubCategoryUpdateSuccess: boolean
}

type Actions = {
  setCategory: (category: CategoryRead | undefined) => void
  setCategories: (categories: CategoryRead[]) => void
  setIsUpdateSuccess: (isUpdateSuccess: boolean) => void
  setSearch: (search: SearchRead | undefined) => void
  setSearchAdd: (navigationAdd: SearchCreate | undefined) => void
  setIsSearchAdd: (isSearchAdd: number) => void
  setIsSearchAddSuccess: (isSearchAddSuccess: boolean) => void
  updateCategory: (category: CategoryRead) => void
  setSubCategory: (subcategory: SubCatgeoryRead | undefined) => void
  setSubCategoryAdd: (subcategoryAdd: SubCatgeoryRead | undefined) => void
  setIsSubCategoryAddSuccess: (isSubcategoryAddSuccess: boolean) => void
  setIsSubCategoryAdd: (isSubcategoryAdd: number) => void
  setImageError: (imageError: boolean) => void
  setIsSubCategoryUpdateSuccess: (isSubcategoryUpdateSuccess: boolean) => void
}

export const useCategoriesStore = create<Values & Actions>((set) => ({
  categories: [],
  category: undefined,
  isUpdateSuccess: false,
  search: undefined,
  searchAdd: undefined,
  isSearchAdd: -1,
  isSearchAddSuccess: false,
  subCategory: undefined,
  subCategoryAdd: undefined,
  isSubCategoryAddSuccess: false,
  isSubCategoryAdd: -1,
  imageError: false,
  isSubCategoryUpdateSuccess: false,

  setIsSubCategoryUpdateSuccess: (isSubcategoryUpdateSuccess) => set({isSubCategoryUpdateSuccess: isSubcategoryUpdateSuccess}),
  setImageError: (imageError) => set({imageError: imageError}),
  setIsSearchAddSuccess: (isSearchAddSuccess) => set({isSearchAddSuccess: isSearchAddSuccess}),
  setIsSearchAdd: (isSearchAdd) => set({isSearchAdd: isSearchAdd, isUpdateSuccess: false, search: undefined}),
  setSearchAdd: (searchAdd) => set({searchAdd: searchAdd, isUpdateSuccess: false}),
  setSearch: (search) => set({search: search, isUpdateSuccess: false, isSearchAdd: -1}),
  updateCategory: (category) => set({category: category, isUpdateSuccess: true}),
  setCategory: (category) => set({category: category, isUpdateSuccess: false, isSearchAdd: -1}),
  setCategories: (categories) => set(() => ({categories: categories, isUpdateSuccess: false})),
  setIsUpdateSuccess: (isUpdateSuccess) => set(() => ({isUpdateSuccess: isUpdateSuccess})),
  setSubCategory: (subCategory) => set({subCategory: subCategory, isSubCategoryAddSuccess: false, isSubCategoryUpdateSuccess: false, imageError: false, isSubCategoryAdd: -1}),
  setSubCategoryAdd: (subcategoryAdd) => set({subCategoryAdd: subcategoryAdd, isSubCategoryAddSuccess: false}),
  setIsSubCategoryAddSuccess: (isSubcategoryAddSuccess) => set({isSubCategoryAddSuccess: isSubcategoryAddSuccess}),
  setIsSubCategoryAdd: (isSubCategoryAdd) => set({isSubCategoryAdd: isSubCategoryAdd, isSubCategoryAddSuccess: false, subCategoryAdd: undefined, subCategory: undefined}),
}))
