import { Grid } from '@tremor/react'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListCredentialResponse,
} from '../../../../../api/api'

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
        <Grid numItemsMd={2} numItemsLg={3} className="w-full gap-3 mt-6 mb-10">
            <SummaryCard
                title="Onboarded AWS Accounts"
                metric={String(
                    numericDisplay(accountsSummary?.connectionCount)
                )}
                loading={accountLoading}
            />
            <SummaryCard
                title="Unhealthy Accounts"
                metric={String(
                    numericDisplay(accountsSummary?.totalUnhealthyCount)
                )}
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
