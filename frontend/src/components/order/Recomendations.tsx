import styles from './Order.module.css'
import Product from "../catalog/Product.tsx";
import { type Product as ProductType } from '../../../types/models.ts';
import { useUIStore } from "../../../stores/useUIStore.ts";

const Recomendations = () => {

  const uiStore = useUIStore((state) => state);

  return (
    <div
      className={styles.recomendationsContainer}
    >
      <div
        className={styles.recomendationsTitle}
      >
        Смотрите также
      </div>
      <div
        className={styles.recomendationsContent}
      >
        {uiStore.recomendations?.map((product: ProductType) => (
          <Product product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

export default Recomendations