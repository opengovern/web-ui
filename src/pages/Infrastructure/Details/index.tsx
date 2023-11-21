import { useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai/index'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import { useEffect, useState } from 'react'
import { filterAtom, timeAtom } from '../../../store'
import { checkGranularity } from '../../../utilities/dateComparator'
import Header from '../../../components/Header'
import Layout from '../../../components/Layout'
import Resources from './Tabs/Resources'
import CloudAccounts from './Tabs/CloudAccounts'

export default function InfrastructureDetails() {
    const navigate = useNavigate()
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const url = window.location.pathname.split('/')

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

    return (
        <Layout
            currentPage={
                url.includes('resource-collection')
                    ? 'resource-collection'
                    : 'infrastructure'
            }
        >
            <Header breadCrumb={['Infrastructure detail']} filter datePicker />
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
                            isSummary
                        />
                    </TabPanel>
                    <TabPanel>
                        <CloudAccounts
                            activeTimeRange={activeTimeRange}
                            connections={selectedConnections}
                        />
                    </TabPanel>
                    <TabPanel>
                        <Resources
                            activeTimeRange={activeTimeRange}
                            connections={selectedConnections}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </Layout>
    )
}
