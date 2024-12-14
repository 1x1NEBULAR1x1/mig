import styles from './Header.module.css'
import { useUIStore } from "../../../stores/useUIStore.ts";
import { useDataStore } from "../../../stores/useDataStore.ts";

const ExitingModal = () => {

  const uiStore = useUIStore(state => state)

  const dataStore = useDataStore(state => state)

  return (
    <>
      {uiStore.isExiting &&
        <div
          className={styles.loginModalOverlay}
          onClick={() => uiStore.setIsExiting(false)}
        >
          <div
            className={styles.exitingModalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={styles.exitingModalText}
            >
              Вы уверены, что хотите<br /> выйти из профиля?
            </div>
            <div
              className={styles.exitingModalButtonContainer}
            >
              <div
                className={styles.exitingModalButtonExit}
                onClick={() => {
                  window.document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                  dataStore.logout();
                  uiStore.setIsExiting(false);
                  uiStore.setIsProfileOpened(false)}
              }
              >
                Выйти
              </div>
              <div
                className={styles.exitingModalButtonCancel}
                onClick={() => uiStore.setIsExiting(false)}
              >
                Отменить
              </div>
            </div>
          </div>
        </div>}
    </>
  )
}

export default ExitingModal