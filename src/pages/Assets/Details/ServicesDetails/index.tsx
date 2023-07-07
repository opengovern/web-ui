import React, { useRef, useState } from 'react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridOptions } from 'ag-grid-community'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { Button, DateRangePicker, Flex, Text } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { FunnelIcon as FunnelIconOutline } from '@heroicons/react/24/outline'
import { FunnelIcon as FunnelIconSolid } from '@heroicons/react/24/solid'
import { useInventoryApiV2ServicesMetricList } from '../../../../api/inventory.gen'
import Summary from './Summary'
import { filterAtom, timeAtom } from '../../../../store'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import ConnectionList from '../../../../components/ConnectionList'
import { useOnboardApiV1SourcesList } from '../../../../api/onboard.gen'

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
    const [openDrawer, setOpenDrawer] = useState(false)
    const { response: connections, isLoading: connectionsLoading } =
        useOnboardApiV1SourcesList()

    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    const { response: serviceList, isLoading: isServiceListLoading } =
        useInventoryApiV2ServicesMetricList({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector: selectedConnections?.provider,
            connectionId: selectedConnections?.connections,
            pageSize: 1000,
            pageNumber: 1,
            endTime: String(dayjs(activeTimeRange.to).unix()),
            sortBy: 'name',
        })
    const { response: TopServices } = useInventoryApiV2ServicesMetricList({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        connector: selectedConnections?.provider,
        connectionId: selectedConnections?.connections,
        pageSize: 5,
        pageNumber: 1,
        endTime: String(dayjs(activeTimeRange.to).unix()),
        sortBy: 'count',
    })
    const { response: TopFastestServices } =
        useInventoryApiV2ServicesMetricList({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector: selectedConnections?.provider,
            connectionId: selectedConnections?.connections,
            pageSize: 5,
            pageNumber: 1,
            endTime: String(dayjs(activeTimeRange.to).unix()),
            sortBy: 'growth_rate',
        })

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
    const handleDrawer = (data: any) => {
        if (openDrawer) {
            setSelectedConnections(data)
            setOpenDrawer(false)
        } else setOpenDrawer(true)
    }

    const filterText = () => {
        if (selectedConnections.connections.length > 0) {
            return <Text>{selectedConnections.connections.length} Filters</Text>
        }
        if (selectedConnections.provider !== '') {
            return <Text>{selectedConnections.provider}</Text>
        }
        return 'Filters'
    }

    return (
        <LoggedInLayout currentPage="assets">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Breadcrumbs pages={breadcrumbsPages} />
                <Flex flexDirection="row" justifyContent="end">
                    <DateRangePicker
                        className="max-w-md"
                        value={activeTimeRange}
                        onValueChange={setActiveTimeRange}
                        enableClear={false}
                        maxDate={new Date()}
                    />
                    <Button
                        variant="secondary"
                        className="ml-2 h-9"
                        onClick={() => setOpenDrawer(true)}
                        icon={
                            selectedConnections.connections.length > 0 ||
                            selectedConnections.provider !== ''
                                ? FunnelIconSolid
                                : FunnelIconOutline
                        }
                    >
                        {filterText()}
                    </Button>
                    <ConnectionList
                        connections={connections || []}
                        loading={connectionsLoading}
                        open={openDrawer}
                        selectedConnectionsProps={selectedConnections}
                        onClose={(data: any) => handleDrawer(data)}
                    />
                </Flex>
            </Flex>
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
        </LoggedInLayout>
    )
}
