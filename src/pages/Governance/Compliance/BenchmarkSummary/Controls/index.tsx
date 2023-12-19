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
import { useState } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'
import { useComplianceApiV1BenchmarksControlsDetail } from '../../../../../api/compliance.gen'

interface IPolicies {
    id: string | undefined
}

export const severityBadge = (severity: any) => {
    const style = {
        color: '#fff',
        borderRadius: '8px',
        width: '64px',
    }
    if (severity) {
        if (severity === 'unknown') {
            return (
                <Badge style={{ backgroundColor: '#9BA2AE', ...style }}>
                    Unknown
                </Badge>
            )
        }
        if (severity === 'passed') {
            return (
                <Badge style={{ backgroundColor: '#54B584', ...style }}>
                    Passed
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
        if (severity === 'medium') {
            return (
                <Badge style={{ backgroundColor: '#EE9235', ...style }}>
                    Medium
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
        return (
            <Badge style={{ backgroundColor: '#6E120B', ...style }}>
                Critical
            </Badge>
        )
    }
    return (
        <Badge style={{ backgroundColor: '#9BA2AE', ...style }}>Unknown</Badge>
    )
}

const rows = (json: any) => {
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
                const res = rows(json.children[i])
                arr = arr.concat(res)
            }
        }
    }
    if (arr.length) {
        return arr.sort((a: any, b: any) => {
            if (a.path < b.path) {
                return -1
            }
            if (a.path > b.path) {
                return 1
            }
            return 0
        })
    }

    return arr
}

const groupBy = (input: any[], key: string) => {
    return input.reduce((acc, currentValue) => {
        const groupKey = currentValue[key]
        if (!acc[groupKey]) {
            acc[groupKey] = []
        }
        acc[groupKey].push(currentValue)
        return acc
    }, {})
}

export default function Controls({ id }: IPolicies) {
    const { response: controls, isLoading } =
        useComplianceApiV1BenchmarksControlsDetail(String(id))
    const navigate = useNavigate()

    return (
        <Flex flexDirection="col" className="gap-4">
            {Object.entries(groupBy(rows(controls), 'parentName'))?.map(
                ([name, value]: any[]) => (
                    <Card>
                        <Accordion
                            defaultOpen
                            className="bg-transparent border-0"
                        >
                            <AccordionHeader className="pl-0 pr-0.5 py-2 w-full bg-transparent">
                                <Flex>
                                    <Flex
                                        justifyContent="start"
                                        className="gap-2"
                                    >
                                        <Title className="font-semibold">
                                            {name}
                                        </Title>
                                        <Text>{`${
                                            value?.filter((c: any) => c.passed)
                                                .length
                                        }/${value?.length} passed rules`}</Text>
                                    </Flex>
                                </Flex>
                            </AccordionHeader>
                            <AccordionBody className="p-0">
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
                                                Passed resources
                                            </TableHeaderCell>
                                            <TableHeaderCell className="w-5" />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="max-w-full">
                                        {value.map((v: any, i: number) => (
                                            <TableRow
                                                className="max-w-full cursor-pointer hover:bg-kaytu-50"
                                                key={v?.id}
                                                onClick={() =>
                                                    navigate(String(v?.id))
                                                }
                                            >
                                                <TableCell className="w-24 min-w-[96px]">{`${name.substring(
                                                    0,
                                                    name.indexOf(' ')
                                                )}.${i + 1}`}</TableCell>
                                                <TableCell>
                                                    <Grid
                                                        numItems={10}
                                                        className="w-full"
                                                    >
                                                        {severityBadge(
                                                            v?.severity
                                                        )}
                                                        <Col numColSpan={9}>
                                                            <Text className="truncate">
                                                                {v?.title}
                                                            </Text>
                                                        </Col>
                                                    </Grid>
                                                </TableCell>
                                                <TableCell className="w-40 min-w-[160px]">
                                                    {`${
                                                        (v?.totalResourcesCount ||
                                                            0) -
                                                        (v?.failedResourcesCount ||
                                                            0)
                                                    }/${
                                                        v?.totalResourcesCount ||
                                                        0
                                                    }`}
                                                </TableCell>
                                                <TableCell className="w-5 min-w-[20px]">
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
            )}
        </Flex>
    )
}
