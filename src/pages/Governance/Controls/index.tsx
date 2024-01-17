import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Badge,
    Card,
    Col,
    Flex,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    Title,
} from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'
import {
    BookOpenIcon,
    CheckCircleIcon,
    CodeBracketIcon,
    Cog8ToothIcon,
    CommandLineIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { useComplianceApiV1BenchmarksControlsDetail } from '../../../api/compliance.gen'
import Spinner from '../../../components/Spinner'
import { numberDisplay } from '../../../utilities/numericDisplay'
import DrawerPanel from '../../../components/DrawerPanel'

interface IPolicies {
    id: string | undefined
    assignments: number
}

export const severityBadge = (severity: any) => {
    const style = {
        color: '#fff',
        borderRadius: '8px',
        width: '64px',
    }
    if (severity) {
        if (severity === 'critical') {
            return (
                <Badge style={{ backgroundColor: '#6E120B', ...style }}>
                    Critical
                </Badge>
            )
        }
        if (severity === 'high') {
            return (
                <Badge style={{ backgroundColor: '#CA2B1D', ...style }}>
                    High
                </Badge>
            )
        }
        if (severity === 'medium') {
            return (
                <Badge style={{ backgroundColor: '#EE9235', ...style }}>
                    Medium
                </Badge>
            )
        }
        if (severity === 'low') {
            return (
                <Badge style={{ backgroundColor: '#F4C744', ...style }}>
                    Low
                </Badge>
            )
        }
        if (severity === 'none') {
            return (
                <Badge style={{ backgroundColor: '#9BA2AE', ...style }}>
                    None
                </Badge>
            )
        }
        return (
            <Badge style={{ backgroundColor: '#54B584', ...style }}>
                Passed
            </Badge>
        )
    }
    return <Badge style={{ backgroundColor: '#9BA2AE', ...style }}>None</Badge>
}

export const statusBadge = (status: any) => {
    if (status === 'passed') {
        return (
            <Flex className="w-fit gap-1.5">
                <CheckCircleIcon className="h-4 text-emerald-500" />
                <Text>Passed</Text>
            </Flex>
        )
    }
    return (
        <Flex className="w-fit gap-1.5">
            <XCircleIcon className="h-4 text-rose-600" />
            <Text>Failed</Text>
        </Flex>
    )
}

export const treeRows = (json: any) => {
    let arr: any = []
    if (json) {
        if (json.control !== null && json.control !== undefined) {
            for (let i = 0; i < json.control.length; i += 1) {
                let obj = {}
                obj = {
                    parentName: json.benchmark.title,
                    ...json.control[i].control,
                    ...json.control[i],
                }
                arr.push(obj)
            }
        }
        if (json.children !== null && json.children !== undefined) {
            for (let i = 0; i < json.children.length; i += 1) {
                const res = treeRows(json.children[i])
                arr = arr.concat(res)
            }
        }
    }

    return arr
}

export const groupBy = (input: any[], key: string) => {
    return input.reduce((acc, currentValue) => {
        const groupKey = currentValue[key]
        if (!acc[groupKey]) {
            acc[groupKey] = []
        }
        acc[groupKey].push(currentValue)
        return acc
    }, {})
}

export default function Controls({ id, assignments }: IPolicies) {
    const { response: controls, isLoading } =
        useComplianceApiV1BenchmarksControlsDetail(String(id))
    const navigate = useNavigate()
    const [doc, setDoc] = useState('')
    const [docTitle, setDocTitle] = useState('')

    return (
        <Flex flexDirection="col" className="gap-4">
            <DrawerPanel
                title={docTitle}
                open={doc.length > 0}
                onClose={() => setDoc('')}
            >
                <MarkdownPreview
                    source={doc}
                    wrapperElement={{
                        'data-color-mode': 'light',
                    }}
                    rehypeRewrite={(node, index, parent) => {
                        if (
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            node.tagName === 'a' &&
                            parent &&
                            /^h(1|2|3|4|5|6)/.test(
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                parent.tagName
                            )
                        ) {
                            // eslint-disable-next-line no-param-reassign
                            parent.children = parent.children.slice(1)
                        }
                    }}
                />
            </DrawerPanel>
            {isLoading ? (
                <Spinner className="mt-20" />
            ) : (
                Object.entries(groupBy(treeRows(controls), 'parentName'))?.map(
                    ([name, value]: any[]) => (
                        <Card>
                            <Accordion
                                defaultOpen
                                className="bg-transparent border-0"
                            >
                                <AccordionHeader className="pl-0 pr-0.5 py-2 w-full bg-transparent">
                                    <Flex>
                                        <Flex>
                                            <Title className="font-semibold">
                                                {name}
                                            </Title>
                                            {assignments > 0 && (
                                                <Flex
                                                    justifyContent="start"
                                                    className="gap-2"
                                                    style={{ width: '200px' }}
                                                >
                                                    {value?.filter(
                                                        (c: any) => c.passed
                                                    ).length ===
                                                    value?.length ? (
                                                        <CheckCircleIcon className="w-5 text-emerald-500" />
                                                    ) : (
                                                        <XCircleIcon className="w-5 text-rose-600" />
                                                    )}
                                                    <Text className="font-semibold whitespace-nowrap">{`Passed controls: ${numberDisplay(
                                                        value?.filter(
                                                            (c: any) => c.passed
                                                        ).length,
                                                        0
                                                    )}/${numberDisplay(
                                                        value?.length,
                                                        0
                                                    )} (${Math.floor(
                                                        // eslint-disable-next-line no-unsafe-optional-chaining
                                                        (value?.filter(
                                                            (c: any) => c.passed
                                                        ).length /
                                                            (value?.length ||
                                                                0)) *
                                                            100
                                                    )}%)`}</Text>
                                                </Flex>
                                            )}
                                        </Flex>
                                    </Flex>
                                </AccordionHeader>
                                <AccordionBody className="p-0 pt-4">
                                    <Table className="max-w-full">
                                        <TableHead className="max-w-full">
                                            <TableRow className="max-w-full">
                                                <TableHeaderCell className="w-24">
                                                    Control
                                                </TableHeaderCell>
                                                <TableHeaderCell>
                                                    Title
                                                </TableHeaderCell>
                                                <TableHeaderCell className="w-40">
                                                    Remediation
                                                </TableHeaderCell>
                                                {assignments > 0 && (
                                                    <TableHeaderCell className="w-48">
                                                        Passed resources
                                                    </TableHeaderCell>
                                                )}
                                                <TableHeaderCell className="w-5" />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="max-w-full">
                                            {value.map((v: any, i: number) => (
                                                <TableRow
                                                    className="max-w-full cursor-pointer hover:bg-kaytu-50 dark:hover:bg-gray-900"
                                                    key={v?.id}
                                                >
                                                    <TableCell
                                                        className="w-24 min-w-[96px]"
                                                        onClick={() =>
                                                            navigate(
                                                                String(v?.id)
                                                            )
                                                        }
                                                    >{`${name.substring(
                                                        0,
                                                        name.indexOf(' ')
                                                    )}.${i + 1}`}</TableCell>
                                                    <TableCell
                                                        onClick={() =>
                                                            navigate(
                                                                String(v?.id)
                                                            )
                                                        }
                                                    >
                                                        <Grid numItems={12}>
                                                            <Col numColSpan={2}>
                                                                {severityBadge(
                                                                    v?.severity
                                                                )}
                                                            </Col>
                                                            <Col
                                                                numColSpan={10}
                                                                className="-ml-8"
                                                            >
                                                                <Text className="truncate">
                                                                    {v?.title}
                                                                </Text>
                                                            </Col>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Flex
                                                            justifyContent="start"
                                                            className="gap-1.5"
                                                        >
                                                            {v?.cliRemediation &&
                                                                v
                                                                    ?.cliRemediation
                                                                    .length >
                                                                    0 && (
                                                                    <div className="group relative flex justify-center">
                                                                        <CommandLineIcon
                                                                            className="text-kaytu-500 w-5"
                                                                            onClick={() => {
                                                                                setDoc(
                                                                                    v?.cliRemediation
                                                                                )
                                                                                setDocTitle(
                                                                                    `Command line (CLI) remediation for '${v?.title}'`
                                                                                )
                                                                            }}
                                                                        />
                                                                        <Card className="absolute -top-2.5 left-6 w-fit z-40 scale-0 transition-all rounded p-2 group-hover:scale-100">
                                                                            <Text>
                                                                                Command
                                                                                line
                                                                                (CLI)
                                                                            </Text>
                                                                        </Card>
                                                                    </div>
                                                                )}
                                                            {v?.manualRemediation &&
                                                                v
                                                                    ?.manualRemediation
                                                                    .length >
                                                                    0 && (
                                                                    <div className="group relative flex justify-center">
                                                                        <BookOpenIcon
                                                                            className="text-kaytu-500 w-5"
                                                                            onClick={() => {
                                                                                setDoc(
                                                                                    v?.manualRemediation
                                                                                )
                                                                                setDocTitle(
                                                                                    `Manual remediation for '${v?.title}'`
                                                                                )
                                                                            }}
                                                                        />
                                                                        <Card className="absolute -top-2.5 left-6 w-fit z-40 scale-0 transition-all rounded p-2 group-hover:scale-100">
                                                                            <Text>
                                                                                Manual
                                                                            </Text>
                                                                        </Card>
                                                                    </div>
                                                                )}
                                                            {v?.programmaticRemediation &&
                                                                v
                                                                    ?.programmaticRemediation
                                                                    .length >
                                                                    0 && (
                                                                    <div className="group relative flex justify-center">
                                                                        <CodeBracketIcon
                                                                            className="text-kaytu-500 w-5"
                                                                            onClick={() => {
                                                                                setDoc(
                                                                                    v?.programmaticRemediation
                                                                                )
                                                                                setDocTitle(
                                                                                    `Programmatic remediation for '${v?.title}'`
                                                                                )
                                                                            }}
                                                                        />
                                                                        <Card className="absolute -top-2.5 left-6 w-fit z-40 scale-0 transition-all rounded p-2 group-hover:scale-100">
                                                                            <Text>
                                                                                Programmatic
                                                                            </Text>
                                                                        </Card>
                                                                    </div>
                                                                )}
                                                            {v?.guardrailRemediation &&
                                                                v
                                                                    ?.guardrailRemediation
                                                                    .length >
                                                                    0 && (
                                                                    <div className="group relative flex justify-center">
                                                                        <Cog8ToothIcon
                                                                            className="text-kaytu-500 w-5"
                                                                            onClick={() => {
                                                                                setDoc(
                                                                                    v?.guardrailRemediation
                                                                                )
                                                                                setDocTitle(
                                                                                    `Guard rails remediation for '${v?.title}'`
                                                                                )
                                                                            }}
                                                                        />
                                                                        <Card className="absolute -top-2.5 left-6 w-fit z-40 scale-0 transition-all rounded p-2 group-hover:scale-100">
                                                                            <Text>
                                                                                Guard
                                                                                rail
                                                                            </Text>
                                                                        </Card>
                                                                    </div>
                                                                )}
                                                        </Flex>
                                                    </TableCell>
                                                    {assignments > 0 && (
                                                        <TableCell
                                                            onClick={() =>
                                                                navigate(
                                                                    String(
                                                                        v?.id
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            <Flex
                                                                justifyContent="start"
                                                                className="gap-2"
                                                            >
                                                                {(v?.totalResourcesCount ||
                                                                    0) -
                                                                    (v?.failedResourcesCount ||
                                                                        0) ===
                                                                (v?.totalResourcesCount ||
                                                                    0) ? (
                                                                    <CheckCircleIcon className="w-5 text-emerald-500" />
                                                                ) : (
                                                                    <XCircleIcon className="w-5 text-rose-600" />
                                                                )}
                                                                {`${numberDisplay(
                                                                    (v?.totalResourcesCount ||
                                                                        0) -
                                                                        (v?.failedResourcesCount ||
                                                                            0),
                                                                    0
                                                                )}/${numberDisplay(
                                                                    v?.totalResourcesCount ||
                                                                        0,
                                                                    0
                                                                )} (${Math.floor(
                                                                    (((v?.totalResourcesCount ||
                                                                        0) -
                                                                        (v?.failedResourcesCount ||
                                                                            0)) /
                                                                        (v?.totalResourcesCount ||
                                                                            1)) *
                                                                        100
                                                                )}%)`}
                                                            </Flex>
                                                        </TableCell>
                                                    )}
                                                    <TableCell
                                                        onClick={() =>
                                                            navigate(
                                                                String(v?.id)
                                                            )
                                                        }
                                                    >
                                                        <ChevronRightIcon className="h-5 text-kaytu-500" />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </AccordionBody>
                            </Accordion>
                        </Card>
                    )
                )
            )}
        </Flex>
    )
}
