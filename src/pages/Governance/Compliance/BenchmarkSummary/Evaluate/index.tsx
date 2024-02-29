import { useAtomValue } from 'jotai'
import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Title } from '@tremor/react'
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react'
import { useComplianceApiV1AssignmentsBenchmarkDetail } from '../../../../../api/compliance.gen'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedConnection,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary,
} from '../../../../../api/api'
import Modal from '../../../../../components/Modal'
import DrawerPanel from '../../../../../components/DrawerPanel'
import Table, { IColumn } from '../../../../../components/Table'
import { isDemoAtom } from '../../../../../store'

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
    const isDemo = useAtomValue(isDemoAtom)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [connections, setConnections] = useState<string[]>([])

    const { response: assignments } =
        useComplianceApiV1AssignmentsBenchmarkDetail(String(id), {})

    const checkbox = useCheckboxState()

    useEffect(() => {
        checkbox.setState(connections)
    }, [connections])

    useEffect(() => {
        if (assignments) {
            const activeAccounts = assignments?.connections
                ?.filter((a) => a.status)
                .map((a) => a.connectionID || '')
            setConnections(activeAccounts || [])
        }
    }, [assignments])

    const click = (connectionID: string) => {
        const arrFiltered = connections.filter((v) => v !== connectionID)
        if (arrFiltered.length === connections.length) {
            setConnections(() => [...connections, connectionID])
        } else {
            setConnections(() => [...arrFiltered])
        }
    }

    return (
        <>
            <Button
                icon={ArrowPathRoundedSquareIcon}
                onClick={() => setOpen(true)}
                loading={
                    !(
                        benchmarkDetail?.lastJobStatus === 'FAILED' ||
                        benchmarkDetail?.lastJobStatus === 'SUCCEEDED' ||
                        (benchmarkDetail?.lastJobStatus || '') === ''
                    )
                }
            >
                {benchmarkDetail?.lastJobStatus === 'FAILED' ||
                benchmarkDetail?.lastJobStatus === 'SUCCEEDED' ||
                (benchmarkDetail?.lastJobStatus || '') === ''
                    ? 'Evaluate now'
                    : 'Evaluating'}
            </Button>
            <DrawerPanel
                open={open}
                onClose={() => setOpen(false)}
                title="Evaluate Now"
            >
                <Flex flexDirection="col" alignItems="start" className="h-full">
                    <Flex flexDirection="col" alignItems="start">
                        <Title className="mb-6">List of cloud accounts</Title>
                        <Table
                            id="evaluate_now"
                            key={`evaluate_now-${connections.join('')}`}
                            columns={columns(checkbox, isDemo)}
                            rowData={assignments?.connections}
                            fullHeight
                            onRowClicked={(e) =>
                                click(e.data?.connectionID || '')
                            }
                        />
                        {/* <TableHead>
                                <TableRow>
                                    <TableHeaderCell className="pl-10">
                                        Account Name
                                    </TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="w-full">
                                {assignments?.connections?.map((c) => (
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    <Checkbox
                                        value={c.connectionID}
                                        {...connectionCheckbox}
                                        className="cursor-pointer w-full min-w-full"
                                    >
                                        <TableRow className="w-full">
                                            <TableCell className="w-80">
                                                {c.providerConnectionName}
                                            </TableCell>
                                            <TableCell>
                                                {c.providerConnectionID}
                                            </TableCell>
                                        </TableRow>
                                    </Checkbox>
                                ))}
                            </TableBody>
                        </Table> */}
                    </Flex>
                    <Flex justifyContent="end" className="gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </Button>
                        <Button onClick={() => setOpenConfirm(true)}>
                            Run
                        </Button>
                    </Flex>
                </Flex>
            </DrawerPanel>
            <Modal open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <Title>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
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
        </>
    )
}
