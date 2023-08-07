import { BadgeDelta, Flex } from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { ICellRendererParams } from 'ag-grid-community'
import { filterAtom, timeAtom } from '../../../../store'
import { useInventoryApiV2AnalyticsMetricList } from '../../../../api/inventory.gen'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import DateRangePicker from '../../../../components/DateRangePicker'
import ConnectionList from '../../../../components/ConnectionList'
import { badgeDelta, badgeTypeByDelta } from '../../../../utilities/deltaType'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiMetric } from '../../../../api/api'
import Table, { IColumn } from '../../../../components/Table'

const columns: IColumn<any, any>[] = [
    {
        field: 'category',
        rowGroup: true,
        hide: true,
        headerName: 'Category',
        type: 'string',
    },
    {
        field: 'name',
        headerName: 'Metric Name',
        type: 'string',
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

const rowGenerator = (data: any) => {
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
    const navigate = useNavigate()

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
            startTime: activeTimeRange.start.unix().toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix().toString(),
        }),
        pageSize: 1000,
    }

    const { response: metrics, isLoading: metricsLoading } =
        useInventoryApiV2AnalyticsMetricList(query)

    const breadcrumbsPages = [
        {
            name: 'Assets',
            path: () => {
                navigate(-1)
            },
            current: false,
        },
        { name: 'Resource metrics', path: '', current: true },
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
            <Table
                title="Resource Metrics"
                downloadable
                id="asset_resource_metrics"
                rowData={rowGenerator(metrics?.metrics)}
                columns={columns}
                onGridReady={(params) => {
                    if (metricsLoading) {
                        params.api.showLoadingOverlay()
                    }
                }}
            />
        </LoggedInLayout>
    )
}
