import {SubCategory as SubCategoryType} from "../../../../types/models";
import {FC} from "react";
import {View, Text, Image, FlatList} from "react-native";
import Product from "./Product";
import {url} from "../../../../requests/load_data";

interface ISubCategory {
  subCategory: SubCategoryType
}

const SubCategory: FC<ISubCategory> = ({subCategory}) => {
  return (
    <View className='w-full h-auto mb-4'>
      <View className='flex w-full rounded-2xl p-4 flex-row bg-white items-center gap-4 mb-4'>
        <Image
          source={{uri: `${url}${subCategory.imagePath}`}}
          className='w-12 h-12 aspect-square rounded'
        />
        <Text className='text-black text-lg text-center'>{subCategory.name}</Text>
      </View>
      <FlatList
        numColumns={2}
        className='gap-4 flex-col '
        data={subCategory.products}
        renderItem={({item}) => (<Product product={item} key={item.id} />)}
      />
    </View>
  )
}

export default SubCategory