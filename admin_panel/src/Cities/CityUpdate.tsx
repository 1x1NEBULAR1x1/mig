import classes from "../Classes.module.css";
import {useCitiesStore} from "../stores/useCitiesStore.ts";
import CityBranches from "./CityBranches.tsx";
import {updateCity} from "../requests/cities.ts";
import {getCities} from "../requests/cities.ts";
const CityUpdate = () => {

  const citiesStore = useCitiesStore(state => state)

  const applyUpdate = async () => {
    const city = citiesStore.cityUpdate
    if (city) {
      const newCity = await updateCity(city)
      citiesStore.setCityUpdate(newCity)
      getCities().then(cities => citiesStore.setCities(cities))
      citiesStore.setIsUpdateSuccess(true)
    }
  }

  return (
    <div className={classes.cityUpdate}>
      <div className={classes.id}>ID города: {citiesStore.cityUpdate!.id}</div>
      <div className={classes.name}>
        Название города:
        <input
          className={classes.input}
          type="text"
          value={citiesStore.cityUpdate!.name}
          onInput={(e) => citiesStore.setCityUpdate({...citiesStore.cityUpdate!, name: e.currentTarget.value})}
        />
      </div>
      <div className={classes.isAvailable}>
        Доступен:
        <input
          className={classes.input}
          type="checkbox"
          checked={citiesStore.cityUpdate!.isAvailable}
          onInput={() => citiesStore.setCityUpdate({...citiesStore.cityUpdate!, isAvailable: !citiesStore.cityUpdate!.isAvailable})}
        />
      </div>
      <div className={classes.apply} onClick={async () => await applyUpdate()}>Применить изменения</div>
      {citiesStore.isUpdateSuccess && <div className={classes.success}>Изменения успешно применены</div>}
      {citiesStore.cityUpdate!.branches.length > 0 ? <CityBranches /> : <div>Филиалы отсутствуют</div>}
      <div
        className={classes.button}

      >
        Добавить филиал
      </div>
      <div>Дата создания: {citiesStore.cityUpdate!.created}</div>
      <div>Дата обновления: {citiesStore.cityUpdate!.updated}</div>
    </div>
  )
}

export default CityUpdate