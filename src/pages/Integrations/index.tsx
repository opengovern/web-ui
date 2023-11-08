import { Flex, Grid, Title } from '@tremor/react'
import Layout from '../../components/Layout'
import {
    useOnboardApiV1CatalogMetricsList,
    useOnboardApiV1ConnectorList,
} from '../../api/onboard.gen'
import ConnectorCard from '../../components/Cards/ConnectorCard'
import Spinner from '../../components/Spinner'
import OnboardCard from '../../components/Cards/OnboardCard'
import Header from '../../components/Header'

export default function Integrations() {
    const { response: topMetrics, isLoading: metricsLoading } =
        useOnboardApiV1CatalogMetricsList()
    const { response: responseConnectors, isLoading: connectorsLoading } =
        useOnboardApiV1ConnectorList()

    return (
        <Layout currentPage="integrations">
            <Header />
            <Grid numItems={3} className="gap-4 mb-10">
                <OnboardCard
                    title="Active Accounts"
                    active={topMetrics?.connectionsEnabled}
                    inProgress={topMetrics?.inProgressConnections}
                    healthy={topMetrics?.healthyConnections}
                    unhealthy={topMetrics?.unhealthyConnections}
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
                    {responseConnectors?.map((connector) => (
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
        </Layout>
    )
}
