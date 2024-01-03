import { Badge, Button } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import {
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { useAtomValue } from 'jotai'
import PrincipalInfo from './PrincipalInfo'
import NewPrincipal from './NewPrincipal'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
} from '../../../../../../api/api'
import Table, { IColumn } from '../../../../../../components/Table'
import { isDemoAtom } from '../../../../../../store'

interface IPrincipals {
    principals: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
}

const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'name',
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
            field: 'credentialType',
            headerName: 'Credential Type',
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
    return temp
}

export default function Principals({ principals }: IPrincipals) {
    const [open, setOpen] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const [priData, setPriData] = useState<
        | GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential
        | undefined
    >(undefined)
    const isDemo = useAtomValue(isDemoAtom)

    return (
        <>
            <Table
                downloadable
                title="Principals"
                id="azure_pri_list"
                columns={columns(isDemo)}
                rowData={principals}
                onRowClicked={(
                    event: RowClickedEvent<GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential>
                ) => {
                    setPriData(event.data)
                    setOpenInfo(true)
                }}
            >
                <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                    Create New Principal
                </Button>
            </Table>
            <PrincipalInfo
                data={priData}
                open={openInfo}
                onClose={() => setOpenInfo(false)}
                isDemo={isDemo}
            />
            <NewPrincipal open={open} onClose={() => setOpen(false)} />
        </>
    )
}
