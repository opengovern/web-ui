import { useAtom } from 'jotai/index'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { selectedResourceCategoryAtom } from '../../../../../store'
import { useInventoryApiV2ResourcesMetricList } from '../../../../../api/inventory.gen'
import {
    exactPriceDisplay,
    numericDisplay,
} from '../../../../../utilities/numericDisplay'
import MetricsList, { IMetric } from '../../../../../components/MetricsList'

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
    const { response: resourceMetricsResponse, isLoading } =
        useInventoryApiV2ResourcesMetricList(query)

    const metrics = () => {
        return (
            resourceMetricsResponse?.resource_types?.map((resourceType) => {
                const v: IMetric = {
                    name:
                        resourceType.resource_name ||
                        resourceType.resource_type ||
                        '',
                    displayedValue: numericDisplay(resourceType.count),
                    newValue: resourceType.count || 0,
                    oldValue: resourceType.old_count || 0,
                    onClick: () => {
                        navigate(
                            `metrics/${encodeURIComponent(
                                resourceType.resource_type || ''
                            )}`
                        )
                    },
                }
                return v
            }) || []
        )
    }

    return (
        <MetricsList
            name="Resource"
            seeMoreUrl="resource-metrics"
            isLoading={isLoading}
            categories={categories}
            selectedCategory={selectedResourceCategory}
            onChangeCategory={setSelectedResourceCategory}
            metrics={metrics()}
        />
    )
}
