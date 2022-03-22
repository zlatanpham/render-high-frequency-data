import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import dbAccounts from '../data/db-accounts';
import binanceAccounts from '../data/binance-accounts';
import { Account } from '../types/schema';

interface AccountsValues {
  accounts: Account[];
}

const AccountsContext = createContext<AccountsValues>({ accounts: [] });

const AccountsProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    // Suppose this comes from an request from an API call
    dbAccounts.forEach((dbAccount, index) => {
      setTimeout(() => {
        setAccounts((prev) => [
          ...prev,
          {
            ...binanceAccounts[index],
            display_name: dbAccount.display_name,
            id: dbAccount.id,
          },
        ]);
      }, 10000);
    });
  }, []);

  return (
    <AccountsContext.Provider value={{ accounts }}>
      {children}
    </AccountsContext.Provider>
  );
};

const useAccountsContext = () => useContext(AccountsContext);

export { AccountsProvider, useAccountsContext };
