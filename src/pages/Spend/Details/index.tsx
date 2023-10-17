import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai/index'
import { useEffect, useState } from 'react'
import Menu from '../../../components/Menu'
import Header from '../../../components/Header'
import Services from './Tabs/Services'
import { checkGranularity } from '../../../utilities/dateComparator'
import { filterAtom, spendTimeAtom } from '../../../store'
import Connections from './Tabs/Connections'

export default function SpendDetails() {
    const navigate = useNavigate()
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedTab, setSelectedTab] = useState(0)
    const tabs = useLocation().hash
    useEffect(() => {
        switch (tabs) {
            case '#summary':
                setSelectedTab(0)
                break
            case '#connections':
                setSelectedTab(1)
                break
            case '#services':
                setSelectedTab(2)
                break
            default:
                setSelectedTab(0)
                break
        }
    }, [tabs])
    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'none'
    >(
        checkGranularity(activeTimeRange.start, activeTimeRange.end).monthly
            ? 'monthly'
            : 'daily'
    )
    useEffect(() => {
        setSelectedGranularity(
            checkGranularity(activeTimeRange.start, activeTimeRange.end).monthly
                ? 'monthly'
                : 'daily'
        )
    }, [activeTimeRange])

    return (
        <Menu currentPage="spend">
            <Header breadCrumb={['Spend detail']} filter datePicker />
            <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
                <TabList className="mb-3">
                    <Tab onClick={() => navigate('#summary')}>Summary</Tab>
                    <Tab onClick={() => navigate('#connections')}>
                        Connections
                    </Tab>
                    <Tab onClick={() => navigate('#services')}>Services</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Services
                            activeTimeRange={activeTimeRange}
                            connections={selectedConnections}
                            selectedGranularity={selectedGranularity}
                            onGranularityChange={setSelectedGranularity}
                            isSummary
                        />
                    </TabPanel>
                    <TabPanel>
                        <Connections
                            activeTimeRange={activeTimeRange}
                            connections={selectedConnections}
                            selectedGranularity={selectedGranularity}
                            onGranularityChange={setSelectedGranularity}
                        />
                    </TabPanel>
                    <TabPanel>
                        <Services
                            activeTimeRange={activeTimeRange}
                            connections={selectedConnections}
                            selectedGranularity={selectedGranularity}
                            onGranularityChange={setSelectedGranularity}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </Menu>
    )
}
