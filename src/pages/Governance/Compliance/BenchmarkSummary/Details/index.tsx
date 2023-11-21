import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import Layout from '../../../../../components/Layout'
import Policies from './Tabs/Policies'
import Assignments from './Tabs/Assignments'
import Findings from './Tabs/Findings'
import { filterAtom } from '../../../../../store'
import Header from '../../../../../components/Header'
import CloudAccounts from './Tabs/CloudAccounts'
import Services from './Tabs/Services'

export default function BenchmarkDetails() {
    const navigate = useNavigate()
    const { id, resourceId } = useParams()
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedTab, setSelectedTab] = useState(0)
    const tabs = useLocation().hash
    useEffect(() => {
        switch (tabs) {
            case '#policies':
                setSelectedTab(0)
                break
            case '#cloud-accounts':
                setSelectedTab(1)
                break
            case '#resources':
                setSelectedTab(2)
                break
            case '#assignments':
                setSelectedTab(3)
                break
            case '#findings':
                setSelectedTab(4)
                break
            default:
                setSelectedTab(0)
                break
        }
    }, [tabs])

    return (
        <Layout currentPage="compliance">
            <Header
                filter={
                    tabs === '#findings' ||
                    tabs === '#cloud-accounts' ||
                    tabs === '#resources'
                }
            />
            <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
                <TabList className="mb-3">
                    <Tab onClick={() => navigate('#policies')}>Policies</Tab>
                    <Tab onClick={() => navigate('#cloud-accounts')}>
                        Cloud accounts
                    </Tab>
                    <Tab onClick={() => navigate('#resources')}>Resources</Tab>
                    <Tab onClick={() => navigate('#assignments')}>
                        Assignments
                    </Tab>
                    <Tab onClick={() => navigate('#findings')}>
                        All findings
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {selectedTab === 0 && <Policies id={id} />}
                    </TabPanel>
                    <TabPanel>
                        {selectedTab === 1 && (
                            <CloudAccounts
                                id={id}
                                connections={selectedConnections}
                                resourceId={resourceId}
                            />
                        )}
                    </TabPanel>
                    <TabPanel>
                        {selectedTab === 2 && (
                            <Services
                                id={id}
                                connections={selectedConnections}
                                resourceId={resourceId}
                            />
                        )}
                    </TabPanel>
                    <TabPanel>
                        {selectedTab === 3 && <Assignments id={id} />}
                    </TabPanel>
                    <TabPanel>
                        {selectedTab === 4 && (
                            <Findings
                                id={id}
                                connections={selectedConnections}
                                resourceId={resourceId}
                            />
                        )}
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </Layout>
    )
}
