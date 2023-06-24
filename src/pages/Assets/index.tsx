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
} from '@tremor/react'
import { FunnelIcon } from '@heroicons/react/24/outline'
import LoggedInLayout from '../../components/LoggedInLayout'
import { filterAtom, timeAtom } from '../../store'
import { useInventoryApiV2ResourcesTagList } from '../../api/inventory.gen'
import { useOnboardApiV1SourcesList } from '../../api/onboard.gen'
import ConnectionList from './ConnectionList'
import SummaryTab from './SummaryTab'
import TrendsTab from './TrendsTab'
import CompositionTab from './CompositionTab/indedx'

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
        <LoggedInLayout>
            <main>
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    alignItems="center"
                >
                    <Title>Assets</Title>
                    <div className="flex flex-row justify-start items-start">
                        <DateRangePicker
                            className="max-w-md"
                            value={activeTimeRange}
                            onValueChange={setActiveTimeRange}
                            selectPlaceholder="Selection"
                        />
                        <Button
                            variant="light"
                            className="ml-2 mt-2"
                            onClick={() => setOpenDrawer(true)}
                        >
                            <FunnelIcon className="h-6 w-6" />
                        </Button>
                        <ConnectionList
                            connections={connections || []}
                            open={openDrawer}
                            selectedConnectionsProps={selectedConnections}
                            onClose={(data: any) => handleDrawer(data)}
                        />
                    </div>
                </Flex>

                <TabGroup className="mt-6">
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
                            />
                        </TabPanel>
                        <TabPanel>
                            {/* Main section */}
                            {/* <div className="h-96" /> */}
                            <TrendsTab
                                categories={categoryOptions}
                                timeRange={activeTimeRange}
                                connections={selectedConnections.connections}
                                count={5}
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
        </LoggedInLayout>
    )
}

export default Assets
