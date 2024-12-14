import styles from './Order.module.css'
import { useUIStore } from "../../../stores/useUIStore.ts";
import {useDataStore} from "../../../stores/useDataStore.ts";
import {useOrderStore} from "../../../stores/useOrderStore.ts";
import {useEffect, useState} from "react";
import {Map, Placemark} from "@pbe/react-yandex-maps";
import classes from "../viewOrder/ViewOrder.module.css";
import axios from "axios";
import {useCitiesStore} from "../../../stores/useCitiesStore.ts";
import {Address} from "../../../types/models.ts";
import {loadUser, yandexMapsApiKey} from "../../../requests/load_data.ts";


const Form = () => {
  const uiStore = useUIStore(state => state);
  const dataStore = useDataStore(state => state)
  const orderStore = useOrderStore(state => state)
  const citiesStore = useCitiesStore(state => state)

  useEffect(() => {

  }, [orderStore.orderDeliveryPriority]);

  function getAccessTokenFromCookies() {
    const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : undefined;
  }

  useEffect(() => {
    const token = getAccessTokenFromCookies()
    if (token) {
      loadUser(token).then(user => dataStore.setUser(user))
    }
  }, [dataStore.number]);

  const [coordinates, setCoordinates] = useState<Array<number> | null>(null);

  const address = `${citiesStore.selectedCity?.name} ${orderStore.orderStreet} ${orderStore.orderHouse}`;

  useEffect(() => {
    if (!orderStore.orderDeliveryPriority && dataStore.orderPriorities) {
      orderStore.setOrderDeliveryPriority(dataStore.orderPriorities.reverse()[0])
    }
  }, [orderStore.orderDeliveryPriority, dataStore.orderPriorities]);


  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!orderStore.orderStreet) {
      setError('street')
    } else if (!orderStore.orderHouse) {
      setError('house')
    } else if (!orderStore.orderFlat) {
      setError('flat')
    } else if (!orderStore.orderFloor) {
      setError('floor')
    } else {
      setError(undefined)
    }
  }, [
    orderStore.orderStreet,
    orderStore.orderHouse,
    orderStore.orderFlat,
    orderStore.orderEntrance,
    orderStore.orderFloor
  ]);

  function getUniqueSortedAddresses(addresses: Address[]): Address[] {
    const cityAddresses = addresses.filter(address => address.cityId === citiesStore.selectedCity!.id);

    const uniqueAddresses = cityAddresses.filter((address, index, self) => {
      return (
        index ===
        self.findIndex(
          (other) =>
            other.street === address.street &&
            other.house === address.house &&
            other.floor === address.floor &&
            other.flat === address.flat &&
            other.cityId === address.cityId &&
            other.comment === address.comment
        )
      );
    });

    uniqueAddresses.sort((a, b) => {
      const streetComparison = a.street.localeCompare(b.street);
      if (streetComparison !== 0) return streetComparison;

      const houseComparison = a.house.localeCompare(b.house);
      if (houseComparison !== 0) return houseComparison;

      return  a.flat.localeCompare(b.flat);
    });

    return uniqueAddresses;
  }

  const getCoordinates = async (address: string) => {
    try {
      const res = await axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${yandexMapsApiKey}&geocode=${encodeURIComponent(address)}`);
      const point = res.data.response.GeoObjectCollection.featureMember[0]?.GeoObject.Point.pos;

      if (point) {
        const [longitude, latitude] = point.split(" ");
        if (latitude && longitude) {
          setCoordinates([parseFloat(latitude), parseFloat(longitude)]);
        }
      } else {
        console.warn("Адрес не найден");
      }
    } catch (error) {
      console.error("Ошибка при геокодировании:", error);
    }
  };

  useEffect(() => {
    if (address.trim()) {
      getCoordinates(address).then();
    }
  }, [address]);

  const setAddress = (address: Address | undefined) => {
    orderStore.setOrderStreet(address?.street || '')
    orderStore.setOrderHouse(address?.house || '')
    orderStore.setOrderFloor(address?.floor || '')
    orderStore.setOrderFlat(address?.flat || '')
    orderStore.setOrderEntrance(address?.entrance || '')
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formTitle}>
        <div className={styles.formTitleText}>Оформление заказа</div>
        <div
          className={styles.formTitleBack}
          onClick={() => {uiStore.setIsOrderPageOpen(false)}}
        >
          <svg width="0.9375vw" height="1.16667vh" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.57751 6.16632L8.45554 1.52369L7.30652 0.316406L0.924838 6.39014C0.580006 6.71833 0.579701 7.2682 0.924168 7.59678L7.30585 13.684L8.45622 12.478L3.5865 7.83299L17.3326 7.83387L17.3327 6.1672L10.4551 6.16676L3.57751 6.16632Z" fill="#1B9F01"/>
          </svg>
          Вернуться назад
        </div>
      </div>
      <div className={styles.formBodyContainer}>
        <div className={styles.formBodyTitle}>Адрес доставки</div>
        <div className={styles.formBodySeparator}>
          <div className={styles.formElementContainer}>
            {dataStore.user?.addresses && <div className={styles.formInputElement}>
              <div className={styles.formInputElementLable}>Вы можете выбрать адрес из ранее использованых</div>
              <select
                className={styles.formInputElementSelect}
                onChange={(e) => {
                  const address = getUniqueSortedAddresses(dataStore.user?.addresses || []).find(
                    (address: Address) => address.id!.toString() === e.target.value
                  );
                  setAddress(address);
                }}
              >
                <option value="">Не указан</option>
                {getUniqueSortedAddresses(dataStore.user?.addresses || []).map((address) => (
                  <option key={`address-${address.id}`} value={address.id!.toString()}>
                    {`ул. ${address.street}, д. ${address.house}, кв. ${address.flat}`}
                  </option>
                ))}
              </select>
            </div>}
            <div className={styles.formInputElement}>
              <div className={styles.formInputElementLable}>Улица</div>
              <input
                className={styles.formInputElementInput}
                type="text"
                placeholder="Введите улицу"
                value={orderStore.orderStreet}
                onInput={(e) => orderStore.setOrderStreet(e.currentTarget.value)}
              />
              {error === 'street' && <p style={{fontSize: 7, color: '#EC4646'}}>*данное поле обязательно</p>}
            </div>
            <div className={styles.formInputElements}>
              <div className={styles.formInputElement}>
                <div className={styles.formInputElementLable}>Дом</div>
                <input
                  className={styles.formInputElementInput}
                  type="text"
                  placeholder=""
                  value={orderStore.orderHouse}
                  onInput={(e) => orderStore.setOrderHouse(e.currentTarget.value)}
                />
                {error === 'house' && <p style={{fontSize: 7, color: '#EC4646'}}>*данное поле обязательно</p>}
              </div>
              <div className={styles.formInputElement}>
                <div className={styles.formInputElementLable}>Квартира</div>
                <input
                  className={styles.formInputElementInput}
                  type="text"
                  placeholder=""
                  value={orderStore.orderFlat}
                  onInput={(e) => orderStore.setOrderFlat(e.currentTarget.value)}
                />
                {error === 'flat' && <p style={{fontSize: 7, color: '#EC4646'}}>*данное поле обязательно</p>}
              </div>
              <div className={styles.formInputElement}>
                <div className={styles.formInputElementLable}>Подъезд</div>
                <input
                  className={styles.formInputElementInput}
                  type="text"
                  placeholder=""
                  value={orderStore.orderEntrance}
                  onInput={(e) => orderStore.setOrderEntrance(e.currentTarget.value)}
                />
              </div>
              <div className={styles.formInputElement}>
                <div className={styles.formInputElementLable}>Этаж</div>
                <input
                  className={styles.formInputElementInput}
                  type="text"
                  placeholder=""
                  value={orderStore.orderFloor}
                  onInput={(e) => orderStore.setOrderFloor(e.currentTarget.value)}
                />
                {error === 'floor' && <p style={{fontSize: 7, color: '#EC4646'}}>*данное поле обязательно</p>}
              </div>
            </div>
            <div className={styles.formInputElement}>
              <div className={styles.formInputElementLable}>Выберите дату доставки</div>
              <select
                className={styles.formInputElementSelect}
                defaultValue={dataStore.orderPriorities[0]?.id.toString()}
                onChange={(e) => {
                  const selectedPriority = dataStore.orderPriorities.find(
                    (priority) => priority.id.toString() === e.target.value
                  );
                  orderStore.setOrderDeliveryPriority(selectedPriority);
                }}
              >
                {dataStore.orderPriorities.reverse().map((priority) => (
                  <option key={priority.id} value={priority.id.toString()}>
                    {priority.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formInputElement}>
              <div className={styles.formInputElementLable}>Комментарий</div>
              <textarea
                className={styles.formInputElementInputTextArea}
                placeholder="Комментарий"
                value={orderStore.orderComment}
                onInput={(e) => orderStore.setOrderComment(e.currentTarget.value)}
              />
            </div>
          </div>
          {coordinates &&
						<Map
							className={classes.map}
							defaultState={{
                center: coordinates,
                zoom: 15,
              }}
							width="100%"
							height="100%"
							state={{center: coordinates, zoom: 15}}
							style={{width: "100%", height: "auto", overflow: 'hidden', aspectRatio: '1/1'}}
						>
							<Placemark geometry={coordinates}/>
						</Map>
          }
        </div>
      </div>
    </div>
  );
}

export default Form