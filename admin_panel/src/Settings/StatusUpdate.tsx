import classes from '../Classes.module.css'
import {useSettingsStore} from "../stores/useSettingsStore.ts";
import {getStatuses, updateStatus} from "../requests/settings.ts";



const StatusUpdate = () => {
  const settingsStore = useSettingsStore(state => state)

  const onUpdateStatus = async () => {
    if (!settingsStore.status) return
    const status = await updateStatus(settingsStore.status)
    if (status) {
      const statuses = await getStatuses()
      settingsStore.setStatuses(statuses)
      settingsStore.setStatus(status)
      settingsStore.setActionSuccess(true)
    }
  }

  return (<div className={classes.menu}>
    <div className={classes.menuTitle}>Изменение статуса</div>
    <div className={classes.menuContainer}>
      <div className={classes.name}>
        Название <br/>
        <input
          type="text"
          className={classes.input}
          onChange={(e) => settingsStore.setStatus({...settingsStore.status!, name: e.target.value})}
          value={settingsStore.status?.name}
        />
      </div>
      <div className={classes.name}>
        Полное название <br/>
        <input
          type="text"
          className={classes.input}
          onChange={(e) => settingsStore.setStatus({...settingsStore.status!, fullStatus: e.target.value})}
          value={settingsStore.status?.fullStatus}
        />
      </div>
      <div className={classes.name}>
        Описание <br/>
        <textarea
          className={classes.input}
          onChange={(e) => settingsStore.setStatus({...settingsStore.status!, description: e.target.value})}
          value={settingsStore.status?.description}
        />
      </div>
      <div
        className={classes.button}
        style={{backgroundColor: '#1b9f01', color: 'white'}}
        onClick={async () => await onUpdateStatus()}
      >
        Применить изменения
      </div>
      {settingsStore.isActionSuccess && <div className={classes.success}>Изменения применены</div>}
    </div>
  </div>)
}

export default StatusUpdate