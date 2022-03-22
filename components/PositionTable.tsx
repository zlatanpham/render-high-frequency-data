import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTradingDataContext } from '../context/trading-data';

export const PositionTable = ({ data, node, api }) => {
  const rowId = node.id;
  const [rowData] = useState(data.positions);
  const { emitter } = useTradingDataContext();

  useEffect(() => {
    return () => {
      console.log('removing detail grid info with id: ', rowId);

      // the detail grid is automatically destroyed as it is a React component
      api.removeDetailGridInfo(rowId);
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      width: 120,
      sortable: true,
      resizable: true,
    };
  }, []);

  const colDefs = [
    { field: 'symbol' },
    { field: 'askNotional' },
    { field: 'bidNotional' },
    { field: 'entryPrice' },
    { field: 'initialMargin' },
    { field: 'isolated' },
    { field: 'isolatedWallet' },
    { field: 'leverage' },
    { field: 'maintMargin' },
    { field: 'maxNotional' },
    { field: 'notional' },
    { field: 'openOrderInitialMargin' },
    { field: 'positionAmt' },
    { field: 'positionInitialMargin' },
    { field: 'positionSide' },
    { field: 'unrealizedProfit' },
    { field: 'updateTime' },
  ];

  const getRowId = useCallback(function (params) {
    return params.data.symbol;
  }, []);

  const onGridReady = useCallback((params) => {
    emitter.on('trading', (data) => {
      params.api.applyTransactionAsync({
        update: data.accounts.filter((account) => account.id !== data.id)[0]
          .positions,
      });
    });
  }, []);

  return (
    <div className="full-width-panel">
      <AgGridReact
        animateRows
        getRowId={getRowId}
        className="full-width-grid ag-theme-alpine"
        columnDefs={colDefs}
        asyncTransactionWaitMillis={1000}
        defaultColDef={defaultColDef}
        rowData={rowData}
        onGridReady={onGridReady}
      />
    </div>
  );
};
