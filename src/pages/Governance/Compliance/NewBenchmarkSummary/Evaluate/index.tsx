import { useAtomValue } from 'jotai'
import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Button,
    Flex,
    MultiSelect,
    MultiSelectItem,
    Title,
} from '@tremor/react'
import {
    ArrowPathRoundedSquareIcon,
    CloudIcon,
    PlayCircleIcon,
} from '@heroicons/react/24/outline'
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react'
import { useComplianceApiV1AssignmentsBenchmarkDetail } from '../../../../../api/compliance.gen'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedConnection,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary,
} from '../../../../../api/api'
import DrawerPanel from '../../../../../components/DrawerPanel'
import Table, { IColumn } from '../../../../../components/Table'
import { isDemoAtom } from '../../../../../store'
import KFilter from '../../../../../components/Filter'
import { Box, Icon, Multiselect, SpaceBetween } from '@cloudscape-design/components'
import { Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Modal from '@cloudscape-design/components/modal'
import KButton from '@cloudscape-design/components/button'
import axios from 'axios'
interface IEvaluate {
    id: string | undefined
    assignmentsCount: number
    benchmarkDetail:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
        | undefined
    onEvaluate: (c: string[]) => void
}
const columns: (
    checkbox: {
        state: string | boolean | any[]
        setState: React.Dispatch<React.SetStateAction<string | boolean | any[]>>
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    },
    isDemo: boolean
) => IColumn<
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedConnection,
    any
>[] = (checkbox, isDemo) => [
    {
        type: 'string',
        width: 50,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedConnection>
        ) => {
            return (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                <Checkbox
                    value={params.data?.connectionID}
                    {...checkbox}
                    className="cursor-pointer w-full h-full"
                />
            )
        },
    },
    {
        type: 'connector',
        headerName: 'Provider',
        field: 'connector',
    },
    {
        type: 'string',
        headerName: 'Account Name',
        field: 'providerConnectionName',
        cellRenderer: (param: ValueFormatterParams) => (
            <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
        ),
    },
    {
        type: 'string',
        headerName: 'Account ID',
        field: 'providerConnectionID',
        cellRenderer: (param: ValueFormatterParams) => (
            <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
        ),
    },
]
export default function Evaluate({
    id,
    benchmarkDetail,
    assignmentsCount,
    onEvaluate,
}: IEvaluate) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [accounts,setAccounts] = useState()
    const isDemo = useAtomValue(isDemoAtom)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [connections, setConnections] = useState<string[]>([])



    // useEffect(() => {
    //     checkbox.setState(connections)
    //     console.log(assignments)
    // }, [connections])

    // useEffect(() => {
    //     if (assignments) {
    //         const activeAccounts = assignments?.connections
    //             ?.filter((a) => a.status)
    //             .map((a) => a.connectionID || '')
    //         setConnections( [])
    //     }
    // }, [assignments])
    const GetEnabled = () => {
        // /compliance/api/v3/benchmark/{benchmark-id}/assignments
        setLoading(true)
        let url = ''
        if (window.location.origin === 'http://localhost:3000') {
            url = window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL
        } else {
            url = window.location.origin
        }
        // @ts-ignore
        const token = JSON.parse(localStorage.getItem('kaytu_auth')).token

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        let connector= ''
        benchmarkDetail?.connectors?.map((c) => {
            connector += `connectors=${c}&`
        }
    )
        axios
            .get(
                `${url}/main/onboard/api/v3/integrations?health_state=healthy&${connector}`,
                config
            )
            .then((res) => {
                setAccounts(res.data.integrations)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }
  

    const isLoading =
        benchmarkDetail?.lastJobStatus !== 'FAILED' &&
        benchmarkDetail?.lastJobStatus !== 'SUCCEEDED' &&
        (benchmarkDetail?.lastJobStatus || '') !== ''

    return (
        <>
            <KButton
                onClick={() => {
                    setOpen(true)
                  GetEnabled()
                }}
                loading={false}
                variant="primary"
                className="flex flex-row justify-center items-center w-full min-w-20"
                // iconAlign="left"
            >
                <div className="flex flex-row justify-center items-center w-full min-w-20 gap-2">
                    <PlayCircleIcon className="w-5" />
                    Run
                </div>
            </KButton>
            <Modal
                onDismiss={() => setOpen(false)}
                visible={open}
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button
                                variant="secondary"
                                onClick={() => setOpen(false)}
                            >
                                Close
                            </Button>
                            {/* <Button
                                variant="secondary"
                                onClick={() => {
                                    setConnections(
                                       []
                                    )
                                }}
                            >
                                DeSelect All
                            </Button> */}
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setConnections(
                                        // @ts-ignore
                                        assignments?.connections?.map((c) => {
                                            return {
                                                label: c.providerConnectionName,
                                                value: c.connectionID,
                                                description:
                                                    c.providerConnectionID,
                                            }
                                        })
                                    )
                                }}
                            >
                                Select All
                            </Button>
                            <Button
                                onClick={() => {
                                    setOpen(false)
                                    onEvaluate(connections)
                                }}
                            >
                                Run
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
                header="Select Account"
            >
                <Multiselect
                    className="w-full"
                    // @ts-ignore
                    options={accounts?.map((c) => {
                        return {
                            label: c.name,
                            value: c.integration_tracker,
                            description: c.id,
                        }
                    })}
                    // @ts-ignore
                    selectedOptions={connections}
                    loadingText="Loading Accounts"
                    emptyText="No Accounts"
                    loading={loading}
                    placeholder="Select Account"
                    onChange={({ detail }) => {
                        // @ts-ignore
                        setConnections(detail.selectedOptions)
                    }}
                />
            </Modal>
        </>
    )
}
{/**
    
    <Modal
                visible={openConfirm}
                onDismiss={() => setOpenConfirm(false)}
            >
                <Title>
                    {`Do you want to run evaluation on ${checkbox.state.length} accounts?`}
                </Title>
                <Flex className="mt-8">
                    <Button
                        variant="secondary"
                        onClick={() => setOpenConfirm(false)}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            onEvaluate(connections)
                            setOpenConfirm(false)
                        }}
                    >
                        Evaluate
                    </Button>
                </Flex>
            </Modal>
    */}