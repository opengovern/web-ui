import {
    Flex,
    Metric,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@tremor/react'
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
        if (!inventoryCategories?.category)
            return [{ label: 'no data', value: 'no data' }]
        const output: { label: string; value: string }[] = []
        inventoryCategories.category.map((categoryName) =>
            output.push({
                label: categoryName,
                value: categoryName,
            })
        )
        return output
    }

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
            <TabGroup className="mt-3">
                <TabList>
                    <Tab>Summary</Tab>
                    <Tab>Trends</Tab>
                    <Tab>Breakdown</Tab>
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
