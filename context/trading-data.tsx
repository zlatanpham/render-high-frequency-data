import React, { createContext, useContext, useEffect, useRef } from 'react';
import { WorkerDataTypes } from '../types/worker';
import { useAccountsContext } from './accounts';
import mitt, { Emitter } from 'mitt';
import { useIsWindowVisible } from '../hooks/useIsWindowVisible';

interface TradingDataValues {
  emitter: Emitter<any>;
}

const TradingDataContext = createContext<TradingDataValues>({
  emitter: mitt(),
});

const TradingDataProvider: React.FC<React.ReactNode> = ({ children }) => {
  const worker = useRef<Worker>();
  const tradingData = useRef();
  const emitter = useRef(mitt());
  const isOnTab = useRef(true);

  const { accounts } = useAccountsContext();
  const isVisible = useIsWindowVisible();

  useEffect(() => {
    isOnTab.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    worker.current = new Worker(
      new URL('../trading-data-worker.ts', import.meta.url),
    );
    // Connect to the shared worker

    // Set an event listener that either sets state of the web socket
    // Or handles data coming in for ONLY this tab.
    worker.current.onmessage = (event) => {
      const { data, type } = event.data as WorkerDataTypes;
      switch (type) {
        case 'TRADE':
          if (isOnTab.current) {
            tradingData.current = data;
            emitter.current.emit('trading', tradingData.current);
          }
          break;
      }
    };
  }, []);

  useEffect(() => {
    if (worker.current) {
      worker.current?.postMessage({
        type: 'ACCOUNTS',
        data: accounts,
      });
    }
  }, [accounts]);

  return (
    <TradingDataContext.Provider value={{ emitter: emitter.current }}>
      {children}
    </TradingDataContext.Provider>
  );
};

const useTradingDataContext = () => useContext(TradingDataContext);

export { TradingDataProvider, useTradingDataContext };
