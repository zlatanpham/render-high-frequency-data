import { Account } from './schema';

export type AppDataTypes = {
  type: 'ACCOUNTS';
  data: Account[];
};

export type WorkerDataTypes = {
  type: 'TRADE';
  data: any;
};
