import type { NextPage } from 'next';
import { DataTable } from '../components/DataTable';
import { AccountsProvider } from '../context/accounts';
import { TradingDataProvider } from '../context/trading-data';

const Home: NextPage = () => {
  return (
    <AccountsProvider>
      <TradingDataProvider>
        <DataTable />
      </TradingDataProvider>
    </AccountsProvider>
  );
};

export default Home;
