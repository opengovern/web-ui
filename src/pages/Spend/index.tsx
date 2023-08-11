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
import { useAtom, useAtomValue } from 'jotai'
import { useNavigate, useLocation } from 'react-router-dom'
import DateRangePicker from '../../components/DateRangePicker'
import Menu from '../../components/Menu'
import {
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsTagList,
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
import { isDemo } from '../../utilities/demo'

export default function Spend() {
    const navigate = useNavigate()
    const tab = useLocation().hash
    const [index, setIndex] = useState<number>(0)
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const { response: inventoryCategories, isLoading: categoriesLoading } =
        useInventoryApiV2AnalyticsTagList(
            {
                metricType: 'spend',
            },
            {
                ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
            }
        )

    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )
    const activeCategory =
        selectedResourceCategory === 'All Categories'
            ? ''
            : selectedResourceCategory
    const query = {
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix().toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix().toString(),
        }),
        pageSize: 5000,
        pageNumber: 1,
    }
    const {
        response: serviceCostResponse,
        isLoading: serviceCostLoading,
        error: serviceCostError,
        sendNow: serviceCostSendNow,
    } = useInventoryApiV2AnalyticsSpendMetricList(query)

    const {
        response: accountCostResponse,
        isLoading: accountCostLoading,
        error: accountCostError,
        sendNow: accountCostSendNow,
    } = useOnboardApiV1ConnectionsSummaryList({
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        connectionId: selectedConnections.connections,
        startTime: activeTimeRange.start.unix(),
        endTime: activeTimeRange.end.unix(),
        pageSize: 5000,
        pageNumber: 1,
        sortBy: 'cost',
        needResourceCount: false,
    })

    const categoryOptions = useMemo(() => {
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
        if (!inventoryCategories?.category)
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

    useEffect(() => {
        switch (tab) {
            case '#summary':
                setIndex(0)
                break
            case '#trends':
                setIndex(1)
                break
            case '#breakdowns':
                setIndex(2)
                break
            default:
                setIndex(0)
                break
        }
    }, [tab])

    return (
        <Menu currentPage="spend">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Metric>Spend</Metric>
                <Flex flexDirection="row" justifyContent="end">
                    <DateRangePicker isSpend />
                    <ConnectionList />
                </Flex>
            </Flex>
            <SummaryMetrics
                accountCostResponse={accountCostResponse}
                accountCostLoading={accountCostLoading}
                serviceCostResponse={serviceCostResponse}
                serviceCostLoading={serviceCostLoading}
            />
            <TabGroup className="mt-3" index={index} onIndexChange={setIndex}>
                <TabList>
                    <Tab onClick={() => navigate('#summary')}>Summary</Tab>
                    <Tab onClick={() => navigate('#trends')}>Trends</Tab>
                    <Tab onClick={() => navigate('#breakdowns')}>Breakdown</Tab>
                </TabList>
                <TabPanels className="mt-6">
                    <TabPanel>
                        <CostMetrics
                            categories={categoryOptions}
                            accountCostResponse={accountCostResponse}
                            serviceCostResponse={serviceCostResponse}
                            accountCostLoading={accountCostLoading}
                            serviceCostLoading={serviceCostLoading}
                            accountCostError={accountCostError}
                            accountCostSendNow={accountCostSendNow}
                            serviceCostError={serviceCostError}
                            serviceCostSendNow={serviceCostSendNow}
                        />
                    </TabPanel>
                    <TabPanel>{trendsTab}</TabPanel>
                    <TabPanel>{compositionTab}</TabPanel>
                </TabPanels>
            </TabGroup>
        </Menu>
    )
}
