import {FunctionComponent, useEffect} from 'react';
import styles from './City.module.css'
import { useCitiesStore } from "../../../stores/useCitiesStore.ts";
import CitiesList from "./CitiesList.tsx";
import SearchIcon from "./SearchIcon.tsx";
import {loadCities, url} from "../../../requests/load_data.ts";

const CityContent: FunctionComponent = () => {
  const citiesStore = useCitiesStore((state) => state)

  const onInput = (value: string) => {
    citiesStore.setInputValue(value)
  }

  useEffect(() => {
    loadCities().then(cities => citiesStore.setCities(cities))
  }, []);

  return (
    <>
      <div
        className={styles.content}
      >
        <div
          className={styles.pictureContainer}
        >
          <p className={styles.pictureText}>Выберите город</p>

          <div className={styles.pictureImage}>
            <img
              src={url + '/static/white-city.png'}
              alt="City image"
            /></div>
        </div>
        <div
          className={styles.search}
        >
          <div className={styles.searchContainer}>
            <SearchIcon />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Поиск"
              value={citiesStore.inputValue}
              onInput={(e) => onInput(e.currentTarget.value)}
            />
          </div>

          <div>
            <CitiesList />
          </div>
        </div>

      </div>
    </>
  );
};

export default CityContent;
