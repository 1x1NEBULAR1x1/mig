import classes from '../Classes.module.css'
import {useBranchesStore} from "../stores/useBranchesStore.ts";
import {getBranchCatalog, updateBranch} from "../requests/branches.ts";
import {useCitiesStore} from "../stores/useCitiesStore.ts";
import {getCities} from "../requests/cities.ts";
import {useEffect} from "react";

const BranchUpdate = () => {

  const citiesStore = useCitiesStore(state => state)

  const branchesStore = useBranchesStore(state => state)

  useEffect(() => {
    branchesStore.setBranch({...branchesStore.branch!, address: {...branchesStore.branch!.address, cityId: citiesStore.city!.id, branchId: -1, latitude: 0, longitude: 0}})
  }, [branchesStore.branchAddress]);
  const setProducts = async () => {
    if (!branchesStore.branch) return
    getBranchCatalog(branchesStore.branch.id).then(categories => branchesStore.setProductsList(categories))
  }

  const onUpdateBranch = async () => {
    if (!branchesStore.branch) return
    const branch = await updateBranch(branchesStore.branch, citiesStore.city!.name)
    const cities = await getCities()
    citiesStore.setCities(cities)
    branchesStore.setBranch(branch.data)
    branchesStore.setIsActionSuccess(true)
  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>Редактирование филиала</div>
      <div className={classes.menuContainer}>
        <div className={classes.name}>ID: {branchesStore.branch?.id}</div>
        <div className={classes.name}>
          Название: <br/><input
            type="text"
            value={branchesStore.branch?.name}
            onChange={(e) => branchesStore.setBranch({...branchesStore.branch!, name: e.target.value})}
          />
        </div>
        <div className={classes.name}>
          Адрес: ул.{branchesStore.branch?.address?.street} д.{branchesStore.branch?.address?.house}
          <div
            className={classes.button}
            style={branchesStore.branchAddress ? {background: '#56585F', color: '#EEEFF9'} : {}}
            onClick={() => branchesStore.setBranchAddress(branchesStore.branchAddress? undefined : branchesStore.branch?.address)}
          >
            {branchesStore.branchAddress ? 'Отмена' : 'Изменить'}
          </div>
        </div>
        <div className={classes.name}>
          Описание <br/>
          <textarea
            value={branchesStore.branch!.description}
            onChange={(e) => branchesStore.setBranch({...branchesStore.branch!, description: e.currentTarget.value})}
          />
        </div>
        <div
          className={classes.button}
          onClick={async () => {
            if (!branchesStore.productsList) {
              await setProducts()
            } else {
              branchesStore.setProductsList(undefined)
            }
          }}
          style={branchesStore.productsList ? {background: '#56585F', color: '#EEEFF9'} : {}}
        >
          {branchesStore.productsList ? 'Скрыть список продуктов' : 'Показать список продуктов'}
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