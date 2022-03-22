import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { useTradingDataContext } from '../context/trading-data';
import { PositionTable } from './PositionTable';
// makes a copy of the original and merges in the new values

export const DataTable = () => {
  const gridRef = useRef();
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState();
  const { emitter } = useTradingDataContext();
  const previousLength = useRef(-1);

  const [columnDefs] = useState([
    // these are the row groups, so they are all hidden (they are show in the group column)
    {
      headerName: 'Name',
      field: 'display_name',
      cellRenderer: 'agGroupCellRenderer',
    },
    {
      headerName: 'Fee Tier',
      field: 'feeTier',
      width: 250,
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      headerName: 'Total Initial Margin',
      field: 'totalInitialMargin',
      width: 250,
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      headerName: 'Available Balance',
      field: 'availableBalance',
      width: 250,
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      headerName: 'Total Margin Balance',
      field: 'totalMarginBalance',
      width: 250,
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      headerName: 'Cross Wallet Balance',
      field: 'totalCrossWalletBalance',
      width: 250,
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      headerName: 'Total Initial Margin',
      field: 'totalInitialMargin',
      width: 250,
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
  ]);

  const getRowId = useCallback(function (params) {
    return params.data.id;
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      width: 120,
      sortable: true,
      resizable: true,
    };
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      width: 250,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    emitter.on('trading', (data) => {
      const len = data.accounts.length;
      if (len !== previousLength.current) {
        setRowData(data.accounts);
      } else {
        params.api.applyTransactionAsync({ update: data.accounts });
      }
      previousLength.current = len;
    });
  }, []);

  return (
    <div style={gridStyle} className="ag-theme-alpine">
      <AgGridReact
        ref={gridRef}
        animateRows={true}
        masterDetail={true}
        rowData={rowData}
        columnDefs={columnDefs}
        suppressAggFuncInHeader={true}
        asyncTransactionWaitMillis={1000}
        getRowId={getRowId}
        detailRowHeight={500}
        detailCellRenderer={PositionTable}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        onGridReady={onGridReady}
      ></AgGridReact>
    </div>
  );
};
