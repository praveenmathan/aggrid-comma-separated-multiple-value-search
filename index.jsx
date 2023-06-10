'use strict';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const GridExample = () => {
    const gridRef = useRef();
    const inputRef = useRef(null);

    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState();
    const [gridApi, setGridApi] = useState(null);

    const [columnDefs, setColumnDefs] = useState([
        {
            field: 'athlete',
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['reset', 'apply'],
            },
        },
        {
            field: 'age',
            maxWidth: 100,
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            },
        },
        {
            field: 'country',
            filter: 'agTextColumnFilter',
            filterParams: {
                buttons: ['clear', 'apply'],
            },
        },
        {
            field: 'year',
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['apply', 'cancel'],
                closeOnApply: true,
            },
            maxWidth: 100,
        },
        { field: 'sport' },
        { field: 'gold', filter: 'agNumberColumnFilter' },
        { field: 'silver', filter: 'agNumberColumnFilter' },
        { field: 'bronze', filter: 'agNumberColumnFilter' },
        { field: 'total', filter: 'agNumberColumnFilter' },
    ]);
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 150,
            filter: true,
        };
    }, []);

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then((resp) => resp.json())
            .then((data) => setRowData(data));
    }, []);

    const onFilterOpened = useCallback((e) => {
        console.log('onFilterOpened', e);
    }, []);

    const onFilterChanged = useCallback((e) => {
        console.log('onFilterChanged', e);
        console.log(
            'gridRef.current.api.getFilterModel() =>',
            e.api.getFilterModel()
        );
    }, []);

    const onFilterModified = useCallback((e) => {
        console.log('onFilterModified', e);
        console.log('filterInstance.getModel() =>', e.filterInstance.getModel());
        console.log(
            'filterInstance.getModelFromUi() =>',
            e.filterInstance.getModelFromUi()
        );
    }, []);

    const onClickFilterSearch = (e) => {
        const v = inputRef.current.value;
        console.log('v :', v);
        const formObj = {
            filterType: 'text',
            operator: 'OR',
            conditions: [
                {
                    filterType: 'text',
                    type: 'equals',
                    filter: 'australia'
                },
                {
                    filterType: 'text',
                    type: 'equals',
                    filter: 'norway'
                }
            ]
        }
        const countryFilterComponent = gridApi.getFilterInstance('country');
        console.log('gridAPI filter instance', countryFilterComponent);

        const model = countryFilterComponent.getModelFromUi();
        console.log('get Model', model);

        countryFilterComponent.setModel(formObj);
        console.log('set model', countryFilterComponent.setModel(formObj));
        gridApi.onFilterChanged();
    };

    const onResetFilterSearch = (e) => {
        const countryFilterComponent = gridApi.getFilterInstance('country');
        countryFilterComponent.setModel(null);
        gridApi.onFilterChanged();
    }

    return (
        <div style={containerStyle}>
            <div className="example-header">
                <input type="text" id="filter-text-box" placeholder="Filter..." ref={inputRef} />
                <button style={{ marginLeft: '20px' }} onClick={onClickFilterSearch}>
                    Apply
                </button>
                <button onClick={onResetFilterSearch}>Reset</button>
            </div>
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                    onFilterOpened={onFilterOpened}
                    onFilterChanged={onFilterChanged}
                    onFilterModified={onFilterModified}
                ></AgGridReact>
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<GridExample />);
