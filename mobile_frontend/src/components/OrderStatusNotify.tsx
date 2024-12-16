import {useUIStore} from "../../stores/useUIStore.ts";


const OrderStatusNotify = () => {
  const uiStore = useUIStore(state => state)

  return (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: '1.66667vh 1.0416667vw',
        gap: '2vh',
        position: 'absolute',
        width: 'auto',
        height: 'auto',
        top: '8vh',
        background: '#FFFFFF',
        boxShadow: '4px 4px 42px rgba(156, 143, 132, 0.4)',
        borderRadius: '2vh',
        zIndex: '50',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        <div className='h-full w-auto aspect-square p-1 flex justify-center items-center'>
          <div className='h-12 w-12 aspect-square rounded-full bg-[#1B9F01] flex justify-center items-center'>
            <svg width="28" height="28" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M15.0473 1.59221L6.29733 10.3422C5.97189 10.6676 5.44425 10.6676 5.11882 10.3422L0.952148 6.17554L2.13066 4.99703L5.70807 8.57444L13.8688 0.413696L15.0473 1.59221Z"
                    fill="#EEEFF3"/>
            </svg>
          </div>
        </div>
        <div className='flex-col w-full h-full justify-center'>
          <div className='text-md text-[#1B1C1F] font-bold'>Заказ изменил статус</div>
          <div className='text-xs text-[#56585F]'>
            Ваш заказ №{uiStore.orderStatusChanged?.id} изменил статус на {uiStore.orderStatusChanged?.status.fullStatus}
          </div>
        </div>
      </div>
  )
}

export default OrderStatusNotify