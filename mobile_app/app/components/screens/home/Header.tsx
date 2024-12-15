import {View, Text, Pressable} from "react-native";
import {useUIStore} from "../../../../stores/useUIStore";
import {useDataStore} from "../../../../stores/useDataStore";
import React from "react";

const Header = () => {

  const dataStore = useDataStore(state => state)

  const uiStore = useUIStore(state => state)

  return (
    <View>
      <View
        className="flex flex-row p-4 h-24 pt-12 w-full items-center justify-evenly bg-white"
      >
        {dataStore.categories?.map(category => {
          return (
            <Pressable
              key={category.name + 'header'}
              className={uiStore.selectedCategory?.id === category.id
                ? 'flex-1 h-12 text-center p-2 rounded-3xl items-center justify-center bg-[#EEEFF3]'
                : 'flex-1 h-12 text-center p-2 rounded-3xl items-center justify-center'}
              onPress={() => uiStore.setSelectedCategory(category)}
            >
              <Text
                className={uiStore.selectedCategory?.id === category.id
                  ? "text-sm text-center text-[#1B9F01] transition-all duration-100"
                  : "text-sm text-center text-[#56585F] transition-all duration-100"}
              >{category.name}</Text>
            </Pressable>
          )
        })}
      </View>
      <View className='h-[1px] w-full bg-gray-300'></View>
    </View>
  )
}

export default Header