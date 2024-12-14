import classes from '../Classes.module.css'
import {useSettingsStore} from "../stores/useSettingsStore.ts";


const PrioritiesList = () => {
  const settingsStore = useSettingsStore(state => state)



  return (<div className={classes.menuList}>
    <div className={classes.menuTitle}>Список приоритетов</div>
    {settingsStore.priorities.map((priority) => (
      <div
        key={priority.id}
        style={priority.id === settingsStore.priority?.id ? {color: '#1b9f01'} : {}}
        onClick={() => settingsStore.setPriority(priority)}
      >
        {priority.name}
      </div>
    ))}
  </div>)
}

export default PrioritiesList