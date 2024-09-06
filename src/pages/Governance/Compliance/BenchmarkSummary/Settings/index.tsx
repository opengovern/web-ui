import { ValueFormatterParams } from 'ag-grid-community'
import { useAtomValue } from 'jotai'
import { Button, Callout, Flex, Switch, Text } from '@tremor/react'
import { useEffect, useState } from 'react'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { isDemoAtom } from '../../../../../store'
import DrawerPanel from '../../../../../components/DrawerPanel'
import Table, { IColumn } from '../../../../../components/Table'
import {
    useComplianceApiV1AssignmentsBenchmarkDetail,
    useComplianceApiV1AssignmentsConnectionCreate,
    useComplianceApiV1AssignmentsConnectionDelete,
    useComplianceApiV1BenchmarksSettingsCreate,
} from '../../../../../api/compliance.gen'
import Spinner from '../../../../../components/Spinner'

interface ISettings {
    id: string | undefined
    response: (x: number) => void
    autoAssign: boolean | undefined
    tracksDriftEvents: boolean | undefined
    isAutoResponse: (x: boolean) => void
    reload: () => void
}

const columns: (isDemo: boolean) => IColumn<any, any>[] = (isDemo) => [
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
            <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
        ),
    },
    {
        field: 'providerConnectionID',
        headerName: 'Connection ID',
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

interface ITransferState {
    connectionID: string
    status: boolean
}

export default function Settings({
    id,
    response,
    autoAssign,
    tracksDriftEvents,
    isAutoResponse,
    reload,
}: ISettings) {
    const [open, setOpen] = useState(false)
    const [firstLoading, setFirstLoading] = useState<boolean>(true)
    const [transfer, setTransfer] = useState<ITransferState>({
        connectionID: '',
        status: false,
    })
    const [allEnable, setAllEnable] = useState(autoAssign)
    const [banner, setBanner] = useState(autoAssign)
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

    useEffect(() => {
        if (enableAllResponse) {
            isAutoResponse(true)
            setAllEnable(!allEnable)
        }
    }, [enableAllResponse])

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

    const {
        isLoading: changeSettingsLoading,
        isExecuted: changeSettingsExecuted,
        sendNowWithParams: changeSettings,
    } = useComplianceApiV1BenchmarksSettingsCreate(String(id), {}, {}, false)

    useEffect(() => {
        if (!changeSettingsLoading) {
            reload()
        }
    }, [changeSettingsLoading])

    useEffect(() => {
        if (id && !assignments) {
            refreshList()
        }
        if (assignments) {
            const count = assignments.connections?.filter((c) => c.status)
            response(count?.length || 0)
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
            <Button icon={Cog6ToothIcon} onClick={() => setOpen(true)}>
                Settings
            </Button>
            <DrawerPanel
                open={open}
                onClose={() => {
                    setOpen(false)
                    setBanner(allEnable)
                }}
                title="Settings"
            >
                {banner ? (
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
                                onClick={() => setBanner(false)}
                            >
                                Edit
                            </Button>
                        </Flex>
                    </Callout>
                ) : (
                    <Flex className="relative">
                        {allEnable && (
                            <Flex
                                justifyContent="center"
                                className="w-full h-full absolute backdrop-blur-sm z-10 top-[50px] rounded-lg"
                                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                            >
                                <Text className="py-2 px-4 rounded bg-white border">
                                    Auto onboard enabled
                                </Text>
                            </Flex>
                        )}
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
                                    <Text className="text-gray-800 whitespace-nowrap">
                                        Auto enable
                                    </Text>
                                    {enableAllLoading && enableAllExecuted ? (
                                        <Spinner />
                                    ) : (
                                        <Switch
                                            checked={allEnable}
                                            onClick={() => sendEnableAll()}
                                        />
                                    )}
                                </Flex>
                            </Flex>
                        </Table>
                    </Flex>
                )}
                <Flex className="w-full gap-2 mt-4" justifyContent="between">
                    <Text className="text-gray-800 whitespace-nowrap">
                        Maintain Detailed audit trails of Drifts Events
                    </Text>
                    {changeSettingsLoading && changeSettingsExecuted ? (
                        <Spinner />
                    ) : (
                        <Switch
                            checked={tracksDriftEvents}
                            onChange={(e) =>
                                changeSettings(id, { tracksDriftEvents: e }, {})
                            }
                        />
                    )}
                </Flex>
            </DrawerPanel>
        </>
    )
}
