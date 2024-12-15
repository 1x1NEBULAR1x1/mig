import {FlatList, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent} from "react-native"
import React, {useEffect, useRef} from "react";
import Header from "./Header";
import {useUIStore} from "../../../../stores/useUIStore";
import SubCategory from "./SubCategory";
import { useDataStore } from "../../../../stores/useDataStore";

const {width} = Dimensions.get('window')

const Category = () => {

  const selectedCategory = useUIStore((state) => state.selectedCategory)
  const setSelectedCategory = useUIStore((state) => state.setSelectedCategory)

  const categories = useDataStore((state) => state.categories);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    if (!selectedCategory) return
    const index = Math.round(contentOffsetX / width);
    if (index !== (selectedCategory.id - 1) && index >= 0 && index < categories.length) {
      setSelectedCategory(categories[index]);
    }
  };

  useEffect(() => {
    if (!selectedCategory) return
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: (selectedCategory.id - 1) * (width),
        animated: true,
      });
    }
  }, [selectedCategory?.id]);

  return (
    <>
      <Header />
      <ScrollView
        ref={scrollViewRef}
        onMomentumScrollEnd={handleScroll}
        horizontal
        persistentScrollbar={false}
        pagingEnabled
        className="w-full h-full bg-[#EEEFF3]"
      >

        {categories.map((category) => (
          <FlatList
            key={category.id}
            style={{width}}
            className='flex flex-col p-4 h-auto gap-2'
            data={category.subCategories}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <SubCategory subCategory={item} />
            )}
          />))}
      </ScrollView>
    </>
  )
}

export default Category