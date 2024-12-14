import classes from '../Classes.module.css'
import {useBranchesStore} from "../stores/useBranchesStore.ts";
import {updateBranch} from "../requests/branches.ts";
import {useCitiesStore} from "../stores/useCitiesStore.ts";


const BranchUpdate = () => {

  const branchesStore = useBranchesStore(state => state)

  const citiesStore = useCitiesStore(state => state)
  const onSave = async () => {
    const res = await updateBranch({...branchesStore.branch!, address: branchesStore.branchAddress}, citiesStore.city!.name)
    if (res.status === 200) {
      branchesStore.setBranch({...branchesStore.branch!})
      branchesStore.setBranchAddress(undefined)
      branchesStore.setIsActionSuccess(true)
    }
  }

  return (<div className={classes.menu}>
    <div className={classes.menuTitle}>Редактирование адреса</div>
    <div className={classes.menuContainer}>
      <div className={classes.name}>
        Улица: <br/>
        <input
          type="text"
          value={branchesStore.branchAddress?.street}
          onChange={(e) => branchesStore.setBranchAddress({...branchesStore.branchAddress!, street: e.target.value})}
        />
      </div>
      <div className={classes.name}>
        Дом: <br/>
        <input
          type="text"
          value={branchesStore.branchAddress?.house}
          onChange={(e) => branchesStore.setBranchAddress({...branchesStore.branchAddress!, house: e.target.value})}
        />
      </div>
      <div className={classes.name}>
        Квартира: <br/>
        <input
          type="text"
          value={branchesStore.branchAddress?.flat}
          onChange={(e) => branchesStore.setBranchAddress({...branchesStore.branchAddress!, flat: e.target.value})}
        />
      </div>
      <div className={classes.name}>
        Этаж: <br />
        <input
          type="text"
          value={branchesStore.branchAddress?.floor}
          onChange={(e) => branchesStore.setBranchAddress({...branchesStore.branchAddress!, floor: e.target.value})}
        />
      </div>
      <div className={classes.name}>
        Подъезд: <br />
        <input
          type="text"
          value={branchesStore.branchAddress?.entrance}
          onChange={(e) => branchesStore.setBranchAddress({...branchesStore.branchAddress!, entrance: e.target.value})}
        />
      </div>
      <div className={classes.name}>
        Комментарий: <br />
        <textarea
          value={branchesStore.branchAddress?.comment}
          onChange={(e) => branchesStore.setBranchAddress({...branchesStore.branchAddress!, comment: e.target.value})}
        />
      </div>
      <div
        className={classes.button}
        onClick={async () => await onSave()}
        style={{background: '#1b9f01', color: 'white'}}
      >
        Изменить
      </div>
    </div>
  </div>)
}

export default BranchUpdate