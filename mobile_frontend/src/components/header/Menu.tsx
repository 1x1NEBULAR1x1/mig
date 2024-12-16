import HeaderSearch from "./HeaderSearch.tsx";
import HeaderCategories from "./HeaderCategories.tsx";
import classes from "./Header.module.css";

const Menu = () => {


  return(
    <div className={classes.menuOverlay}>
      <div className={classes.menu}>
        <HeaderSearch classname={classes.menuSearch}/>
        <HeaderCategories className={classes.menuCategories}/>
      </div>
    </div>
  )
}

export default Menu