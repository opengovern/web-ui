import { useLocation, useNavigate, useParams } from 'react-router-dom'
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
import { useEffect, useState } from 'react'
import Menu from '../../../components/Menu'
import { filterAtom, timeAtom } from '../../../store'
import Summary from './Tabs/Summary'
import { useComplianceApiV1BenchmarksSummaryDetail } from '../../../api/compliance.gen'
import Assignments from './Tabs/Assignments'
import Policies from './Tabs/Policies'
import Findings from './Tabs/Findings'
import Spinner from '../../../components/Spinner'
import { dateDisplay } from '../../../utilities/dateDisplay'
import Header from '../../../components/Header'

export default function BenchmarkDetail() {
    const [selectedTab, setSelectedTab] = useState(0)
    const tabs = useLocation().hash
    const navigate = useNavigate()
    const { id } = useParams()

    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const { response: benchmarkDetail, isLoading } =
        useComplianceApiV1BenchmarksSummaryDetail(String(id))

    useEffect(() => {
        switch (tabs) {
            case '#policies':
                setSelectedTab(1)
                break
            case '#assignments':
                setSelectedTab(2)
                break
            case '#findings':
                setSelectedTab(3)
                break
            default:
                setSelectedTab(0)
                break
        }
    }, [tabs])

    return (
        <Menu currentPage="compliance">
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <>
                    <Header
                        breadCrumb={['Benchmark detail']}
                        filter
                        datePicker
                    />
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        justifyContent="start"
                        className="mb-6"
                    >
                        <Flex className="mb-1">
                            <Title>{benchmarkDetail?.title}</Title>
                            <Text className="whitespace-nowrap">{`Last evaluation: ${dateDisplay(
                                benchmarkDetail?.evaluatedAt
                            )}`}</Text>
                        </Flex>
                        <Text className="w-2/3">
                            {benchmarkDetail?.description}
                        </Text>
                    </Flex>
                    <TabGroup
                        index={selectedTab}
                        onIndexChange={setSelectedTab}
                    >
                        <TabList>
                            <Tab onClick={() => navigate('#summary')}>
                                Summary
                            </Tab>
                            <Tab onClick={() => navigate('#policies')}>
                                Policies
                            </Tab>
                            <Tab onClick={() => navigate('#assignments')}>
                                Assignments
                            </Tab>
                            <Tab onClick={() => navigate('#findings')}>
                                Findings
                            </Tab>
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
        </Menu>
    )
}
