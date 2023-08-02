import {
    Flex,
    Metric,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@tremor/react'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import LoggedInLayout from '../../components/LoggedInLayout'
import { useInventoryApiV2AnalyticsTagList } from '../../api/inventory.gen'
import ConnectionList from '../../components/ConnectionList'
import TrendsTab from './Tabs/TrendsTab'
import CompositionTab from './Tabs/CompositionTab'
import SummaryMetrics from './SummaryMetrics'
import ResourceMetrics from './Tabs/ResourceMetrics'
import { isDemo } from '../../utilities/demo'

export default function Assets() {
    const workspace = useParams<{ ws: string }>().ws
    const tabs = useParams<{ assetTab: string }>().assetTab
    const [selectedTab, setSelectedTab] = useState(0)
    const { response: inventoryCategories, isLoading: categoriesLoading } =
        useInventoryApiV2AnalyticsTagList(
            {},
            {
                ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
            }
        )

    const categoryOptions = () => {
        if (categoriesLoading) {
            return [{ label: 'Loading', value: 'Loading' }]
        }
        if (!inventoryCategories?.category) return []
        const output: { label: string; value: string }[] = []
        inventoryCategories.category.map((categoryName) =>
            output.push({
                label: categoryName,
                value: categoryName,
            })
        )
        return output
    }

    useEffect(() => {
        switch (tabs) {
            case 'summary':
                setSelectedTab(0)
                break
            case 'trends':
                setSelectedTab(1)
                break
            case 'breakdowns':
                setSelectedTab(2)
                break
            default:
                setSelectedTab(0)
                break
        }
    }, [tabs])

    return (
        <LoggedInLayout currentPage="assets">
            <Flex justifyContent="between" alignItems="center">
                <Metric>Assets</Metric>
                <Flex justifyContent="end" alignItems="start">
                    <DateRangePicker />
                    <ConnectionList />
                </Flex>
            </Flex>
            <SummaryMetrics />
            <TabGroup className="mt-3" index={selectedTab}>
                <TabList>
                    <Tab onClick={() => setSelectedTab(0)}>
                        <Link to={`/${workspace}/assets/summary`}>Summary</Link>
                    </Tab>
                    <Tab onClick={() => setSelectedTab(1)}>
                        <Link to={`/${workspace}/assets/trends`}>Trends</Link>
                    </Tab>
                    <Tab onClick={() => setSelectedTab(2)}>
                        <Link to={`/${workspace}/assets/breakdowns`}>
                            Breakdown
                        </Link>
                    </Tab>
                </TabList>
                <TabPanels className="mt-6">
                    <TabPanel>
                        <ResourceMetrics
                            categories={categoryOptions()}
                            pageSize={1000}
                        />
                    </TabPanel>
                    <TabPanel>
                        <TrendsTab categories={categoryOptions()} />
                    </TabPanel>
                    <TabPanel>
                        <CompositionTab top={5} />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </LoggedInLayout>
    )
}
