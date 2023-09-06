import { Flex, Grid, Title } from '@tremor/react'
import Menu from '../../components/Menu'
import {
    useOnboardApiV1CatalogMetricsList,
    useOnboardApiV1ConnectorList,
} from '../../api/onboard.gen'
import ConnectorCard from '../../components/Cards/ConnectorCard'
import Spinner from '../../components/Spinner'
import { isDemo } from '../../utilities/demo'
import OnboardCard from '../../components/Cards/OnboardCard'
import Header from '../../components/Header'

export default function Integrations() {
    const { response: topMetrics, isLoading: metricsLoading } =
        useOnboardApiV1CatalogMetricsList()
    const { response: responseConnectors, isLoading: connectorsLoading } =
        useOnboardApiV1ConnectorList()

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
            <Header />
            <Grid numItems={3} className="gap-4 mb-10">
                <OnboardCard
                    title="Active Accounts"
                    healthy={topMetrics?.healthyConnections}
                    unhealthy={topMetrics?.unhealthyConnections}
                    allCount={topMetrics?.totalConnections}
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
