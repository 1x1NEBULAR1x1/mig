import classes from "../Classes.module.css";
import {useCitiesStore} from "../stores/useCitiesStore.ts";
import {useBranchesStore} from "../stores/useBranchesStore.ts";

const CityBranches = () => {

  const citiesStore = useCitiesStore(state => state)

  const branchesStore = useBranchesStore(state => state)

  return (
    <div className={classes.cityBranches}>
      Список филиалов
      {citiesStore.cityUpdate!.branches.map((branch, index) => (
        <>
          <div
            className={classes.branch} key={branch.id}
            onClick={() => branchesStore.setBranch(branch)}
          >
            {branch.name}
          </div>
          {index < citiesStore.cityUpdate!.branches.length - 1 && <hr className={classes.hr} />}
        </>
      ))}
    </div>
  )
}

export default CityBranches