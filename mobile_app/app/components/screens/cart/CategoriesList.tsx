import {Image, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {Category} from "../../../../types/models";
import {useUIStore} from "../../../../stores/useUIStore";
import {useDataStore} from "../../../../stores/useDataStore";
import {useTypedNavigation} from "../../../../hooks/useTypedNavigation";
import {url} from "../../../../requests/load_data";


const CategoriesList = () => {

  const {navigate} = useTypedNavigation()

  const dataStore = useDataStore(state => state)

  const uiStore = useUIStore(state => state)

  const onPressCategory = (category: Category) => {
    if (!dataStore.categories) return
    uiStore.setSelectedCategory(category)
    navigate('SubCategoryList')
  }

  return (
    <View className='w-full h-auto'>
      {dataStore.categories.map(category => (
        <TouchableOpacity
            onPress={() => onPressCategory(category)}
            key={category.name}
            className='flex-row w-full flex items-center justify-between bg-white rounded-2xl p-4 aspect-[3.7/1] mb-2'
          >
            <View className='flex h-auto'>
              <Text className="text-xl font-bold mb-2">{category.name || ''}</Text>
            </View>
            <View className='flex aspect-square h-full'>
              <Image
                className="w-full h-full flex-1 flex justify-end"
                source={{uri: url + category.imagePath}}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
      ))}
    </View>
  )
}

export default CategoriesList