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
import Table, { IColumn } from '../../../../components/Table'

const columns: IColumn<any, any>[] = [
    {
        field: 'connectors',
        headerName: 'Cloud Providers',
        type: 'string',
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
        type: 'string',
        flex: 2,
    },
    {
        field: 'count',
        headerName: 'Resource Count',
        type: 'number',
    },
    {
        field: 'old_count',
        headerName: 'Old Resource Count',
        type: 'number',
    },
    {
        field: 'growth',
        headerName: 'Growth',
        type: 'string',
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
            <Table
                id="asset_service_details"
                columns={columns}
                rowData={serviceList?.metrics || []}
                onGridReady={(params) => {
                    if (isServiceListLoading) {
                        params.api.showLoadingOverlay()
                    }
                }}
            />
        </LoggedInLayout>
    )
}
