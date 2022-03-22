import type { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import { AccountsProvider } from '../context/accounts';
import {
  TradingDataProvider,
  useTradingDataContext,
} from '../context/trading-data';

// Handle event only meant for this tab

const InnerRender = () => {
  const { emitter } = useTradingDataContext();
  const [data, setData] = useState();
  useEffect(() => {
    emitter.on('trading', (data) => {
      setData(data);
    });
  }, [emitter]);

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <AccountsProvider>
      <TradingDataProvider>
        <InnerRender />
      </TradingDataProvider>
    </AccountsProvider>
  );
};

export default Home;
