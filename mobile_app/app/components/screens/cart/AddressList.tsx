import { Picker } from '@react-native-picker/picker';
import {View, Text, Animated} from "react-native";
import { useDataStore } from '../../../../stores/useDataStore';
import {useOrderStore} from "../../../../stores/useOrderStore";
import {Address} from "../../../../types/models";

const AddressList = () => {
  const dataStore = useDataStore(state => state)
  const orderStore = useOrderStore(state => state)
  if (!dataStore.user ||!dataStore.user.addresses || dataStore.user.addresses.length === 0) return <View />
  function getUniqueAddresses(addresses: Address[]): Address[] {
    const uniqueMap = new Map<string, Address>();
    const getKey = (address: Address): string => `${address.street}-${address.house}-${address.floor}-${address.flat}-${address.cityId}`;
    for (const address of addresses) {
      const key = getKey(address);
      if (address.cityId !== dataStore.user?.cityId) continue
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, address);
      }
    }
    return Array.from(uniqueMap.values());
  }

  const selectAddress = (address: Address) => {
    orderStore.setSelectedAddress(address)
    orderStore.setOrderStreet(address.street)
    orderStore.setOrderHouse(address.house)
    orderStore.setOrderFlat(address.flat)
    orderStore.setOrderFloor(address.floor)
    orderStore.setOrderEntrance(address.entrance || '')
    orderStore.setLatitude(address.latitude || -1)
    orderStore.setLongtude(address.longitude || -1)
  }
  const emptyAddress: Address = {
    id: -1,
    cityId: -1,
    street: '',
    house: '',
    floor: '',
    flat: '',
    entrance: '',
    latitude: -1,
    longitude: -1
  }

  return (
    <View className='flex flex-col w-full p-2 px-3 border-gray-300 border rounded-2xl'>
      <Text className="text-[#A9A9A9] mt-1 w-auto">Или выберите адресс из ранее использованных</Text>
      <Picker
        style={{width: '105%', marginLeft: '-4%', color: '#1B1C1F', padding: 0, margin: 0, paddingLeft: 0, marginBottom: '-3%', marginTop: '-3%'}}
        selectedValue={orderStore.selectedAddress}
        onValueChange={(itemValue) => selectAddress(itemValue)}
      >
        <Picker.Item
          style={{fontSize: 14, color: '#A9A9A9'}}
          value={emptyAddress}
          label='Не указано'
        />
        {getUniqueAddresses(dataStore.user.addresses).map((address) => (
          <Picker.Item
            style={{fontSize: 14, color: '#A9A9A9'}}
            key={address.id}
            label={`ул. ${address.street}, д. ${address.house}, кв. ${address.flat}`}
            value={address}
          />
        ))}
      </Picker>
    </View>
  )
}

export default AddressList