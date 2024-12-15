import {ScrollView, View, Text, Image, Pressable} from "react-native";
import {useUIStore} from "../../../../stores/useUIStore";
import {type SubCategory} from "../../../../types/models";
import {useTypedNavigation} from "../../../../hooks/useTypedNavigation";
import {url} from "../../../../requests/load_data";


const SubCategoryList = () => {
  const uiStore = useUIStore(state => state)

  if (!uiStore.selectedCategory) return <View />

  const {navigate} = useTypedNavigation()

  const onPressSubCategory = (subCategory: SubCategory) => {
    uiStore.setSelectedSubCategory(subCategory)
    navigate('SubCategoryScreen')
  }

  const onPressAll = () => {
    navigate('Category')
  }

  return (
    <View className='w-full h-full pt-11 p-2 bg-[#EEEFF3] flex flex-col gap-2'>
      <View className='h-auto p-2 bg-white rounded-2xl'>
        <Text className='text-xl text-center'>Выберите подкатегорию товаров</Text>
      </View>
      <ScrollView className='p-4 bg-white rounded-2xl'>
        <View className='flex flex-col h-full justify-between'>
        <View className='flex flex-col h-[75vh] gap-2'>
          {uiStore.selectedCategory.subCategories?.map((subCategory, index) => (
          <View key={subCategory.name}>
            {index !== 0 && <View className='w-full h-[1px] bg-gray-300' />}
            <Pressable
              className='w-full h-auto flex flex-row gap-4 my-2 justify-between px-2'
              onPress={() => onPressSubCategory(subCategory)}
            >
              <View className='w-auto h-auto'>
                <Text className='w-auto text-lg font-semibold'>{subCategory.name}</Text>
              </View>
              <View className='h-16 flex w-16 items-center justify-center rounded'>
                <Image
                  source={{uri: url + subCategory.imagePath}}
                  resizeMode='contain'
                  className='w-full h-full rounded'
                />
              </View>
            </Pressable>
          </View>
        ))}</View>
        <Pressable
          className='w-full h-auto flex flex-row gap-4 justify-between px-2'
          onPress={onPressAll}
        >
          <View className='w-auto h-auto'>
            <Text className='w-auto text-lg font-semibold'>Все продукты</Text>
          </View>
          <View className='h-16 flex w-16 items-center justify-center rounded'>
            <Image
              source={{uri: url + uiStore.selectedCategory.imagePath}}
              resizeMode='contain'
              className='w-full h-full rounded'
            />
          </View>
        </Pressable>
        </View>
      </ScrollView>

    </View>
  )
}

export default SubCategoryList