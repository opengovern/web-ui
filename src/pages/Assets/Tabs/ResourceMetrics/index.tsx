import { useAtom, useAtomValue } from 'jotai'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import {
    filterAtom,
    selectedResourceCategoryAtom,
    timeAtom,
} from '../../../../store'
import {
    useInventoryApiV2AnalyticsMetricList,
    useInventoryApiV2ResourcesMetricList,
} from '../../../../api/inventory.gen'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import MetricsList, { IMetric } from '../../../../components/MetricsList'
import { isDemo } from '../../../../utilities/demo'

interface IProps {
    categories: {
        label: string
        value: string
    }[]
    pageSize: number
}

export default function ResourceMetrics({ pageSize, categories }: IProps) {
    const navigate = useNavigate()
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )
    const activeCategory =
        selectedResourceCategory === 'All Categories'
            ? ''
            : selectedResourceCategory
    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix().toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix().toString(),
        }),
        ...(pageSize && { pageSize }),
    }
    const { response: resourceMetricsResponse, isLoading } =
        useInventoryApiV2AnalyticsMetricList(query, {
            ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
        })

    const metrics = () => {
        return (
            resourceMetricsResponse?.metrics?.map((metric) => {
                const v: IMetric = {
                    name: metric.name || '',
                    displayedValue: numericDisplay(metric.count),
                    newValue: metric.count || 0,
                    oldValue: metric.old_count || 0,
                    onClick: () => {
                        navigate(
                            `metrics/${encodeURIComponent(metric.name || '')}`
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
            isSameDay={
                activeTimeRange.start.toString() ===
                activeTimeRange.end.toString()
            }
        />
    )
}
