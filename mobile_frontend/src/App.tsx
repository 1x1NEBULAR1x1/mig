import Footer from "./components/footer/Footer.tsx";
import Header from "./components/header/Header.tsx";
import UnavailableCityModal from "./components/cities/UnavailableCityModal.tsx";
import CatalogContent from "./components/catalog/CatalogContent.tsx";
import HomeContent from "./components/home/HomeContent.tsx";
import CityContent from "./components/cities/CityContent.tsx";
import { useCitiesStore } from "../stores/useCitiesStore.ts";
import { useUIStore } from "../stores/useUIStore.ts";
import ProductModal from "./components/catalog/ProductModal.tsx";
import { useDataStore } from "../stores/useDataStore.ts";
import OrderContent from "./components/order/OrderContent.tsx";
import {useEffect} from "react";
import LoginModal from "./components/header/LoginModal.tsx";
import Profile from "./components/header/Profile.tsx";
import ExitingModal from "./components/header/ExitingModal.tsx";
import ViewOrderContent from "./components/viewOrder/ViewOrderContent.tsx";
import HistoryContent from "./components/history/HistoryContent.tsx";
import {YMaps} from "@pbe/react-yandex-maps";
import {loadAccount, loadOrderPriorities, loadOrders} from "../requests/load_data.ts";
import {useOrderStore} from "../stores/useOrderStore.ts";
import OrderModal from "./components/order/OrderModal.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import PaymentSuccessModal from "./components/order/PaymentSuccessModal.tsx";
import {Order} from "../types/models.ts";
import OrderStatusNotify from "./components/OrderStatusNotify.tsx";
import Search from "./components/header/Search.tsx";
import Menu from "./components/header/Menu.tsx";

const App = () => {
  const citiesStore = useCitiesStore((state) => state);
  const uiStore = useUIStore((state) => state);
  const dataStore = useDataStore((state) => state);
  const orderStore = useOrderStore(state => state)

  useEffect(() => {
    if (dataStore.cart.length === 0) {
      uiStore.setIsOrderPageOpen(false)
    }
  }, [dataStore.cart, uiStore.isOrderPageOpen]);

  function getOrderIdsFromCookies(): number[] {
    const match = document.cookie.match(/(?:^|;\s*)orderIds=([^;]+)/);
    return match ? JSON.parse(decodeURIComponent(match[1])) : [];
  }

  const ordersIds = getOrderIdsFromCookies()

  const checkOrders = (ordersIds: number[]) => {
    if (!ordersIds || ordersIds.length === 0) return

    ordersIds.forEach(id => {
      loadOrders().then(orders => {
        const order = orders.find(o => o.id === id);
          if (order) {
            if (order.isPaymentAccepted) {
              deleteOrderIdFromCookies(order.id)
              orderStore.setOrder(undefined)
              uiStore.setPaymentCheck(undefined)
              uiStore.setIsPaymentSuccess(true)
              setTimeout(() => {
                uiStore.setIsPaymentSuccess(false)
                uiStore.setViewOrder(order)
              }, 5000)
          }
        }
      })
    })
  }

  function deleteOrderIdFromCookies(orderId: number) {
    const existingOrderIds = getOrderIdsFromCookies();
    const updatedOrderIds = existingOrderIds.filter((id) => id !== orderId);
    document.cookie = `orderIds=${encodeURIComponent(JSON.stringify(updatedOrderIds))}; path=/; max-age=3600`;
  }
  let paymentIntervalId: number;
  const startPaymentInterval = () => {
    if (ordersIds && ordersIds.length > 0) {
      // @ts-ignore
      paymentIntervalId = setInterval(() => {
        checkOrders(getOrderIdsFromCookies())
      }, 15000)
    }
  }
  const stopPaymentInterval = () => {
    if (paymentIntervalId) {
      clearInterval(paymentIntervalId)
    }
  }
  const checkOrdersStatuses = async (orders: Order[]) => {
    const newOrders = await loadOrders()
    orders.forEach(order => {
      const newOrder = newOrders.find(o => o.id === order.id)
      if (newOrder) {
        if (order.status.id !== newOrder.status.id) {
          dataStore.setOrders(dataStore.orders.map(o => o.id === order.id ? newOrder : o))
          uiStore.setOrderStatusChanged(newOrder)
          if (uiStore.viewOrder) {
            uiStore.setViewOrder(newOrder)
          }
          setTimeout(() => {
            uiStore.setOrderStatusChanged(undefined)
          }, 5000)
        }
      }
    })
  }

  useEffect(() => {
    if (uiStore.isProfileOpened && dataStore.number) {
      loadOrders().then(orders => dataStore.setOrders(orders))
    }
  }, [uiStore.isProfileOpened]);

  let statusesIntervalId: number
  const startStatusesInterval = () => {
    if (dataStore.orders && dataStore.orders.length > 0) {
      // @ts-ignore
      statusesIntervalId = setInterval(() => {
        checkOrdersStatuses(dataStore.orders)
      }, 15000)
    }
  }

  const stopStatusesInterval = () => {
    if (statusesIntervalId) {
      clearInterval(statusesIntervalId)
    }
  }

  useEffect(() => {
    if (dataStore.orders) {
      startStatusesInterval()
    }
    return () => stopStatusesInterval()
  }, [dataStore.orders]);

  useEffect(() => {
    startPaymentInterval()
    return () => stopPaymentInterval()
  }, [ordersIds])

  useEffect(() => {
    loadOrderPriorities().then(priorities => dataStore.setOrderPriorities(priorities))
    setTimeout(() => {
      if (window.document.cookie.includes('access_token')) {
        const loader = async () => {
          const number = await loadAccount()
          if (number) {
            const orders = await loadOrders()
            dataStore.setNumber(number)
            dataStore.setOrders(orders)
          }
        }
        loader().then()
      }
    }, 150)
  }, []);

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
    <div
      className='app '
    >
      <YMaps query={{ apikey: '6e6b308e-4374-4acd-85d6-da69a5ffc26f'}}>
        <Header/>
        {uiStore.isProfileOpened && <Profile />}
        {(!citiesStore.selectedCity || !citiesStore.selectedCity?.isAvailable) && <CityContent/>}
        {citiesStore.selectedCity?.isAvailable && <>
          {!uiStore.viewOrder && !uiStore.viewHistory && <>
            {!uiStore.selectedCategory && <HomeContent/>}
            {uiStore.isOrderPageOpen && dataStore.cart.length > 0 && <OrderContent/>}

            {uiStore.selectedCategory && (!uiStore.isOrderPageOpen || dataStore.cart.length === 0) && <CatalogContent/>}
          </>}
          {dataStore.number && uiStore.viewOrder && !uiStore.viewHistory && <ViewOrderContent />}
          {dataStore.number && uiStore.viewHistory && !uiStore.viewOrder && <HistoryContent />}
        </>}
        <Footer/>
        <UnavailableCityModal/>
        <ProductModal />
        <LoginModal />
        <ExitingModal />
        {uiStore.isPaymentSuccess && <PaymentSuccessModal />}
        {orderStore.order && <OrderModal order={orderStore.order} />}
        {uiStore.orderStatusChanged && <OrderStatusNotify />}
        {uiStore.searchValue && <Search/>}
        {uiStore.isHeaderMenuOpened && <Menu />}
      </YMaps>
    </div>
    </QueryClientProvider>
  );
}
export default App