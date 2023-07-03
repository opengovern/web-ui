import { Grid } from '@tremor/react'
import dayjs from 'dayjs'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import { useInventoryApiV2ServicesSummaryList } from '../../../../../api/inventory.gen'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../../utilities/numericDisplay'

interface IProps {
    provider: any
    connections: any
    timeRange: any
    setActiveSubPage: (subPage: string) => void
}

export default function SummaryMetrics({
    provider,
    connections,
    timeRange,
    setActiveSubPage,
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
                metricPrev="922"
                onClick={() => setActiveSubPage('Accounts')}
                loading={accountIsLoading}
            />
            <SummaryCard
                title="Services"
                metric={String(numericDisplay(services?.totalCount))}
                metricPrev="149"
                onClick={() => setActiveSubPage('Services')}
                loading={servicesIsLoading}
            />
            <SummaryCard
                title="Resources"
                metric={String(numericDisplay(accounts?.totalResourceCount))}
                metricPrev="4.34M"
                loading={accountIsLoading}
            />
        </Grid>
    )
}
