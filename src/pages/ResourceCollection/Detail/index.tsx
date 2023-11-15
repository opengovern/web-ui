import { useParams } from 'react-router-dom'
import {
    Button,
    Card,
    Flex,
    Grid,
    List,
    ListItem,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    Title,
} from '@tremor/react'
import { TableCellsIcon } from '@heroicons/react/24/outline'
import Layout from '../../../components/Layout'
import { useInventoryApiV2MetadataResourceCollectionDetail } from '../../../api/inventory.gen'
import Header from '../../../components/Header'
import Spinner from '../../../components/Spinner'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../api/compliance.gen'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse } from '../../../api/api'
import Chart from '../../../components/Chart'
import { camelCaseToLabel } from '../../../utilities/labelMaker'

const pieData = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse
        | undefined
) => {
    const data: any[] = []
    if (input && input.totalChecks) {
        // eslint-disable-next-line array-callback-return
        Object.entries(input.totalChecks).map(([key, value]) => {
            data.push({ name: camelCaseToLabel(key), value })
        })
    }
    return data.reverse()
}

export default function ResourceCollectionDetail() {
    const { id } = useParams()

    const { response: detail, isLoading: detailsLoading } =
        useInventoryApiV2MetadataResourceCollectionDetail(id || '')
    const { response: complianceKPI, isLoading: complianceKPILoading } =
        useComplianceApiV1BenchmarksSummaryList({
            resourceCollection: [id || ''],
        })
    console.log(complianceKPI)

    return (
        <Layout currentPage="resource-collection">
            <Header
                breadCrumb={[
                    detail ? detail.name : 'Resource collection detail',
                ]}
            />
            {detailsLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <>
                    <Flex className="mb-4">
                        <Flex flexDirection="col" alignItems="start">
                            <Title className="font-semibold">
                                {detail?.name}
                            </Title>
                            <Text>{detail?.name}</Text>
                        </Flex>
                        <Button icon={TableCellsIcon}>Tech landscape</Button>
                    </Flex>
                    <Grid numItems={2} className="w-full gap-4">
                        <Card>
                            <Title className="font-semibold mb-2">
                                Resource collection info
                            </Title>
                            <List>
                                <ListItem>
                                    <Text>Creation date</Text>
                                    <Text className="text-gray-800">
                                        {detail?.name}
                                    </Text>
                                </ListItem>
                                <ListItem>
                                    <Text>Last evaluation</Text>
                                    <Text className="text-gray-800">
                                        {detail?.name}
                                    </Text>
                                </ListItem>
                                <ListItem>
                                    <Text>Status</Text>
                                    <Text className="text-gray-800">
                                        {detail?.name}
                                    </Text>
                                </ListItem>
                                <ListItem>
                                    <Text>Tags</Text>
                                    <Text className="text-gray-800">
                                        {detail?.name}
                                    </Text>
                                </ListItem>
                            </List>
                        </Card>
                        <Card>
                            <Title className="font-semibold mb-2">
                                Key performance indicator
                            </Title>
                            <TabGroup>
                                <TabList>
                                    <Tab>Compliance</Tab>
                                    <Tab>Infrastructure</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <Chart
                                            labels={[]}
                                            chartType="doughnut"
                                            chartData={pieData(complianceKPI)}
                                            loading={complianceKPILoading}
                                            colorful
                                        />
                                    </TabPanel>
                                </TabPanels>
                            </TabGroup>
                        </Card>
                    </Grid>
                </>
            )}
        </Layout>
    )
}
