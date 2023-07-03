import {
    Button,
    Flex,
    SearchSelect,
    SearchSelectItem,
    Text,
    Title,
} from '@tremor/react'
import { useAtom } from 'jotai/index'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import Swiper from '../../../../../components/Swiper'
import MetricCard from '../../../../../components/Cards/MetricCard'
import { selectedResourceCategoryAtom } from '../../../../../store'
import { useInventoryApiV2ResourcesMetricList } from '../../../../../api/inventory.gen'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import Spinner from '../../../../../components/Spinner'

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

export default function ResourceMetrics({
    provider,
    timeRange,
    pageSize,
    categories,
    connection,
}: IProps) {
    const navigate = useNavigate()

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
        useInventoryApiV2ResourcesMetricList(query)
    const percentage = (a?: number, b?: number): number => {
        return a && b ? ((a - b) / b) * 100 : 0
    }

    const deltaType = (delta: number) => {
        if (delta > 0) {
            return 'moderateIncrease'
        }
        if (delta < 0) {
            return 'moderateDecrease'
        }
        return 'unchanged'
    }

    return (
        <div>
            <Flex className="gap-x-2 mb-6">
                <Flex flexDirection="row" justifyContent="start">
                    <Title>Resource metrics </Title>
                    <Button
                        variant="light"
                        className="ml-2"
                        onClick={() => navigate('resource-metrics')}
                    >
                        <Text color="blue">(See all)</Text>
                    </Button>
                </Flex>
                <SearchSelect
                    onValueChange={(e) => setSelectedResourceCategory(e)}
                    value={selectedResourceCategory}
                    placeholder="Source Selection"
                    className="max-w-xs"
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
            </Flex>
            {isLoading ? (
                <div className="flex items-center justify-center mt-48">
                    <Spinner />
                </div>
            ) : (
                <Swiper
                    gridContainerProps={{
                        numItemsSm: 2,
                        numItemsMd: 3,
                        className: 'gap-3',
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
                            ).toFixed(2)}`}
                            deltaType={deltaType(
                                percentage(metric.count, metric.old_count)
                            )}
                        />
                    ))}
                </Swiper>
            )}
        </div>
    )
}
