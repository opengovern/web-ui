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
import { isDemo } from '../../../../../utilities/demo'

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

const MockData = {
    discoveredAWSAccounts: 10,
    onBoarded: 10,
    org: 1,
    healthy: 9,
    unhealthy: 1,
}

export default function AWSSummary({
    accountsSummary,
    accountLoading,
    credential,
    credentialLoading,
}: IAWSSummary) {
    return (
        <Grid
            numItems={2}
            numItemsMd={3}
            numItemsLg={5}
            className="w-full gap-4 mt-6 mb-10"
        >
            <SummaryCard
                title="Discovered AWS Accounts"
                metric={String(
                    numericDisplay(
                        isDemo()
                            ? MockData.discoveredAWSAccounts
                            : accountsSummary?.connectionCount
                    )
                )}
                loading={accountLoading}
            />
            <SummaryCard
                title="Onboarded AWS Accounts"
                metric={String(
                    numericDisplay(
                        isDemo()
                            ? MockData.onBoarded
                            : accountsSummary?.connectionCount
                    )
                )}
                loading={accountLoading}
            />
            <SummaryCard
                title="AWS Organizations"
                metric={String(
                    numericDisplay(
                        isDemo()
                            ? MockData.org
                            : credential?.totalCredentialCount
                    )
                )}
                loading={credentialLoading}
            />
            <SummaryCard
                title="Healthy Connections"
                metric={numberDisplay(
                    isDemo()
                        ? MockData.healthy
                        : (accountsSummary?.connectionCount || 0) -
                              (accountsSummary?.totalUnhealthyCount || 0),
                    0
                )}
                loading={accountLoading}
            />
            <SummaryCard
                title="Unhealthy Connections"
                metric={numberDisplay(
                    isDemo()
                        ? MockData.unhealthy
                        : accountsSummary?.totalUnhealthyCount,
                    0
                )}
                loading={accountLoading}
            />
        </Grid>
    )
}
