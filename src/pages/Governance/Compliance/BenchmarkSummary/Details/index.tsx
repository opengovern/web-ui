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
            case '#assignments':
                setSelectedTab(1)
                break
            case '#findings':
                setSelectedTab(2)
                break
            default:
                setSelectedTab(0)
                break
        }
    }, [tabs])

    return (
        <Menu currentPage="compliance">
            <Header filter={tabs === '#findings'} />
            <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
                <TabList>
                    <Tab onClick={() => navigate('#policies')}>Policies</Tab>
                    <Tab onClick={() => navigate('#assignments')}>
                        Assignments
                    </Tab>
                    <Tab onClick={() => navigate('#findings')}>Findings</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Policies id={id} />
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
