import classes from './Order.module.css'


const PaymentSuccessModal = () => {

  return (
    <div className={classes.orderModalOverlay}>
      <div className={classes.orderModalContainer}>
        <div className='w-full flex justify-center items-center'>
          <div className='aspect-square bg-[#1B9F01] p-4 rounded-full w-auto h-auto'>
            <svg width="4vh" height="4vh" viewBox="0 0 39 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M38.1755 3.14454L14.988 26.332C14.1256 27.1945 12.7273 27.1945 11.8649 26.332L0.823242 15.2904L3.9463 12.1673L13.4264 21.6475L35.0524 0.0214844L38.1755 3.14454Z"
                    fill="white"/>
            </svg>
          </div>
        </div>
        <div className={classes.orderModalTitle}>Оплата прошла успешно</div>
        <div className={classes.orderModalText}>Страница закроется автоматически через 5 секунд</div>
      </div>
    </div>
  )
}

export default PaymentSuccessModal