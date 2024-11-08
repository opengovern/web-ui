import { Button, Flex, Title } from '@tremor/react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import { useAtomValue } from 'jotai'
import AWSTabs from './AWS/Tabs'
import AWSSummary from './AWS/Summary'
import AzureSummary from './Azure/Summary'
import AzureTabs from './Azure/Tabs'
import {
    ConnectorToCredentialType,
    StringToProvider,
} from '../../../types/provider'
import {
    useIntegrationApiV1ConnectionsSummariesList,
    useIntegrationApiV1ConnectorsMetricsList,
    useIntegrationApiV1CredentialsList,
} from '../../../api/integration.gen'
import TopHeader from '../../../components/Layout/Header'
import {
    defaultTime,
    searchAtom,
    useUrlDateRangeState,
} from '../../../utilities/urlstate'
import EntraIDTabs from './EntraID/Tabs'
import EntraIDSummary from './EntraID/Summary'

export default function ConnectorDetail() {
    const { ws } = useParams()
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
    const { connector } = useParams()
    const { value: activeTimeRange } = useUrlDateRangeState(
        defaultTime(ws || '')
    )

    const provider = StringToProvider(connector || '')
    const credentialType = ConnectorToCredentialType(connector || '')
    const { response: accounts, isLoading: isAccountsLoading,sendNow: accountSendNow } =
        useIntegrationApiV1ConnectionsSummariesList({
            ...(provider !== '' && {
                connector: [provider],
            }),
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            pageSize: 10000,
            pageNumber: 1,
        })
    const { response: credentials, isLoading: isCredentialLoading,sendNow : credintalsSendNow } =
        useIntegrationApiV1CredentialsList({
            connector: provider,
        })
    const { response: topMetrics, isLoading: metricsLoading } =
        useIntegrationApiV1ConnectorsMetricsList({
            connector: provider !== '' ? [provider] : [],
        })

    const connectorUI = () => {
        if (connector === 'AWS') {
            return (
                <>
                    {/* <AWSSummary
                        metrics={topMetrics}
                        metricsLoading={metricsLoading}
                        credential={credentials}
                        credentialLoading={isCredentialLoading}
                    /> */}
                    <AWSTabs
                        accounts={accounts?.connections || []}
                        organizations={credentials?.credentials || []}
                        loading={isAccountsLoading}
                        accountSendNow={accountSendNow}
                    />
                </>
            )
        }
        if (connector === 'Azure') {
            return (
                <>
                    {/* <AzureSummary
                        principalsSummary={credentials}
                        metrics={topMetrics}
                        metricsLoading={metricsLoading}
                        principalsLoading={isCredentialLoading}
                        subscriptionsSummary={accounts}
                        subscriptionsLoading={isAccountsLoading}
                    /> */}
                    <AzureTabs
                        principals={credentials?.credentials || []}
                        subscriptions={accounts?.connections || []}
                        loading={isAccountsLoading}
                        accountSendNow={accountSendNow}
                        credintalsSendNow={credintalsSendNow}
                    />
                </>
            )
        }
        return (
            <>
                {/* <EntraIDSummary
                    principalsSummary={credentials}
                    metrics={topMetrics}
                    metricsLoading={metricsLoading}
                    principalsLoading={isCredentialLoading}
                    subscriptionsSummary={accounts}
                    subscriptionsLoading={isAccountsLoading}
                /> */}
                <EntraIDTabs
                    directories={credentials?.credentials || []}
                    loading={isAccountsLoading}
                />
            </>
        )
    }

    return (
        <>
            <TopHeader breadCrumb={[connector]} />
            <Flex flexDirection="col" alignItems="start" className='gap-2'>
                {/* <Flex flexDirection="row">
                    <Title className="font-semibold">{connector}</Title>
                    <Button
                        variant="secondary"
                        onClick={() =>
                            navigate(`./resourcetypes?${searchParams}`)
                        }
                    >
                        <Cog8ToothIcon className="w-6" />
                    </Button>
                </Flex> */}
                {connectorUI()}
            </Flex>
        </>
    )
}
