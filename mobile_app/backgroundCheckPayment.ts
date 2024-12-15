import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {url} from "./requests/load_data";
import {Order} from "./types/models";
import axios from "axios";

const BACKGROUND_FETCH_TASK = 'check-order-payment';

async function removeOrderId(orderIdToRemove: number) {
  try {
    const idsString = await AsyncStorage.getItem('activeOrderIds');
    const orderIds: number[] = idsString ? JSON.parse(idsString) : [];

    const updatedOrderIds = orderIds.filter(id => id != orderIdToRemove);

    await AsyncStorage.setItem('activeOrderIds', JSON.stringify(updatedOrderIds));

  } catch (error) {
  }
}


TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const orderIds: number[] = await getOrderIds();
    for (const orderId of orderIds) {
      const res = await axios.get<Order>(url + '/order-mobile/?order_id=' + orderId);
      removeOrderId(orderId);
      if (res.data.isPaymentAccepted) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Оплата заказа подтверждена',
            body: `Ваш заказ #${orderId} изменил статус на: ${res.data.status.fullStatus}`,
          },
          trigger: null,
        });
      }
    }
  } catch (error) {
  }
});

async function getOrderIds() {
  try {
    const idsString = await AsyncStorage.getItem('activeOrderIds');
    return idsString ? JSON.parse(idsString) : [] as number[];
  } catch (error) {
    return [];
  }
}
