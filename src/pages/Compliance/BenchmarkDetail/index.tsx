import { useNavigate, useParams } from 'react-router-dom'
import { useAtom } from 'jotai/index'
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
import LoggedInLayout from '../../../components/LoggedInLayout'
import { timeAtom } from '../../../store'
import Breadcrumbs from '../../../components/Breadcrumbs'
import DateRangePicker from '../../../components/DateRangePicker'
import Summary from './Tabs/Summary'

export default function BenchmarkDetail() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)

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
                <DateRangePicker />
            </Flex>
            <Flex alignItems="end" className="mb-6">
                <Flex flexDirection="col" alignItems="start">
                    <Title>Name</Title>
                    <Text>description</Text>
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
                <TabPanels>
                    <TabPanel>
                        <Summary />
                    </TabPanel>
                    <TabPanel>coming soon</TabPanel>
                    <TabPanel>coming soon</TabPanel>
                    <TabPanel>coming soon</TabPanel>
                </TabPanels>
            </TabGroup>
        </LoggedInLayout>
    )
}
