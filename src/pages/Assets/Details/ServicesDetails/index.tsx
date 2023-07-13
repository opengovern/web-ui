import React, { useRef } from 'react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridOptions } from 'ag-grid-community'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { Flex } from '@tremor/react'
import { DateRangePicker } from '@react-spectrum/datepicker'
import { Provider } from '@react-spectrum/provider'
import { theme } from '@react-spectrum/theme-default'
import { today, getLocalTimeZone } from '@internationalized/date'
import { useNavigate } from 'react-router-dom'
import { useInventoryApiV2ServicesMetricList } from '../../../../api/inventory.gen'
import Summary from './Summary'
import { filterAtom, timeAtom } from '../../../../store'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import ConnectionList from '../../../../components/ConnectionList'

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

export default function ServicesDetails() {
    const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)

    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    const { response: serviceList, isLoading: isServiceListLoading } =
        useInventoryApiV2ServicesMetricList({
            connector: [selectedConnections?.provider],
            connectionId: selectedConnections?.connections,
            pageSize: 1000,
            pageNumber: 1,
            endTime: String(dayjs(activeTimeRange.end.toString()).unix()),
            sortBy: 'name',
        })

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        paginationPageSize: 25,
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

    const breadcrumbsPages = [
        {
            name: 'Assets',
            path: () => {
                navigate(-1)
            },
            current: false,
        },
        { name: 'Services detail', path: '', current: true },
    ]

    return (
        <LoggedInLayout currentPage="assets">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Breadcrumbs pages={breadcrumbsPages} />
                <Flex flexDirection="row" justifyContent="end">
                    <Provider theme={theme}>
                        <DateRangePicker
                            value={activeTimeRange}
                            onChange={setActiveTimeRange}
                            maxValue={today(getLocalTimeZone())}
                        />
                    </Provider>
                    <ConnectionList />
                </Flex>
            </Flex>
            <Summary
                totalServices={serviceList?.total_services}
                totalServicesLoading={isServiceListLoading}
            />
            <div className="ag-theme-alpine mt-10">
                <AgGridReact
                    ref={gridRef}
                    domLayout="autoHeight"
                    gridOptions={gridOptions}
                    rowData={rowData}
                />
            </div>
        </LoggedInLayout>
    )
}
