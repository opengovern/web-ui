import { Badge, Button, Card, Flex, Title } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { ICellRendererParams, RowClickedEvent } from 'ag-grid-community'
import PrincipalInfo from './PrincipalInfo'
import NewPrincipal from './NewPrincipal'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiCredential } from '../../../../../../api/api'
import { AzureIcon } from '../../../../../../icons/icons'
import Table, { IColumn } from '../../../../../../components/Table'

interface IPrincipals {
    principals: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
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
                    <AzureIcon />
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

export default function Principals({ principals }: IPrincipals) {
    const [open, setOpen] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const [priData, setPriData] = useState<
        GithubComKaytuIoKaytuEnginePkgOnboardApiCredential | undefined
    >(undefined)

    return (
        <>
            <Card>
                <Table
                    downloadable
                    title="Principals"
                    id="azure_pri_list"
                    columns={columns}
                    rowData={principals}
                    onRowClicked={(
                        event: RowClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiCredential>
                    ) => {
                        setPriData(event.data)
                        setOpenInfo(true)
                    }}
                >
                    <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                        Create New Principal
                    </Button>
                </Table>
            </Card>
            <PrincipalInfo
                data={priData}
                open={openInfo}
                onClose={() => setOpenInfo(false)}
            />
            <NewPrincipal open={open} onClose={() => setOpen(false)} />
        </>
    )
}
