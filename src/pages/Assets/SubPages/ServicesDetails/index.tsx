import React, { useRef } from 'react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridOptions } from 'ag-grid-community'
import dayjs from 'dayjs'
import {
    useInventoryApiV2ServicesSummaryList,
    useInventoryApiV2ServicesMetricList,
} from '../../../../api/inventory.gen'
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
        field: 'service_label',
        headerName: 'Service Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'resource_count',
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
        useInventoryApiV2ServicesMetricList({
            connector: selectedConnections?.provider,
            connectionId: selectedConnections?.connections,
            pageSize: 1000,
            pageNumber: 1,
            endTime: String(dayjs(timeRange.to).unix()),
            sortBy: 'name',
        })
    const { response: TopServices } = useInventoryApiV2ServicesMetricList({
        connector: selectedConnections?.provider,
        connectionId: selectedConnections?.connections,
        pageSize: 5,
        pageNumber: 1,
        endTime: String(dayjs(timeRange.to).unix()),
        sortBy: 'count',
    })
    const { response: TopFastestServices } =
        useInventoryApiV2ServicesMetricList({
            connector: selectedConnections?.provider,
            connectionId: selectedConnections?.connections,
            pageSize: 5,
            pageNumber: 1,
            endTime: String(dayjs(timeRange.to).unix()),
            sortBy: 'growth_rate',
        })
    if (!flag && serviceList?.total_count) {
        rowCount = serviceList?.total_count
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
        newData.resource_count = data.resource_count
        return newData
    })
    return (
        <main>
            <Summary
                TopServices={TopServices?.services}
                TopFastestServices={TopFastestServices?.services}
                TotalServices={serviceList?.total_services}
            />
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
