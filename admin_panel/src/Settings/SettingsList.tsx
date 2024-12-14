import classes from '../Classes.module.css'
import {useSettingsStore} from "../stores/useSettingsStore.ts";
import {updateDeliveryPrice, updateTax} from "../requests/settings.ts";


const SettingsList = () => {
  const settingsStore = useSettingsStore(state => state)
  const onUpdateData = async  () => {
    try {
      if (!settingsStore.tax) return
      const tax = await updateTax(settingsStore.tax.tax)
      if (tax) {
        settingsStore.setTax({tax: tax})
        settingsStore.setActionSuccess(true)
      }
    } catch {console.log()}
    try{
      if (!settingsStore.deliveryPrice || !settingsStore.deliveryPrice.start_price || !settingsStore.deliveryPrice.cost_per_100m) return
      const deliveryPrice = await updateDeliveryPrice(settingsStore.deliveryPrice!.start_price, settingsStore.deliveryPrice!.cost_per_100m)
      if (deliveryPrice) {
        settingsStore.setDeliveryPrice(deliveryPrice)
        settingsStore.setActionSuccess(true)
      }
    } catch {console.log()}
  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>Настройки</div>
      <div className={classes.menuContainer}>
        <div className={classes.name}>
          Налог (в % от стоимости)<br/>
          <input
            type='text'
            value={settingsStore.tax?.tax}
            onInput={(e) => {
              const val = parseFloat(e.currentTarget.value)
              settingsStore.setTax({tax: val || 0})
            }}
          />
        </div>
        <div className={classes.name}>
          Начальная стоимость доставки<br/>
          <input
            type='text'
            value={settingsStore.deliveryPrice?.start_price}
            onInput={(e) => {
              const val = parseFloat(e.currentTarget.value)
              settingsStore.setDeliveryPrice({...settingsStore.deliveryPrice!, start_price: val || 0})
            }}
          />
        </div>
        <div className={classes.name}>
          Цена за 100м<br/>
          <input
            type='text'
            value={settingsStore.deliveryPrice?.cost_per_100m}
            onInput={(e) => {
              const val = parseFloat(e.currentTarget.value)
              settingsStore.setDeliveryPrice({...settingsStore.deliveryPrice!, cost_per_100m: val || 0})
            }}
          />
        </div>
        <div
          className={classes.button}
          style={{backgroundColor: '#1b9f01', color: 'white'}}
          onClick={async () => onUpdateData()}
        >
          Применить изменения
        </div>
        {settingsStore.isActionSuccess && <div className={classes.success}>Изменения применены</div>}
      </div>
    </div>
  );
};

export default SettingsList