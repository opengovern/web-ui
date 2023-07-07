import { Grid } from '@tremor/react'
import dayjs from 'dayjs'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import { useInventoryApiV2CostMetricList } from '../../../../../api/inventory.gen'
import SummaryCard from '../../../../../components/Cards/SummaryCard'

interface IProps {
    provider: any
    timeRange: any
    connection: any
    pageSize: any
}

export default function SummaryMetrics({
    provider,
    timeRange,
    pageSize,
    connection,
}: IProps) {
    const query = {
        ...(provider && { connector: provider }),
        ...(connection && { connectionId: connection }),
        ...(timeRange.from && { startTime: dayjs(timeRange.from).unix() }),
        ...(timeRange.to && { endTime: dayjs(timeRange.to).unix() }),
        ...(pageSize && { pageSize }),
    }
    const { response: accounts, isLoading: accountsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: provider,
            connectionId: connection,
            startTime: dayjs(timeRange.from).unix(),
            endTime: dayjs(timeRange.to).unix(),
            pageSize: 10000,
            pageNumber: 1,
        })
    const { response: metrics, isLoading: metricLoading } =
        useInventoryApiV2CostMetricList(query)

    return (
        <Grid numItemsMd={2} numItemsLg={3} className="gap-3 mt-6 mb-10">
            <SummaryCard
                title="Accounts Total Cost"
                metric={`$ ${accounts?.totalCost?.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                })}`}
                loading={accountsLoading}
            />
            <SummaryCard
                title="Services"
                metric={String(metrics?.total_count?.toLocaleString('en-US'))}
                loading={metricLoading}
            />
        </Grid>
    )
}
