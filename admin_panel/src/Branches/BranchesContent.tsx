import classes from "../Classes.module.css";
import CitiesList from "./CitiesList.tsx";
import {useCitiesStore} from "../stores/useCitiesStore.ts";
import {useBranchesStore} from "../stores/useBranchesStore.ts";
import BranchesList from "./BranchesList.tsx";
import BranchUpdate from "./BranchUpdate.tsx";
import {useEffect} from "react";
import {getCities} from "../requests/cities.ts";
import BranchAddressUpdate from "./BranchAddressUpdate.tsx";
import BranchProducts from "./BranchProducts.tsx";
import BranchProduct from "./BranchProduct.tsx";
import CityCreate from "./CityCreate.tsx";
import BranchCreate from "./BranchCreate.tsx";


const BranchesContent = () => {

  const citiesStore = useCitiesStore(state => state)

  useEffect(() => {
    getCities().then((cities) => citiesStore.setCities(cities))
  }, []);

  useEffect(() => {
    if (!citiesStore.city) return
    branchesStore.setBranches(citiesStore.city.branches)
  }, [citiesStore.city?.id]);

  const branchesStore = useBranchesStore(state => state)

  return (
    <div className={classes.content}>
      <div style={{display: 'flex', flexDirection: 'column', gap: '2vh'}}>
        <CitiesList />
        {citiesStore.city && <BranchesList />}
      </div>
      {branchesStore.branch && <BranchUpdate />}
      {branchesStore.branchAddress && <BranchAddressUpdate />}
      {branchesStore.productsList && <BranchProducts />}
      {branchesStore.branchProduct && <BranchProduct />}
      {branchesStore.branchAdd && <BranchCreate />}
      {citiesStore.cityCreate && <CityCreate />}
    </div>
  );
};

export default BranchesContent;