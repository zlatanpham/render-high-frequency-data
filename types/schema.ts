import { BinanceAccount } from '../data/binance-accounts';
import { DBAccount } from '../data/db-accounts';

export interface Account
  extends BinanceAccount,
    Pick<DBAccount, 'display_name' | 'id'> {}
