import { Flex, Title } from '@tremor/react'
import { useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import Menu from '../../../components/Menu'
import {
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

    return (
        <Menu currentPage="integrations">
            <Flex flexDirection="col" alignItems="start">
                <Header breadCrumb={[connector]} />
                <Title className="font-semibold">{connector}</Title>
                {connector === 'AWS' ? (
                    <>
                        <AWSSummary
                            accountsSummary={accounts}
                            accountLoading={isAccountsLoading}
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
        </Menu>
    )
}
