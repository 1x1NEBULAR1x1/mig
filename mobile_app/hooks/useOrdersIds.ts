import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useOrderIds = () => {
  const [orderIds, setOrderIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadOrderIds = async () => {
      try {
        const storedOrderIds = await AsyncStorage.getItem("activeOrderIds");
        if (storedOrderIds) {
          setOrderIds(JSON.parse(storedOrderIds));
        }
      } catch (error) {
        console.error("Failed to load active order IDs from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderIds().then();
  }, []);

  const addOrdersFromDataStore = async (orders: { id: number }[]) => {
    const newOrderIds = orders.map((order) => order.id);
    const mergedOrderIds = Array.from(new Set([...orderIds, ...newOrderIds]));
    setOrderIds(mergedOrderIds);
    await saveOrderIdsToStorage(mergedOrderIds);
  };

  const saveOrderIdsToStorage = async (newOrderIds: number[]) => {
    try {
      await AsyncStorage.setItem("activeOrderIds", JSON.stringify(newOrderIds));
    } catch (error) {
      console.error("Failed to save active order IDs to AsyncStorage:", error);
    }
  };

  const addOrderId = async (orderId: number) => {
    if (!orderIds.includes(orderId)) {
      const newOrderIds = [...orderIds, orderId];
      setOrderIds(newOrderIds);
      await saveOrderIdsToStorage(newOrderIds);
    }
  };

  const removeOrderId = async (orderId: number) => {
    const newOrderIds = orderIds.filter((id) => id !== orderId);
    setOrderIds(newOrderIds);
    await saveOrderIdsToStorage(newOrderIds);
  };

  const clearOrderIds = async () => {
    try {
      await AsyncStorage.removeItem("activeOrderIds");
      setOrderIds([]);
    } catch (error) {
    }
  };

  return {
    orderIds,
    loading,
    addOrderId,
    removeOrderId,
    clearOrderIds,
    addOrdersFromDataStore
  };
};
