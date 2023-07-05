import {
    BadgeDelta,
    Card,
    DateRangePicker,
    DeltaType,
    Flex,
    SearchSelect,
    SearchSelectItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    Title,
} from '@tremor/react'

import React, { useEffect, useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { ColDef } from 'ag-grid-community'
import {
    filterAtom,
    selectedResourceCategoryAtom,
    timeAtom,
} from '../../../../store'
import {
    useInventoryApiV2ResourcesMetricList,
    useInventoryApiV2ResourcesTagList,
} from '../../../../api/inventory.gen'
import Spinner from '../../../../components/Spinner'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import Breadcrumbs from '../../../../components/Breadcrumbs'

const columns: ColDef[] = [
    {
        field: 'metricName',
        headerName: 'Metric Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'from',
        headerName: 'From',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'Count',
        headerName: 'Count',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'Change',
        headerName: 'Change',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
]
export default function ResourceMetricsDetails() {
    const navigate = useNavigate()

    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )
    const [tableData, setTableData] = useState<any>([])

    const { response: inventoryCategories } =
        useInventoryApiV2ResourcesTagList()

    const activeCategory =
        selectedResourceCategory === 'All Categories'
            ? ''
            : selectedResourceCategory
    const query = {
        ...(selectedConnections.provider && {
            connector: selectedConnections.provider,
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
        ...(activeTimeRange.from && {
            startTime: dayjs(activeTimeRange.from).unix(),
        }),
        ...(activeTimeRange.to && {
            endTime: dayjs(activeTimeRange.to).unix(),
        }),
        pageSize: 1000,
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { response: metrics } = useInventoryApiV2ResourcesMetricList(query)

    const categoryOptions = useMemo(() => {
        if (!inventoryCategories)
            return [{ label: 'no data', value: 'no data' }]
        return [{ label: 'All Categories', value: 'All Categories' }].concat(
            inventoryCategories.category.map((categoryName) => ({
                label: categoryName,
                value: categoryName,
            }))
        )
    }, [inventoryCategories])

    const percentage = (a?: number, b?: number): number => {
        return a && b ? ((a - b) / b) * 100 : 0
    }

    useEffect(() => {
        const newData: {
            metricName: string | undefined
            count: number | undefined
            from: number | undefined
            changes: number | string | undefined
            deltaType: DeltaType
        }[] = []
        // eslint-disable-next-line array-callback-return
        metrics?.resource_types?.map((res) => {
            const percent = percentage(res.count, res.old_count)
            newData.push({
                metricName: res.resource_type,
                count: res.count,
                from: res.old_count,
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
        setTableData(newData)
    }, [metrics])

    const breadcrumbsPages = [
        {
            name: 'Assets',
            path: () => {
                navigate(-1)
            },
            current: false,
        },
        { name: 'Resource metrics', path: '', current: true },
    ]

    return (
        <LoggedInLayout currentPage="assets">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Breadcrumbs pages={breadcrumbsPages} />
                <DateRangePicker
                    className="max-w-md"
                    value={activeTimeRange}
                    onValueChange={setActiveTimeRange}
                    enableClear={false}
                    maxDate={new Date()}
                />
            </Flex>
            <Card className="mt-10">
                <Flex>
                    <Title>Resources Metrics</Title>
                    <SearchSelect
                        onValueChange={(e) => setSelectedResourceCategory(e)}
                        value={selectedResourceCategory}
                        placeholder="Source Selection"
                        className="max-w-xs mb-6"
                    >
                        {categoryOptions.map((category) => (
                            <SearchSelectItem
                                key={category.label}
                                value={category.value}
                            >
                                {category.value}
                            </SearchSelectItem>
                        ))}
                    </SearchSelect>
                </Flex>
                {tableData.length > 0 ? (
                    <Table className="mt-5">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>Metric Name</TableHeaderCell>
                                <TableHeaderCell>From</TableHeaderCell>
                                <TableHeaderCell>Count</TableHeaderCell>
                                <TableHeaderCell>Changes</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((item: any) => (
                                <TableRow key={item.metricName}>
                                    <TableCell>{item.metricName}</TableCell>
                                    <TableCell>
                                        <Text>{numericDisplay(item.from)}</Text>
                                    </TableCell>
                                    <TableCell>
                                        <Text>
                                            {numericDisplay(item.count)}
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        <BadgeDelta
                                            color="emerald"
                                            deltaType={item.deltaType}
                                        >
                                            {`${item.changes} %`}
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
        </LoggedInLayout>
    )
}
