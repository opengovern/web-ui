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
                    category: data[i].tags.category,
                })
            }
        }
    }
    return rows
}

export const defaultColumns: IColumn<any, any>[] = [
    {
        headerName: 'Connectors',
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
            params.data?.name && params.data?.old_count
                ? badgeDelta(params.data?.old_count, params.data?.count)
                : badgeDelta(1, 2),
    },
    {
        headerName: 'Change (Δ)',
        type: 'string',
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiMetric>
        ) =>
            params.data?.name &&
            badgeDelta(params.data?.old_count, params.data?.count),
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
        ...defaultColumns,
        {
            field: 'category',
            enableRowGroup: true,
            headerName: 'Category',
            resizable: true,
            sortable: true,
            filter: true,
            type: 'string',
            hide: isSummary,
            rowGroup: isSummary,
        },
    ]

    return (
        <Table
            title={isSummary ? 'Summary' : 'Services'}
            id={
                isSummary
                    ? 'infrastructure_summary_table'
                    : 'infrastructure_service_table'
            }
            columns={columns}
            downloadable
            rowData={rowGenerator(resources?.metrics)}
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