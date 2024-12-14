import Header from './Header/Header.tsx'
import {useNavigationStore} from "./stores/useNavigationStore.ts";
import CitiesContent from "./Cities/CitiesContent.tsx";
import Home from "./Home/Home.tsx";
import {useEffect} from "react";
import axios from "axios";
import {url} from "./requests/url.ts";
import UsersContent from "./Users/UsersContent.tsx";
import CategoriesContent from "./Categories/CategoriesContent.tsx";
import SubCategoriesContent from "./SubCategory/SubCategoryContent.tsx";
import ProductsContent from "./Products/ProductsContent.tsx";
import OrdersContent from "./Orders/OrdersContent.tsx";
import BranchesContent from "./Branches/BranchesContent.tsx";
import SettingsContent from "./Settings/SettingsContent.tsx";

function App() {

  const navStore = useNavigationStore(state => state)

  useEffect(() => {
    const checkRequest = async () => {
      const isSuccess = await axios.get(url + '/admin/protected', {withCredentials: true})
      if (isSuccess) {
        navStore.setIsLogined(true)
      } else {
        navStore.setIsLogined(false)
      }
    }
    checkRequest().then()
  }, []);

  return (
    <>
      <Header />
      {navStore.navigation == 'homePage' && <Home />}
      {navStore.navigation == 'citiesPage' && <CitiesContent />}
      {navStore.navigation == 'usersPage' && <UsersContent />}
      {navStore.navigation == 'categoriesPage' && <CategoriesContent />}
      {navStore.navigation == 'subCategoriesPage' && <SubCategoriesContent />}
      {navStore.navigation == 'productsPage' && <ProductsContent />}
      {navStore.navigation == 'ordersPage' && <OrdersContent />}
      {navStore.navigation == 'branchsPage' && <BranchesContent />}
      {navStore.navigation == 'settingsPage' && <SettingsContent />}
    </>
  )
}

export default App
