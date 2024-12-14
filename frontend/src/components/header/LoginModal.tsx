import styles from './Header.module.css'
import { useDataStore } from "../../../stores/useDataStore.ts";
import { useUIStore } from "../../../stores/useUIStore.ts";
import {checkVerificationCode, loadOrders, sendVerificationCode} from "../../../requests/load_data.ts";

const LoginModal = () => {

  const dataStore = useDataStore(state => state);
  const uiStore = useUIStore(state => state)

  const onInputNumber = (text: string) => {

    text = text.replace(/[^\d+]/g, "");

    if (uiStore.phoneNumber === '') {
      text = "+7 " + text;
    }
    if (text.startsWith("+7")) {
      const digits = text.replace(/[^\d]/g, "");
      text = `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`.trim();
    }
    uiStore.setPhoneNumber(text);
  };

  const onContinue = async () => {
    if (uiStore.phoneNumber && uiStore.phoneNumber.length === 16) {
      const cleanedPhone = uiStore.phoneNumber.replace(/\s+/g, "");
      const res = await sendVerificationCode('%2B'+ cleanedPhone.slice(1))
      if (res.status !== 200) {
        uiStore.setIsVerifying(false)
      } else {
        uiStore.setIsVerifying(true)
      }
    }
  }

  return (
    <>
      {uiStore.isLoginModalOpened &&
        <div className={styles.loginModalOverlay} onClick={() => uiStore.setIsLoginModalOpened(false)}>
					<div className={styles.loginModalContainer} onClick={(e) => e.stopPropagation()}>
            {!dataStore.isVerified && !uiStore.isVerifying &&
              <>
                <div className={styles.loginModalTitle}>Вход в профиль</div>
                <div className={styles.loginModalContent}>
                  <div className={styles.loginModalLabel}>Телефон</div>
                  <div className={styles.loginModalInputContainer}>
                    <input
                      type='text'
                      className={styles.loginModalInput}
                      value={(uiStore.phoneNumber ? uiStore.phoneNumber : '')}
                      placeholder='+7 ___ ___ __ __'
                      maxLength={16}
                      onInput={(e) => onInputNumber(e.currentTarget.value)}
                    />
                    <div className={styles.loginModalButton} onClick={async () => await onContinue()}>
                      Продолжить
                    </div>
                  </div>
                </div>
              </>}
            {uiStore.isVerifying &&
              <>
                <div className={styles.loginModalVerifyingTitle}>Вход в профиль</div>
                <div className={styles.loginModalVerifyingContent}>
                  <div className={styles.loginModalVerifyingText}>
                      На ваш номер придет смс с кодом<br /> подтверждения, введите его в поле ниже
                    <div className={styles.loginModalVerifyingBack} onClick={() => uiStore.setIsVerifying(false)}>
                      Изменить номер
                    </div>
                  </div>
                  <div
                    className={styles.loginModalVerifyingContainer}
                  >
                    <input
                      placeholder='Введите код'
                      max={6}
                      className={styles.loginModalVerifyingInput}
                      value={uiStore.code}
                      onInput={(e) => {
                        try{
                          parseInt(e.currentTarget.value)
                          uiStore.setCode(e.currentTarget.value)
                        }
                        catch {
                          uiStore.setIsCodeError(true)
                        }
                      }}
                    />
                    <div
                      className={styles.loginModalVerifyingButton}
                      onClick={async () => {
                        if (!uiStore.phoneNumber) return
                        const cleanedPhone = uiStore.phoneNumber.replace(/\s+/g, "");
                        const res = await checkVerificationCode(cleanedPhone, uiStore.code)
                        if (res.status === 200) {
                          dataStore.setIsVerified(true)
                          dataStore.setNumber(uiStore.phoneNumber)
                          uiStore.setIsLoginModalOpened(false)
                          uiStore.setIsVerifying(false)
                          const orders = await loadOrders()
                          dataStore.setOrders(orders)
                        }
                        else {
                          uiStore.setIsCodeError(true)
                        }
                      }}
                    >
                      Войти в профиль
                    </div>
                  </div>
                  <div
                    className={styles.loginModalVerifyingError}
                    style={uiStore.isCodeError ? {display: 'block'} : {display: 'none'}}
                  >
                    Неверный код
                  </div>
                    <div
                      className={styles.loginModalVerifyingRetry}
                      onClick={async () => {
                        if (!uiStore.phoneNumber) return
                          const cleanedPhone = uiStore.phoneNumber.replace(/\s+/g, "");
                          const res = await checkVerificationCode(cleanedPhone, uiStore.code)
                          if (res.status === 200) {
                            dataStore.setIsVerified(true)
                            dataStore.setNumber(uiStore.phoneNumber)
                            uiStore.setIsLoginModalOpened(false)
                            uiStore.setIsVerifying(false)
                            const orders = await loadOrders()
                            dataStore.setOrders(orders)
                          }
                          else {
                            uiStore.setIsCodeError(true)
                          }
                        }}
                    >
                      <svg width="1.333vh" height="1.333vh" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15.5357 0.414062H13.8691V3.32907C12.4749 1.5784 10.3361 0.500357 8 0.500357C3.85786 0.500357 0.5 3.85822 0.5 8.00036C0.5 12.1425 3.85786 15.5004 8 15.5004C12.1421 15.5004 15.5 12.1425 15.5 8.00036H13.8333C13.8333 11.222 11.2217 13.8337 8 13.8337C4.77834 13.8337 2.16667 11.222 2.16667 8.00036C2.16667 4.7787 4.77834 2.16702 8 2.16702C9.91033 2.16702 11.6509 3.09358 12.7274 4.58073L9.70241 4.58073V6.2474H14.7024C15.1626 6.2474 15.5357 5.8743 15.5357 5.41406V0.414062Z"
                          fill="#56585F"/>
                      </svg>
                      Отправить повторно
                    </div>
                </div>
              </>}
          </div>
        </div>
      }
    </>
  );
}

export default LoginModal;