import {
    Card,
    Flex,
    Grid,
    Metric,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { useParams } from 'react-router-dom'
import LoggedInLayout from '../../components/LoggedInLayout'
import SummaryCard from '../../components/Cards/SummaryCard'
import { numberDisplay } from '../../utilities/numericDisplay'
import { useInventoryApiV2ServicesSummaryList } from '../../api/inventory.gen'
import { useWorkspaceApiV1WorkspacesLimitsDetail } from '../../api/workspace.gen'
import Spinner from '../../components/Spinner'
import Chart from '../../components/Charts'

export default function Home() {
    const workspace = useParams<{ ws: string }>().ws
    const { response: services, isLoading: servicesIsLoading } =
        useInventoryApiV2ServicesSummaryList({})
    const { response: limits, isLoading: limitsLoading } =
        useWorkspaceApiV1WorkspacesLimitsDetail(workspace || '')

    const isLoading = false

    return (
        <LoggedInLayout currentPage="home">
            <Metric>Home</Metric>
            <Grid
                numItems={1}
                numItemsMd={3}
                className="gap-4 w-full mt-6 mb-4"
            >
                <SummaryCard
                    title="Cloud Accounts"
                    metric={numberDisplay(limits?.currentConnections, 0)}
                    loading={limitsLoading}
                />
                <SummaryCard
                    title="Services"
                    metric={numberDisplay(services?.totalCount, 0)}
                    loading={servicesIsLoading}
                />
                <SummaryCard
                    title="Resource Count"
                    metric={numberDisplay(limits?.currentResources, 0)}
                    loading={limitsLoading}
                />
            </Grid>
            <Card>
                <Flex>
                    <Title>Growth Trend</Title>
                    <TabGroup className="w-fit rounded-lg">
                        <TabList variant="solid">
                            <Tab className="pt-0.5 pb-1">
                                <Text>Spend</Text>
                            </Tab>
                            <Tab className="pt-0.5 pb-1">
                                <Text>Resource</Text>
                            </Tab>
                        </TabList>
                    </TabGroup>
                </Flex>
                {isLoading ? (
                    <Spinner className="h-80" />
                ) : (
                    <Chart
                        className="mt-3"
                        index="date"
                        type="line"
                        categories={['Resource Count']}
                        data={[
                            { 'Resource Count': 100 },
                            { 'Resource Count': 200 },
                        ]}
                    />
                )}
            </Card>
        </LoggedInLayout>
    )
}
