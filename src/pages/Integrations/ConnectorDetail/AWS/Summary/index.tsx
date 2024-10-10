import { Grid } from '@tremor/react'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListCredentialResponse,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListCredentialResponse,
} from '../../../../../api/api'
import OnboardCard from '../../../../../components/Cards/OnboardCard'
import { KeyValuePairs } from '@cloudscape-design/components'

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
        <Grid numItems={1} className="w-full gap-4 mt-6 mb-10">
            {/* <KeyValuePairs
            columns={1}
                items={[
                    {
                        label: 'Total Organizations',
                        value: numericDisplay(credential?.totalCredentialCount),
                    },
                    {
                        label: 'Active Accounts',
                        value: numericDisplay(metrics?.connectionsEnabled),
                    },
                    {
                        label: 'In Progress Accounts',
                        value: numericDisplay(metrics?.inProgressConnections),
                    },
                    {
                        label: 'Healthy Accounts',
                        value: numericDisplay(metrics?.healthyConnections),
                    },
                    {
                        label: 'Unhealthy Accounts',
                        value: numericDisplay(metrics?.unhealthyConnections),
                    },
                ]}
            /> */}
            {/* <OnboardCard
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
            /> */}
        </Grid>
    )
}
