import {
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import { useOnboardApiV1CatalogMetricsList } from '../../../../api/onboard.gen'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import { timeAtom } from '../../../../store'
import AccountList from './Panels/AccountList'
import Organizations from './Panels/Organizations'

export default function AWSConnectorDetail() {
    const navigate = useNavigate()
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)

    const { response: topMetrics, isLoading } =
        useOnboardApiV1CatalogMetricsList()

    const breadcrumbsPages = [
        {
            name: 'Integrations',
            path: () => {
                navigate('./..')
            },
            current: false,
        },
        { name: 'AWS', path: '', current: true },
    ]

    return (
        <LoggedInLayout currentPage="integration">
            <Flex flexDirection="col" alignItems="start">
                <Flex flexDirection="row" className="mb-6">
                    <Breadcrumbs pages={breadcrumbsPages} />
                </Flex>
                <Title>AWS Account</Title>
                <Text>Description</Text>
                <Grid
                    numItemsMd={2}
                    numItemsLg={3}
                    className="w-full gap-3 mt-6 mb-10"
                >
                    <SummaryCard
                        title="Onboarded AWS Accounts"
                        metric={String(
                            numericDisplay(topMetrics?.totalConnections)
                        )}
                        loading={isLoading}
                    />
                    <SummaryCard
                        title="Unhealthy Accounts"
                        metric={String(
                            numericDisplay(topMetrics?.unhealthyConnections)
                        )}
                        loading={isLoading}
                    />
                    <SummaryCard
                        title="Organization Count"
                        metric={String(
                            numericDisplay(topMetrics?.totalConnections)
                        )}
                        loading={isLoading}
                    />
                </Grid>
                <TabGroup>
                    <TabList className="mb-3">
                        <Tab>Organizations</Tab>
                        <Tab>AWS Accounts</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Organizations />
                        </TabPanel>
                        <TabPanel>
                            <AccountList activeTimeRange={activeTimeRange} />
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </Flex>
        </LoggedInLayout>
    )
}
