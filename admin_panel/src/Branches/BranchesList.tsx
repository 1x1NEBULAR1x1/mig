import classes from '../Classes.module.css'
import {useBranchesStore} from "../stores/useBranchesStore.ts";
import {useCitiesStore} from "../stores/useCitiesStore.ts";


const BranchesList = () => {

  const branchesStore = useBranchesStore(state => state)
  const citiesStore = useCitiesStore(state => state)


  const onAddBranch = () => {
    branchesStore.setBranchAdd({
      name: '',
      isAvailable: true,
      address: {
        branchId: -1,
        cityId: citiesStore.city!.id,
        street: '',
        house: '',
        entrance: '',
        floor: '',
        flat: '',
        comment: '',
        latitude: 0,
        longitude: 0
      },
      cityId: citiesStore.city!.id
    })
  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>Список филиалов</div>
      <div className={classes.menuContainer}>
        {branchesStore.branches.map((branch) => (
          <div
            key={branch.id}
            style={branch.id == branchesStore.branch?.id ? {color: '#1b9f01'} : {}}
            onClick={() => branchesStore.setBranch(branch)}
          >
            {branch.name}
          </div>
        ))}
      </div>
      <hr className={classes.hr} />
      <div className={classes.button} style={{backgroundColor: '#1b9f01', color: 'white'}} onClick={() => onAddBranch()}>
        Добавить филиал
      </div>
    </div>
  );
};

export default BranchesList