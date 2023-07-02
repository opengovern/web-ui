import { Grid } from '@tremor/react'
import dayjs from 'dayjs'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../api/onboard.gen'
import { useInventoryApiV2ServicesSummaryList } from '../../../../api/inventory.gen'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import Spinner from '../../../../components/Spinner'

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
    // const { data: services, isLoading: serviceLodaing } = useTopServices(
    //     provider,
    //     connections
    // )
    // const lowerProvider = provider.toLowerCase()

    return (
        <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
            <span>
                {/* Placeholder to set height */}
                {/* <div className="h-28" /> */}
                <SummaryCard
                    title="Accounts"
                    metric={String(numericDisplay(accounts?.connectionCount))}
                    metricPrev="922"
                    // delta={MockData[0].delta}
                    // deltaType={MockData[0].deltaType}
                    // areaChartData={[{}]}
                    viewMore
                    onClick={() => setActiveSubPage('Accounts')}
                    loading={accountIsLoading}
                />
            </span>
            <span>
                {/* Placeholder to set height */}
                {/* <div className="h-28" /> */}
                <SummaryCard
                    title="Services"
                    metric={String(numericDisplay(services?.totalCount))}
                    metricPrev="149"
                    // delta={MockData[1].delta}
                    // deltaType={MockData[1].deltaType}
                    // areaChartData={[{}]}
                    viewMore
                    onClick={() => setActiveSubPage('Services')}
                    loading={servicesIsLoading}
                />
            </span>
            <span>
                {/* Placeholder to set height */}
                {/* <div className="h-28" /> */}
                <SummaryCard
                    title="Resources"
                    metric={String(
                        numericDisplay(accounts?.totalResourceCount)
                    )}
                    metricPrev="4.34M"
                    // delta={MockData[2].delta}
                    // deltaType={MockData[2].deltaType}
                    // areaChartData={[{}]}
                    viewMore
                    // onClick={() => setActiveSubPage('Resources')}
                    loading={accountIsLoading}
                />
            </span>
        </Grid>
    )
}
