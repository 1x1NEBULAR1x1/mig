import {Image, Pressable, Text, TouchableOpacity, View} from "react-native";
import {useDataStore} from "../../../../stores/useDataStore";
import {useTypedNavigation} from "../../../../hooks/useTypedNavigation";
import {useCitiesStore} from "../../../../stores/useCitiesStore";
import {useCatalog} from "../../../../hooks/useCatalog";
import React, {FC, ReactNode, useEffect} from "react";
import {Category, City, Search} from "../../../../types/models";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useUIStore} from "../../../../stores/useUIStore";
import Spinner from "react-native-loading-spinner-overlay";
import {url} from "../../../../requests/load_data";

const SelectCategory = ({city}: {city: City}) => {
  const {bottom} = useSafeAreaInsets()
  const dataStore = useDataStore(state => state)
  const citiesStore = useCitiesStore(state => state)
  const {categories, isLoading, isSuccess} = useCatalog(city.id)
  const uiStore = useUIStore(state => state)
  const { navigate } = useTypedNavigation()

  const onPressSearch = (search: Search) => {
    if (!dataStore.categories) return
    const subCategory = dataStore.categories.find(c => c.id === search.categoryId)?.subCategories?.find(s => s.id === search.subCategoryId)
    if (!subCategory) return
    uiStore.setSelectedSubCategory(subCategory)
    navigate('SubCategoryList')
  }

  const onPressCategory = (category: Category) => {
    if (!dataStore.categories) return
    uiStore.setSelectedCategory(category)
    navigate('SubCategoryList')
  }

  useEffect(() => {
    if (categories && isSuccess) {
      dataStore.setCategories(categories)
    }
  }, [categories, isSuccess]);

  return (
    <View className='w-full h-full p-4 flex-col justify-end gap-2'>
      {isLoading && <Spinner
        visible={true}
        textContent={"Загрузка каталога..."}
        textStyle={{ color: "#1B9F01" }}
      />}
      {dataStore.categories?.map(category => (
        <TouchableOpacity
          onPress={() => onPressCategory(category)}
          key={category.name}
          className='flex-row flex justify-between bg-white rounded-2xl p-4 h-[21.3%]'
        >
          <View className='flex w-65% h-auto'>
            <Text className="text-xl font-bold mb-2">{category.name || ''}</Text>
            {category.searches?.map(search => {
              return (
                <Pressable
                  key={search.name}
                  className='w-auto'
                  onPress={() => onPressSearch(search)}
                >
                  <Text className="text-xs">{search.name}</Text>
                </Pressable>
              )
            })}
          </View>
          <Image
            className="w-[38%] h-[100%]"
            source={{uri: url + category.imagePath}}
          />
        </TouchableOpacity>
      ))}
      <Pressable
        style={{marginBottom: bottom + 25}}
        className='w-full h-[5%] bg-[#1B9F01] rounded-2xl items-center justify-center'
        onPress={() => {citiesStore.setSelectedCity(undefined); navigate('Home')}}
      >
        <Text className="text-white font-bold">Вернуться к выбору города</Text>
      </Pressable>
    </View>
  )
}

export default SelectCategory