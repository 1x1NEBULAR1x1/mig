import classes from '../Classes.module.css'
import StatusesList from "./StatusesList.tsx";
import SettingsList from "./SettingsList.tsx";
import PrioritiesList from "./PrioritiesList.tsx";
import {useSettingsStore} from "../stores/useSettingsStore.ts";
import {useEffect} from "react";
import {getPriorities} from "../requests/orders.ts";
import {getDeliveryPrice, getStatuses, getTax} from "../requests/settings.ts";
import PriorityUpdate from "./PriorityUpdate.tsx";
import PriorityCreate from "./PriorityCreate.tsx";
import StatusUpdate from "./StatusUpdate.tsx";


const SettingsContent = () => {
  const settingsStore = useSettingsStore(state => state)

  useEffect(() => {
    getPriorities().then(ps => settingsStore.setPriorities(ps))
    getStatuses().then(ss => settingsStore.setStatuses(ss))
    getTax().then(t => settingsStore.setTax(t))
    getDeliveryPrice().then(d => settingsStore.setDeliveryPrice(d))
  }, []);

  return (<div className={classes.content}>
    <div className='flex flex-col gap-4'>
      <SettingsList />
      <StatusesList />
    </div>
    <PrioritiesList />
    {settingsStore.priority && <PriorityUpdate />}
    {settingsStore.priorityAdd && <PriorityCreate />}
    {settingsStore.status && <StatusUpdate />}
  </div>)
}

export default SettingsContent