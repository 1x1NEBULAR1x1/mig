import classes from '../Classes.module.css'
import {useSettingsStore} from "../stores/useSettingsStore.ts";


const StatusesList = () => {
  const settingsStore = useSettingsStore(state => state)

  return (<div className={classes.menuList}>
    <div className={classes.menuTitle}>Список статусов</div>
    {settingsStore.statuses.map((status) => (
      <div
        key={status.id}
        style={status.id === settingsStore.status?.id ? {color: '#1b9f01'} : {}}
        onClick={() => settingsStore.setStatus(status)}
      >
        {status.name}
      </div>
    ))}
  </div>)
}

export default StatusesList