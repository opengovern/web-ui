import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import Menu from '../../../../../components/Menu'
import Policies from './Tabs/Policies'
import Assignments from './Tabs/Assignments'
import Findings from './Tabs/Findings'
import { filterAtom } from '../../../../../store'
import Header from '../../../../../components/Header'

export default function BenchmarkDetails() {
    const navigate = useNavigate()
    const { id } = useParams()
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedTab, setSelectedTab] = useState(0)
    const tabs = useLocation().hash
    useEffect(() => {
        switch (tabs) {
            case '#policies':
                setSelectedTab(0)
                break
            case '#connections':
                setSelectedTab(1)
                break
            case '#services':
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
        <Menu currentPage="compliance">
            <Header
                filter={
                    tabs === '#findings' ||
                    tabs === '#connections' ||
                    tabs === '#services'
                }
            />
            <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
                <TabList className="mb-3">
                    <Tab onClick={() => navigate('#policies')}>Policies</Tab>
                    <Tab onClick={() => navigate('#connections')}>
                        Connections
                    </Tab>
                    <Tab onClick={() => navigate('#services')}>Services</Tab>
                    <Tab onClick={() => navigate('#assignments')}>
                        Assignments
                    </Tab>
                    <Tab onClick={() => navigate('#findings')}>
                        All findings
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Policies id={id} />
                    </TabPanel>
                    <TabPanel>
                        <Findings id={id} connections={selectedConnections} />
                    </TabPanel>
                    <TabPanel>
                        <Findings id={id} connections={selectedConnections} />
                    </TabPanel>
                    <TabPanel>
                        <Assignments id={id} />
                    </TabPanel>
                    <TabPanel>
                        <Findings id={id} connections={selectedConnections} />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </Menu>
    )
}
