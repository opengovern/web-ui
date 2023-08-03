import { Badge, Button, Card, Flex } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { ICellRendererParams, RowClickedEvent } from 'ag-grid-community'
import { useState } from 'react'
import OrganizationInfo from './OrganizationInfo'
import NewOrganization from './NewOrganization'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
} from '../../../../../../api/api'
import { AWSIcon } from '../../../../../../icons/icons'
import Table, { IColumn } from '../../../../../../components/Table'

interface IOrganizations {
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    organizations: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
}

function getBadgeColor(status: string) {
    switch (status) {
        case 'healthy':
            return 'emerald'
        case 'unhealthy':
            return 'rose'
        default:
            return 'neutral'
    }
}

const columns: IColumn<any, any>[] = [
    {
        field: 'connectortype',
        headerName: 'Connector',
        type: 'string',
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
                    <AWSIcon id="org" />
                </Flex>
            )
        },
    },
    {
        field: 'name',
        headerName: 'Name',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'credentialType',
        headerName: 'Credential Type',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'enabled',
        headerName: 'Enabled',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'healthStatus',
        headerName: 'Health Status',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (params: ICellRendererParams) => {
            return (
                <Badge color={getBadgeColor(params.value)}>
                    {params.value}
                </Badge>
            )
        },
    },
    {
        field: 'healthReason',
        headerName: 'Health Reason',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'total_connections',
        headerName: 'Total Connections',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'enabled_connections',
        headerName: 'Enabled Connections',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'unhealthy_connections',
        headerName: 'Unhealthy Connections',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
]

export default function Organizations({
    organizations,
    accounts,
}: IOrganizations) {
    const [open, setOpen] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const [orgData, setOrgData] = useState<
        GithubComKaytuIoKaytuEnginePkgOnboardApiCredential | undefined
    >(undefined)

    return (
        <>
            <Card>
                <Table
                    downloadable
                    title="Organizations"
                    id="aws_org_list"
                    columns={columns}
                    rowData={organizations}
                    onRowClicked={(
                        event: RowClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiCredential>
                    ) => {
                        setOrgData(event.data)
                        setOpenInfo(true)
                    }}
                >
                    <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                        Create New Organization
                    </Button>
                </Table>
            </Card>
            <OrganizationInfo
                open={openInfo}
                onClose={() => {
                    setOpenInfo(false)
                }}
                data={orgData}
            />
            <NewOrganization
                accounts={accounts}
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    )
}
