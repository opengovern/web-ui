import { Tab, TabGroup, TabList } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Dayjs } from 'dayjs'
import { ValueFormatterParams } from 'ag-grid-community'
import Table, { IColumn } from '../../../../../components/Table'
import { IFilter, isDemoAtom, notificationAtom } from '../../../../../store'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import { options } from '../Resources'

interface IConnections {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    connections: IFilter
}

const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'connector',
            headerName: 'Connector',
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
            field: 'lifecycleState',
            headerName: 'State',
            type: 'string',
            resizable: true,
            sortable: true,
            filter: true,
            enableRowGroup: true,
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
            type: 'date',
            resizable: true,
            sortable: true,
        },
        {
            field: 'onboardDate',
            headerName: 'Onboard Date',
            type: 'date',
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
}: IConnections) {
    const navigate = useNavigate()

    const setNotification = useSetAtom(notificationAtom)
    const isDemo = useAtomValue(isDemoAtom)

    const [isOnboarded, setIsOnboarded] = useState(true)
    const [index, setIndex] = useState(0)
    useEffect(() => {
        if (isOnboarded) {
            setIndex(0)
        } else setIndex(1)
    }, [isOnboarded])

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

    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList(query)

    return (
        <Table
            title="Cloud accounts"
            id="infrastructure_connection_table"
            columns={columns(isDemo)}
            downloadable
            rowData={
                accounts?.connections?.filter((acc) => {
                    if (isOnboarded) {
                        return acc.lifecycleState === 'ONBOARD'
                    }
                    return acc
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
        >
            <TabGroup className="w-fit rounded-lg border" index={index}>
                <TabList variant="solid">
                    <Tab onClick={() => setIsOnboarded(true)}>Onboarded</Tab>
                    <Tab onClick={() => setIsOnboarded(false)}>Show all</Tab>
                </TabList>
            </TabGroup>
        </Table>
    )
}
