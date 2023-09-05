import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { Card } from '@tremor/react'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import DrawerPanel from '../../../../../components/DrawerPanel'
import { filterAtom, timeAtom } from '../../../../../store'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../api/api'
import { RenderObject } from '../../../../../components/RenderObject'
import Table, { IColumn } from '../../../../../components/Table'

const columns: IColumn<any, any>[] = [
    {
        field: 'connector',
        headerName: 'Connector',
        type: 'connector',
        width: 50,
        sortable: true,
        filter: true,
    },
    {
        field: 'providerConnectionName',
        headerName: 'Name',
        type: 'string',
    },
    {
        field: 'providerConnectionID',
        headerName: 'ID',
        type: 'string',
    },
    {
        field: 'lifecycleState',
        headerName: 'State',
        type: 'string',
    },
    {
        field: 'resourceCount',
        headerName: 'Resources',
        type: 'number',
    },
    {
        field: 'lastInventory',
        headerName: 'Last Inventory Date',
        type: 'date',
    },
    {
        field: 'id',
        headerName: 'Connection ID',
        type: 'string',
        hide: true,
    },
    {
        field: 'onboardDate',
        headerName: 'Onboard Date',
        type: 'date',
        hide: true,
    },
]

export default function MultiAccount() {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedConnection, setSelectedConnection] =
        useState<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>()

    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            ...(selectedConnections.provider !== '' && {
                connector: [selectedConnections.provider],
            }),
            connectionId: selectedConnections?.connections,
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            pageSize: 10000,
            pageNumber: 1,
            needCost: false,
        })

    return (
        <>
            {/* <Summary /> */}
            <Card>
                <Table
                    title="Accounts"
                    downloadable
                    id="asset_multiaccount"
                    columns={columns}
                    rowData={accounts?.connections || []}
                    onGridReady={(e) => {
                        if (isAccountsLoading) {
                            e.api?.showLoadingOverlay()
                        }
                    }}
                    onCellClicked={(event) => {
                        if (event.data !== null) {
                            setSelectedConnection(event.data)
                            setDrawerOpen(true)
                        }
                    }}
                />
            </Card>
            <DrawerPanel
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Connection details"
            >
                <RenderObject obj={selectedConnection} />
            </DrawerPanel>
        </>
    )
}
