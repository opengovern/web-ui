import React from 'react'
import {
    Button,
    Text,
    Grid,
    SearchSelect,
    SearchSelectItem,
    Title,
} from '@tremor/react'
import { useAtom } from 'jotai/index'
import dayjs from 'dayjs'
import Swiper from '../../../../components/Swiper'
import MetricCard from '../../../../components/Cards/MetricCard'
import { selectedResourceCategoryAtom } from '../../../../store'
import { useInventoryApiV2CostMetricList } from '../../../../api/inventory.gen'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import Spinner from '../../../../components/Spinner'

interface IProps {
    provider: any
    timeRange: any
    connection: any
    categories: {
        label: string
        value: string
    }[]
    pageSize: any
    setActiveSubPage: (subPage: string) => void
}

export default function CostMetrics({
    provider,
    timeRange,
    pageSize,
    categories,
    connection,
    setActiveSubPage,
}: IProps) {
    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )
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
    const { response: metrics, isLoading } =
        useInventoryApiV2CostMetricList(query)
    const percentage = (a?: number, b?: number): number => {
        return a && b ? ((a - b) / b) * 100 : 0
    }

    return (
        <div>
            {/* <div className="h-80" /> */}
            <div className="flex justify-between gap-x-2">
                <div className="flex flex-row justify-start items-start">
                    <Title>Cost metrics </Title>
                    <Button
                        variant="light"
                        className="mt-1 ml-2"
                        onClick={() => setActiveSubPage('Cost Metrics')}
                    >
                        <Text color="blue">(see All)</Text>
                    </Button>
                </div>
                <SearchSelect
                    onValueChange={(e) => setSelectedResourceCategory(e)}
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
            <Grid>
                {isLoading && (
                    <div className="flex items-center justify-center">
                        <Spinner />
                    </div>
                )}
                <Swiper
                    gridContainerProps={{
                        numItemsSm: 2,
                        numItemsMd: 3,
                        className: 'gap-6',
                    }}
                >
                    {!isLoading &&
                        metrics?.metrics?.map((metric) => (
                            <MetricCard
                                title={
                                    metric.cost_dimension_name
                                        ? metric.cost_dimension_name
                                        : String(metric.cost_dimension_name)
                                }
                                metric={`$ ${String(
                                    numericDisplay(
                                        metric.total_cost
                                            ? metric.total_cost
                                            : 0
                                    )
                                )}`}
                                metricPrev={String(
                                    `$ ${numericDisplay(
                                        metric.daily_cost_at_start_time
                                            ? metric.daily_cost_at_start_time
                                            : 0
                                    )}`
                                )}
                                delta={`${Math.abs(
                                    percentage(
                                        metric.daily_cost_at_end_time,
                                        metric.daily_cost_at_start_time
                                    )
                                ).toFixed(2)} %`}
                                deltaType={
                                    percentage(
                                        metric.daily_cost_at_end_time,
                                        metric.daily_cost_at_start_time
                                    ) > 0
                                        ? 'moderateIncrease'
                                        : 'moderateDecrease'
                                }
                            />
                        ))}
                </Swiper>
            </Grid>
        </div>
    )
}
