import classes from "../Classes.module.css";
import {useCitiesStore} from "../stores/useCitiesStore.ts";
import {CityRead} from "../models.ts";
import {useBranchesStore} from "../stores/useBranchesStore.ts";


const CitiesList = () => {

  const citiesStore = useCitiesStore((state) => state);
  const branchesStore = useBranchesStore((state) => state);
  const addCity = () => {
    citiesStore.setCityCreate({name: '', isAvailable: true})
  }

  const onSelectCity = (city: CityRead) => {
    citiesStore.setCity(city)
    citiesStore.setCityCreate(undefined)
    branchesStore.setBranchAdd(undefined)
    branchesStore.setBranchAddAddress(undefined)
    branchesStore.setBranch(undefined)
    branchesStore.setBranchProductAdd(undefined)
  }

  return (
    <div className={classes.menuList}>
      <div className={classes.menuTitle}>Список городов</div>
      {citiesStore.cities.map((city) => (
        <div
          key={city.id}
          style={city.id === citiesStore.city?.id ? {color: '#1b9f01'} : {}}
          onClick={() => onSelectCity(city)}
        >
          {city.name}
        </div>
      ))}
      <hr className={classes.hr} />
      <div className={classes.button} style={{backgroundColor: '#1b9f01', color: 'white'}} onClick={addCity}>
        Добавить город
      </div>
    </div>
  );
};

export default CitiesList;