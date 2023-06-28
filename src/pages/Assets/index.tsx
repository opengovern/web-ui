import React, { useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import {
    Button,
    DateRangePicker,
    Flex,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Title,
    Bold,
} from '@tremor/react'
import { FunnelIcon as FunnelIconOutline } from '@heroicons/react/24/outline'
import { FunnelIcon as FunnelIconSolid } from '@heroicons/react/24/solid'
import LoggedInLayout from '../../components/LoggedInLayout'
import { filterAtom, timeAtom } from '../../store'
import { useInventoryApiV2ResourcesTagList } from '../../api/inventory.gen'
import { useOnboardApiV1SourcesList } from '../../api/onboard.gen'
import ConnectionList from './ConnectionList'
import SummaryTab from './SummaryTab'
import TrendsTab from './TrendsTab'
import CompositionTab from './CompositionTab/indedx'
import ResourceMetricsDetails from './SubPages/ResourceMetricsDetails'
import AccountsDetails from './SubPages/AccountsDetails'
import Breadcrumbs from '../../components/Breadcrumbs'
import ServicesDetails from './SubPages/ServicesDetails'

const Assets: React.FC<any> = () => {
    const [activeSubPage, setActiveSubPage] = useState<
        | 'All'
        | 'Resource Metrics'
        | 'Accounts'
        | 'Services'
        | 'Regions'
        | 'Resources'
    >('All')
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)
    const [openDrawer, setOpenDrawer] = useState(false)
    const { response: connections } = useOnboardApiV1SourcesList()
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

    const handleDrawer = (data: any) => {
        if (openDrawer) {
            setSelectedConnections(data)
            setOpenDrawer(false)
        } else setOpenDrawer(true)
    }

    const renderSubPageAll = () => {
        return (
            <main>
                <TabGroup className="mt-3">
                    <TabList>
                        <Tab>Summary</Tab>
                        <Tab>Trends</Tab>
                        <Tab>Composition</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <SummaryTab
                                provider={selectedConnections.provider}
                                connections={selectedConnections.connections}
                                categories={categoryOptions}
                                timeRange={activeTimeRange}
                                pageSize={1000}
                                setActiveSubPage={setActiveSubPage}
                            />
                        </TabPanel>
                        <TabPanel>
                            {/* Main section */}
                            {/* <div className="h-96" /> */}
                            <TrendsTab
                                categories={categoryOptions}
                                timeRange={activeTimeRange}
                                connections={selectedConnections.connections}
                                provider={selectedConnections.provider}
                            />
                        </TabPanel>
                        <TabPanel>
                            {/* KPI section */}
                            {/* Placeholder to set height */}
                            {/* <div className="h-28" /> */}
                            <CompositionTab
                                connector={selectedConnections.provider}
                                top={5}
                                time={activeTimeRange}
                            />{' '}
                            {/* Composition */}
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </main>
        )
    }

    const breadcrubmsPages = [
        {
            name: 'Assets',
            path: () => {
                setActiveSubPage('All')
            },
            current: false,
        },
        { name: activeSubPage, path: '', current: true },
    ]

    return (
        <LoggedInLayout currentPage="assets">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                {activeSubPage === 'All' ? (
                    <Title>Assets</Title>
                ) : (
                    <Breadcrumbs pages={breadcrubmsPages} />
                )}
                <div className="flex flex-row justify-start items-start">
                    <DateRangePicker
                        className="max-w-md"
                        value={activeTimeRange}
                        onValueChange={setActiveTimeRange}
                        selectPlaceholder="Time Range"
                        enableClear={false}
                    />
                    <Button
                        variant="secondary"
                        className="ml-2 h-9"
                        onClick={() => setOpenDrawer(true)}
                        icon={
                            selectedConnections.connections.length > 0 ||
                            selectedConnections.provider !== ''
                                ? FunnelIconSolid
                                : FunnelIconOutline
                        }
                    >
                        {selectedConnections.connections.length > 0 ||
                        selectedConnections.provider !== '' ? (
                            <Bold>Filters</Bold>
                        ) : (
                            'Filters'
                        )}
                    </Button>
                    <ConnectionList
                        connections={connections || []}
                        open={openDrawer}
                        selectedConnectionsProps={selectedConnections}
                        onClose={(data: any) => handleDrawer(data)}
                    />
                </div>
            </Flex>
            {activeSubPage === 'All' && renderSubPageAll()}
            {activeSubPage === 'Resource Metrics' && (
                <ResourceMetricsDetails
                    provider={selectedConnections.provider}
                    connection={selectedConnections.connections}
                    categories={categoryOptions}
                    timeRange={activeTimeRange}
                    pageSize={1000}
                />
            )}
            {activeSubPage === 'Accounts' && (
                <AccountsDetails
                    selectedConnections={selectedConnections}
                    timeRange={activeTimeRange}
                />
            )}
            {activeSubPage === 'Services' && (
                <ServicesDetails
                    selectedConnections={selectedConnections}
                    timeRange={activeTimeRange}
                />
            )}
        </LoggedInLayout>
    )
}

export default Assets
