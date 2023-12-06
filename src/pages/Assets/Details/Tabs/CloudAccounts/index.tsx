import { useNavigate } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { Dayjs } from 'dayjs'
import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community'
import Table, { IColumn } from '../../../../../components/Table'
import { IFilter, isDemoAtom, notificationAtom } from '../../../../../store'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import { options } from '../Metrics'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiMetric,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
} from '../../../../../api/api'
import { badgeDelta } from '../../../../../utilities/deltaType'

interface IConnections {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    connections: IFilter
    resourceId?: string | undefined
}

const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'connector',
            headerName: 'Cloud provider',
            type: 'string',
            width: 140,
            sortable: true,
            filter: true,
            enableRowGroup: true,
        },
        {
            field: 'providerConnectionName',
            headerName: 'Account name',
            resizable: true,
            type: 'string',
            sortable: true,
            filter: true,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'providerConnectionID',
            headerName: 'Account ID',
            type: 'string',
            resizable: true,
            sortable: true,
            filter: true,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'resourceCount',
            headerName: 'Resource count',
            type: 'number',
            aggFunc: 'sum',
            resizable: true,
            sortable: true,
        },
        {
            field: 'oldResourceCount',
            headerName: 'Old resource count',
            type: 'number',
            aggFunc: 'sum',
            hide: true,
            resizable: true,
            sortable: true,
        },
        {
            headerName: 'Change (%)',
            field: 'change_percent',
            aggFunc: 'sum',
            sortable: true,
            type: 'number',
            filter: true,
            cellRenderer: (
                params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
            ) =>
                params.data
                    ? badgeDelta(
                          params.data?.oldResourceCount,
                          params.data?.resourceCount
                      )
                    : badgeDelta(params.value / 100, 0),
        },
        {
            headerName: 'Change (Δ)',
            field: 'change_delta',
            aggFunc: 'sum',
            sortable: true,
            type: 'number',
            hide: true,
            cellRenderer: (
                params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
            ) =>
                params.data
                    ? badgeDelta(
                          params.data?.oldResourceCount,
                          params.data?.resourceCount,
                          true
                      )
                    : badgeDelta(params.value, 0, true),
        },
        {
            field: 'lastInventory',
            headerName: 'Last inventory',
            type: 'datetime',
            hide: true,
            resizable: true,
            sortable: true,
        },
        {
            field: 'onboardDate',
            headerName: 'Onboard Date',
            type: 'datetime',
            hide: true,
            resizable: true,
            sortable: true,
        },
    ]
    return temp
}

const rowGenerator = (
    data:
        | GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse
        | undefined
) => {
    const rows = []
    if (data && data.connections) {
        for (let i = 0; i < data.connections.length; i += 1) {
            rows.push({
                ...data.connections[i],
                change_percent:
                    (((data.connections[i].oldResourceCount || 0) -
                        (data.connections[i].resourceCount || 0)) /
                        (data.connections[i].resourceCount || 1)) *
                    100,
                change_delta:
                    (data.connections[i].oldResourceCount || 0) -
                    (data.connections[i].resourceCount || 0),
            })
        }
    }
    return rows
}

export default function CloudAccounts({
    activeTimeRange,
    connections,
    resourceId,
}: IConnections) {
    const navigate = useNavigate()

    const setNotification = useSetAtom(notificationAtom)
    const isDemo = useAtomValue(isDemoAtom)

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
        pageSize: 5000,
        needCost: false,
    }

    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList(query)

    return (
        <Table
            title="Cloud account list"
            id="asset_connection_table"
            columns={columns(isDemo)}
            downloadable
            rowData={rowGenerator(accounts)
                ?.sort(
                    (a, b) => (b.resourceCount || 0) - (a.resourceCount || 0)
                )
                .filter((acc) => {
                    return (
                        acc.lifecycleState === 'ONBOARD' ||
                        acc.lifecycleState === 'IN_PROGRESS'
                    )
                })}
            loading={isAccountsLoading}
            onRowClicked={(event) => {
                if (event.data) {
                    if (event.data.lifecycleState === 'ONBOARD') {
                        navigate(`account_${event.data.id}`)
                    } else {
                        setNotification({
                            text: 'Account is not onboarded',
                            type: 'warning',
                        })
                    }
                }
            }}
            onGridReady={(event) => {
                if (isAccountsLoading) {
                    event.api.showLoadingOverlay()
                }
            }}
            options={options}
        />
    )
}
