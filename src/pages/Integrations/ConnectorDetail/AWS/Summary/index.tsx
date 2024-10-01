import { Grid } from '@tremor/react'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListCredentialResponse,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListCredentialResponse,
} from '../../../../../api/api'
import OnboardCard from '../../../../../components/Cards/OnboardCard'

interface IAWSSummary {
    metricsLoading: boolean
    credential:
        | GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListCredentialResponse
        | undefined
    credentialLoading: boolean
    metrics: GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics | undefined
}

export default function AWSSummary({
    metrics,
    metricsLoading,
    credential,
    credentialLoading,
}: IAWSSummary) {
    return (
        <Grid numItems={3} className="w-full gap-4 mt-6 mb-10">
            <OnboardCard
                title="Active AWS Accounts"
                active={metrics?.connectionsEnabled}
                inProgress={metrics?.inProgressConnections}
                healthy={metrics?.healthyConnections}
                unhealthy={metrics?.unhealthyConnections}
                loading={metricsLoading}
            />
            <SummaryCard
                title="AWS Organizations"
                metric={credential?.totalCredentialCount}
                loading={credentialLoading}
            />
        </Grid>
    )
}
