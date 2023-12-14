import {
    Badge,
    Button,
    Card,
    Flex,
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
import { useComplianceApiV1BenchmarksControlsDetail } from '../../../../../api/compliance.gen'

interface IPolicies {
    id: string | undefined
}

export const renderBadge = (severity: any) => {
    const style = {
        color: '#fff',
        borderRadius: '8px',
        width: '64px',
    }
    if (severity) {
        if (severity === 'none') {
            return (
                <Badge style={{ backgroundColor: '#9BA2AE', ...style }}>
                    None
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
    return ''
}

export default function Policies({ id }: IPolicies) {
    const [open, setOpen] = useState(false)
    const { response: policies, isLoading } =
        useComplianceApiV1BenchmarksControlsDetail(String(id))
    console.log(policies)
    return (
        <Card>
            <Flex className="mb-3">
                <Title className="font-semibold">Confidentiality</Title>
                <Button
                    variant="light"
                    icon={ChevronRightIcon}
                    iconPosition="right"
                    onClick={() => setOpen(true)}
                >
                    {`${(policies?.length || 10) - 10} more`}
                </Button>
            </Flex>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell className="w-32">
                            Control
                        </TableHeaderCell>
                        <TableHeaderCell>Title</TableHeaderCell>
                        <TableHeaderCell className="w-40">
                            Passed resources
                        </TableHeaderCell>
                        <TableHeaderCell className="w-28" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {policies?.map(
                        (p, i) =>
                            i < 10 && (
                                <TableRow key={`${p.control?.id || i}`}>
                                    <TableCell>1.1.</TableCell>
                                    <TableCell>
                                        <Flex
                                            justifyContent="start"
                                            className="gap-8"
                                        >
                                            {renderBadge(p.control?.severity)}
                                            <Text>{p.control?.title}</Text>
                                        </Flex>
                                    </TableCell>
                                    <TableCell>
                                        {`${
                                            (p?.totalResourcesCount || 0) -
                                            (p?.failedResourcesCount || 0)
                                        }/${p?.totalResourcesCount || 0}`}
                                    </TableCell>
                                    <TableCell>
                                        <ChevronRightIcon className="h-5 text-kaytu-500" />
                                    </TableCell>
                                </TableRow>
                            )
                    )}
                </TableBody>
            </Table>
        </Card>
    )
}
