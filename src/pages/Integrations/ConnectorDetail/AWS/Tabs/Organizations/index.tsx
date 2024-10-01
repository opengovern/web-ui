import { Badge, Button, Select, TextInput } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { ICellRendererParams, RowClickedEvent } from 'ag-grid-community'
import { useState } from 'react'
import { useAtomValue } from 'jotai'
import OrganizationInfo from './OrganizationInfo'
import {
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
} from '../../../../../../api/api'
import Table, { IColumn } from '../../../../../../components/Table'
import { isDemoAtom } from '../../../../../../store'
import OnboardDrawer from '../../../../Onboard/AWS'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Box, Modal, SpaceBetween } from '@cloudscape-design/components'

interface IOrganizations {
    accounts: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection[]
    organizations: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
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
    return temp
}

export default function Organizations({
    organizations,
    accounts,
}: IOrganizations) {
    const [open, setOpen] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const [orgData, setOrgData] = useState<
        | GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential
        | undefined
    >(undefined)
    const [edit,setEdit] = useState<boolean>(false);
    const isDemo = useAtomValue(isDemoAtom)

    return (
        <>
            <Table
                // downloadable
                title="Organizations"
                id="aws_org_list"
                columns={columns(isDemo)}
                rowData={organizations}
                onRowClicked={(
                    event: RowClickedEvent<GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential>
                ) => {
                    setOrgData(event.data)
                    setOpenInfo(true)
                }}
            >
               
            </Table>
            <Modal
                onDismiss={() => setEdit(false)}
                visible={edit}
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button
                                variant="secondary"
                                onClick={() => setEdit(false)}
                            >
                                Close
                            </Button>

                            <Button
                                onClick={() => {
                                    setEdit(false)
                                }}
                            >
                                Edit
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
                header="Edit Credintials"
            >
                <Select
                // @ts-ignore
                    selectedOption={undefined}
                // @ts-ignore

                    onChange={({ detail }) =>{}}
                    placeholder='Select organization'    
                
                    options={[
                        { label: 'Option 1', value: '1' },
                        { label: 'Option 2', value: '2' },
                        { label: 'Option 3', value: '3' },
                        { label: 'Option 4', value: '4' },
                        { label: 'Option 5', value: '5' },
                    ]}
                />
                <TextInput
                    className="w-full my-3"
                    value={''}
                    placeholder="Access key ID"
                    onChange={(e) => {}}
                />
                <TextInput
                    className="w-full my-3"
                    value={''}
                    placeholder="Secret access key"
                    onChange={(e) => {}}
                />
                <TextInput
                    className="w-full my-3"
                    value={''}
                    placeholder="Role name"
                    onChange={(e) => {}}
                />
            </Modal>
            <OrganizationInfo
                open={openInfo}
                onClose={() => {
                    setOpenInfo(false)
                }}
                data={orgData}
                isDemo={isDemo}
            />
            <OnboardDrawer
                open={open}
                onClose={() => setOpen(false)}
                // bootstrapMode={false}
            />
        </>
    )
}
