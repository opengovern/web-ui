import { useState } from 'react'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { Badge, Button } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import NewAzureSubscription from './NewSubscription'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
} from '../../../../../../api/api'
import SubscriptionInfo from './SubscriptionInfo'
import Table, { IColumn } from '../../../../../../components/Table'
import { snakeCaseToLabel } from '../../../../../../utilities/labelMaker'

interface ISubscriptions {
    subscriptions: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    spns: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
    loading: boolean
}

function getBadgeColor(status: string) {
    switch (status) {
        case 'NOT_ONBOARD':
            return 'neutral'
        case 'IN_PROGRESS':
            return 'yellow'
        case 'ONBOARD':
            return 'emerald'
        case 'UNHEALTHY':
            return 'rose'
        default:
            return 'gray'
    }
}

function getBadgeText(status: string) {
    switch (status) {
        case 'NOT_ONBOARD':
            return 'Not Onboarded'
        case 'IN_PROGRESS':
            return 'In Progress'
        case 'ONBOARD':
            return 'Onboarded'
        case 'UNHEALTHY':
            return 'Unhealthy'
        case 'DISCOVERED':
            return 'Discovered'
        default:
            return 'Archived'
    }
}

const columns: IColumn<any, any>[] = [
    {
        field: 'providerConnectionName',
        headerName: 'Name',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'providerConnectionID',
        headerName: 'ID',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'credentialName',
        headerName: 'Parent SPN Name',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'credentialType',
        headerName: 'Subscription Type',
        type: 'string',
        hide: true,
        sortable: true,
        filter: true,
        resizable: true,
        valueFormatter: (param) => snakeCaseToLabel(param.value),
        flex: 1,
    },
    {
        field: 'credentialID',
        headerName: 'Parent SPN ID',
        type: 'string',
        hide: true,
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'lifecycleState',
        headerName: 'State',
        type: 'string',
        rowGroup: true,
        enableRowGroup: true,
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (params: ICellRendererParams) => {
            return (
                <Badge color={getBadgeColor(params.value)}>
                    {getBadgeText(params.value)}
                </Badge>
            )
        },
        hide: true,
    },
    {
        field: 'healthState',
        type: 'string',
        headerName: 'Health state',
        enableRowGroup: true,
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'id',
        headerName: 'Kaytu Connection ID',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'lastInventory',
        headerName: 'Last Inventory',
        type: 'date',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'onboardDate',
        headerName: 'Onboard Date',
        type: 'date',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
]

const generateRows = (data: any) => {
    const rows = []
    if (data) {
        for (let i = 0; i < data.length; i += 1) {
            if (data[i].metadata) {
                // eslint-disable-next-line no-param-reassign
                data[i].type = snakeCaseToLabel(
                    data[i].metadata.account_type || ''
                )
                rows.push(data[i])
            }
        }
    }
    return rows
}

export default function Subscriptions({
    subscriptions,
    spns,
    loading,
}: ISubscriptions) {
    const [open, setOpen] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const [priData, setPriData] = useState<
        GithubComKaytuIoKaytuEnginePkgOnboardApiConnection | undefined
    >(undefined)

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
        autoGroupColumnDef: {
            headerName: 'State',
            flex: 2,
            sortable: true,
            filter: true,
            resizable: true,
            // cellRendererParams: {
            //     suppressCount: true,
            // },
        },
    }

    return (
        <>
            <Table
                downloadable
                title="Subscriptions"
                id="azure_subscription_list"
                rowData={generateRows(subscriptions)}
                columns={columns}
                options={options}
                loading={loading}
                onRowClicked={(
                    event: RowClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
                ) => {
                    setPriData(event.data)
                    setOpenInfo(true)
                }}
            >
                <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                    Onboard New Azure Principal
                </Button>
            </Table>
            <SubscriptionInfo
                data={priData}
                open={openInfo}
                onClose={() => setOpenInfo(false)}
            />
            <NewAzureSubscription
                spns={spns}
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    )
}
