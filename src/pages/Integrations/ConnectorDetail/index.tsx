import { Flex, Text, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import LoggedInLayout from '../../../components/LoggedInLayout'
import {
    useOnboardApiV1ConnectionsSummaryList,
    useOnboardApiV1CredentialList,
} from '../../../api/onboard.gen'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { timeAtom } from '../../../store'
import AWSTabs from './AWS/Tabs'
import AWSSummary from './AWS/Summary'
import AzureSummary from './Azure/Summary'
import AzureTabs from './Azure/Tabs'

export default function ConnectorDetail() {
    const navigate = useNavigate()
    const { connector } = useParams()

    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)

    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector,
            startTime: dayjs(activeTimeRange.from).unix(),
            endTime: dayjs(activeTimeRange.to).unix(),
            pageSize: 10000,
            pageNumber: 1,
        })
    const { response: credentials, isLoading: isCredentialLoading } =
        useOnboardApiV1CredentialList({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector,
        })
    console.log(accounts)

    const breadcrumbsPages = [
        {
            name: 'Integrations',
            path: () => {
                navigate(-1)
            },
            current: false,
        },
        { name: connector, path: '', current: true },
    ]

    return (
        <LoggedInLayout currentPage="integration">
            <Flex flexDirection="col" alignItems="start">
                <Flex flexDirection="row" className="mb-6">
                    <Breadcrumbs pages={breadcrumbsPages} />
                </Flex>
                <Title>Connector Name</Title>
                <Text>Description</Text>
                {connector === 'AWS' ? (
                    <>
                        <AWSSummary
                            account={accounts}
                            accountLoading={isAccountsLoading}
                            credential={credentials}
                            credentialLoading={isCredentialLoading}
                        />
                        <AWSTabs
                            accounts={accounts}
                            organizations={credentials}
                        />
                    </>
                ) : (
                    <>
                        <AzureSummary
                            principals={credentials}
                            principalsLoading={isCredentialLoading}
                            subscriptions={accounts}
                            subscriptionsLoading={isAccountsLoading}
                        />
                        <AzureTabs
                            principals={credentials}
                            subscriptions={accounts}
                        />
                    </>
                )}
            </Flex>
        </LoggedInLayout>
    )
}
