import { ValueFormatterParams } from 'ag-grid-community'
import { useAtomValue } from 'jotai'
import {
    Button,
    Callout,
    Divider,
    Flex,
    Grid,
    Switch,
    Text,
} from '@tremor/react'
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
import {
    FormField,
    RadioGroup,
    Tiles,
    Toggle,
} from '@cloudscape-design/components'

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
            <Flex
                flexDirection="col"
                justifyContent="start"
                alignItems="center"
            >
                <Flex className="w-full mb-3">
                    <Tiles
                        value={allEnable ? 'all' : 'manual'}
                        className="gap-8"
                        onChange={({ detail }) => {
                            sendEnableAll()
                            window.location.reload()
                        }}
                        items={[
                            {
                                value: 'Disable',
                                label: 'Disable',
                                description:
                                    'Makes the framework inactive, with no assignments or audits.',
                                disabled: true,
                            },
                            {
                                value: 'manual',
                                label: `Custom Assignment`,
                                description:
                                    'Select integrations from the list below to enable the framework for auditing.',
                            },
                            {
                                value: 'all',
                                label: `Auto-Assign`,
                                description:
                                    'Activates the framework on all integrations including any future integrations supported by the framework',
                            },
                        ]}
                    />
                </Flex>
                {banner ? (
                    <Callout title="Provider requirements" className='w-full' color="amber">
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
                            {/* <Flex flexDirection="col">
                                <Flex className="bg-white p-7">
                                    <Text className="text-gray-800 whitespace-nowrap">
                                        Set Benchmark as Required Baseline and
                                        Auto-Enable for All Integrations{' '}
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
                                <Divider />
                            </Flex> */}
                        </Table>
                    </Flex>
                )}
                {/* <Divider /> */}
                <Flex
                    className="w-full gap-2  bg-white p-7 rounded-xl mt-2"
                    justifyContent="between"
                >
                    <Text className="text-gray-800 whitespace-nowrap">
                        Maintain Detailed audit trails of Drifts Events
                    </Text>
                    {changeSettingsLoading && changeSettingsExecuted ? (
                        <Spinner />
                    ) : (
                        <>
                            <Toggle
                                onChange={({ detail }) =>
                                    changeSettings(
                                        id,
                                        { tracksDriftEvents: detail.checked },
                                        {}
                                    )
                                }
                                checked={false}
                            ></Toggle>
                        </>
                    )}
                </Flex>
            </Flex>
        </>
    )
}
