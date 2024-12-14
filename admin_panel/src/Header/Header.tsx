import Logo from "../Logo.tsx";
import classes from '../Classes.module.css'
import {Navigations, useNavigationStore} from "../stores/useNavigationStore.ts";

const Header = () => {

  const navStore = useNavigationStore(state => state)

  return (
    <div className={classes.header}>
      <div
        className={classes.headerButton}
        onClick={() => navStore.setNavigation(Navigations.homePage)}
      >
        <Logo width="12vh" height="8vh"/>
      </div>
      {navStore.isLogined && <>
        <div
          className={classes.headerButton}
          style={navStore.navigation == 'usersPage' ? {background: '#EEEFF3'} : {}}
          onClick={() => navStore.setNavigation(Navigations.usersPage)}>
          Пользователи
        </div>
        <div
          className={classes.headerButton}
          style={navStore.navigation == 'branchsPage' ? {background: '#EEEFF3'} : {}}
          onClick={() => navStore.setNavigation(Navigations.branchsPage)}
        >
          Города и филиалы
        </div>
        <div
          className={classes.headerButton}
          style={navStore.navigation == 'categoriesPage' ? {background: '#EEEFF3'} : {}}
          onClick={() => navStore.setNavigation(Navigations.categoriesPage)}
        >
          Категории
        </div>
        <div
          className={classes.headerButton}
          style={navStore.navigation == 'subCategoriesPage' ? {background: '#EEEFF3'} : {}}
          onClick={() => navStore.setNavigation(Navigations.subCategoriesPage)}
        >
          Подкатегории
        </div>
        <div
          className={classes.headerButton}
          style={navStore.navigation == 'productsPage' ? {background: '#EEEFF3'} : {}}
          onClick={() => navStore.setNavigation(Navigations.productsPage)}
        >
          Товары
        </div>
        <div
          className={classes.headerButton}
          style={navStore.navigation == 'ordersPage' ? {background: '#EEEFF3'} : {}}
          onClick={() => navStore.setNavigation(Navigations.ordersPage)}
        >
          Заказы
        </div>
        <div
          className={classes.headerButton}
          style={navStore.navigation == 'settingsPage' ? {background: '#EEEFF3'} : {}}
          onClick={() => navStore.setNavigation(Navigations.settingsPage)}
        >
          Настройки
        </div>
      </>}
    </div>
  )
}

export default Header