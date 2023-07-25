import { Badge, Button, Card, Flex, Title } from '@tremor/react'
import { useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
    ColDef,
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { PlusIcon } from '@heroicons/react/24/solid'
import dayjs from 'dayjs'
import AccountInfo from './AccountInfo'
import NewAWSAccount from './NewAWSAccount'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
} from '../../../../../../api/api'
import { AWSIcon } from '../../../../../../icons/icons'

interface IAccountList {
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    organizations: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
}

const columns: ColDef[] = [
    {
        field: 'connector',
        headerName: 'Connector',
        width: 50,
        sortable: true,
        filter: true,
        cellStyle: { padding: 0 },
        cellRenderer: (params: ICellRendererParams) => {
            return (
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    className="w-full h-full"
                >
                    <AWSIcon id="acc" />
                </Flex>
            )
        },
    },
    {
        field: 'providerConnectionName',
        headerName: 'Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'providerConnectionID',
        headerName: 'ID',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'credentialName',
        headerName: 'Parent Organization Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'credentialID',
        headerName: 'Parent Organization ID',
        hide: true,
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'lifecycleState',
        headerName: 'State',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (params: ICellRendererParams) => {
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

            return (
                <Badge color={getBadgeColor(params.value)}>
                    {params.value}
                </Badge>
            )
        },
    },
    {
        field: 'id',
        headerName: 'Kaytu Connection ID',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'lastInventory',
        headerName: 'Last Inventory',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
        valueFormatter: (param) => {
            return dayjs(param.value).format('MMM DD, YYYY HH:mm:ss')
        },
    },
    {
        field: 'onboardDate',
        headerName: 'Onboard Date',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
        valueFormatter: (param) => {
            return dayjs(param.value).format('MMM DD, YYYY HH:mm:ss')
        },
    },
]

export default function AccountList({ accounts, organizations }: IAccountList) {
    const gridRef = useRef<AgGridReact>(null)
    const [accData, setAccData] = useState<
        GithubComKaytuIoKaytuEnginePkgOnboardApiConnection | undefined
    >(undefined)
    const [openInfo, setOpenInfo] = useState(false)
    const [open, setOpen] = useState(false)

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        paginationPageSize: 25,
        rowSelection: 'multiple',
        animateRows: true,
        getRowHeight: (params) => 50,
        onRowClicked: (
            event: RowClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
        ) => {
            setAccData(event.data)
            setOpenInfo(true)
        },
        sideBar: {
            toolPanels: [
                {
                    id: 'columns',
                    labelDefault: 'Columns',
                    labelKey: 'columns',
                    iconKey: 'columns',
                    toolPanel: 'agColumnsToolPanel',
                },
                {
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                },
            ],
            defaultToolPanel: '',
        },
    }

    return (
        <>
            <Card>
                <Flex flexDirection="row">
                    <Title>AWS Accounts</Title>
                    <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                        Create New AWS Account
                    </Button>
                </Flex>
                <div className="ag-theme-alpine mt-6">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                        rowData={accounts}
                    />
                </div>
            </Card>
            <AccountInfo
                data={accData}
                open={openInfo}
                onClose={() => setOpenInfo(false)}
            />
            <NewAWSAccount
                accounts={accounts}
                organizations={organizations}
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    )
}
