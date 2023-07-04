import { Grid } from '@tremor/react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import { useInventoryApiV2ServicesSummaryList } from '../../../../../api/inventory.gen'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../../utilities/numericDisplay'

interface IProps {
    provider: any
    connections: any
    timeRange: any
}

export default function SummaryMetrics({
    provider,
    connections,
    timeRange,
}: IProps) {
    const { response: accounts, isLoading: accountIsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: provider,
            connectionId: connections,
            startTime: dayjs(timeRange.from).unix(),
            endTime: dayjs(timeRange.to).unix(),
            pageSize: 10000,
            pageNumber: 1,
        })
    const { response: services, isLoading: servicesIsLoading } =
        useInventoryApiV2ServicesSummaryList({
            connector: provider,
            connectionId: connections,
        })

    return (
        <Grid numItemsMd={2} numItemsLg={3} className="gap-3 mt-6 mb-10">
            <SummaryCard
                title="Accounts"
                metric={String(numericDisplay(accounts?.connectionCount))}
                url="accounts-detail"
                loading={accountIsLoading}
            />
            <SummaryCard
                title="Services"
                metric={String(numericDisplay(services?.totalCount))}
                url="services-detail"
                loading={servicesIsLoading}
            />
            <SummaryCard
                title="Resources"
                metric={String(numericDisplay(accounts?.totalResourceCount))}
                loading={accountIsLoading}
            />
        </Grid>
    )
}
