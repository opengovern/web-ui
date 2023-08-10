import { Flex, Grid, Metric, Title } from '@tremor/react'
import Menu from '../../components/Menu'
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
    const { response: responseConnectors, isLoading: connectorsLoading } =
        useOnboardApiV1ConnectorList({
            ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
        })

    const mockConnectors = [
        {
            allowNewConnections: true,
            autoOnboardSupport: true,
            connection_count: 50,
            description: 'Amazon AWS Accounts',
            direction: 'both',
            label: 'AWS',
            name: 'AWS',
            status: 'enabled',
        },
        {
            allowNewConnections: true,
            autoOnboardSupport: true,
            connection_count: 50,
            description: 'Microsoft Azure Subscriptions',
            direction: 'both',
            label: 'Azure',
            name: 'Azure',
            status: 'enabled',
        },
    ]
    const connectors = () => (isDemo() ? mockConnectors : responseConnectors)

    return (
        <Menu currentPage="integration">
            <Metric>Integrations</Metric>
            <Grid numItems={2} numItemsLg={4} className="gap-4 mt-6 mb-10">
                <SummaryCard
                    title="Discovered Cloud Connection"
                    metric={numberDisplay(topMetrics?.totalConnections, 0)}
                    loading={metricsLoading}
                />
                <SummaryCard
                    title="Onboarded Cloud Connection"
                    metric={numberDisplay(topMetrics?.connectionsEnabled, 0)}
                    loading={metricsLoading}
                />
                <SummaryCard
                    title="Healthy Connections"
                    metric={numberDisplay(topMetrics?.unhealthyConnections, 0)}
                    loading={metricsLoading}
                />
                <SummaryCard
                    title="Unhealthy Connections"
                    metric={numberDisplay(topMetrics?.healthyConnections, 0)}
                    loading={metricsLoading}
                />
            </Grid>
            <Title className="font-semibold">Connectors</Title>
            {connectorsLoading ? (
                <Flex className="mt-36">
                    <Spinner />
                </Flex>
            ) : (
                <Grid numItemsMd={2} numItemsLg={3} className="gap-4 mt-6">
                    {connectors()?.map((connector) => (
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
        </Menu>
    )
}
