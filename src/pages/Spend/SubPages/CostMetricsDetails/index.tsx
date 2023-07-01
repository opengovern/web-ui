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
    TabGroup,
    TabList,
    Tab,
} from '@tremor/react'

import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { selectedResourceCategoryAtom } from '../../../../store'
import { useInventoryApiV2CostMetricList } from '../../../../api/inventory.gen'
import Spinner from '../../../../components/Spinner'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../api/onboard.gen'

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
    const [accTableData, setAccTableDdata] = useState<any>([])
    const [selectedIndex, setSelectedIndex] = useState(0)
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
    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: provider,
            connectionId: connection,
            startTime: timeRange[0],
            endTime: timeRange[1],
            pageSize: 10000,
            pageNumber: 1,
        })
    const percentage = (a?: number, b?: number): number => {
        return a && b ? ((a - b) / b) * 100 : 0
    }
    useEffect(() => {
        const newData: {
            metricName: string | undefined
            aggregatedCost: number | undefined
            from: number | undefined
            now: number | undefined
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
                aggregatedCost: res.total_cost,
                from: res.daily_cost_at_start_time,
                now: res.daily_cost_at_end_time,
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
    useEffect(() => {
        const newData: {
            metricName: string | undefined
            aggregatedCost: number | undefined
            from: number | undefined
            now: number | undefined
            changes: number | string | undefined
            deltaType: DeltaType
        }[] = []
        // eslint-disable-next-line array-callback-return
        accounts?.connections?.map((res) => {
            const percent = percentage(
                res.dailyCostAtEndTime,
                res.dailyCostAtStartTime
            )
            newData.push({
                metricName: res.credentialName,
                aggregatedCost: res.cost,
                from: res.dailyCostAtStartTime ? res.dailyCostAtStartTime : 0,
                now: res.dailyCostAtEndTime ? res.dailyCostAtEndTime : 0,
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
        setAccTableDdata(newData)
        console.log('accounts', newData)
    }, [accounts])

    const renderTable = (type: string | 'Service' | 'Account') => {
        return (
            <Table className="mt-5">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>{type} Name</TableHeaderCell>
                        <TableHeaderCell>Aggregated Cost</TableHeaderCell>
                        <TableHeaderCell>
                            Beginning selected date
                        </TableHeaderCell>
                        <TableHeaderCell>End selected date</TableHeaderCell>
                        <TableHeaderCell>Changes</TableHeaderCell>
                    </TableRow>
                </TableHead>
                {type === 'Service' ? (
                    <TableBody>
                        {tableData.map(
                            (item: {
                                metricName:
                                    | boolean
                                    | React.Key
                                    | React.ReactElement<
                                          any,
                                          | string
                                          | React.JSXElementConstructor<any>
                                      >
                                    | Iterable<React.ReactNode>
                                    | null
                                    | undefined
                                aggregatedCost: string | number | undefined
                                from: string | number | undefined
                                now: string | number | undefined
                                deltaType: DeltaType
                                changes:
                                    | string
                                    | number
                                    | boolean
                                    | React.ReactElement<
                                          any,
                                          | string
                                          | React.JSXElementConstructor<any>
                                      >
                                    | Iterable<React.ReactNode>
                                    | null
                                    | undefined
                            }) => (
                                <TableRow>
                                    <TableCell>{item.metricName}</TableCell>
                                    <TableCell>
                                        <Text>
                                            {`$ ${numericDisplay(
                                                item.aggregatedCost
                                            )}`}
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        <Text>{`$ ${numericDisplay(
                                            item.from
                                        )}`}</Text>
                                    </TableCell>
                                    <TableCell>
                                        <Text>{`$ ${numericDisplay(
                                            item.now
                                        )}`}</Text>
                                    </TableCell>
                                    <TableCell>
                                        <BadgeDelta deltaType={item.deltaType}>
                                            {item.changes !== 0
                                                ? `${item.changes} %`
                                                : item.changes}
                                        </BadgeDelta>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                ) : (
                    <TableBody>
                        {accTableData.map(
                            (item: {
                                metricName:
                                    | boolean
                                    | React.Key
                                    | React.ReactElement<
                                          any,
                                          | string
                                          | React.JSXElementConstructor<any>
                                      >
                                    | Iterable<React.ReactNode>
                                    | null
                                    | undefined
                                aggregatedCost: string | number | undefined
                                from: string | number | undefined
                                now: string | number | undefined
                                deltaType: DeltaType
                                changes:
                                    | string
                                    | number
                                    | boolean
                                    | React.ReactElement<
                                          any,
                                          | string
                                          | React.JSXElementConstructor<any>
                                      >
                                    | Iterable<React.ReactNode>
                                    | null
                                    | undefined
                            }) => (
                                <TableRow>
                                    <TableCell>{item.metricName}</TableCell>
                                    <TableCell>
                                        <Text>
                                            {item.aggregatedCost
                                                ? `$ ${numericDisplay(
                                                      item.aggregatedCost
                                                  )}`
                                                : 'N/A'}
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        <Text>
                                            {item.from
                                                ? `$ ${numericDisplay(
                                                      item.from
                                                  )}`
                                                : 'N/A'}
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        <Text>
                                            {item.now
                                                ? `$ ${numericDisplay(
                                                      item.now
                                                  )}`
                                                : 'N/A'}
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        <BadgeDelta deltaType={item.deltaType}>
                                            {item.changes !== 0
                                                ? `${item.changes} %`
                                                : item.changes}
                                        </BadgeDelta>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                )}
            </Table>
        )
    }

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
                        <span className="ml-5">
                            <TabGroup
                                index={selectedIndex}
                                onIndexChange={setSelectedIndex}
                            >
                                <TabList variant="solid">
                                    <Tab>Services</Tab>
                                    <Tab>Accounts</Tab>
                                </TabList>
                            </TabGroup>
                        </span>
                    </div>
                </Flex>
                {/* eslint-disable-next-line no-nested-ternary */}
                {selectedIndex === 0 ? (
                    tableData.length > 0 ? (
                        renderTable('Service')
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <Spinner />
                            <Text className="mt-5">
                                It might take some time
                            </Text>
                        </div>
                    )
                ) : accTableData.length > 0 && selectedIndex === 1 ? (
                    renderTable('Account')
                ) : (
                    <div className="flex flex-col justify-center items-center">
                        <Spinner />
                        <Text className="mt-5">It might take some time</Text>
                    </div>
                )}
            </Card>
        </main>
    )
}
