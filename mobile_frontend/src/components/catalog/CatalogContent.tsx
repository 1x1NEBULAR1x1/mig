import Sider from "./Sider.tsx";
import Cart from "./Cart.tsx";
import ProductsList from "./ProductsList.tsx";
import classes from "./Catalog.module.css";

const CatalogContent = () => {

  return (
    <div
      className={classes.contentLong}
    >
      <Sider/>
      <ProductsList/>
      <Cart/>
    </div>
  );

}

export default CatalogContent
