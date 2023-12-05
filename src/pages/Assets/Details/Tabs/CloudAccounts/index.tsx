import { useNavigate } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { Dayjs } from 'dayjs'
import { ValueFormatterParams } from 'ag-grid-community'
import Table, { IColumn } from '../../../../../components/Table'
import { IFilter, isDemoAtom, notificationAtom } from '../../../../../store'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import { options } from '../Metrics'

interface IConnections {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    connections: IFilter
    resourceId?: string | undefined
}

const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'connector',
            headerName: 'Cloud Provider',
            type: 'string',
            width: 120,
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
            headerName: 'Resources',
            type: 'number',
            resizable: true,
            sortable: true,
        },
        {
            field: 'lastInventory',
            headerName: 'Last inventory',
            type: 'datetime',
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
            title="Cloud accounts list"
            id="asset_connection_table"
            columns={columns(isDemo)}
            downloadable
            rowData={
                accounts?.connections
                    ?.sort(
                        (a, b) =>
                            (b.resourceCount || 0) - (a.resourceCount || 0)
                    )
                    .filter((acc) => {
                        return (
                            acc.lifecycleState === 'ONBOARD' ||
                            acc.lifecycleState === 'IN_PROGRESS'
                        )
                    }) || []
            }
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
