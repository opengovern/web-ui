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
        <Grid numItems={2} numItemsLg={4} className="w-full gap-4 mt-6 mb-10">
            <SummaryCard
                title="Onboarded AWS Accounts"
                metric={String(
                    numericDisplay(accountsSummary?.connectionCount)
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
            <SummaryCard
                title="Healthy Connections"
                metric={numberDisplay(
                    (accountsSummary?.connectionCount || 0) -
                        (accountsSummary?.totalUnhealthyCount || 0),
                    0
                )}
                loading={accountLoading}
            />
            <SummaryCard
                title="Unhealthy Connections"
                metric={numberDisplay(accountsSummary?.totalUnhealthyCount, 0)}
                loading={accountLoading}
            />
        </Grid>
    )
}
