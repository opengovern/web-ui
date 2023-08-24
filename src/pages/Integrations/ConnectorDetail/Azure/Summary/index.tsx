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
import OnboardCard from '../../../../../components/Cards/OnboardCard'

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
        <Grid numItems={3} className="w-full gap-4 mt-6 mb-10">
            <OnboardCard
                title="Active supscriptions"
                healthy={
                    (subscriptionsSummary?.totalDiscoveredCount || 0) -
                    (subscriptionsSummary?.totalUnhealthyCount || 0)
                }
                unhealthy={subscriptionsSummary?.totalUnhealthyCount}
                loading={subscriptionsLoading}
                allCount={subscriptionsSummary?.totalDiscoveredCount}
            />
            <SummaryCard
                title="Service Principals"
                metric={String(
                    numericDisplay(principalsSummary?.totalCredentialCount)
                )}
                loading={principalsLoading}
            />
            <SummaryCard
                title="Billing Accounts"
                metric={`$${numberDisplay(subscriptionsSummary?.totalCost, 0)}`}
                loading={principalsLoading}
            />
        </Grid>
    )
}
