import React, { useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import {
    Button,
    DateRangePicker,
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Title,
} from '@tremor/react'
import { FunnelIcon } from '@heroicons/react/24/outline'
import Composition from '../../components/Blocks/Composition'
import Region from '../../components/Blocks/Region'
import SummaryMetrics from './SummaryMetrics'
import ResourceMetrics from './ResourceMetrics'
import GrowthTrend from './GrowthTrend'
import LoggedInLayout from '../../components/LoggedInLayout'
import { filterAtom, timeAtom } from '../../store'
import { useInventoryApiV2ResourcesTagList } from '../../api/inventory.gen'
import { useOnboardApiV1SourcesList } from '../../api/onboard.gen'
import ConnectionList from './ConnectionList'

const Assets: React.FC<any> = () => {
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

    return (
        <LoggedInLayout currentPage="assets">
            <main>
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    alignItems="center"
                >
                    <Title>Assets</Title>
                    <DateRangePicker
                        className="max-w-md"
                        value={activeTimeRange}
                        onValueChange={setActiveTimeRange}
                        selectPlaceholder="Selection"
                    />
                </Flex>

                <TabGroup className="mt-6">
                    <TabList>
                        <Tab>All</Tab>
                    </TabList>
                    <Flex flexDirection="row" justifyContent="end">
                        <Button
                            variant="light"
                            className="mt-4 mb-6"
                            onClick={() => setOpenDrawer(true)}
                        >
                            <FunnelIcon className="h-6 w-6" />
                        </Button>
                    </Flex>
                    <TabPanels>
                        <TabPanel>
                            <ConnectionList
                                connections={connections || []}
                                open={openDrawer}
                                selectedConnectionsProps={selectedConnections}
                                onClose={(data: any) => handleDrawer(data)}
                            />
                            <SummaryMetrics
                                provider={selectedConnections.provider}
                                connections={selectedConnections.connections}
                                timeRange={activeTimeRange}
                            />
                            <div className="mt-10">
                                <ResourceMetrics
                                    provider={selectedConnections.provider}
                                    // connection={selectedConnections.connections}
                                    categories={categoryOptions}
                                    timeRange={activeTimeRange}
                                    pageSize={1000}
                                />
                            </div>
                            {/* Main section */}
                            <div className="mt-20">
                                {/* <div className="h-96" /> */}
                                <GrowthTrend
                                    categories={categoryOptions}
                                    timeRange={activeTimeRange}
                                />
                            </div>

                            {/* KPI section */}
                            <Grid
                                numItemsMd={2}
                                className="mt-20 gap-6 flex justify-between"
                            >
                                <div className="w-full">
                                    {/* Placeholder to set height */}
                                    {/* <div className="h-28" /> */}
                                    <Composition
                                        connector={selectedConnections.provider}
                                        top={5}
                                        time={activeTimeRange}
                                    />{' '}
                                    {/* Composition */}
                                </div>
                                <div className="w-full">
                                    {/* Placeholder to set height */}
                                    {/* <div className="h-28" /> */}
                                    <Region
                                        provider={selectedConnections.provider}
                                        connections={
                                            selectedConnections.connections
                                        }
                                        count={5}
                                    />{' '}
                                    {/* region */}
                                </div>
                            </Grid>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </main>
        </LoggedInLayout>
    )
}

export default Assets
