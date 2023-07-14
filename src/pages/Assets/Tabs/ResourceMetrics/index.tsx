import { useAtom, useAtomValue } from 'jotai/index'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import {
    filterAtom,
    selectedResourceCategoryAtom,
    timeAtom,
} from '../../../../store'
import { useInventoryApiV2ResourcesMetricList } from '../../../../api/inventory.gen'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import MetricsList, { IMetric } from '../../../../components/MetricsList'

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
            startTime: dayjs(activeTimeRange.start.toString())
                .unix()
                .toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: dayjs(activeTimeRange.end.toString()).unix().toString(),
        }),
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
            isSameDay={
                activeTimeRange.start.toString() ===
                activeTimeRange.end.toString()
            }
        />
    )
}
