import {useDataStore} from "../../../stores/useDataStore.ts";
import styles from './Footer.module.css'

const FooterInfo = () => {

  const categories = useDataStore((state => state.categories));


  return (
    <>
      {Array.isArray(categories) && categories.length > 0 &&
        <div
          className={styles.infoCategoriesContainer}
        >
          {categories.map((category) => {
            return (
              <p
                key={category.id}
                className={styles.infoCategoryButton}
              >
                {category.name}
              </p>
            )
          })}
        </div>
      }
      <div
        className={styles.privatePolicyAndPublicOfertContainer}
      >
        <div
          className={styles.PPAPOButton}
        >
          Политика конфиденциальности
        </div>
        <div
          className={styles.PPAPOButton}
        >
          Публичная оферта
        </div>
      </div>



    </>

  )
}

export default FooterInfo