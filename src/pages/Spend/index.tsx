import React, { useEffect, useMemo, useState } from 'react'
import {
    Flex,
    Metric,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@tremor/react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import DateRangePicker from '../../components/DateRangePicker'
import LoggedInLayout from '../../components/LoggedInLayout'
import {
    useInventoryApiV2CostMetricList,
    useInventoryApiV2ResourcesTagList,
} from '../../api/inventory.gen'
import ConnectionList from '../../components/ConnectionList'
import TrendsTab from './Tabs/TrendsTab'
import CompositionTab from './Tabs/CompositionTab'
import {
    filterAtom,
    selectedResourceCategoryAtom,
    spendTimeAtom,
} from '../../store'
import SummaryMetrics from './SummaryMetrics'
import CostMetrics from './Tabs/CostMetrics'
import { useOnboardApiV1ConnectionsSummaryList } from '../../api/onboard.gen'

export default function Spend() {
    const [index, setIndex] = useState<number>(0)
    const [activeTimeRange, setActiveTimeRange] = useAtom(spendTimeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)
    const { response: inventoryCategories } =
        useInventoryApiV2ResourcesTagList()
    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )
    const activeCategory =
        selectedResourceCategory === 'All Categories'
            ? ''
            : selectedResourceCategory
    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
        ...(activeTimeRange.start && {
            startTime: dayjs(activeTimeRange.start.toString())
                .unix()
                .toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: dayjs(activeTimeRange.end.toString()).unix().toString(),
        }),
        pageSize: 5000,
        pageNumber: 1,
    }
    const { response: serviceCostResponse, isLoading: serviceCostLoading } =
        useInventoryApiV2CostMetricList(query)

    const { response: accountCostResponse, isLoading: accountCostLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: [selectedConnections.provider],
            connectionId: selectedConnections.connections,
            startTime: dayjs(activeTimeRange.start.toString()).unix(),
            endTime: dayjs(activeTimeRange.end.toString()).unix(),
            pageSize: 5000,
            pageNumber: 1,
            sortBy: 'cost',
        })

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

    const [trendsTab, setTrendsTab] = useState<React.ReactNode>()
    const [compositionTab, setCompositionTab] = useState<React.ReactNode>()

    useEffect(() => {
        if (index === 1 && trendsTab === undefined) {
            setTrendsTab(<TrendsTab categories={categoryOptions} />)
        }
        if (index === 2 && compositionTab === undefined) {
            setCompositionTab(<CompositionTab top={5} />)
        }
    }, [index])

    return (
        <LoggedInLayout currentPage="spend">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Metric>Spend</Metric>
                <Flex flexDirection="row" justifyContent="end">
                    <DateRangePicker />
                    <ConnectionList />
                </Flex>
            </Flex>
            <SummaryMetrics
                accountCostResponse={accountCostResponse}
                serviceCostResponse={serviceCostResponse}
                accountCostLoading={accountCostLoading}
                serviceCostLoading={serviceCostLoading}
            />
            <TabGroup className="mt-3" index={index} onIndexChange={setIndex}>
                <TabList>
                    <Tab>Summary</Tab>
                    <Tab>Trends</Tab>
                    <Tab>Breakdown</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <CostMetrics
                            categories={categoryOptions}
                            accountCostResponse={accountCostResponse}
                            serviceCostResponse={serviceCostResponse}
                            accountCostLoading={accountCostLoading}
                            serviceCostLoading={serviceCostLoading}
                        />
                    </TabPanel>
                    <TabPanel>{trendsTab}</TabPanel>
                    <TabPanel>{compositionTab}</TabPanel>
                </TabPanels>
            </TabGroup>
        </LoggedInLayout>
    )
}
