import { ICellRendererParams } from 'ag-grid-community'
import { useAtomValue } from 'jotai'
import { BadgeDelta, Flex } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { useInventoryApiV2AnalyticsMetricList } from '../../../../api/inventory.gen'
import Summary from './Summary'
import { filterAtom, timeAtom } from '../../../../store'
import Menu from '../../../../components/Menu'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../../utilities/deltaType'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiMetric } from '../../../../api/api'
import Table, { IColumn } from '../../../../components/Table'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'
import Header from '../../../../components/Header'

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
                {params.data?.connectors?.map((item) => getConnectorIcon(item))}
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
            endTime: activeTimeRange.end.unix(),
            sortBy: 'name',
        })

    return (
        <Menu currentPage="assets">
            <Header
                title="Assets"
                breadCrumb={['Services Detail']}
                connectionFilter
                datePicker
            />
            <Summary
                totalServices={serviceList?.total_metrics}
                totalServicesLoading={isServiceListLoading}
            />
            <Table
                title="Services"
                downloadable
                id="asset_service_details"
                columns={columns}
                rowData={serviceList?.metrics || []}
                onGridReady={(params) => {
                    if (isServiceListLoading) {
                        params.api.showLoadingOverlay()
                    }
                }}
            />
        </Menu>
    )
}
