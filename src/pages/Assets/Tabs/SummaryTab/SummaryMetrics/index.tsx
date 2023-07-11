import { Grid } from '@tremor/react'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import { useInventoryApiV2ServicesSummaryList } from '../../../../../api/inventory.gen'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import { filterAtom, timeAtom } from '../../../../../store'

export default function SummaryMetrics() {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    const { response: accounts, isLoading: accountIsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: [selectedConnections.provider],
            connectionId: selectedConnections.connections,
            startTime: dayjs(activeTimeRange.from).unix(),
            endTime: dayjs(activeTimeRange.to).unix(),
            pageSize: 10000,
            pageNumber: 1,
        })
    const { response: services, isLoading: servicesIsLoading } =
        useInventoryApiV2ServicesSummaryList({
            connector: [selectedConnections.provider],
            connectionId: selectedConnections.connections,
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
