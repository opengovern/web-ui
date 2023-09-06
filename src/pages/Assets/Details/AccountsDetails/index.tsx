import { useAtomValue, useSetAtom } from 'jotai'
import { Card } from '@tremor/react'
import { GridOptions, RowClickedEvent } from 'ag-grid-community'
import { useNavigate } from 'react-router-dom'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../api/onboard.gen'
import { filterAtom, notificationAtom, timeAtom } from '../../../../store'
import Table, { IColumn } from '../../../../components/Table'
import Header from '../../../../components/Header'
import Menu from '../../../../components/Menu'

const columns: IColumn<any, any>[] = [
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
        headerName: 'Name',
        type: 'string',
        sortable: true,
        filter: true,
    },
    {
        field: 'providerConnectionID',
        headerName: 'ID',
        type: 'string',
        sortable: true,
        filter: true,
    },
    {
        field: 'lifecycleState',
        headerName: 'State',
        type: 'string',
        sortable: true,
        filter: true,
        rowGroup: true,
        enableRowGroup: true,
    },
    {
        field: 'resourceCount',
        headerName: 'Resources',
        type: 'number',
        sortable: true,
    },
    {
        field: 'lastInventory',
        headerName: 'Last Inventory Date',
        type: 'date',
        sortable: true,
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
        sortable: true,
    },
]

const options: GridOptions = {
    enableGroupEdit: true,
    columnTypes: {
        dimension: {
            enableRowGroup: true,
            enablePivot: true,
        },
    },
    // groupDefaultExpanded: -1,
    rowGroupPanelShow: 'always',
    groupAllowUnbalanced: true,
    animateRows: false,
}

export default function AccountsDetails() {
    const navigate = useNavigate()
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const setNotification = useSetAtom(notificationAtom)

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
        <Menu currentPage="assets">
            <Header breadCrumb={['Accounts']} filter datePicker />
            <Card>
                <Table
                    title="Accounts"
                    downloadable
                    id="asset_multiaccount"
                    columns={columns}
                    rowData={accounts?.connections}
                    onGridReady={(e) => {
                        if (isAccountsLoading) {
                            e.api?.showLoadingOverlay()
                        }
                    }}
                    onRowClicked={(event: RowClickedEvent) => {
                        if (event.data) {
                            if (event.data.lifecycleState === 'ONBOARD') {
                                navigate(`${event.data.id}`)
                            } else {
                                setNotification({
                                    text: 'Account is not onboarded',
                                    type: 'warning',
                                })
                            }
                        }
                    }}
                    options={options}
                />
            </Card>
        </Menu>
    )
}
