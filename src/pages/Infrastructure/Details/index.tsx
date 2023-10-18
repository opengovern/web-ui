import { useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai/index'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import { useEffect, useState } from 'react'
import { filterAtom, timeAtom } from '../../../store'
import { checkGranularity } from '../../../utilities/dateComparator'
import Header from '../../../components/Header'
import Menu from '../../../components/Menu'
import Resources from './Tabs/Resources'

export default function InfrastructureDetails() {
    const navigate = useNavigate()
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedTab, setSelectedTab] = useState(0)
    const tabs = useLocation().hash
    useEffect(() => {
        switch (tabs) {
            case '#summary':
                setSelectedTab(0)
                break
            case '#cloud-accounts':
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

    const [isOnboarded, setIsOnboarded] = useState(true)

    return (
        <Menu currentPage="infrastructure">
            <Header breadCrumb={['Details']} filter datePicker />
            <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
                <TabList className="mb-3">
                    <Tab onClick={() => navigate('#summary')}>Summary</Tab>
                    <Tab onClick={() => navigate('#cloud-accounts')}>
                        Cloud accounts
                    </Tab>
                    <Tab onClick={() => navigate('#services')}>Services</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Resources
                            activeTimeRange={activeTimeRange}
                            connections={selectedConnections}
                            onboardState={isOnboarded}
                            onChange={setIsOnboarded}
                            isSummary
                        />
                    </TabPanel>
                    <TabPanel>hi</TabPanel>
                    <TabPanel>
                        <Resources
                            activeTimeRange={activeTimeRange}
                            connections={selectedConnections}
                            onboardState={isOnboarded}
                            onChange={setIsOnboarded}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </Menu>
    )
}
