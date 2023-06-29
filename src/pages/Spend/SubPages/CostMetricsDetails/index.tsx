import {
    Card,
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Text,
    Title,
    BadgeDelta,
    SearchSelectItem,
    SearchSelect,
    Flex,
    DeltaType,
} from '@tremor/react'

import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { selectedResourceCategoryAtom } from '../../../../store'
import { useInventoryApiV2CostMetricList } from '../../../../api/inventory.gen'
import Spinner from '../../../../components/Spinner'
import { numericDisplay } from '../../../../utilities/numericDisplay'

interface IProps {
    provider: any
    timeRange: any
    connection: any
    categories: {
        label: string
        value: string
    }[]
    pageSize: any
}

export default function CostMetricsDetails({
    provider,
    timeRange,
    pageSize,
    categories,
    connection,
}: IProps) {
    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )
    const [tableData, setTableDdata] = useState<any>([])
    const activeCategory =
        selectedResourceCategory === 'All Categories'
            ? ''
            : selectedResourceCategory
    const query = {
        ...(provider && { connector: provider }),
        ...(connection && { connectionId: connection }),
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
        ...(timeRange.from && { startTime: dayjs(timeRange.from).unix() }),
        ...(timeRange.to && { endTime: dayjs(timeRange.to).unix() }),
        ...(pageSize && { pageSize }),
    }
    const { response: metrics } = useInventoryApiV2CostMetricList(query)
    const percentage = (a?: number, b?: number): number => {
        return a && b ? ((a - b) / b) * 100 : 0
    }
    useEffect(() => {
        const newData: {
            metricName: string | undefined
            cost: number | undefined
            from: number | undefined
            changes: number | string | undefined
            deltaType: DeltaType
        }[] = []
        // eslint-disable-next-line array-callback-return
        metrics?.metrics?.map((res) => {
            const percent = percentage(
                res.daily_cost_at_end_time,
                res.daily_cost_at_start_time
            )
            newData.push({
                metricName: res.cost_dimension_name,
                cost: res.total_cost,
                from: res.daily_cost_at_start_time,
                changes: Math.ceil(Math.abs(percent)),
                deltaType:
                    // eslint-disable-next-line no-nested-ternary
                    percent > 0
                        ? 'moderateIncrease'
                        : percent < 0
                        ? 'moderateDecrease'
                        : 'unchanged',
            })
        })
        setTableDdata(newData)
    }, [metrics])
    return (
        <main>
            {/* <Flex justifyContent="between"> */}
            {/*    <TextInput */}
            {/*        icon={MagnifyingGlassIcon} */}
            {/*        placeholder="Search..." */}
            {/*        className="max-w-xs" */}
            {/*        disabled */}
            {/*    /> */}
            {/* </Flex> */}
            <Card className="mt-10">
                <Flex>
                    <Title>Resources Metrics</Title>
                    <div className="flex flex-row">
                        <SearchSelect
                            onValueChange={(e) =>
                                setSelectedResourceCategory(e)
                            }
                            value={selectedResourceCategory}
                            placeholder="Source Selection"
                            className="max-w-xs mb-6"
                        >
                            {categories.map((category) => (
                                <SearchSelectItem
                                    key={category.label}
                                    value={category.value}
                                >
                                    {category.value}
                                </SearchSelectItem>
                            ))}
                        </SearchSelect>
                    </div>
                </Flex>
                {tableData.length > 0 ? (
                    <Table className="mt-5">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>Metric Name</TableHeaderCell>
                                <TableHeaderCell>Cost</TableHeaderCell>
                                <TableHeaderCell>From</TableHeaderCell>
                                <TableHeaderCell>Changes</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((item: any) => (
                                <TableRow key={item.metricName}>
                                    <TableCell>{item.metricName}</TableCell>
                                    <TableCell>
                                        <Text>
                                            {`$ ${numericDisplay(item.cost)}`}
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        <Text>
                                            {`$ ${numericDisplay(item.from)}`}
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        <BadgeDelta
                                            color="emerald"
                                            deltaType="moderateIncrease"
                                        >
                                            {item.changes !== 0
                                                ? `${item.changes} %`
                                                : item.changes}
                                        </BadgeDelta>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex justify-center">
                        <Spinner />
                    </div>
                )}
            </Card>
        </main>
    )
}
