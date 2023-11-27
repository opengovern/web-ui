import { GridOptions, ICellRendererParams } from 'ag-grid-community'
import { Dayjs } from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useSetAtom } from 'jotai'
import Table, { IColumn } from '../../../../../components/Table'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiMetric } from '../../../../../api/api'
import { badgeDelta } from '../../../../../utilities/deltaType'
import { IFilter, notificationAtom } from '../../../../../store'
import { useInventoryApiV2AnalyticsMetricList } from '../../../../../api/inventory.gen'

interface IResources {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    connections: IFilter
    isSummary?: boolean
    resourceId?: string | undefined
}

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
                    category: data[i].tags.category[0],
                })
            }
        }
    }

    return rows
}

export const defaultColumns: IColumn<any, any>[] = [
    {
        headerName: 'Connector',
        field: 'connectors',
        type: 'string',
        filter: true,
        width: 120,
        enableRowGroup: true,
    },
    {
        field: 'name',
        headerName: 'Resource name',
        resizable: true,
        filter: true,
        sortable: true,
        type: 'string',
    },
    {
        field: 'count',
        resizable: true,
        sortable: true,
        headerName: 'Count',
        filter: true,
        type: 'number',
    },
    {
        headerName: 'Change (%)',
        type: 'string',
        filter: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiMetric>
        ) =>
            params.data &&
            (params.data?.old_count
                ? badgeDelta(params.data?.old_count, params.data?.count)
                : badgeDelta(1, 2)),
    },
    {
        headerName: 'Change (Δ)',
        type: 'string',
        hide: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiMetric>
        ) =>
            params.data &&
            badgeDelta(params.data?.old_count, params.data?.count, true),
    },
]

export const options: GridOptions = {
    enableGroupEdit: true,
    rowGroupPanelShow: 'always',
    groupAllowUnbalanced: true,
    autoGroupColumnDef: {
        width: 200,
        sortable: true,
        filter: true,
        resizable: true,
    },
}

export default function Resources({
    activeTimeRange,
    connections,
    isSummary = false,
    resourceId,
}: IResources) {
    const navigate = useNavigate()
    const setNotification = useSetAtom(notificationAtom)

    const query = {
        ...(connections.provider && {
            connector: [connections.provider],
        }),
        ...(connections.connections && {
            connectionId: connections.connections,
        }),
        ...(connections.connectionGroup && {
            connectionGroup: connections.connectionGroup,
        }),
        ...(resourceId && {
            resourceCollection: [resourceId],
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
        pageSize: 1000,
        needCost: false,
    }
    const { response: resources, isLoading: resourcesLoading } =
        useInventoryApiV2AnalyticsMetricList(query)

    const columns: IColumn<any, any>[] = [
        {
            field: 'tags.category',
            enableRowGroup: true,
            headerName: 'Category',
            resizable: true,
            sortable: true,
            filter: true,
            type: 'string',
            hide: isSummary,
            rowGroup: isSummary,
        },
        ...defaultColumns,
    ]

    return (
        <Table
            title={isSummary ? 'Summary' : 'Resources'}
            id={
                isSummary
                    ? 'infrastructure_summary_table'
                    : 'infrastructure_resource_table'
            }
            columns={columns}
            downloadable
            rowData={rowGenerator(resources?.metrics).sort((a, b) => {
                if (a.category < b.category) {
                    return -1
                }
                if (a.category > b.category) {
                    return 1
                }
                return 0
            })}
            loading={resourcesLoading}
            onRowClicked={(event) => {
                if (event.data) {
                    if (event.data.category) {
                        navigate(`metric_${event.data.id}`)
                    } else {
                        setNotification({
                            text: 'Account is not onboarded',
                            type: 'warning',
                        })
                    }
                }
            }}
            onGridReady={(event) => {
                if (resourcesLoading) {
                    event.api.showLoadingOverlay()
                }
            }}
            options={options}
        />
    )
}
