import { Badge, Button } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import {
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { useAtomValue } from 'jotai'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
} from '../../../../../../api/api'
import Table, { IColumn } from '../../../../../../components/Table'
import { isDemoAtom } from '../../../../../../store'
import DirectoryInfo from './DirectoryInfo'
import NewDirectory from './NewDirectory'

interface IDirectories {
    directories: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
}

const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'metadata.tenant_id',
            headerName: 'Tenant (Directory) ID',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
        },
        {
            field: 'name',
            headerName: 'Directory Name',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
            ),
        },
        // {
        //     field: 'credentialType',
        //     headerName: 'Credential Type',
        //     type: 'string',
        //     sortable: true,
        //     filter: true,
        //     resizable: true,
        //     flex: 1,
        //     cellRenderer: (param: ValueFormatterParams) => (
        //         <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
        //     ),
        // },
        // {
        //     field: 'enabled',
        //     headerName: 'Enabled',
        //     type: 'string',
        //     sortable: true,
        //     filter: true,
        //     resizable: true,
        //     flex: 1,
        // },
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
            field: 'metadata.spn_name',
            headerName: 'SPN Name',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
            ),
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

export default function Directories({ directories }: IDirectories) {
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
                title="Directories"
                id="azure_pri_list"
                columns={columns(isDemo)}
                rowData={directories}
                onRowClicked={(
                    event: RowClickedEvent<GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential>
                ) => {
                    setPriData(event.data)
                    setOpenInfo(true)
                }}
            >
                {/* <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                    Create New Principal
                </Button> */}
            </Table>
            <DirectoryInfo
                data={priData}
                open={openInfo}
                onClose={() => setOpenInfo(false)}
                isDemo={isDemo}
            />
            <NewDirectory open={open} onClose={() => setOpen(false)} />
        </>
    )
}
