import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { url } from './requests/load_data';
import { Order } from './types/models';

const BACKGROUND_FETCH_TASK = 'check-order-status';

// Фоновая задача
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const activeOrders = await getActiveOrders();
    for (const { orderId, statusId } of activeOrders) {
      const response = await axios.get<Order>(`${url}/order-mobile/?order_id=${orderId}`);
      const newStatusId = response.data.status.id;
      if (statusId !== 1 && statusId !== 0 && statusId !== newStatusId) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Обновление статуса заказа',
            body: `Ваш заказ #${orderId} изменил статус на: ${response.data.status.fullStatus}`,
          },
          trigger: null,
        });
      } else {
        await updateOrderStatus(orderId, newStatusId);
      }
    }
  } catch (error) {
  }
});

async function getActiveOrders() {
  try {
    const ordersString = await AsyncStorage.getItem('activeOrders');
    return ordersString ? JSON.parse(ordersString) : [] as { orderId: number; statusId: number }[];
  } catch (error) {
    return [];
  }
}

async function updateOrderStatus(orderId: number, newStatusId: number) {
  try {
    const orders = await getActiveOrders();
    // @ts-ignore
    const updatedOrders = orders.map(order =>
      order.orderId === orderId ? { ...order, statusId: newStatusId } : order
    );
    await AsyncStorage.setItem('activeOrders', JSON.stringify(updatedOrders));
  } catch (error) {
  }
}
