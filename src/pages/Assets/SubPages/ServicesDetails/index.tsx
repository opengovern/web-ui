import React, { useRef } from 'react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridOptions } from 'ag-grid-community'
import dayjs from 'dayjs'
import { useInventoryApiV2ServicesSummaryList } from '../../../../api/inventory.gen'
import Summary from './Summary'

type IProps = {
    selectedConnections: any
    timeRange: any
}

const columns: ColDef[] = [
    {
        field: 'connector',
        headerName: 'Cloud Provider',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'serviceLabel',
        headerName: 'Service Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'resourceCount',
        headerName: 'Resource Count',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
]

let flag = false
let rowCount

export default function ServicesDetails({
    selectedConnections,
    timeRange,
}: IProps) {
    const gridRef = useRef<AgGridReact>(null)
    const { response: serviceList, isLoading: isServiceListLoading } =
        useInventoryApiV2ServicesSummaryList({
            connector: selectedConnections?.provider,
            connectionId: selectedConnections?.connections,
            pageSize: 1000,
            pageNumber: 1,
            endTime: String(dayjs(timeRange.to).unix()),
        })

    if (!flag && serviceList?.totalCount) {
        rowCount = serviceList?.totalCount
        flag = true
    }

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
        getRowHeight: (params) => 50,
        onGridReady: (params) => {
            if (isServiceListLoading) {
                params.api.showLoadingOverlay()
            }
        },
    }

    const rowData = (serviceList?.services || []).map((data) => {
        const newData = { ...data }
        newData.resourceCount = data.resourceCount
        return newData
    })
    return (
        <main>
            <Summary serviceList={serviceList} />
            <div className="ag-theme-alpine mt-10">
                <AgGridReact
                    ref={gridRef}
                    domLayout="autoHeight"
                    gridOptions={gridOptions}
                    rowData={rowData}
                />
            </div>
        </main>
    )
}
