import React, { useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import {
    Button,
    Flex,
    Metric,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@tremor/react'
import { DateRangePicker } from '@react-spectrum/datepicker'
import { Provider } from '@react-spectrum/provider'
import { theme } from '@react-spectrum/theme-default'
import { today, getLocalTimeZone } from '@internationalized/date'
import LoggedInLayout from '../../components/LoggedInLayout'
import { filterAtom, timeAtom } from '../../store'
import { useInventoryApiV2ResourcesTagList } from '../../api/inventory.gen'
import ConnectionList from '../../components/ConnectionList'
import SummaryTab from './Tabs/SummaryTab'
import TrendsTab from './Tabs/TrendsTab'
import CompositionTab from './Tabs/CompositionTab'

const Assets: React.FC<any> = () => {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
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
                    <Provider theme={theme}>
                        <DateRangePicker
                            value={activeTimeRange}
                            onChange={setActiveTimeRange}
                            maxValue={today(getLocalTimeZone())}
                        />
                    </Provider>
                    <ConnectionList />
                </Flex>
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

export default Assets
