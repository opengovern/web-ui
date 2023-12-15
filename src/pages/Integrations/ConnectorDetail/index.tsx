import { Button, Flex, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import Layout from '../../../components/Layout'
import {
    useOnboardApiV1CatalogMetricsList,
    useOnboardApiV1ConnectionsSummaryList,
    useOnboardApiV1CredentialList,
} from '../../../api/onboard.gen'
import { timeAtom } from '../../../store'
import AWSTabs from './AWS/Tabs'
import AWSSummary from './AWS/Summary'
import AzureSummary from './Azure/Summary'
import AzureTabs from './Azure/Tabs'
import { StringToProvider } from '../../../types/provider'
import Header from '../../../components/Header'

export default function ConnectorDetail() {
    const navigate = useNavigate()
    const { connector } = useParams()

    const activeTimeRange = useAtomValue(timeAtom)
    const provider = StringToProvider(connector || '')
    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            ...(provider !== '' && {
                connector: [provider],
            }),
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            pageSize: 10000,
            pageNumber: 1,
        })
    const { response: credentials, isLoading: isCredentialLoading } =
        useOnboardApiV1CredentialList({
            connector: provider,
        })
    const { response: topMetrics, isLoading: metricsLoading } =
        useOnboardApiV1CatalogMetricsList({
            connector: provider !== '' ? [provider] : [],
        })

    return (
        <Layout currentPage="integrations">
            <Flex flexDirection="col" alignItems="start">
                <Header breadCrumb={[connector]} />
                <Flex flexDirection="row">
                    <Title className="font-semibold">{connector}</Title>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('./resourcetypes')}
                    >
                        <Cog8ToothIcon className="w-6" />
                    </Button>
                </Flex>
                {connector === 'AWS' ? (
                    <>
                        <AWSSummary
                            metrics={topMetrics}
                            metricsLoading={metricsLoading}
                            credential={credentials}
                            credentialLoading={isCredentialLoading}
                        />
                        <AWSTabs
                            accounts={accounts?.connections || []}
                            organizations={credentials?.credentials || []}
                            loading={isAccountsLoading}
                        />
                    </>
                ) : (
                    <>
                        <AzureSummary
                            principalsSummary={credentials}
                            metrics={topMetrics}
                            metricsLoading={metricsLoading}
                            principalsLoading={isCredentialLoading}
                            subscriptionsSummary={accounts}
                            subscriptionsLoading={isAccountsLoading}
                        />
                        <AzureTabs
                            principals={credentials?.credentials || []}
                            subscriptions={accounts?.connections || []}
                            loading={isAccountsLoading}
                        />
                    </>
                )}
            </Flex>
        </Layout>
    )
}
