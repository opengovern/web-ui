import React, { useMemo } from 'react'
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
import { useAtom } from 'jotai'
import LoggedInLayout from '../../components/LoggedInLayout'
import { useInventoryApiV2ResourcesTagList } from '../../api/inventory.gen'
import ConnectionList from '../../components/ConnectionList'
import TrendsTab from './Tabs/TrendsTab'
import CompositionTab from './Tabs/CompositionTab'
import { spendTimeAtom } from '../../store'
import SummaryMetrics from './SummaryMetrics'
import CostMetrics from './Tabs/CostMetrics'

export default function Spend() {
    const [activeTimeRange, setActiveTimeRange] = useAtom(spendTimeAtom)
    const { response: inventoryCategories } =
        useInventoryApiV2ResourcesTagList()

    const categoryOptions = useMemo(() => {
        if (!inventoryCategories)
            return [{ label: 'no data', value: 'no data' }]
        return [{ label: 'All Categories', value: 'All Categories' }].concat(
            inventoryCategories.category.map((categoryName) => ({
                label: categoryName,
                value: categoryName,
            }))
        )
    }, [inventoryCategories])

    return (
        <LoggedInLayout currentPage="spend">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Metric>Spend</Metric>
                <Flex flexDirection="row" justifyContent="end">
                    <DateRangePicker
                        className="max-w-md"
                        value={activeTimeRange}
                        onValueChange={setActiveTimeRange}
                        selectPlaceholder="Time Range"
                        enableClear={false}
                        maxDate={new Date()}
                    />
                    <ConnectionList />
                </Flex>
            </Flex>
            <SummaryMetrics pageSize={1000} />
            <TabGroup className="mt-3">
                <TabList>
                    <Tab>Summary</Tab>
                    <Tab>Trends</Tab>
                    <Tab>Breakdown</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <CostMetrics
                            categories={categoryOptions}
                            pageSize={1000}
                        />
                    </TabPanel>
                    <TabPanel>
                        <TrendsTab categories={categoryOptions} />
                    </TabPanel>
                    <TabPanel>
                        <CompositionTab top={5} />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </LoggedInLayout>
    )
}
