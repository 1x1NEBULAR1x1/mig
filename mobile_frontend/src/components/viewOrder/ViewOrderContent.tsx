import { useUIStore } from "../../../stores/useUIStore.ts";
import {useEffect, useState} from "react";
import Menu from "./Menu.tsx";
import axios from 'axios';
import { Map, Placemark } from "@pbe/react-yandex-maps";
import classes from './ViewOrder.module.css';
import {useCitiesStore} from "../../../stores/useCitiesStore.ts";

const ViewOrderContent = () => {

  const uiStore = useUIStore((state) => state);

  const citiesStore = useCitiesStore(state => state)

  const address = `${citiesStore.cities.find(city => city.id === uiStore.viewOrder!.address.cityId)?.name}, ул. ${uiStore.viewOrder!.address.street || ""}, д. ${uiStore.viewOrder!.address.house || ""}, кв. ${uiStore.viewOrder!.address.flat || ""}`;

  const [coordinates, setCoordinates] = useState<Array<number> | null>(null);

  const apiKey = '6e6b308e-4374-4acd-85d6-da69a5ffc26f';

  const getCoordinates = async (address: string) => {
    try {
      const res = await axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${apiKey}&geocode=${encodeURIComponent(address)}`);
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

  return (
    <div className={classes.contentLong}>
      <Menu />
      {coordinates ? (
        <Map
          className={classes.map}
          defaultState={{
            center: coordinates,
            zoom: 15,
          }}
          width="100%"
          height="100%"
          state={{ center: coordinates, zoom: 15 }}
        >
          <Placemark geometry={coordinates} />
        </Map>
      ) : (
        <p>Загрузка карты...</p>
      )}
    </div>
  );
};

export default ViewOrderContent;
