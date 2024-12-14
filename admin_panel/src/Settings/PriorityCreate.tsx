import classes from '../Classes.module.css'
import {useSettingsStore} from "../stores/useSettingsStore.ts";
import {addOrderPriority, getOrderPriorities} from "../requests/settings.ts";


const PriorityCreate = () => {
  const settingsStore = useSettingsStore(state => state)

  const onAddPriority = async () => {
    if (!settingsStore.priorityAdd) return
    const priority = await addOrderPriority(settingsStore.priorityAdd)
    if (priority) {
      const priorities = await getOrderPriorities()
      settingsStore.setPriorities(priorities)
      settingsStore.setPriority(priority)
      settingsStore.setActionSuccess(true)
    }
  }

  return (<div className={classes.menu}>
    <div className={classes.menuTitle}>Добавление приоритета</div>
    <div className={classes.menuContainer}>
      <div className={classes.menuInput}>
        Название <br />
        <input
          type="text"
          className={classes.input}
          onChange={(e) => settingsStore.setPriority({...settingsStore.priority!, name: e.target.value})}
          value={settingsStore.priorityAdd?.name}
        />
      </div>
      <div className={classes.name}>
        Дополнительная плата (В % от стоимости) <br />
        <input
          type="number"
          className={classes.input}
          onChange={(e) => settingsStore.setPriority({...settingsStore.priority!, extraCost: +e.target.value})}
          value={settingsStore.priorityAdd?.extraCost}
        />
      </div>
      <div
        className={classes.button}
        style={{backgroundColor: '#1b9f01', color: 'white'}}
        onClick={async () => await onAddPriority()}
      >
        Применить изменения
      </div>
      {settingsStore.isActionSuccess && <div className={classes.success}>Изменения применены</div>}
    </div>
  </div>)
}

export default PriorityCreate