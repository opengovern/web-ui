import {Grid} from '@tremor/react'
import dayjs from 'dayjs'
import {useOnboardApiV1ConnectionsSummaryList} from '../../../api/onboard.gen'
import {useInventoryApiV2ServicesSummaryList} from '../../../api/inventory.gen'
import SummaryCard from '../../../components/Cards/KPICards/SummaryCard'
import {numericDisplay} from '../../../utilities/numericDisplay'

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

    const { response: accounts } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: provider,
            connectionId: connections,
            startTime: dayjs(timeRange['from']).unix(),
            endTime: dayjs(timeRange['to']).unix(),
            pageSize: 10000,
            pageNumber: 1,
        })
    const { response: services } = useInventoryApiV2ServicesSummaryList({
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
                    title={'Accounts'}
                    metric={String(numericDisplay(accounts?.connectionCount))}
                    // metricPrev={MockData[0].metricPrev}
                    // delta={MockData[0].delta}
                    // deltaType={MockData[0].deltaType}
                    // areaChartData={[{}]}
                />
            </span>
            <span>
                {/* Placeholder to set height */}
                {/* <div className="h-28" /> */}
                <SummaryCard
                    title={"Services"}
                    metric={String(numericDisplay(services?.totalCount))}
                    // metricPrev={MockData[1].metricPrev}
                    // delta={MockData[1].delta}
                    // deltaType={MockData[1].deltaType}
                    // areaChartData={[{}]}
                />
            </span>
            <span>
                {/* Placeholder to set height */}
                {/* <div className="h-28" /> */}
                <SummaryCard
                    title={"Resources"}
                    metric={String(numericDisplay(accounts?.TotalResourceCount))}
                    // metricPrev={MockData[2].metricPrev}
                    // delta={MockData[2].delta}
                    // deltaType={MockData[2].deltaType}
                    // areaChartData={[{}]}
                />
            </span>
        </Grid>
    )
}