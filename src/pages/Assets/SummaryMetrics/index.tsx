import { Grid } from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../api/onboard.gen'
import { useInventoryApiV2AnalyticsMetricList } from '../../../api/inventory.gen'
import SummaryCard from '../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../utilities/numericDisplay'
import { filterAtom, timeAtom } from '../../../store'
import { isDemo } from '../../../utilities/demo'

export default function SummaryMetrics() {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const { response: accounts, isLoading: accountIsLoading } =
        useOnboardApiV1ConnectionsSummaryList(
            {
                ...(selectedConnections.provider !== '' && {
                    connector: [selectedConnections.provider],
                }),
                connectionId: selectedConnections.connections,
                startTime: activeTimeRange.start.unix(),
                endTime: activeTimeRange.end.unix(),
                pageSize: 0,
                pageNumber: 1,
            },
            {
                ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
            }
        )
    const { response: services, isLoading: servicesIsLoading } =
        useInventoryApiV2AnalyticsMetricList(
            {
                connector: [
                    selectedConnections.provider !== ''
                        ? selectedConnections.provider
                        : '',
                ],
                connectionId: selectedConnections.connections,
            },
            {
                ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
            }
        )

    return (
        <Grid numItemsMd={2} numItemsLg={3} className="gap-4 mt-6 mb-10">
            <SummaryCard
                title="Accounts"
                metric={
                    isDemo()
                        ? String(numericDisplay(141420))
                        : String(numericDisplay(accounts?.connectionCount))
                }
                url="accounts-detail"
                loading={isDemo() ? false : accountIsLoading}
            />
            <SummaryCard
                title="Services"
                metric={
                    isDemo()
                        ? String(numericDisplay(96))
                        : String(numericDisplay(services?.total_metrics))
                }
                url="services-detail"
                loading={isDemo() ? false : servicesIsLoading}
            />
            <SummaryCard
                title="Resources"
                metric={
                    isDemo()
                        ? String(numericDisplay(3926020))
                        : String(numericDisplay(accounts?.totalResourceCount))
                }
                loading={isDemo() ? false : accountIsLoading}
            />
        </Grid>
    )
}
