import { Flex, Grid, Metric, Title } from '@tremor/react'
import LoggedInLayout from '../../components/LoggedInLayout'
import {
    useOnboardApiV1CatalogMetricsList,
    useOnboardApiV1ConnectorList,
} from '../../api/onboard.gen'
import SummaryCard from '../../components/Cards/SummaryCard'
import { numberDisplay } from '../../utilities/numericDisplay'
import ConnectorCard from '../../components/Cards/ConnectorCard'
import Spinner from '../../components/Spinner'
import { isDemo } from '../../utilities/demo'

export default function Integrations() {
    const { response: topMetrics, isLoading: metricsLoading } =
        useOnboardApiV1CatalogMetricsList({
            ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
        })
    const { response: connectors, isLoading: connectorsLoading } =
        useOnboardApiV1ConnectorList({
            ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
        })

    return (
        <LoggedInLayout currentPage="integration">
            <Metric>Integrations</Metric>
            <Grid numItemsMd={2} numItemsLg={3} className="gap-4 mt-6 mb-10">
                <SummaryCard
                    title="Total Connections"
                    metric={numberDisplay(topMetrics?.totalConnections, 0)}
                    loading={metricsLoading}
                />
                <SummaryCard
                    title="Active Connections"
                    metric={numberDisplay(topMetrics?.connectionsEnabled, 0)}
                    loading={metricsLoading}
                />
                <SummaryCard
                    title="Total Unhealthy Connections"
                    metric={numberDisplay(topMetrics?.unhealthyConnections, 0)}
                    loading={metricsLoading}
                />
            </Grid>
            <Title>Connectors</Title>
            {connectorsLoading ? (
                <Flex className="mt-36">
                    <Spinner />
                </Flex>
            ) : (
                <Grid numItemsMd={2} numItemsLg={3} className="gap-4 mt-6">
                    {connectors?.map((connector) => (
                        <ConnectorCard
                            connector={connector.name}
                            title={connector.label}
                            status={connector.status}
                            count={connector.connection_count}
                            description={connector.description}
                        />
                    ))}
                </Grid>
            )}
        </LoggedInLayout>
    )
}
