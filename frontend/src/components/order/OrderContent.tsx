import contentStyles from '../Content.module.css'
import styles from './Order.module.css'
import Form from "./Form.tsx";
import Payment from "./Payment.tsx";
import Cart from "./Cart.tsx";
import Recomendations from "./Recomendations.tsx";

const OrderContent = () => {

  return (
    <div
      className={contentStyles.contentLong}
    >
      <main
        className={styles.mainContainer}
      >
        <Form />
        <Cart />
        <Recomendations />
      </main>
      <Payment />
    </div>
  );
}

export default OrderContent