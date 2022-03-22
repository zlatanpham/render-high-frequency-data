import { AppDataTypes, WorkerDataTypes } from './types/worker';
import {
  fieldToNumber,
  pipe,
  randomNumberField,
  randomNumberForPositions,
} from './utils/trade';

// Event handler called when a tab tries to connect to this worker.
interface Response {
  trade?: any;
  accounts?: any[];
}

interface InternalValues {
  accounts?: any[];
}

const internalValues: InternalValues = {};

const response: Response = {};

const ws = new WebSocket('wss://testnet-dex.binance.org/api/ws');

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      method: 'subscribe',
      topic: 'allTickers',
      symbols: ['$all'],
    }),
  );
};

ws.onmessage = ({ data }) => {
  if (data) {
    const { data: trade } = JSON.parse(data); // parsing single-trade record
    response.trade = trade;
  }
};

ws.onerror = (error) => {
  console.error(error);
};

onmessage = (msg) => {
  const { type, data } = msg.data as AppDataTypes;
  if (type === 'ACCOUNTS') {
    internalValues.accounts = data;
  }
};

// We need this to notify the newly connected context to know
// the current state of WS connection.
setInterval(() => {
  response.accounts = (internalValues.accounts || []).map(
    pipe(fieldToNumber, randomNumberField, randomNumberForPositions),
  );

  postMessage({ type: 'TRADE', data: response } as WorkerDataTypes);
}, 1000);

// a trick make ts happy
export {};
