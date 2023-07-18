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
import { useAtomValue } from 'jotai/index'
import LoggedInLayout from '../../../components/LoggedInLayout'
import { timeAtom } from '../../../store'
import Breadcrumbs from '../../../components/Breadcrumbs'
import DateRangePicker from '../../../components/DateRangePicker'
import Summary from './Tabs/Summary'
import { useComplianceApiV1BenchmarksSummaryDetail } from '../../../api/compliance.gen'
import ConnectionList from '../../../components/ConnectionList'

export default function BenchmarkDetail() {
    const navigate = useNavigate()
    const { id } = useParams()

    const activeTimeRange = useAtomValue(timeAtom)

    const { response: benchmarkDetail } =
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
        <LoggedInLayout currentPage="compliance">
            <Flex className="mb-6">
                <Breadcrumbs pages={breadcrumbsPages} />
                <Flex justifyContent="end">
                    <DateRangePicker />
                    <ConnectionList />
                </Flex>
            </Flex>
            <Flex alignItems="end" className="mb-6">
                <Flex flexDirection="col" alignItems="start">
                    <Title className="mb-1">{benchmarkDetail?.title}</Title>
                    <Text className="w-2/3">
                        {benchmarkDetail?.description}
                    </Text>
                </Flex>
                <Text className="whitespace-nowrap">Last Check</Text>
            </Flex>
            <TabGroup>
                <TabList>
                    <Tab>Summary</Tab>
                    <Tab>Benchmarks</Tab>
                    <Tab>Assignments</Tab>
                    <Tab>Findings</Tab>
                </TabList>
                <TabPanels className="mt-6">
                    <TabPanel>
                        <Summary detail={benchmarkDetail} id={id} />
                    </TabPanel>
                    <TabPanel>coming soon</TabPanel>
                    <TabPanel>coming soon</TabPanel>
                    <TabPanel>coming soon</TabPanel>
                </TabPanels>
            </TabGroup>
        </LoggedInLayout>
    )
}
