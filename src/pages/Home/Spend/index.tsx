import { Card, Flex, Icon, Title } from '@tremor/react'
import { BanknotesIcon } from '@heroicons/react/24/outline'
import { useAtomValue } from 'jotai/index'
import { SpendChartMetric } from '../../../components/Spend/Chart/Metric'
import { filterAtom, spendTimeAtom } from '../../../store'
import {
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../../api/inventory.gen'
import { toErrorMessage } from '../../../types/apierror'
import SummaryCard from '../../../components/Cards/SummaryCard'

export default function Spend() {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const query: {
        pageSize: number
        pageNumber: number
        sortBy: 'cost' | undefined
        endTime: number
        startTime: number
        connectionId: string[]
        connector?: ('AWS' | 'Azure')[] | undefined
    } = {
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
        pageSize: 5,
        pageNumber: 1,
        sortBy: 'cost',
    }
    const duration = activeTimeRange.end.diff(activeTimeRange.start, 'second')
    const prevTimeRange = {
        start: activeTimeRange.start.add(-duration, 'second'),
        end: activeTimeRange.end.add(-duration, 'second'),
    }
    const prevQuery = {
        ...query,
        ...(activeTimeRange.start && {
            startTime: prevTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: prevTimeRange.end.unix(),
        }),
    }

    const {
        response: costTrend,
        isLoading: costTrendLoading,
        error: costTrendError,
        sendNow: costTrendRefresh,
    } = useInventoryApiV2AnalyticsSpendTrendList({
        ...query,
        granularity: 'daily',
    })
    const {
        response: serviceCostResponse,
        isLoading: serviceCostLoading,
        error: serviceCostErr,
        sendNow: serviceCostRefresh,
    } = useInventoryApiV2AnalyticsSpendMetricList(query)
    const {
        response: servicePrevCostResponse,
        isLoading: servicePrevCostLoading,
        error: servicePrevCostErr,
        sendNow: serviceCostPrevRefresh,
    } = useInventoryApiV2AnalyticsSpendMetricList(prevQuery)

    return (
        <Card className="h-full">
            <Flex justifyContent="start" className="mb-2">
                <Icon
                    icon={BanknotesIcon}
                    className="bg-gray-50 rounded mr-2"
                />
                <Title>Spend</Title>
            </Flex>
            <SummaryCard
                title="Total spend"
                metric={serviceCostResponse?.total_cost || 0}
                metricPrev={servicePrevCostResponse?.total_cost || 0}
                loading={
                    costTrendLoading ||
                    serviceCostLoading ||
                    servicePrevCostLoading
                }
                error={toErrorMessage(
                    costTrendError,
                    serviceCostErr,
                    servicePrevCostErr
                )}
                isPrice
                border={false}
            />
        </Card>
    )
}
