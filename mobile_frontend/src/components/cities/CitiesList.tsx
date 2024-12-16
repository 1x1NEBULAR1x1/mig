import { useEffect } from "react";
import { useCitiesStore } from "../../../stores/useCitiesStore.ts";
import styles from './City.module.css';
import { City } from "../../../types/models.ts";
import { useDataStore } from "../../../stores/useDataStore.ts";
import { loadCatalog } from "../../../requests/load_data.ts";

const CitiesList = () => {
  const citiesStore = useCitiesStore((state) => state);
  const dataStore = useDataStore(state => state)

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
  return (
    <div className={styles.citiesList}>
      {citiesStore.matchedCities.length === 0 ? (
        <div
          className={styles.cityNotFound}
        >
          Город не найден
        </div>
      ) : (
        citiesStore.matchedCities?.map((city) => (
          <div
            onClick={async () => {
              const categories = await loadCatalog(city.id)
              dataStore.setCategories(categories)
              citiesStore.setSelectedCity(city)
            }}
            key={city.name}
            className={styles.cityButton}>
            {city.name}
          </div>
        ))
      )}
    </div>
  );
};

export default CitiesList;
