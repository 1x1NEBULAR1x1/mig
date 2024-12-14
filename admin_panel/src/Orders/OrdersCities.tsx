import classes from '../Classes.module.css'
import {useCitiesStore} from "../stores/useCitiesStore.ts";
import {useEffect} from "react";
import {getCities} from "../requests/cities.ts";

const OrdersCities = () => {

  const citiesStore = useCitiesStore(state => state)

  useEffect(() => {
    getCities().then(cities => citiesStore.setCities(cities))
  }, []);

  return (<div className={classes.menu}>
    <div className={classes.menuTitle}>Список городов</div>
    {citiesStore.cities?.map(c =>
      <div
        className={classes.name}
        onClick={() => citiesStore.setCity(c)}
        style={c.id === citiesStore.city?.id ? {color: '#1b9f01'} : {}}
      >
        {c.name}
      </div>)}
  </div>)
}

export default OrdersCities