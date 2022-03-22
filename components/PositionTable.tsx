import { AgGridReact } from 'ag-grid-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTradingDataContext } from '../context/trading-data';

export const PositionTable = ({ data, node, api }) => {
  const rowId = node.id;
  const [rowData] = useState(data.positions);
  const { emitter } = useTradingDataContext();
  const blockRender = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

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

  const colDefs = useMemo(
    () => [
      { field: 'symbol', cellRenderer: 'agAnimateShowChangeCellRenderer' },
      { field: 'askNotional', cellRenderer: 'agAnimateShowChangeCellRenderer' },
      { field: 'bidNotional', cellRenderer: 'agAnimateShowChangeCellRenderer' },
      { field: 'entryPrice', cellRenderer: 'agAnimateShowChangeCellRenderer' },
      {
        field: 'initialMargin',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
      },
      { field: 'isolated', cellRenderer: 'agAnimateShowChangeCellRenderer' },
      {
        field: 'isolatedWallet',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
      },
      { field: 'leverage', cellRenderer: 'agAnimateShowChangeCellRenderer' },
      { field: 'maintMargin', cellRenderer: 'agAnimateShowChangeCellRenderer' },
      { field: 'maxNotional', cellRenderer: 'agAnimateShowChangeCellRenderer' },
      { field: 'notional', cellRenderer: 'agAnimateShowChangeCellRenderer' },
      {
        field: 'openOrderInitialMargin',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
      },
      { field: 'positionAmt', cellRenderer: 'agAnimateShowChangeCellRenderer' },
      {
        field: 'positionInitialMargin',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
      },
      {
        field: 'positionSide',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
      },
      {
        field: 'unrealizedProfit',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
      },
      { field: 'updateTime', cellRenderer: 'agAnimateShowChangeCellRenderer' },
    ],
    [],
  );

  const getRowId = useCallback(function (params) {
    return params.data.symbol;
  }, []);

  const onGridReady = useCallback((params) => {
    emitter.on('trading', (data) => {
      if (blockRender.current) {
        return;
      }
      params.api.applyTransactionAsync({
        update: data.accounts.filter((account) => account.id !== data.id)[0]
          .positions,
      });
    });
  }, []);

  const onScroll = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    blockRender.current = true;

    scrollTimeout.current = setTimeout(() => {
      blockRender.current = false;
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <AgGridReact
      animateRows={true}
      onBodyScroll={onScroll}
      getRowId={getRowId}
      columnDefs={colDefs}
      suppressAggFuncInHeader={true}
      asyncTransactionWaitMillis={1000}
      defaultColDef={defaultColDef}
      rowData={rowData}
      onGridReady={onGridReady}
    />
  );
};
