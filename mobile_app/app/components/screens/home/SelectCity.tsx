import {View, Text, Image, Pressable, TextInput, Button, ScrollView} from "react-native";
import {useCitiesStore} from "../../../../stores/useCitiesStore";
import Svg, {Path} from "react-native-svg";
import {useEffect} from "react";
import {City} from "../../../../types/models";
import {useCities} from "../../../../hooks/useCities";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";

const SelectCity = () => {
  const citiesStore = useCitiesStore(state => state)
  const {isLoading} = useCities()

  useEffect(() => {
    const selectedCityName = citiesStore.inputValue.trim();

    if (selectedCityName === "") {
      citiesStore.setMatchedCities(citiesStore.cities);
    } else {
      const filteredCities = citiesStore.cities.filter((city: City) =>
        city.name.toLowerCase().includes(selectedCityName.toLowerCase())
      );

      if (filteredCities.length === 0) {
        citiesStore.setMatchedCities([]);
      } else {
        citiesStore.setMatchedCities(filteredCities);
      }
    }
  }, [citiesStore.inputValue, citiesStore.cities]);

  const onSelectCity = async (city: City) => {
    citiesStore.setSelectedCity(city)
  }

  return (
    <View className="flex align-center w-screen h-screen bg-[#EEEFF3] p-4 gap-4 mt-12">
      <View className='flex justify-center align-center w-full bg-[#1B9F01] rounded-2xl aspect-[3/2] p-2 py-4 overflow-hidden'>
        <View className='flex w-[100%] h-[100%] items-center justify-center'>
          <Image
            className="w-[75%] h-[75%]"
            source={require('../../../assets/white-city.png')}
          />
        </View>
        <Text className="text-2xl text-white font-bold mb-6 ml-2 text-center">Выберите свой город</Text>
      </View>
      <View className='flex justify-center align-center w-full h-auto bg-white rounded-2xl'>
        <View className='flex flex-row gap-2 justify-center items-center'>
          <Svg width={18} height={18} viewBox="0 0 20 20" fill="none">
            <Path
              d="M9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667C15.8333 10.7068 15.3111 12.125 14.4339 13.2538L17.6726 16.4941L16.4941 17.6726L13.2538 14.4339C12.125 15.3111 10.7068 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5ZM9.16667 4.16667C6.40524 4.16667 4.16667 6.40524 4.16667 9.16667C4.16667 11.9281 6.40524 14.1667 9.16667 14.1667C11.9281 14.1667 14.1667 11.9281 14.1667 9.16667C14.1667 6.40524 11.9281 4.16667 9.16667 4.16667Z"
              fill="#56585F"/>
          </Svg>
          <TextInput
            className='w-[85%]'
            placeholder="Поиск"
            value={`${citiesStore.inputValue.toString()}`}
            onChangeText={text => citiesStore.setInputValue(text)}
          />
        </View>
        <View className='w-full h-[1px] bg-[#EEEFF3]'></View>
        <ScrollView className='flex flex-col h-auto max-h-[54vh] gap-3 p-3'>
          {isLoading ? <Spinner
            visible={isLoading}
            textContent={"Загрузка данных городов..."}
            textStyle={{ color: "#1B9F01" }}
          /> : <>
            {citiesStore.matchedCities.length === 0 ? (
              <Text className='text-gray-500'>
                Город не найден
              </Text>
            ) : (
              citiesStore.matchedCities.map((city, index) => (
                <Pressable
                  onPress={() => onSelectCity(city)}
                  key={city.name}
                  className={`w-full ${index !== 0 && 'mt-2'}`}
                >
                  <Text className='text-[#56585F] text-lg'>{city.name}</Text>
                </Pressable>
              ))
            )}
          </>}
        </ScrollView>
      </View>
    </View>
  )
}

export default SelectCity;