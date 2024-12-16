import styles from './Order.module.css'
import profileStyles from '../header/Header.module.css'
import { useDataStore } from "../../../stores/useDataStore.ts";
import { useCitiesStore } from "../../../stores/useCitiesStore.ts";
import { useOrderStore } from "../../../stores/useOrderStore.ts";
import axios from "axios";
import { useEffect } from "react";
import {OrderCreate} from "../../../types/models.ts";
import {checkVerificationCode, sendVerificationCode} from "../../../requests/load_data.ts";
import {useDeliveryPrice} from "../../../hooks/useDeliveryPrice.ts";
import {useTax} from "../../../hooks/useTax.ts";

const Payment = () => {
  const citiesStore = useCitiesStore(state => state);
  const orderStore = useOrderStore(state => state)
  const deliveryCost = useDeliveryPrice({cityName: citiesStore.selectedCity!.name, house: orderStore.orderHouse, street: orderStore.orderStreet})
  const dataStore = useDataStore(state => state)
  const cartPrice = dataStore.cart.reduce((total, cartItem) => {
    return total + cartItem.amount * cartItem.product.price
  }, 0);
  const taxRate = useTax()
  let priorityPrice = 0
  if (orderStore.orderDeliveryPriority) {
    priorityPrice = cartPrice * (orderStore.orderDeliveryPriority!.extraCost / 100)
  }
  const address = citiesStore.selectedCity?.name + ', ' + orderStore.orderStreet + ', ' + orderStore.orderHouse
  const tips = orderStore.paymentTips === 'Без чая' ? 0 : orderStore.paymentTips === '5%' ? cartPrice * 0.05 : orderStore.paymentTips === '10%' ? cartPrice * 0.1 : orderStore.paymentTips === '20%' ? cartPrice * 0.2 : 0
  const totalPrice = parseFloat(cartPrice.toFixed(2)) + parseFloat((deliveryCost.data || 0).toFixed(2)) + parseFloat(priorityPrice.toFixed(2)) + parseFloat((cartPrice * (taxRate.data || 0)  / 100).toFixed(2)) + parseFloat(tips.toFixed(2))

  const createOrder = async () => {
    const order: OrderCreate = {
      totalPrice: totalPrice,
      address: {
        cityId: citiesStore.selectedCity!.id,
        street: orderStore.orderStreet,
        house: orderStore.orderHouse,
        floor: orderStore.orderFloor,
        flat: orderStore.orderFlat,
        entrance: orderStore.orderEntrance,
        comment: orderStore.orderComment,
        latitude: orderStore.latitude,
        longitude: orderStore.longtude,
      },
      products: dataStore.cart,
      deliveryPrice: (deliveryCost.data || 0),
      paymentMethod: orderStore.paymentMethod,
      curierTips: tips,
      priority: orderStore.orderDeliveryPriority!
    };
    if (order) {
      orderStore.setOrder(order)
    }
  }

  const apiKey = '6e6b308e-4374-4acd-85d6-da69a5ffc26f';

  const getCoordinates = async (address: string) => {
    try {
      const res = await axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${apiKey}&geocode=${encodeURIComponent(address)}`);
      const point = res.data.response.GeoObjectCollection.featureMember[0]?.GeoObject.Point.pos;

      if (point) {
        const [longitude, latitude] = point.split(" ");
        if (latitude && longitude) {
          orderStore.setLongtude(parseFloat(longitude))
          orderStore.setLatitude(parseFloat(latitude))
        }
      } else {
        console.warn("Адрес не найден");
      }
    } catch (error) {
      console.error("Ошибка при геокодировании:", error);
    }
  };

  useEffect(() => {
    if (address.trim()) {
      getCoordinates(address).then();
    }
  }, [address]);


  const onContinue = async () => {
    if (orderStore.paymentPhoneInput && orderStore.paymentPhoneInput.length === 16) {
      const cleanedPhone = orderStore.paymentPhoneInput.replace(/\s+/g, "");
      const res = await sendVerificationCode('%2B'+ cleanedPhone.slice(1))
      if (res.status == 200) {
        orderStore.setPaymentCode(true)
      }
    }
  }

  const onInput = (text: string) => {

    text = text.replace(/[^\d+]/g, "");

    if (orderStore.paymentPhoneInput === '') {
      text = "+7 " + text;
    }
    if (text.startsWith("+7")) {
      const digits = text.replace(/[^\d]/g, "");
      text = `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`.trim();
    }
    orderStore.setPaymentPhoneInput(text);
  };

  return (
    <div
      className={styles.paymentSider}
    >
      <div
        className={styles.paymentPhoneInputContainer}
      >
        {dataStore.number && !orderStore.paymentResetPhone && !orderStore.paymentCode &&
          <>
            Ваш номер телефона
            <div
              className={styles.paymentPhoneReset}
              onClick={() => {
                orderStore.setPaymentResetPhone(true)
              }}
            >
              Изменить номер
            </div>
            <div className={styles.paymentPhoneInputContain}>
              <input
                className={styles.paymentPhoneInput}
                value={dataStore.number}
              />
              <div
                  className={styles.paymentPhoneButton}
                  style={{background: '#EEEFF3', color: '#BDBFC9'}}
              >
                Подтвержден
                <svg width="1vh" height="1vh" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M15.0483 2.09257L6.2983 10.8426C5.97287 11.168 5.44523 11.168 5.11979 10.8426L0.953125 6.67591L2.13164 5.4974L5.70905 9.07481L13.8698 0.914062L15.0483 2.09257Z"
                        fill="#BDBFC9"/>
                </svg>
              </div>
            </div>
          </>}
        {(!dataStore.number || orderStore.paymentResetPhone) && !orderStore.paymentCode &&
          <>
            <div
              className={styles.paymentElementTitle}
            >Подтвердите ваш номер телефона</div>
            <div className={styles.paymentPhoneInputContain}>
              <input
                className={styles.paymentPhoneInput}
                value={orderStore.paymentPhoneInput}
                onInput={(e) => onInput(e.currentTarget.value)}
              />
              <div
                  className={styles.paymentPhoneButton}
                  style={orderStore.paymentPhoneInput?.length < 16 ? {background: '#EEEFF3', color: '#56585F'} : {background: '#1B9F01', color: '#EEEFF3'}}
                  onClick={() => onContinue()}
              >
                Подтвeрдить
              </div>
            </div>
          </>}
        {orderStore.paymentCode &&
					<>
						<div
							className={styles.paymentElementTitle}
						>Подтвердите ваш номер телефона
						</div>
						<div
							className={styles.paymentPhoneResetText}
						>
							На ваш номер придет смс с кодом подтверждения, введите его в поле ниже
						</div>
						<div
							className={styles.paymentPhoneReset}
              onClick={() => {
                orderStore.setPaymentCode(false)

              }}
						>Изменить номер
						</div>
						<div className={styles.paymentPhoneInputContain}>
							<input
								className={styles.paymentPhoneInput}
								value={orderStore.paymentCodeInput}
								onInput={(e) => {
                  try {
                    parseInt(e.currentTarget.value)
                    orderStore.setPaymentCodeInput(e.currentTarget.value)
                  } catch {
                    orderStore.setPaymentCodeError(true)
                  }
                }}
							/>
							<div
								className={styles.paymentPhoneButton}
								style={{background: '#000000', color: '#FFFFFF'}}
								onClick={async () => {
                  const cleanedPhone = orderStore.paymentPhoneInput.replace(/\s+/g, "");
                  const res = await checkVerificationCode(cleanedPhone.slice(0), orderStore.paymentCodeInput)
                  if (res.status === 200) {
                    dataStore.setNumber(orderStore.paymentPhoneInput)
                    orderStore.setPaymentCode(false)
                    orderStore.setPaymentCodeInput('')
                    orderStore.setPaymentCodeError(false)
                    orderStore.setPaymentResetPhone(false)
                  }
                }}
							>
								Подтвeрдить
							</div>
						</div>
						<div
							className={profileStyles.loginModalVerifyingRetry}
              onClick={async () => {
                  const cleanedPhone = orderStore.paymentPhoneInput.replace(/\s+/g, "");
                  console.log(cleanedPhone);
                  const res = await checkVerificationCode(cleanedPhone, orderStore.paymentCodeInput)
                  if (res.status === 200) {
                    dataStore.setNumber(cleanedPhone.slice(1))
                    orderStore.setPaymentCode(false)
                    orderStore.setPaymentCodeInput('')
                    orderStore.setPaymentCodeError(false)
                    orderStore.setPaymentResetPhone(false)
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
            {orderStore.paymentCodeError &&
							<div
								className={styles.paymentPhoneResetCodeError}
							>
								Неверный код
							</div>}
					</>}
      </div>
      <hr className={styles.cartProductLine}/>
      <div
        className={styles.paymentElement}
      >
        <div
          className={styles.paymentElementTitle}
        >
          Способ оплаты
        </div>
        <div
          className={styles.paymentMethodContainer}
        >
          <div
            className={styles.paymentMethodButton}
            onClick={() => orderStore.setPaymentMethod('Перевод')}
            style={orderStore.paymentMethod === 'Перевод' ? {border: '1px solid #1B9F01', background: '#FFFFFF'} : {border: '1px solid #FFFFFF'}}
          >
            Перевод
            <svg width="1.667vh" height="1.667vh" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.5 0H16.5V5.58594L18.793 3.29297L20.2072 4.70718L16.2072 8.70718C15.8167 9.09771 15.1835 9.09771 14.793 8.70718L10.793 4.70718L12.2072 3.29297L14.5 5.58579V0Z"
                  fill="#1B1C1F"/>
              <path
                  d="M0.5 6C0.5 4.34315 1.84315 3 3.5 3H8.5V5H3.5C2.94772 5 2.5 5.44772 2.5 6L2.5 7H8.5V9H2.5V16C2.5 16.5523 2.94771 17 3.5 17H17.5C18.0523 17 18.5 16.5523 18.5 16V9L20.5 9V16C20.5 17.6569 19.1569 19 17.5 19H3.5C1.84315 19 0.5 17.6569 0.5 16V6Z"
                  fill="#1B1C1F"/>
            </svg>
          </div>
          <div
              className={styles.paymentMethodButton}
              style={orderStore.paymentMethod === 'СБП' ? {border: '1px solid #1B9F01', background: '#FFFFFF'} : {border: '1px solid #FFFFFF'}}
              onClick={() => orderStore.setPaymentMethod('СБП')}
          >
            СБП
            <svg width="1.667vh" height="1.667vh" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.542969 5.22461L3.44935 10.4196V13.5883L0.546369 18.7731L0.542969 5.22461Z" fill="#5B57A2"/>
              <path d="M11.7031 8.5279L14.4265 6.85872L20.0001 6.85352L11.7031 11.9363V8.5279Z" fill="#D90751"/>
              <path d="M11.6868 5.19336L11.7022 12.0713L8.78906 10.2813V0L11.6868 5.19336Z" fill="#FAB718"/>
              <path d="M19.9992 6.85415L14.4254 6.85934L11.6868 5.19336L8.78906 0L19.9992 6.85415Z" fill="#ED6F26"/>
              <path d="M11.7022 18.8019V15.465L8.78906 13.709L8.79066 24.0005L11.7022 18.8019Z" fill="#63B22F"/>
              <path d="M14.4189 17.1479L3.44915 10.4196L0.542969 5.22461L19.9874 17.1411L14.4189 17.1479Z"
                    fill="#1487C9"/>
              <path d="M8.79102 24L11.7022 18.8014L14.4188 17.1474L19.9873 17.1406L8.79102 24Z" fill="#017F36"/>
              <path d="M0.546875 18.7731L8.81341 13.7091L6.03423 12.0039L3.44985 13.5883L0.546875 18.7731Z"
                    fill="#984995"/>
            </svg>

          </div>
        </div>
      </div>
      <div
        className={styles.paymentElement}
      >
        <div
          className={styles.paymentElementTitle}
        >
          Чаевые курьеру
        </div>
        <div
            className={styles.paymentElementContainer}
        >
          <div
              className={styles.paymentElementButtonBig}
              style={orderStore.paymentTips === 'Без чая' ? {border: '1px solid #1B9F01', background: '#FFFFFF'} : {border: '1px solid #FFFFFF'}}
              onClick={() => orderStore.setPaymentTips('Без чая')}
          >
            Без чая
          </div>
          <div
              className={styles.paymentElementButtonSmall}
              style={orderStore.paymentTips === '5%' ? {border: '1px solid #1B9F01', background: '#FFFFFF'} : {border: '1px solid #FFFFFF'}}
              onClick={() => orderStore.setPaymentTips('5%')}
          >
            5%
          </div>
          <div
              className={styles.paymentElementButtonSmall}
              style={orderStore.paymentTips === '10%' ? {border: '1px solid #1B9F01', background: '#FFFFFF'} : {border: '1px solid #FFFFFF'}}
              onClick={() => orderStore.setPaymentTips('10%')}
          >
            10%
          </div>
          <div
              className={styles.paymentElementButtonSmall}
              style={orderStore.paymentTips === '20%' ? {border: '1px solid #1B9F01', background: '#FFFFFF'} : {border: '1px solid #FFFFFF'}}
              onClick={() => orderStore.setPaymentTips('20%')}
          >
            20%
          </div>
        </div>
      </div>
      <hr className={styles.cartProductLine} />
      <div
        className={styles.paymentProductsPriceContainer}
      >
        <div
          className={styles.paymentProductsPriceText}
        >
          {dataStore.cart.length} ед. товара
        </div>
        {(cartPrice.toFixed(2))} Руб.
      </div>
      <div
        className={styles.paymentProductsPriceContainer}
      >
        <div
          className={styles.paymentProductsPriceText}
        >
          Стоимость доставки
        </div>
        {(deliveryCost.data || 0).toFixed(2)} Руб.
      </div>
      {orderStore.orderDeliveryPriority && orderStore.orderDeliveryPriority.extraCost > 0 &&
          <div className={styles.paymentProductsPriceContainer}>
            <p className={styles.paymentProductsPriceText}>Оплата за скорость доставки:</p>
            <div>
              {priorityPrice.toFixed(2)} Руб.
            </div>
          </div>
        }
      <div
        className={styles.paymentProductsPriceContainer}
      >
        <div
          className={styles.paymentProductsPriceText}
        >
          Налог
        </div>
        {(cartPrice * (taxRate.data || 0) / 100).toFixed(2)} Руб.
      </div>
      <div
        className={styles.paymentOrderPriceContainer}
      >
        <div
          className={styles.paymentOrderPriceText}
        >
          Итого
        </div>
        {totalPrice.toFixed(2)} ₽
      </div>
      <button
        className={styles.paymentCreateOrderButton}
        style={!dataStore.number || !orderStore.orderStreet || !orderStore.orderHouse || !orderStore.orderFlat || !orderStore.orderFloor ? {background: '#EEEFF3', color: '#BDBFC9'} : {}}
        onClick={async () => createOrder()}
        disabled={!dataStore.number || !orderStore.orderStreet || !orderStore.orderHouse || !orderStore.orderFlat || !orderStore.orderFloor}
      >
        Оформить заказ
      </button>
    </div>
  );
}

export default Payment