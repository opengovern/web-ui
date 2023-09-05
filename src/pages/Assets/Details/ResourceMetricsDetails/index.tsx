import { BadgeDelta, Card, Flex } from '@tremor/react'
import { useAtomValue } from 'jotai'
import { GridOptions, ICellRendererParams } from 'ag-grid-community'
import { filterAtom, timeAtom } from '../../../../store'
import { useInventoryApiV2AnalyticsMetricList } from '../../../../api/inventory.gen'
import Menu from '../../../../components/Menu'
import { badgeDelta, badgeTypeByDelta } from '../../../../utilities/deltaType'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiMetric } from '../../../../api/api'
import Table, { IColumn } from '../../../../components/Table'
import Header from '../../../../components/Header'

export const resourceTableColumns: IColumn<any, any>[] = [
    {
        headerName: 'Connectors',
        field: 'connectors',
        type: 'connector',
        enableRowGroup: true,
    },
    {
        field: 'name',
        headerName: 'Service Name',
        type: 'string',
    },
    {
        field: 'category',
        rowGroup: true,
        enableRowGroup: true,
        headerName: 'Category',
        type: 'string',
        hide: true,
    },
    {
        field: 'count',
        headerName: 'Count',
        type: 'number',
    },
    {
        headerName: 'Change (%)',
        type: 'string',
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiMetric>
        ) =>
            params.data?.name && (
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    className="mt-1"
                >
                    {params.data?.old_count
                        ? badgeDelta(params.data?.old_count, params.data?.count)
                        : badgeDelta(1, 2)}
                </Flex>
            ),
    },
    {
        headerName: 'Change (Δ)',
        type: 'string',
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiMetric>
        ) =>
            params.data?.name && (
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    className="mt-1"
                >
                    <BadgeDelta
                        deltaType={badgeTypeByDelta(
                            params.data?.old_count,
                            params.data?.count
                        )}
                    >
                        {Math.abs(
                            (params.data?.old_count || 0) -
                                (params.data?.count || 0)
                        )}
                    </BadgeDelta>
                </Flex>
            ),
    },
]

export const rowGenerator = (data: any) => {
    const rows = []
    if (data) {
        for (let i = 0; i < data.length; i += 1) {
            if (data[i].tags.category.length > 1) {
                for (let j = 0; j < data[i].tags.category.length; j += 1) {
                    rows.push({
                        ...data[i],
                        category: data[i].tags.category[j],
                    })
                }
            } else {
                rows.push({
                    ...data[i],
                    category: data[i].tags.category,
                })
            }
        }
    }
    return rows
}

export default function ResourceMetricsDetails() {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
        pageSize: 1000,
    }

    const { response: metrics, isLoading: metricsLoading } =
        useInventoryApiV2AnalyticsMetricList(query)

    const options: GridOptions = {
        enableGroupEdit: true,
        columnTypes: {
            dimension: {
                enableRowGroup: true,
                enablePivot: true,
            },
        },
        groupDefaultExpanded: -1,
        rowGroupPanelShow: 'always',
        groupAllowUnbalanced: true,
    }

    return (
        <Menu currentPage="assets">
            <Header
                title="Assets"
                breadCrumb={['Resource Metrics']}
                filter
                datePicker
            />
            <Card className="mt-4">
                <Table
                    options={options}
                    title="Resource Metrics"
                    downloadable
                    id="asset_resource_metrics"
                    rowData={rowGenerator(metrics?.metrics)}
                    columns={resourceTableColumns}
                    onGridReady={(params) => {
                        if (metricsLoading) {
                            params.api.showLoadingOverlay()
                        }
                    }}
                />
            </Card>
        </Menu>
    )
}
