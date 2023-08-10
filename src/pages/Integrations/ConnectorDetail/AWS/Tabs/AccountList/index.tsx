import { Badge, Button, Card } from '@tremor/react'
import { useState } from 'react'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { PlusIcon } from '@heroicons/react/24/solid'
import AccountInfo from './AccountInfo'
import NewAWSAccount from './NewAWSAccount'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
} from '../../../../../../api/api'
import Notification from '../../../../../../components/Notification'
import Table, { IColumn } from '../../../../../../components/Table'
import { snakeCaseToLabel } from '../../../../../../utilities/labelMaker'

interface IAccountList {
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    organizations: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
    loading: boolean
}

const getType = (
    account: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection | undefined
) => {
    if (account) {
        if (account.credentialType === 'auto-aws') {
            return 'Standalone Account'
        }
        if (
            account.credentialType === 'manual-aws-org' &&
            account.providerConnectionID ===
                account?.metadata?.account_organization.MasterAccountId
        ) {
            return 'Organization Management Account'
        }
        if (account.credentialType === 'manual-aws-org') {
            return 'Organization Member Account'
        }
    }
    return ''
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
        default:
            return 'Archived'
    }
}

const columns: IColumn<any, any>[] = [
    // {
    //     field: 'connector',
    //     headerName: 'Connector',
    //     type: 'string',
    //     width: 50,
    //     sortable: true,
    //     filter: true,
    //     cellStyle: { padding: 0 },
    //     cellRenderer: (params: ICellRendererParams) => {
    //         return (
    //             <Flex
    //                 alignItems="center"
    //                 justifyContent="center"
    //                 className="w-full h-full"
    //             >
    //                 <AWSIcon id="acc" />
    //             </Flex>
    //         )
    //     },
    // },
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
        headerName: 'Account Type',
        field: 'type',
        type: 'string',
        rowGroup: true,
        enableRowGroup: true,
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'credentialName',
        type: 'string',
        headerName: 'Parent Organization Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'credentialID',
        type: 'string',
        headerName: 'Parent Organization ID',
        hide: true,
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'lifecycleState',
        type: 'string',
        headerName: 'State',
        enableRowGroup: true,
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (params: ICellRendererParams) => {
            return (
                params.data?.providerConnectionName && (
                    <Badge color={getBadgeColor(params.value)}>
                        {getBadgeText(params.value)}
                    </Badge>
                )
            )
        },
    },
    {
        field: 'id',
        type: 'string',
        headerName: 'Kaytu Connection ID',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'lastInventory',
        type: 'date',
        headerName: 'Last Inventory',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'onboardDate',
        type: 'date',
        headerName: 'Onboard Date',
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
                    data[i].metadata.account_type || 'N/A'
                )
                rows.push(data[i])
            }
        }
    }
    return rows
}

export default function AccountList({
    accounts,
    organizations,
    loading,
}: IAccountList) {
    const [accData, setAccData] = useState<
        GithubComKaytuIoKaytuEnginePkgOnboardApiConnection | undefined
    >(undefined)
    const [openInfo, setOpenInfo] = useState(false)
    const [open, setOpen] = useState(false)
    const [notification, setNotification] = useState<string>('')

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
    }

    return (
        <>
            <Card>
                <Table
                    downloadable
                    title="Accounts"
                    id="aws_account_list"
                    options={options}
                    rowData={generateRows(accounts)}
                    columns={columns}
                    onGridReady={(params) => {
                        if (loading) {
                            params.api.showLoadingOverlay()
                        }
                    }}
                    onRowClicked={(
                        event: RowClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
                    ) => {
                        setAccData(event.data)
                        setOpenInfo(true)
                    }}
                >
                    <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                        Onboard New AWS Account
                    </Button>
                </Table>
            </Card>
            {notification && <Notification text={notification} />}
            <AccountInfo
                data={accData}
                type={getType(accData)}
                open={openInfo}
                onClose={() => setOpenInfo(false)}
                notification={setNotification}
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
