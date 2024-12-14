import {CityRead} from "../models.ts";
import classes from "../Classes.module.css";
import {useCitiesStore} from "../stores/useCitiesStore.ts";

const City = ({city}: { city: CityRead }) => {

  const citiesStore = useCitiesStore(state => state)

  return (
    <div
      className={classes.city}
      onClick={() => citiesStore.setCityUpdate(city)}
      style={citiesStore.cityUpdate?.id == city.id ? {color: '#1b9f01'} : {}}
    >
      {city.name}
    </div>
  )
}

export default City