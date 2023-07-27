import { useRef } from 'react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community'
import { useAtomValue } from 'jotai'
import { BadgeDelta, Flex } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { useInventoryApiV2AnalyticsMetricList } from '../../../../api/inventory.gen'
import Summary from './Summary'
import { filterAtom, timeAtom } from '../../../../store'
import DateRangePicker from '../../../../components/DateRangePicker'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import ConnectionList from '../../../../components/ConnectionList'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../../utilities/deltaType'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiMetric } from '../../../../api/api'
import { AWSIcon, AzureIcon } from '../../../../icons/icons'

const columns: ColDef[] = [
    {
        field: 'connectors',
        headerName: 'Cloud Providers',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiMetric>
        ) => (
            <Flex
                justifyContent="center"
                alignItems="center"
                className="w-full h-full"
            >
                {params.data?.connectors?.map((item) =>
                    item === 'Azure' ? <AzureIcon /> : <AWSIcon />
                )}
            </Flex>
        ),
    },
    {
        field: 'name',
        headerName: 'Service Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 2,
    },
    {
        field: 'count',
        headerName: 'Resource Count',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'old_count',
        headerName: 'Old Resource Count',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        headerName: 'Growth',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (params: ICellRendererParams) => {
            return (
                <Flex className="h-full w-full">
                    <BadgeDelta
                        deltaType={badgeTypeByDelta(
                            params?.data.old_count,
                            params?.data.count
                        )}
                    >
                        {`${percentageByChange(
                            params?.data.old_count,
                            params?.data.count
                        )}%`}
                    </BadgeDelta>
                </Flex>
            )
        },
    },
]

export default function ServicesDetails() {
    const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)

    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const { response: serviceList, isLoading: isServiceListLoading } =
        useInventoryApiV2AnalyticsMetricList({
            connector: [selectedConnections?.provider],
            connectionId: selectedConnections?.connections,
            pageSize: 1000,
            pageNumber: 1,
            endTime: String(activeTimeRange.end.unix()),
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
                    <DateRangePicker />
                    <ConnectionList />
                </Flex>
            </Flex>
            <Summary
                totalServices={serviceList?.total_metrics}
                totalServicesLoading={isServiceListLoading}
            />
            <div className="ag-theme-alpine mt-3">
                <AgGridReact
                    ref={gridRef}
                    domLayout="autoHeight"
                    gridOptions={gridOptions}
                    rowData={serviceList?.metrics || []}
                />
            </div>
        </LoggedInLayout>
    )
}
