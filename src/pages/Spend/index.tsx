import React, { useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import {
    Button,
    DateRangePicker,
    Flex,
    Metric,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
} from '@tremor/react'
import { FunnelIcon as FunnelIconOutline } from '@heroicons/react/24/outline'
import { FunnelIcon as FunnelIconSolid } from '@heroicons/react/24/solid'
import LoggedInLayout from '../../components/LoggedInLayout'
import { filterAtom, timeAtom } from '../../store'
import { useInventoryApiV2ResourcesTagList } from '../../api/inventory.gen'
import ConnectionList from '../../components/ConnectionList'
import SummaryTab from './Tabs/SummaryTab'
import TrendsTab from './Tabs/TrendsTab'
import CompositionTab from './Tabs/CompositionTab'

const Assets: React.FC<any> = () => {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)
    const [openDrawer, setOpenDrawer] = useState(false)
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

    const filterText = () => {
        if (selectedConnections.connections.length > 0) {
            return <Text>{selectedConnections.connections.length} Filters</Text>
        }
        if (selectedConnections.provider !== '') {
            return <Text>{selectedConnections.provider}</Text>
        }
        return 'Filters'
    }

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
                        {filterText()}
                    </Button>
                    <ConnectionList
                        open={openDrawer}
                        selectedConnectionsProps={selectedConnections}
                        onClose={(data: any) => handleDrawer(data)}
                    />
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
                            provider={selectedConnections.provider}
                            connections={selectedConnections.connections}
                            categories={categoryOptions}
                            timeRange={activeTimeRange}
                            pageSize={1000}
                        />
                    </TabPanel>
                    <TabPanel>
                        <TrendsTab
                            categories={categoryOptions}
                            timeRange={activeTimeRange}
                            connections={selectedConnections.connections}
                            provider={selectedConnections.provider}
                        />
                    </TabPanel>
                    <TabPanel>
                        <CompositionTab
                            connector={selectedConnections.provider}
                            connectionId={selectedConnections.connections}
                            top={5}
                            time={activeTimeRange}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </LoggedInLayout>
    )
}

export default Assets
