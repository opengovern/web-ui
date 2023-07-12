import { Grid } from '@tremor/react'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListCredentialResponse,
} from '../../../../../api/api'

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
        <Grid numItemsMd={2} numItemsLg={3} className="w-full gap-3 mt-6 mb-10">
            <SummaryCard
                title="Onboarded Azure Subscriptions"
                metric={String(
                    numericDisplay(subscriptionsSummary?.connectionCount)
                )}
                loading={subscriptionsLoading}
            />
            <SummaryCard
                title="Unhealthy Connections"
                metric={String(
                    numericDisplay(subscriptionsSummary?.totalUnhealthyCount)
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
        </Grid>
    )
}
