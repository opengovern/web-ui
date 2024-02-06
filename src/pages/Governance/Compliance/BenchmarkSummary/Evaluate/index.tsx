import { useEffect, useState } from 'react'
import {
    Button,
    Flex,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Title,
} from '@tremor/react'
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react'
import { useComplianceApiV1AssignmentsBenchmarkDetail } from '../../../../../api/compliance.gen'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../../../api/api'
import Modal from '../../../../../components/Modal'
import DrawerPanel from '../../../../../components/DrawerPanel'

interface IEvaluate {
    id: string | undefined
    benchmarkDetail:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
        | undefined
    onEvaluate: (c: string[]) => void
}

export default function Evaluate({
    id,
    benchmarkDetail,
    onEvaluate,
}: IEvaluate) {
    const [open, setOpen] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)

    const { response: assignments } =
        useComplianceApiV1AssignmentsBenchmarkDetail(String(id), {})

    const connectionCheckbox = useCheckboxState({
        state: [],
    })
    useEffect(() => {
        if (assignments) {
            const activeAccounts = assignments?.connections
                ?.filter((a) => a.status)
                .map((a) => a.connectionID)
            connectionCheckbox.setState(activeAccounts || [])
        }
    }, [assignments])
    return (
        <>
            <Button
                icon={ArrowPathRoundedSquareIcon}
                onClick={() => setOpen(true)}
                loading={
                    !(
                        benchmarkDetail?.lastJobStatus === 'FAILED' ||
                        benchmarkDetail?.lastJobStatus === 'SUCCEEDED'
                    )
                }
            >
                {benchmarkDetail?.lastJobStatus === 'FAILED' ||
                benchmarkDetail?.lastJobStatus === 'SUCCEEDED'
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
                        <Table className="w-full">
                            <TableHead>
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
                        </Table>
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
                    {`Do you want to run evaluation on ${connectionCheckbox.state.length} accounts?`}
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
                            onEvaluate(connectionCheckbox.state)
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
