import { useAtom } from 'jotai'
import {
    DateRangePicker,
    Flex,
    Metric,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@tremor/react'
import LoggedInLayout from '../../components/LoggedInLayout'
import { timeAtom } from '../../store'
import { useInventoryApiV2ResourcesTagList } from '../../api/inventory.gen'
import ConnectionList from '../../components/ConnectionList'
import SummaryTab from './Tabs/SummaryTab'
import TrendsTab from './Tabs/TrendsTab'
import CompositionTab from './Tabs/CompositionTab'
import SummaryMetrics from './Tabs/SummaryTab/SummaryMetrics'

export default function Assets() {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const { response: inventoryCategories, isLoading: categoriesLoading } =
        useInventoryApiV2ResourcesTagList()

    const categoryOptions = () => {
        if (categoriesLoading) {
            return [{ label: 'Loading', value: 'Loading' }]
        }
        if (!inventoryCategories)
            return [{ label: 'no data', value: 'no data' }]
        return [{ label: 'All Categories', value: 'All Categories' }].concat(
            inventoryCategories.category.map((categoryName) => ({
                label: categoryName,
                value: categoryName,
            }))
        )
    }

    return (
        <LoggedInLayout currentPage="assets">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Metric>Assets</Metric>
                <Flex flexDirection="row" justifyContent="end">
                    <ConnectionList />
                </Flex>
            </Flex>
            <SummaryMetrics />

            <Flex
                flexDirection="row"
                justifyContent="end"
                alignItems="end"
                className="relative top-10 h-0"
            >
                <DateRangePicker
                    className="max-w-md"
                    value={activeTimeRange}
                    onValueChange={setActiveTimeRange}
                    selectPlaceholder="Time Range"
                    enableClear={false}
                    maxDate={new Date()}
                />
            </Flex>

            <TabGroup className="mt-3">
                <TabList>
                    <Tab>Summary</Tab>
                    <Tab>Trends</Tab>
                    <Tab>Composition</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <SummaryTab
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
