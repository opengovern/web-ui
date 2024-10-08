import { Grid } from '@tremor/react'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListConnectionsSummaryResponse,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListCredentialResponse,
} from '../../../../../api/api'
import OnboardCard from '../../../../../components/Cards/OnboardCard'
import { KeyValuePairs } from '@cloudscape-design/components'
import { numericDisplay } from '../../../../../utilities/numericDisplay'

interface IAzureSummary {
    principalsSummary:
        | GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListCredentialResponse
        | undefined
    principalsLoading: boolean
    metricsLoading: boolean
    subscriptionsSummary:
        | GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListConnectionsSummaryResponse
        | undefined
    subscriptionsLoading: boolean
    metrics: GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics | undefined
}

export default function AzureSummary({
    principalsSummary,
    metricsLoading,
    metrics,
    principalsLoading,
    subscriptionsSummary,
    subscriptionsLoading,
}: IAzureSummary) {
    return (
        <Grid numItems={1} className="w-full gap-4 mt-6 mb-10">
            <KeyValuePairs
                columns={5}
                items={[
                    {
                        label: 'Total Organizations',
                        value: numericDisplay(
                            principalsSummary?.totalCredentialCount
                        ),
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
            />
            {/* <OnboardCard
                title="Active supscriptions"
                active={metrics?.connectionsEnabled}
                inProgress={metrics?.inProgressConnections}
                healthy={metrics?.healthyConnections}
                unhealthy={metrics?.unhealthyConnections}
                loading={metricsLoading}
            />
            <SummaryCard
                title="Service Principals"
                metric={principalsSummary?.totalCredentialCount}
                loading={principalsLoading}
            /> */}
        </Grid>
    )
}
