import {useEffect, useState} from "react";
import {OrderPriority} from "../types/models";


export const usePriorityPrice = (priority: OrderPriority | undefined, cartPrice: number) => {
  const [priorityPrice, setPriorityPrice] = useState(0)

  useEffect(() => {
    if (priority && priority.extraCost) {
      setPriorityPrice(parseFloat((cartPrice * (priority.extraCost / 100)).toFixed(2)))
    } else {
      setPriorityPrice(0)
    }
  }, [priority]);

  return priorityPrice
}