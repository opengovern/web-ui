import { useNavigate, useParams } from 'react-router-dom'
import {
    Flex,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    Title,
} from '@tremor/react'
import { useAtomValue } from 'jotai'
import dayjs from 'dayjs'
import LoggedInLayout from '../../../components/LoggedInLayout'
import { filterAtom, timeAtom } from '../../../store'
import Breadcrumbs from '../../../components/Breadcrumbs'
import DateRangePicker from '../../../components/DateRangePicker'
import Summary from './Tabs/Summary'
import { useComplianceApiV1BenchmarksSummaryDetail } from '../../../api/compliance.gen'
import ConnectionList from '../../../components/ConnectionList'
import Assignments from './Tabs/Assignments'
import Policies from './Tabs/Policies'
import Findings from './Tabs/Findings'
import Spinner from '../../../components/Spinner'

export default function BenchmarkDetail() {
    const navigate = useNavigate()
    const { id } = useParams()

    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const { response: benchmarkDetail, isLoading } =
        useComplianceApiV1BenchmarksSummaryDetail(String(id))

    const breadcrumbsPages = [
        {
            name: 'Compliance',
            path: () => {
                navigate(-1)
            },
            current: false,
        },
        { name: 'Benchmark Detail', path: '', current: true },
    ]

    return (
        <LoggedInLayout currentPage="benchmarks">
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <>
                    <Flex className="mb-6">
                        <Breadcrumbs pages={breadcrumbsPages} />
                        <Flex justifyContent="end">
                            <DateRangePicker />
                            <ConnectionList />
                        </Flex>
                    </Flex>
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        justifyContent="start"
                        className="mb-6"
                    >
                        <Flex className="mb-1">
                            <Title>{benchmarkDetail?.title}</Title>
                            <Text className="whitespace-nowrap">{`Last evaluation: ${dayjs(
                                benchmarkDetail?.evaluatedAt
                            ).format('MMM DD, YYYY')}`}</Text>
                        </Flex>
                        <Text className="w-2/3">
                            {benchmarkDetail?.description}
                        </Text>
                    </Flex>
                    <TabGroup>
                        <TabList>
                            <Tab>Summary</Tab>
                            <Tab>Policies</Tab>
                            <Tab>Assignments</Tab>
                            <Tab>Findings</Tab>
                        </TabList>
                        <TabPanels className="mt-6">
                            <TabPanel>
                                <Summary
                                    detail={benchmarkDetail}
                                    id={id}
                                    timeRange={activeTimeRange}
                                    connections={selectedConnections}
                                />
                            </TabPanel>
                            <TabPanel>
                                <Policies id={id} />
                            </TabPanel>
                            <TabPanel>
                                <Assignments id={id} />
                            </TabPanel>
                            <TabPanel>
                                <Findings
                                    id={id}
                                    connections={selectedConnections}
                                />
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </>
            )}
        </LoggedInLayout>
    )
}
