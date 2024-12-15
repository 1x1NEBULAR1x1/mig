import {FlatList, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent, View, Text} from "react-native";
import React, {useEffect, useRef} from "react";
import Header from "./Header";
import {useUIStore} from "../../../../stores/useUIStore";
import SubCategoryHeader from "./SubCategoryHeader";
import Product from "./Product";

const {width} = Dimensions.get('window')

const SubCategoryScreen = () => {
  const selectedSubCategory = useUIStore((state) => state.selectedSubCategory)
  const setSelectedSubCategory = useUIStore((state) => state.setSelectedSubCategory)

  const subCategories = useUIStore((state) => state.selectedCategory!.subCategories);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);

    if (index >= 0 && index < subCategories!.length) {
      const newSubCategory = subCategories![index];
      if (newSubCategory !== selectedSubCategory) {
        setSelectedSubCategory(newSubCategory);
      }
    }
  };

  useEffect(() => {
    if (!selectedSubCategory) return;

    const index = subCategories!.findIndex(
      (subCategory) => subCategory.id === selectedSubCategory.id
    );

    if (index !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * width,
        animated: true,
      });
    }
  }, [selectedSubCategory, subCategories]);

  const uiStore = useUIStore(state => state)

  return (
    <>
      <Header />
      {uiStore.selectedCategory?.subCategories &&<SubCategoryHeader/>}
      {uiStore.selectedCategory?.subCategories?.length ? (<ScrollView
          ref={scrollViewRef}
          onMomentumScrollEnd={handleScroll}
          horizontal
          persistentScrollbar={false}
          pagingEnabled
          className="w-auto h-full bg-[#EEEFF3]"
        >
          {subCategories?.map((subCategory) => (
            <View
              className='flex w-screen flex-col p-4 h-auto gap-2'
              key={`category-${uiStore.selectedCategory?.name}-subCategory-${subCategory.id}-${subCategory.name}`}
            >
              <FlatList
                numColumns={2}
                className='gap-4'
                persistentScrollbar={false}
                data={subCategory.products}
                renderItem={({item}) => (
                  <Product
                    className='mb-4'
                    product={item}
                    key={`product-${subCategory.id}-${item.id}`}
                  />)}
              />
            </View>
          ))}
        </ScrollView>)
        : <View className='w-auto h-full bg-white rounded-2xl p-4'>
          <Text className='text-center text-xl text-[#56585F]'>На данный момент нет продуктов</Text>
        </View>
      }
    </>
  );
};

export default SubCategoryScreen;
