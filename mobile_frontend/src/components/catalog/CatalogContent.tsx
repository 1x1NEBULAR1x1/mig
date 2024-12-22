import Sider from "./Sider.tsx";
import Cart from "./Cart.tsx";
import ProductsList from "./ProductsList.tsx";
import classes from "./Catalog.module.css";
import {useState} from "react";
import {useSwipeable} from "react-swipeable";

const CatalogContent = () => {
  const [isSiderOpened, setIsSiderOpened] = useState(false);
  const handlers = useSwipeable({
    onSwipedLeft: () => setIsSiderOpened(false),
    onSwipedRight: () => setIsSiderOpened(true),
    preventScrollOnSwipe: true,
    trackMouse: true, // позволяет использовать свайп мышью
  });
  return (
    <div
      className={classes.contentLong}
      {...handlers}
    >
      <Sider isSiderOpened={isSiderOpened} setIsSiderOpened={setIsSiderOpened}/>
      <ProductsList/>
      <Cart/>
    </div>
  );

}

export default CatalogContent
