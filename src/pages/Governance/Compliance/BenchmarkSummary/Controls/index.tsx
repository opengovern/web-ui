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
import { useNavigate } from 'react-router-dom'
import { useComplianceApiV1BenchmarksControlsDetail } from '../../../../../api/compliance.gen'
import ControlList from './ControlList'

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

export default function Controls({ id }: IPolicies) {
    const [open, setOpen] = useState(false)
    const { response: controls, isLoading } =
        useComplianceApiV1BenchmarksControlsDetail(String(id))
    const navigate = useNavigate()
    console.log(controls)

    return (
        <Card className="max-w-full">
            <Flex className="mb-3">
                <Flex justifyContent="start" className="gap-2">
                    <Title className="font-semibold">Confidentiality</Title>
                    <Text>{`${controls?.filter((c) => c.passed).length}/${
                        controls?.length
                    } passed rules`}</Text>
                </Flex>
                <Button
                    variant="light"
                    icon={ChevronRightIcon}
                    iconPosition="right"
                    onClick={() => setOpen(true)}
                >
                    {`${(controls?.length || 10) - 10} more`}
                </Button>
            </Flex>
            <Table className="max-w-full">
                <TableHead className="max-w-full">
                    <TableRow className="max-w-full">
                        <TableHeaderCell className="w-24">
                            Control
                        </TableHeaderCell>
                        <TableHeaderCell>Title</TableHeaderCell>
                        <TableHeaderCell className="w-40">
                            Passed resources
                        </TableHeaderCell>
                        <TableHeaderCell className="w-5" />
                    </TableRow>
                </TableHead>
                <TableBody className="max-w-full">
                    {controls?.map(
                        (p, i) =>
                            i < 10 && (
                                <TableRow
                                    className="max-w-full cursor-pointer hover:bg-kaytu-50"
                                    key={`${p.control?.id || i}`}
                                    onClick={() =>
                                        navigate(String(p.control?.id))
                                    }
                                >
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>
                                        <Flex
                                            justifyContent="start"
                                            className="gap-4"
                                        >
                                            {severityBadge(p.control?.severity)}
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
            <ControlList
                controls={controls}
                open={open}
                onClose={() => setOpen(false)}
                isLoading={isLoading}
            />
        </Card>
    )
}
