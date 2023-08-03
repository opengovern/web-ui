import {
    Flex,
    Metric,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@tremor/react'
import { useNavigate, useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
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
    const navigate = useNavigate()
    const tabs = useLocation().hash
    const [selectedTab, setSelectedTab] = useState(0)
    const { response: inventoryCategories, isLoading: categoriesLoading } =
        useInventoryApiV2AnalyticsTagList(
            {},
            {
                ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
            }
        )

    const categoryOptions = () => {
        if (isDemo()) {
            const output = [
                { label: 'AI + ML', value: 'AI + ML' },
                { label: 'App Platform', value: 'App Platform' },
                {
                    label: 'Application Integration',
                    value: 'Application Integration',
                },
                { label: 'Compute', value: 'Compute' },
                { label: 'DevOps', value: 'DevOps' },
                { label: 'Governance', value: 'Governance' },
                { label: 'Monitoring', value: 'Monitoring' },
                { label: 'Network', value: 'Network' },
                { label: 'Security', value: 'Security' },
                { label: 'Serverless', value: 'Serverless' },
                { label: 'Storage', value: 'Storage' },
            ]
            return output
        }
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
            case '#summary':
                setSelectedTab(0)
                break
            case '#trends':
                setSelectedTab(1)
                break
            case '#breakdowns':
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
            <TabGroup
                className="mt-3"
                index={selectedTab}
                onIndexChange={setSelectedTab}
            >
                <TabList>
                    <Tab onClick={() => navigate('#summary')}>Summary</Tab>
                    <Tab onClick={() => navigate('#trends')}>Trends</Tab>
                    <Tab onClick={() => navigate('#breakdowns')}>Breakdown</Tab>
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
