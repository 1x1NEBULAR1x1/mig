import {useTax} from "./useTax";
import {useEffect, useState} from "react";

export const useTotalPrice = (
  deliveryPrice: number | undefined,
  cartPrice: number,
  priorityPrice: number,
  curierTips: 'Без чая' | '5%' | '10%' | '20%' | undefined,
) => {
  const [totalPrice, setTotalPrice] = useState(0)
  const {data: tax} = useTax()
  let tips = 0

  switch (curierTips) {
    case 'Без чая':
      tips = 0
      break;
    case '5%':
      tips = parseFloat((cartPrice * 0.05).toFixed(2))
      break;
    case '10%':
      tips = parseFloat((cartPrice * 0.1).toFixed(2))
      break;
    case '20%':
      tips = parseFloat((cartPrice * 0.2).toFixed(2))
      break;
    default:
      tips = 0
      break;
  }

  useEffect(() => {
    setTotalPrice(parseFloat((cartPrice + priorityPrice + (deliveryPrice || 0) + (tax || 0) + tips).toFixed(2)))
  }, [cartPrice, deliveryPrice, tax, tips, priorityPrice]);

  return totalPrice
}