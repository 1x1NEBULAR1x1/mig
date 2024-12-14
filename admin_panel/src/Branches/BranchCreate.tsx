import classes from '../Classes.module.css'
import {useBranchesStore} from "../stores/useBranchesStore.ts";
import {addBranch} from "../requests/branches.ts";
import {useCitiesStore} from "../stores/useCitiesStore.ts";
import {getCities} from "../requests/cities.ts";
import {useEffect} from "react";

const BranchUpdate = () => {
  const citiesStore = useCitiesStore(state => state)
  const branchesStore = useBranchesStore(state => state)

  useEffect(() => {
    branchesStore.setBranchAdd({...branchesStore.branchAdd!, address: {...branchesStore.branchAdd!.address, cityId: citiesStore.city!.id, branchId: -1, latitude: 0, longitude: 0}})
  }, [branchesStore.branchAddAddress]);
  const onUpdateBranch = async () => {
    if (!branchesStore.branchAdd) return
    const branch = await addBranch(branchesStore.branchAdd, citiesStore.city!.name)
    const cities = await getCities()
    citiesStore.setCities(cities)
    setTimeout(() => {
      citiesStore.setCity(cities.find((city) => city.id == branch!.data.address.cityId))
      branchesStore.setBranch(branch!.data)
      branchesStore.setIsActionSuccess(true)
    }, 10)
  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>Добавление филиала</div>
      <div className={classes.menuContainer}>
        <div className={classes.name}>
          Название: <br/><input
          type="text"
          value={branchesStore.branchAdd?.name}
          onChange={(e) => branchesStore.setBranchAdd({...branchesStore.branchAdd!, name: e.target.value})}
        />
        </div>
        <div className={classes.name}>
          Описание <br/>
          <textarea
            value={branchesStore.branchAdd!.description}
            onChange={(e) => branchesStore.setBranchAdd({
              ...branchesStore.branchAdd!,
              description: e.currentTarget.value
            })}
          />
        </div>
        <div className={classes.name}>
          Статус:
          <input
            type="checkbox"
            style={{width: 'auto'}}
            onInput={() => branchesStore.setBranchAdd({
              ...branchesStore.branchAdd!,
              isAvailable: !branchesStore.branchAdd!.isAvailable
            })}
            checked={branchesStore.branchAdd!.isAvailable}
          />
        </div>
        <div className={classes.name}>
          Улица: <br/>
          <input
            type="text"
            value={branchesStore.branchAdd?.address?.street}
            onChange={(e) => branchesStore.setBranchAdd({...branchesStore.branchAdd!, address: {...branchesStore.branchAdd!.address, street: e.target.value}})}
          />
        </div>
        <div className={classes.name}>
          Дом: <br/>
          <input
            type="text"
            value={branchesStore.branchAdd?.address?.house}
            onChange={(e) => branchesStore.setBranchAdd({...branchesStore.branchAdd!, address: {...branchesStore.branchAdd!.address, house: e.target.value}})}
          />
        </div>
        <div className={classes.name}>
          Квартира: <br/>
          <input
            type="text"
            value={branchesStore.branchAdd?.address?.flat}
            onChange={(e) => branchesStore.setBranchAdd({...branchesStore.branchAdd!, address: {...branchesStore.branchAdd!.address, flat: e.target.value}})}

          />
        </div>
        <div className={classes.name}>
          Этаж: <br/>
          <input
            type="text"
            value={branchesStore.branchAdd?.address?.floor}
            onChange={(e) => branchesStore.setBranchAdd({...branchesStore.branchAdd!, address: {...branchesStore.branchAdd!.address, floor: e.target.value}})}
          />
        </div>
        <div className={classes.name}>
          Подъезд: <br/>
          <input
            type="text"
            value={branchesStore.branchAdd?.address?.entrance}
            onChange={(e) => branchesStore.setBranchAdd({...branchesStore.branchAdd!, address: {...branchesStore.branchAdd!.address, entrance: e.target.value}})}
          />
        </div>
        <div className={classes.name}>
          Комментарий: <br/>
          <textarea
            value={branchesStore.branchAdd?.address?.comment}
            onChange={(e) => branchesStore.setBranchAdd({...branchesStore.branchAdd!, address: {...branchesStore.branchAdd!.address, comment: e.target.value}})}
          />
        </div>
        <div
          className={classes.button}
          style={{background: '#1b9f01', color: '#FFFFFF'}}
          onClick={async () => await onUpdateBranch()}
        >
          Применить изменения
        </div>
        {branchesStore.isActionSuccess && <div className={classes.success}>Изменения применены</div>}
      </div>
    </div>
  )
}

export default BranchUpdate