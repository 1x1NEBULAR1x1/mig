import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useOrdersStatuses = () => {
  const [orders, setOrders] = useState<{ orderId: number; statusId: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem("activeOrders");
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadOrders().then();
  }, []);

  const saveOrdersToStorage = async (newOrders: { orderId: number; statusId: number }[]) => {
    try {
      await AsyncStorage.setItem("activeOrders", JSON.stringify(newOrders));
    } catch {
    }
  };

  const addOrder = async (order: { orderId: number; statusId: number }) => {
    const exists = orders.some(o => o.orderId === order.orderId);
    let updatedOrders;

    if (exists) {
      // Обновить statusId, если orderId уже существует
      updatedOrders = orders.map(o =>
        o.orderId === order.orderId ? { ...o, statusId: order.statusId } : o
      );
    } else {
      // Добавить новый order
      updatedOrders = [...orders, order];
    }

    setOrders(updatedOrders);
    await saveOrdersToStorage(updatedOrders);
  };

  const removeOrder = async (orderId: number) => {
    const updatedOrders = orders.filter(order => order.orderId !== orderId);
    setOrders(updatedOrders);
    await saveOrdersToStorage(updatedOrders);
  };

  const clearOrders = async () => {
    try {
      await AsyncStorage.removeItem("activeOrders");
      setOrders([]);
    } catch (error) {
    }
  };

  const addOrdersFromDataStore = async (
    newOrders: { orderId: number; statusId: number }[]
  ) => {
    const mergedOrders = [...orders];

    newOrders.forEach(newOrder => {
      const existingIndex = mergedOrders.findIndex(o => o.orderId === newOrder.orderId);

      if (existingIndex !== -1) {
        // Обновить statusId, если orderId уже существует
        mergedOrders[existingIndex].statusId = newOrder.statusId;
      } else {
        // Добавить новый order
        mergedOrders.push(newOrder);
      }
    });

    setOrders(mergedOrders);
    await saveOrdersToStorage(mergedOrders);
  };

  return {
    orders,
    loading,
    addOrder,
    removeOrder,
    clearOrders,
    addOrdersFromDataStore
  };
};
