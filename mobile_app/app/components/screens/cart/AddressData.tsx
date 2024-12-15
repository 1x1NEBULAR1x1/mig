import {View, Text, TextInput} from "react-native";
import {useOrderStore} from "../../../../stores/useOrderStore";
import OrderPriority from "./OrderPriority";
import {FC} from 'react'
import AddressList from "./AddressList";

interface IAddressDataProps {
  error?: 'street' | 'house' | 'flat' | 'floor' | 'entrance' | 'address'
}

const AddressData: FC<IAddressDataProps> = ({error}) => {

  const orderStore = useOrderStore(state => state)

  return (
    <View className="flex mt-2 flex-сol mb-2 gap-2 p-2 w-full items-center justify-evenly bg-white rounded-2xl">
      <Text className='w-full mt-2 ml-3 text-lg text-gray-800 text-balance'>Введите свой адрес для доставки</Text>
      {error === 'address' &&
        <Text className="text-red-300 text-xs">Адрес не найден, проверьте правильность введённых данных</Text>
      }
      <AddressList />
      <View className='border rounded-2xl w-full px-2 border-gray-300'>
        <TextInput
          value={orderStore.orderStreet}
          onChangeText={text => orderStore.setOrderStreet(text)}
          placeholder="Введите название улицы"
        />
        {error === 'street' && <Text className="text-red-300 text-xs">*данное поле обязательно</Text>}
      </View>
      <View className="w-full border-gray-300 border rounded-2xl px-2">
        <TextInput
          value={orderStore.orderHouse}
          onChangeText={text => orderStore.setOrderHouse(text)}
          placeholder="Введите номер дома"
        />
        {error === 'house' && <Text className="text-red-300 text-xs">*данное поле обязательно</Text>}
      </View>
      <View className="w-full border-gray-300 border rounded-2xl px-2">
        <TextInput
          value={orderStore.orderFlat}
          onChangeText={text => orderStore.setOrderFlat(text)}
          placeholder="Введите номер квартиры"
        />
        {error === 'flat' && <Text className="text-red-300 text-xs">*данное поле обязательно</Text>}
      </View>
      <View className='w-full border-gray-300 border rounded-2xl px-2'>
        <TextInput
          value={orderStore.orderFloor}
          onChangeText={text => orderStore.setOrderFloor(text)}
          placeholder="Введите номер этажа"
        />
        {error === 'floor' && <Text className="text-red-500 text-xs">*данное поле обязательно</Text>}
      </View>
      <View className="w-full border-gray-300 border rounded-2xl px-2">
        <TextInput
          value={orderStore.orderEntrance}
          onChangeText={text => orderStore.setOrderEntrance(text)}
          placeholder="Введите номер подъезда"
        />
        {error === 'entrance' && <Text className="text-red-300 text-xs">*данное поле обязательно</Text>}
      </View>
      <OrderPriority />
      <TextInput
        className="w-full border-gray-300 border rounded-2xl p-2 h-14"
        value={orderStore.orderComment}
        onChangeText={text => orderStore.setOrderComment(text)}
        placeholder="Комментарий к доставке"
      />
    </View>
  )
}

export default AddressData