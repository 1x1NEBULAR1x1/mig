import classes from "../Classes.module.css";
import {addCity, getCities} from "../requests/cities.ts";
import { useCitiesStore } from "../stores/useCitiesStore.ts";


const CityCreate = () => {
  const citiesStore = useCitiesStore(state => state)

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>
        Добавить город
      </div>
      <div className={classes.cityUpdate}>
        <div className={classes.name}>
          Название
          <input
            className={classes.input}
            type="text"
            onInput={(e) => citiesStore.setCityCreate({...citiesStore.cityCreate, name: e.currentTarget.value})}
            value={citiesStore.cityCreate.name}
          />
        </div>
        <div className={classes.isAvailable}>
          Доступен
          <input
            className={classes.input}
            type="checkbox"
            onInput={() => citiesStore.setCityCreate({
              ...citiesStore.cityCreate,
              isAvailable: !citiesStore.cityCreate.isAvailable
            })}
            checked={citiesStore.cityCreate.isAvailable}
          />
        </div>
        <div
          className={classes.button}
          onClick={async () => {
            if (!citiesStore.cityCreate.name) {
              return
            }
            await addCity(citiesStore.cityCreate)
            await getCities().then(cities => citiesStore.setCities(cities))
            citiesStore.setIsCreateSuccess(true)
          }}
        >
          Добавить
        </div>
        {citiesStore.isCreateSuccess && <div className={classes.success}>Город успешно добавлен</div>}
      </div>
    </div>
  )
}

export default CityCreate
