import styles from './Catalog.module.css'
import { useUIStore } from "../../../stores/useUIStore";
import { useDataStore } from "../../../stores/useDataStore";
import {url} from "../../../requests/load_data.ts";

const ProductModal = () => {

  const uiStore = useUIStore((state) => state);

  const dataStore = useDataStore((state) => state);

  const isInCart = dataStore.cart.some((cartItem) => cartItem.product === uiStore.selectedProduct?.product);

  let amount = dataStore.cart.find((cartItem) => cartItem.product === uiStore.selectedProduct?.product)?.amount;

  if (!amount) {
    amount = 1
  }

  const onInput = (value: string) => {
    if (value === '') {
      dataStore.updateCartProduct({...uiStore.selectedProduct!, amount: 0})
      return
    }
    let amount: number
    try {
      amount = parseInt(value)
    } catch {
      amount = parseInt(value.slice(0, -1))
    }
    dataStore.updateCartProduct({...uiStore.selectedProduct!, amount: amount})
  }

  return (
    <>
      {uiStore.selectedProduct &&
				<div
					className={styles.productModalOverlay}
					onClick={() => uiStore.setSelectedProduct()}
				>
					<div
						className={styles.productModal}
            onClick={(e) => e.stopPropagation()}
					>
            <div
              className={styles.productModalLeft}
            >
							<div className={styles.productModalHeader}>
								<div className={styles.productModalTags}>
                  {uiStore.selectedProduct.product.tags?.map((tag) => (
                      <div
                        key={tag.name}
                        className={styles.productModalTag}
                        style={{
                          backgroundColor: tag.firstColor,
                          color: tag.secondColor
                        }}
                      >
                        {tag.name}
                      </div>
                    )
                  )}
								</div>
								<svg
                  className={styles.productModalButtonClose}
                  onClick={() => uiStore.setSelectedProduct(undefined)}
                  width="2vh" height="2vh" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M7.41433 5.89953L11.657 1.65689L10.2428 0.242679L6.00012 4.48532L1.75748 0.242676L0.343266 1.65689L4.58591 5.89953L0.343262 10.1422L1.75748 11.5564L6.00012 7.31374L10.2428 11.5564L11.657 10.1422L7.41433 5.89953Z"
										fill="#1B1C1F"/>
								</svg>
							</div>
							<div
								className={styles.productModalImage}
							>
								<img
									src={url + (uiStore.selectedProduct.product.imagePath || "/static/image_not_found.png")}
									alt={uiStore.selectedProduct.product.name}
								/>
							</div>
						</div>
						<div
							className={styles.productModalRight}
						>
							<div
								className={styles.productModalNameContainer}
							>
								<div
									className={styles.productModalName}
                >
                  {uiStore.selectedProduct.product.name}
                </div>
                <div
                  className={styles.productModalAmount}
                >
                  {uiStore.selectedProduct.product.amount} {uiStore.selectedProduct.product.unitsOfMeasure}
                </div>
              </div>
							<div
                className={styles.productModalPriceAndButtonContainer}
              >
                <div
                  className={styles.productModalPrice}
                >
                  {(uiStore.selectedProduct.product.price * amount).toFixed(2)} ₽
                  {uiStore.selectedProduct.product.previousPrice &&
                    <div
                      className={styles.productModalPreviousPrice}
                    >
                      {uiStore.selectedProduct.product.previousPrice} ₽
                    </div>
                  }
                </div>
                {!isInCart ?
                  <div
                    className={styles.productModalBuyButtonContainer}
                    onClick={() => {dataStore.addToCart(uiStore.selectedProduct!)}}
                  >
                    В корзину
                  </div> :
                  <div
                    className={styles.productModalBuyButtonContainer}
                  >
                    <div
                      className={styles.productModalButton}
                      onClick={() => dataStore.updateCartProduct({
                        ...dataStore.cart.find((cartItem) => cartItem.product === uiStore.selectedProduct?.product)!,
                        amount: dataStore.cart.find((cartItem) => cartItem.product === uiStore.selectedProduct?.product)!.amount - 1
                      })}
                    >
                      <svg width="14" height="2" viewBox="0 0 14 2" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M13.6673 1.83268H0.333984V0.166016H13.6673V1.83268Z"
                              fill="#EEEFF3"/>
                      </svg>
                    </div>
                    <div
                      className={styles.productModalButton}
                    >
                      <input
                        onClick={(e) => e.currentTarget.select()}
                        className={styles.productModalAmountInput}
                        type="text"
                        min={0}
                        onInput={(e) => onInput(e.currentTarget.value)}
                        value={dataStore.cart.find((cartItem) => cartItem?.product === uiStore.selectedProduct?.product)?.amount}
                      />
                    </div>
                    <div
                      className={styles.productModalButton}
                      onClick={() => dataStore.updateCartProduct({
                        ...dataStore.cart.find((cartItem) => cartItem.product === uiStore.selectedProduct?.product)!,
                        amount: dataStore.cart.find((cartItem) => cartItem.product === uiStore.selectedProduct?.product)!.amount + 1
                      })}
                    >
                      <svg width="15" height="16" viewBox="0 0 15 16" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M8.33333 0.5H6.66667V7.16667H0V8.83333H6.66667V15.5H8.33333V8.83333H15V7.16667H8.33333V0.5Z"
                          fill="#EEEFF3"/>
                      </svg>
                    </div>
                  </div>
                }
							</div>
              <div
                className={styles.productModalDescripton}
              >
                {uiStore.selectedProduct.product.description}
              </div>
              {uiStore.selectedProduct.product.contains &&
                <div
                  className={styles.productModalEnergyContainer}
                >
                  <div
                    className={styles.productModalPropertyTitle}
                  >
                    В 100 граммах
                  </div>
                  <div
                    className={styles.productModalEnergyAmountContainer}
                  >
                    {uiStore.selectedProduct.product.contains?.map((contains) => {
                      return (
                        <div
                          key={uiStore.selectedProduct!.product.id + Math.random()}
                          className={styles.productModalEnergyAmountContains}
                        >
                          <div
                            className={styles.productModalEnergyAmountNumber}
                          >
                            {contains.amount}
                          </div>
                          <div
                            className={styles.productModalEnergyAmountText}
                          >
                            {contains.name}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>}
              {uiStore.selectedProduct.product.compound &&
                <div
                  className={styles.productModalProperty}
                >
                  <div
                    className={styles.productModalPropertyTitle}
                  >
                    Состав
                  </div>
                  <div
                    className={styles.productModalPropertyContent}
                  >
                    {uiStore.selectedProduct.product.compound}
                  </div>
                </div>}
              {uiStore.selectedProduct.product.expiration &&
                <div
                  className={styles.productModalProperty}
                >
                  <div
                    className={styles.productModalPropertyTitle}
                  >
                    Срок годности
                  </div>
                  <div
                    className={styles.productModalPropertyContent}
                  >
                    {uiStore.selectedProduct.product.expiration}
                  </div>
                </div>}
              {uiStore.selectedProduct.product.storage &&
                <div
                  className={styles.productModalProperty}
                >
                  <div
                    className={styles.productModalPropertyTitle}
                  >
                    Условия хранения
                  </div>
                  <div
                    className={styles.productModalPropertyContent}
                  >
                    {uiStore.selectedProduct.product.storage}
                  </div>
                </div>}
              {uiStore.selectedProduct.product.manufacturer &&
                <div
                  className={styles.productModalProperty}
                >
                  <div
                    className={styles.productModalPropertyTitle}
                  >
                    Производитель
                  </div>
                  <div
                    className={styles.productModalPropertyContent}
                  >
                    {uiStore.selectedProduct.product.manufacturer}
                  </div>
                </div>}
						</div>
					</div>
				</div>
      }
    </>
  )
}

export default ProductModal