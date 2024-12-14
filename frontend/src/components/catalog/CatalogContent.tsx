import contentStyles from '../Content.module.css'
import Sider from "./Sider.tsx";
import Cart from "./Cart.tsx";
import ProductsList from "./ProductsList.tsx";

const CatalogContent = () => {

  return (
    <div
      className={contentStyles.contentLong}
    >
      <Sider/>
      <ProductsList/>
      <Cart/>
    </div>
  );

}

export default CatalogContent
