import { ICellRendererParams } from 'ag-grid-community'
import { useAtomValue } from 'jotai'
import { BadgeDelta, Card, Flex } from '@tremor/react'
import { useInventoryApiV2AnalyticsMetricList } from '../../../../api/inventory.gen'
import { filterAtom, timeAtom } from '../../../../store'
import Menu from '../../../../components/Menu'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../../utilities/deltaType'
import Table, { IColumn } from '../../../../components/Table'
import Header from '../../../../components/Header'

const columns: IColumn<any, any>[] = [
    {
        field: 'connectors',
        headerName: 'Connector',
        type: 'connector',
        width: 50,
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
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const { response: serviceList, isLoading: isServiceListLoading } =
        useInventoryApiV2AnalyticsMetricList({
            connector: [selectedConnections?.provider],
            connectionId: selectedConnections?.connections,
            connectionGroup: selectedConnections?.connectionGroup,
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
            {/* <Summary
                totalServices={serviceList?.total_metrics}
                totalServicesLoading={isServiceListLoading}
            /> */}
            <Card>
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
            </Card>
        </Menu>
    )
}
