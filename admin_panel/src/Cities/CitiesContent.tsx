import classes from '../Classes.module.css'
import {useCitiesStore} from "../stores/useCitiesStore.ts";
import City from "./City.tsx";
import {useEffect} from "react";
import {getCities} from "../requests/cities.ts";
import CityUpdate from "./CityUpdate.tsx";

const CitiesContent = () => {

  const citiesStore = useCitiesStore(state => state)

  useEffect(() => {
    const loadCities = async () => {
      const cities = await getCities()
      citiesStore.setCities(cities)
    }
    loadCities().then()
  }, []);


  return (
    <div
      className={classes.content}
    >
      <div
        className={classes.menuList}
      >
        <div className={classes.menuTitle}>
          Список городов
        </div>
        <hr className={classes.hr} />
        {citiesStore.cities.map((city, index) => (
          <>
            <City city={city}/>
            {index < citiesStore.cities.length - 1 && <hr className={classes.hr} />}
          </>
        ))}
      </div>
      <div className={classes.cityData}>
        <div className={classes.menuTitle}>
          Редактирование города
        </div>
        {citiesStore.cityUpdate ? <CityUpdate /> : <div>Выберите город из списка</div>}
      </div>
      <div
        className={classes.cityData}
      >
        
      </div>
    </div>
  )
}

export default CitiesContent