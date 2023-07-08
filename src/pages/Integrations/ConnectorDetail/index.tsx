import { Flex, Grid, Text, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import LoggedInLayout from '../../../components/LoggedInLayout'
import {
    useOnboardApiV1ConnectionsSummaryList,
    useOnboardApiV1CredentialList,
} from '../../../api/onboard.gen'
import Breadcrumbs from '../../../components/Breadcrumbs'
import SummaryCard from '../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../utilities/numericDisplay'
import { timeAtom } from '../../../store'
import AWSPanels from './Panels/AWS'

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
                <Grid
                    numItemsMd={2}
                    numItemsLg={3}
                    className="w-full gap-3 mt-6 mb-10"
                >
                    <SummaryCard
                        title="Onboarded AWS Accounts"
                        metric={String(
                            numericDisplay(accounts?.connectionCount)
                        )}
                        loading={isAccountsLoading}
                    />
                    <SummaryCard
                        title="Unhealthy Accounts"
                        metric={String(
                            numericDisplay(accounts?.totalUnhealthyCount)
                        )}
                        loading={isAccountsLoading}
                    />
                    <SummaryCard
                        title="Organization Count"
                        metric={String(
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            numericDisplay(credentials?.totalCredentialCount)
                        )}
                        loading={isCredentialLoading}
                    />
                </Grid>
                {connector === 'AWS' ? (
                    <AWSPanels
                        accounts={accounts}
                        organizations={credentials}
                    />
                ) : null}
            </Flex>
        </LoggedInLayout>
    )
}
