import { useAtom, useAtomValue } from 'jotai'
import { useNavigate } from 'react-router-dom'
import {
    filterAtom,
    selectedResourceCategoryAtom,
    timeAtom,
} from '../../../../store'
import { useInventoryApiV2AnalyticsMetricList } from '../../../../api/inventory.gen'
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

const resourceMetricsResponse2 = [
    {
        id: 'elastic_compute_cloud',
        finderQuery: '',
        connectors: ['AWS'],
        name: 'Elastic Compute Cloud (EC2)',
        tags: {
            category: ['Compute'],
        },
        count: 142518,
        old_count: 121274,
    },
    {
        id: 'config',
        finderQuery: '',
        connectors: ['AWS'],
        name: 'Config',
        tags: {
            category: ['Governance'],
        },
        count: 51286,
        old_count: 41286,
    },
    {
        id: 'virtual_machines',
        finderQuery: '',
        connectors: ['Azure'],
        name: 'Virtual Machines',
        tags: {
            category: ['Compute'],
        },
        count: 39175,
        old_count: 49275,
    },
    {
        id: 'storage_account',
        finderQuery: '',
        connectors: ['Azure'],
        name: 'Storage Account',
        tags: {
            category: ['Storage'],
        },
        count: 48689,
        old_count: 47699,
    },
    {
        id: 'cloud_watch',
        finderQuery: '',
        connectors: ['AWS'],
        name: 'CloudWatch',
        tags: {
            category: ['Monitoring'],
        },
        count: 69420,
        old_count: 42069,
    },
    {
        id: 'lambda',
        finderQuery: '',
        connectors: ['AWS'],
        name: 'Lambda',
        tags: {
            category: ['Serverless'],
        },
        count: 11490,
        old_count: 31490,
    },
    {
        id: 'cloud_formation',
        finderQuery: '',
        connectors: ['AWS'],
        name: 'CloudFormation',
        tags: {
            category: ['DevOps'],
        },
        count: 22547,
        old_count: 11547,
    },
    {
        id: 'iam',
        finderQuery: '',
        connectors: ['AWS'],
        name: 'IAM',
        tags: {
            category: ['Security'],
        },
        count: 11400,
        old_count: 11000,
    },
    {
        id: 'simple_storage_service',
        finderQuery: '',
        connectors: ['AWS'],
        name: 'Simple Storage Service (S3)',
        tags: {
            category: ['Storage'],
        },
        count: 9035,
        old_count: 8635,
    },
    {
        id: 'simple_queue_service',
        finderQuery: '',
        connectors: ['AWS'],
        name: 'Simple Queue Service (SQS)',
        tags: {
            category: ['Application Integration'],
        },
        count: 6429,
        old_count: 6249,
    },
    {
        id: 'access_keys',
        finderQuery: '',
        connectors: ['AWS'],
        name: 'Access Keys',
        tags: {
            category: ['Security'],
        },
        count: 6921,
        old_count: 5921,
    },
    {
        id: 'certificate_manager',
        finderQuery: '',
        connectors: ['AWS'],
        name: 'Certificate Manager (ACM)',
        tags: {
            category: ['Security'],
        },
        count: 7504,
        old_count: 4504,
    },
]

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
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
        ...(pageSize && { pageSize }),
    }
    const {
        response: resourceMetricsResponse,
        isLoading,
        error,
        sendNow,
    } = useInventoryApiV2AnalyticsMetricList(query, {
        ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
    })

    const metrics = () => {
        return isDemo()
            ? resourceMetricsResponse2.map((metric) => {
                  const v: IMetric = {
                      name: metric.name || '',
                      displayedValue: numericDisplay(metric.count),
                      newValue: metric.count || 0,
                      oldValue: metric.old_count || 0,
                      onClick: () => {
                          navigate(
                              `./../finder?q=${encodeURIComponent(
                                  metric.finderQuery || ''
                              )}`
                          )
                      },
                  }
                  return v
              })
            : resourceMetricsResponse?.metrics?.map((metric) => {
                  const v: IMetric = {
                      name: metric.name || '',
                      displayedValue: numericDisplay(metric.count),
                      newValue: metric.count || 0,
                      oldValue: metric.old_count || 0,
                      onClick: () => {
                          navigate(
                              `./../finder?q=${encodeURIComponent(
                                  metric.finderQuery || ''
                              )}`
                          )
                      },
                  }
                  return v
              }) || []
    }

    return (
        <MetricsList
            name="Resource"
            seeMoreUrl="resource-metrics"
            isLoading={isDemo() ? false : isLoading}
            categories={
                categories.length > 0
                    ? [
                          { label: 'All Categories', value: 'All Categories' },
                      ].concat(categories)
                    : categories
            }
            error={error}
            selectedCategory={selectedResourceCategory}
            onChangeCategory={setSelectedResourceCategory}
            metrics={metrics()}
            isSameDay={
                activeTimeRange.start.toString() ===
                activeTimeRange.end.toString()
            }
            sendNow={sendNow}
        />
    )
}
