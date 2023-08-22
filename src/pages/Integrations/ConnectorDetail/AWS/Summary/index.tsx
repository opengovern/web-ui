import { Grid } from '@tremor/react'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListCredentialResponse,
} from '../../../../../api/api'
import OnboardCard from '../../../../../components/Cards/OnboardCard'

interface IAWSSummary {
    accountsSummary:
        | GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse
        | undefined
    accountLoading: boolean
    credential:
        | GithubComKaytuIoKaytuEnginePkgOnboardApiListCredentialResponse
        | undefined
    credentialLoading: boolean
}

export default function AWSSummary({
    accountsSummary,
    accountLoading,
    credential,
    credentialLoading,
}: IAWSSummary) {
    return (
        <Grid numItems={3} className="w-full gap-4 mt-6 mb-10">
            <OnboardCard
                title="Active AWS Accounts"
                healthy={
                    (accountsSummary?.totalDiscoveredCount || 0) -
                    (accountsSummary?.totalUnhealthyCount || 0)
                }
                allCount={accountsSummary?.totalDiscoveredCount}
                unhealthy={accountsSummary?.totalUnhealthyCount}
                loading={accountLoading}
            />
            <SummaryCard
                title="AWS Organizations"
                metric={String(
                    numericDisplay(credential?.totalCredentialCount)
                )}
                loading={credentialLoading}
            />
        </Grid>
    )
}
