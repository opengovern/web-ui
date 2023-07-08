import { Grid } from '@tremor/react'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../../utilities/numericDisplay'

interface IAzureSummary {
    principals: any
    principalsLoading: boolean
    subscriptions: any
    subscriptionsLoading: boolean
}

export default function AzureSummary({
    principals,
    principalsLoading,
    subscriptions,
    subscriptionsLoading,
}: IAzureSummary) {
    return (
        <Grid numItemsMd={2} numItemsLg={3} className="w-full gap-3 mt-6 mb-10">
            <SummaryCard
                title="Onboarded Azure Subscriptions"
                metric={String(numericDisplay(subscriptions?.connectionCount))}
                loading={subscriptionsLoading}
            />
            <SummaryCard
                title="Unhealthy Connections"
                metric={String(
                    numericDisplay(subscriptions?.totalUnhealthyCount)
                )}
                loading={subscriptionsLoading}
            />
            <SummaryCard
                title="Service Principals"
                metric={String(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    numericDisplay(principals?.totalCredentialCount)
                )}
                loading={principalsLoading}
            />
        </Grid>
    )
}
