import {Text, Pressable, ScrollView, View} from "react-native";
import {useUIStore} from "../../../../stores/useUIStore";
import React from "react";

const SubCategoryHeader = () => {
  const uiStore = useUIStore(state => state)
  if (!uiStore.selectedCategory) return null

  return uiStore.selectedCategory.subCategories && (
    <ScrollView
      className="flex flex-row h-auto pb-5 p-2 w-full bg-white"
      horizontal
      showsHorizontalScrollIndicator={false}

    >
      {uiStore.selectedCategory?.subCategories?.map(subCategory => {
        return (
          <Pressable
            key={`category-${uiStore.selectedCategory?.name}-subCategory-${subCategory.id}-${subCategory.name}`}
            className={uiStore.selectedSubCategory?.id === subCategory.id
              ? 'flex h-12 text-center p-2 rounded-3xl items-center justify-center bg-[#EEEFF3]'
              : 'flex h-12 text-center p-2 rounded-3xl items-center justify-center'}
            onPress={() => uiStore.setSelectedSubCategory(subCategory)}
          >
            <Text
              className={uiStore.selectedSubCategory?.id === subCategory.id
                ? "text-sm text-center text-nowrap text-[#1B9F01] transition-all duration-100"
                : "text-sm text-center text-nowrap text-[#56585F] transition-all duration-100"}
            >{subCategory.name}</Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

export default SubCategoryHeader