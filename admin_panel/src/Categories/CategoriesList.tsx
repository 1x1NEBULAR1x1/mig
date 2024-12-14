import classes from "../Classes.module.css";
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";


const CategoriesList = () => {

  const categoriesStore = useCategoriesStore(state => state)

  return (
    <div
      className={classes.menuList}
    >
      <div className={classes.menuTitle}>
        Список категорий
      </div>
      <hr className={classes.hr}/>
      {categoriesStore.categories.map((category, index) => (<div key={`category#${category.id}`} style={{width: '100%'}}>
        <div
          className={classes.city}
          onClick={() => categoriesStore.setCategory(category)}
          style={categoriesStore.category?.id === category.id ? {color: "#1b9f01"} : {cursor: "pointer"}}
        >
          {category.name}
        </div>
        {index < categoriesStore.categories.length - 1 && <hr className={classes.hr}/>}
      </div>))}
    </div>
  )
}

export default CategoriesList