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
import { useNavigate } from 'react-router-dom'
import Swiper from '../../../../components/Swiper'
import MetricCard from '../../../../components/Cards/MetricCard'
import { selectedResourceCategoryAtom } from '../../../../store'
import { useInventoryApiV2ResourcesMetricList } from '../../../../api/inventory.gen'
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
    setActiveSubPage: (subPage: string) => void
}

export default function ResourceMetrics({
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
    const { response: metrics } = useInventoryApiV2ResourcesMetricList(query)
    const percentage = (a?: number, b?: number): number => {
        return a && b ? ((a - b) / b) * 100 : 0
    }

    return (
        <div>
            {/* <div className="h-80" /> */}
            <div className="flex justify-between gap-x-2">
                <div className="flex flex-row justify-start items-start">
                    <Title>Resource metrics </Title>
                    <Button
                        variant="light"
                        className="mt-1 ml-2"
                        onClick={() => setActiveSubPage('Resource Metrics')}
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
                <Swiper
                    gridContainerProps={{
                        numItemsSm: 2,
                        numItemsMd: 3,
                        className: 'gap-6',
                    }}
                >
                    {metrics?.resource_types?.map((metric) => (
                        <MetricCard
                            title={
                                metric.resource_name
                                    ? metric.resource_name
                                    : String(metric.resource_type)
                            }
                            metric={String(
                                numericDisplay(metric.count ? metric.count : 0)
                            )}
                            metricPrev={String(
                                numericDisplay(
                                    metric.old_count ? metric.old_count : 0
                                )
                            )}
                            delta={`${Math.abs(
                                percentage(metric.count, metric.old_count)
                            ).toFixed(2)} %`}
                            deltaType={
                                percentage(metric.count, metric.old_count) > 0
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
