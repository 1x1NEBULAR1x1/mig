import {useSettingsStore} from "../stores/useSettingsStore.ts";
import classes from '../Classes.module.css'
import {getOrderPriorities, updateOrderPriority} from "../requests/settings.ts";


const PriorityUpdate = () => {

  const settingsStore = useSettingsStore(state => state)

  const onUpdatePriority = async () => {
    if (!settingsStore.priority) return
    const priority = await updateOrderPriority(settingsStore.priority)
    if (priority) {
      const priorities = await getOrderPriorities()
      settingsStore.setPriorities(priorities)
      settingsStore.setPriority(priority)
      settingsStore.setActionSuccess(true)
    }
  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>Изменение приоритета</div>
      <div className={classes.menuContainer}>
        <div className={classes.name}>
          Название <br />
          <input
            type="text"
            className={classes.input}
            value={settingsStore.priority?.name}
            onChange={(e) => settingsStore.setPriority({...settingsStore.priority!, name: e.target.value})}
          />
        </div>
        <div className={classes.name}>
          Дополнительная плата (В % от стоимости) <br />
          <input
            type="number"
            className={classes.input}
            value={settingsStore.priority?.extraCost}
            onChange={(e) => settingsStore.setPriority({...settingsStore.priority!, extraCost: +e.target.value})}
          />
        </div>
        <div
          className={classes.button}
          style={{backgroundColor: '1b9f01', color: 'white'}}
          onClick={async () => onUpdatePriority()}
        >
          Применить изменения
        </div>
        {settingsStore.isActionSuccess && <div className={classes.success}>Изменения применены</div>}
      </div>
    </div>
  )
}

export default PriorityUpdate