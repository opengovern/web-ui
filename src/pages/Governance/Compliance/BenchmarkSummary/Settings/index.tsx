import { ValueFormatterParams } from 'ag-grid-community'
import { Button, Callout, Flex, Switch, Text } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai/index'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useLocation } from 'react-router-dom'
import { isDemoAtom } from '../../../../../store'
import DrawerPanel from '../../../../../components/DrawerPanel'
import Table, { IColumn } from '../../../../../components/Table'
import {
    useComplianceApiV1AssignmentsBenchmarkDetail,
    useComplianceApiV1AssignmentsConnectionCreate,
    useComplianceApiV1AssignmentsConnectionDelete,
} from '../../../../../api/compliance.gen'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedEntities } from '../../../../../api/api'

interface ISettings {
    id: string | undefined
    response: (
        x:
            | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedEntities
            | undefined
    ) => void
    autoAssign: boolean | undefined
}

const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            width: 120,
            sortable: true,
            filter: true,
            enableRowGroup: true,
            type: 'string',
            field: 'connector',
        },
        {
            field: 'providerConnectionName',
            headerName: 'Connection Name',
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
            field: 'connectionID',
            headerName: 'Connection ID',
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
            headerName: 'Enable',
            sortable: true,
            type: 'string',
            filter: true,
            resizable: true,
            flex: 0.5,
            cellRenderer: (params: any) => {
                return (
                    <Flex
                        alignItems="center"
                        justifyContent="center"
                        className="h-full w-full"
                    >
                        <Switch checked={params.data?.status} />
                    </Flex>
                )
            },
        },
    ]
    return temp
}

interface ITransferState {
    connectionID: string
    status: boolean
}

export default function Settings({ id, response, autoAssign }: ISettings) {
    const tab = useLocation().hash
    const [open, setOpen] = useState(tab === '#settings')
    const [firstLoading, setFirstLoading] = useState<boolean>(true)
    const [transfer, setTransfer] = useState<ITransferState>({
        connectionID: '',
        status: false,
    })
    const [allEnable, setAllEnable] = useState(autoAssign)
    const isDemo = useAtomValue(isDemoAtom)

    const {
        sendNow: sendEnable,
        isLoading: enableLoading,
        isExecuted: enableExecuted,
    } = useComplianceApiV1AssignmentsConnectionCreate(
        String(id),
        { connectionId: [transfer.connectionID] },
        {},
        false
    )
    const {
        response: enableAllResponse,
        sendNow: sendEnableAll,
        isLoading: enableAllLoading,
        isExecuted: enableAllExecuted,
    } = useComplianceApiV1AssignmentsConnectionCreate(
        String(id),
        { auto_assign: !allEnable },
        {},
        false
    )
    console.log(enableAllResponse)
    const {
        sendNow: sendDisable,
        isLoading: disableLoading,
        isExecuted: disableExecuted,
    } = useComplianceApiV1AssignmentsConnectionDelete(
        String(id),
        { connectionId: [transfer.connectionID] },
        {},
        false
    )

    const {
        response: assignments,
        isLoading,
        sendNow: refreshList,
    } = useComplianceApiV1AssignmentsBenchmarkDetail(String(id), {}, false)

    useEffect(() => {
        if (id && !assignments) {
            refreshList()
        }
        if (assignments) {
            response(assignments)
        }
    }, [id, assignments])

    useEffect(() => {
        if (transfer.connectionID !== '') {
            if (transfer.status) {
                sendEnable()
            } else {
                sendDisable()
            }
        }
    }, [transfer])

    useEffect(() => {
        if (firstLoading) {
            refreshList()
        }
        setFirstLoading(false)
    }, [])

    useEffect(() => {
        if (enableExecuted && !enableLoading) {
            setTransfer({ connectionID: '', status: false })
            refreshList()
        }
        if (disableExecuted && !disableLoading) {
            setTransfer({ connectionID: '', status: false })
            refreshList()
        }
    }, [enableExecuted, disableExecuted, enableLoading, disableLoading])

    return (
        <>
            <Button
                variant="secondary"
                icon={Cog6ToothIcon}
                onClick={() => setOpen(true)}
                className="h-9"
            >
                Settings
            </Button>
            <DrawerPanel
                open={open}
                onClose={() => setOpen(false)}
                title="Settings"
            >
                {allEnable ? (
                    <Callout title="Provider requirements" color="amber">
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="gap-3"
                        >
                            <Text color="amber">
                                You have auto-enabled all accounts
                            </Text>
                            <Button
                                variant="secondary"
                                color="amber"
                                onClick={() => setAllEnable(false)}
                            >
                                Edit
                            </Button>
                        </Flex>
                    </Callout>
                ) : (
                    <Table
                        id="compliance_assignments"
                        columns={columns(isDemo)}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName === 'Enable') {
                                setTransfer({
                                    connectionID:
                                        event.data?.connectionID || '',
                                    status: !(event.data?.status || false),
                                })
                            }
                        }}
                        loading={isLoading}
                        rowData={
                            assignments?.connections?.sort(
                                (a, b) =>
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    b.providerConnectionName -
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    a.providerConnectionName
                            ) || []
                        }
                        fullWidth
                    >
                        <Flex>
                            <Flex className="gap-x-2 w-fit">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setTransfer({
                                            connectionID: 'all',
                                            status: false,
                                        })
                                    }}
                                >
                                    Disable All
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setTransfer({
                                            connectionID: 'all',
                                            status: true,
                                        })
                                    }}
                                >
                                    Enable All
                                </Button>
                            </Flex>
                            <Flex className="w-fit gap-2">
                                <Text className="text-gray-800">
                                    Auto enable
                                </Text>
                                <Switch
                                    checked={allEnable}
                                    onClick={() => sendEnableAll()}
                                />
                            </Flex>
                        </Flex>
                    </Table>
                )}
            </DrawerPanel>
        </>
    )
}
