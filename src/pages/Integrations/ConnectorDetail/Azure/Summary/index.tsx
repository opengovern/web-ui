import { Grid } from '@tremor/react'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import {
    numberDisplay,
    numericDisplay,
} from '../../../../../utilities/numericDisplay'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListCredentialResponse,
} from '../../../../../api/api'
import DualSummaryCard from '../../../../../components/Cards/DualSummaryCard'

interface IAzureSummary {
    principalsSummary:
        | GithubComKaytuIoKaytuEnginePkgOnboardApiListCredentialResponse
        | undefined
    principalsLoading: boolean
    subscriptionsSummary:
        | GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse
        | undefined
    subscriptionsLoading: boolean
}

export default function AzureSummary({
    principalsSummary,
    principalsLoading,
    subscriptionsSummary,
    subscriptionsLoading,
}: IAzureSummary) {
    return (
        <Grid numItemsMd={2} numItemsLg={3} className="w-full gap-4 mt-6 mb-10">
            <SummaryCard
                title="Onboarded Azure Subscriptions"
                metric={String(
                    numericDisplay(subscriptionsSummary?.connectionCount)
                )}
                loading={subscriptionsLoading}
            />
            <SummaryCard
                title="Service Principals"
                metric={String(
                    numericDisplay(principalsSummary?.totalCredentialCount)
                )}
                loading={principalsLoading}
            />
            <DualSummaryCard
                title1="Healthy Connections"
                title2="Unhealthy Connections"
                metric1={numberDisplay(
                    (subscriptionsSummary?.connectionCount || 0) -
                        (subscriptionsSummary?.totalUnhealthyCount || 0),
                    0
                )}
                metric2={numberDisplay(
                    subscriptionsSummary?.totalUnhealthyCount,
                    0
                )}
                loading={subscriptionsLoading}
            />
        </Grid>
    )
}
