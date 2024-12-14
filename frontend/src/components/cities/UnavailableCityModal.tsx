import styles from './City.module.css';
import { useCitiesStore } from "../../../stores/useCitiesStore.ts";
import {url} from "../../../requests/load_data.ts";

const UnavailableModal = () => {
  const citiesStore = useCitiesStore(state => state);

  return (
    citiesStore.selectedCity && !citiesStore.selectedCity.isAvailable ? (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <p>Мы еще не открылись<br/>в этом городе</p>
          <div className={styles.modalBottomContainer}>
            <div className={styles.modalButtonContainer}>
              <button onClick={citiesStore.resetSelectedCity} className={styles.modalButton}>
                Вернуться назад
              </button>
            </div>
            <div className={styles.modalImageContainer}>
              <img src={url + '/static/city-not-found.png'} alt="City not found" />
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
};

export default UnavailableModal;
