import { Badge, Button, Color } from '@tremor/react'
import { useState } from 'react'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useAtomValue } from 'jotai'
import AccountInfo from './AccountInfo'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
    SourceHealthStatus,
} from '../../../../../../api/api'
import Table, { IColumn } from '../../../../../../components/Table'
import { snakeCaseToLabel } from '../../../../../../utilities/labelMaker'
import { isDemoAtom } from '../../../../../../store'
import OnboardDrawer from '../../../../Onboard/AWS'

interface IAccountList {
    accounts: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection[]
    organizations: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
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

const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'providerConnectionName',
            headerName: 'Name',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'providerConnectionID',
            headerName: 'ID',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
        },
        {
            headerName: 'Account Type',
            field: 'type',
            type: 'string',
            rowGroup: true,
            enableRowGroup: true,
            sortable: true,
            hide: true,
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
            hide: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
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
            cellRenderer: (
                params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
            ) => {
                if (params.value === undefined) {
                    return null
                }

                let color: Color
                let text: string
                switch (params.value) {
                    case SourceHealthStatus.HealthStatusHealthy:
                        color = 'emerald'
                        text = 'Healthy'
                        break
                    case SourceHealthStatus.HealthStatusUnhealthy:
                        color = 'rose'
                        text = 'Unhealthy'
                        break
                    default:
                        color = 'neutral'
                        text = String(params.value)
                }

                return <Badge color={color}>{text}</Badge>
            },
        },
        {
            field: 'spendDiscovery',
            type: 'string',
            headerName: 'Spend Management',
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'assetDiscovery',
            type: 'string',
            headerName: 'Asset Discovery',
            enableRowGroup: true,
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
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
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
                    params.value !== undefined && (
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
    return temp
}

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
    autoGroupColumnDef: {
        headerName: 'Account Type',
        flex: 2,
        sortable: true,
        filter: true,
        resizable: true,
        // cellRendererParams: {
        //     suppressCount: true,
        // },
    },
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
    const isDemo = useAtomValue(isDemoAtom)

    return (
        <>
            <Table
                downloadable
                title="Accounts"
                id="aws_account_list"
                options={options}
                rowData={generateRows(accounts)}
                columns={columns(isDemo)}
                loading={loading}
                onRowClicked={(
                    event: RowClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
                ) => {
                    if (event.data) {
                        setAccData(event.data)
                        setOpenInfo(true)
                    }
                }}
            >
                <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                    Onboard New AWS Account
                </Button>
            </Table>
            <AccountInfo
                data={accData}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                type={accData?.type}
                open={openInfo}
                onClose={() => setOpenInfo(false)}
                isDemo={isDemo}
            />
            <OnboardDrawer
                open={open}
                onClose={() => setOpen(false)}
                bootstrapMode={false}
            />
        </>
    )
}
