import { Col, Grid } from '@tremor/react'
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
        <Grid numItems={2} numItemsLg={4} className="w-full gap-4 mt-6 mb-10">
            <SummaryCard
                title="Discovered AWS Accounts"
                metric={String(
                    numericDisplay(accountsSummary?.totalDiscoveredCount)
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
            <Col numColSpan={2}>
                <OnboardCard
                    title="Onboarded AWS Accounts"
                    healthy={
                        (accountsSummary?.connectionCount || 0) -
                        (accountsSummary?.totalUnhealthyCount || 0)
                    }
                    unhealthy={accountsSummary?.totalUnhealthyCount}
                    loading={accountLoading}
                />
            </Col>
        </Grid>
    )
}
