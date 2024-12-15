import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './navigation/Navigation';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import './backgroundCheckPayment'
import './backgroundCheckStatus'
import {useEffect} from "react";
import * as BackgroundFetch from 'expo-background-fetch';

export default function App() {
  const queryClient = new QueryClient()
  useEffect(() => {
    async function setupTask() {
      try {
        // Регистрация фоновой задачи
        await BackgroundFetch.registerTaskAsync('check-order-payment', {
          minimumInterval: 15, // Интервал в минутах
          stopOnTerminate: false, // Не останавливать при завершении приложения
          startOnBoot: true, // Запускать при загрузке устройства
        });
        await BackgroundFetch.registerTaskAsync('check-order-status', {
          minimumInterval: 15, // Интервал в минутах
          stopOnTerminate: false, // Не останавливать при завершении приложения
          startOnBoot: true, // Запускать при загрузке устройства
        });
        console.log('bg ok')
      } catch (e) {
        console.log(e)
      }
    }
    setupTask();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Navigation/>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}