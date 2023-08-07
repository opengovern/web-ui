import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import Subscriptions from './Subscriptions'
import Principals from './Principals'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
} from '../../../../../api/api'

interface IAzure {
    principals: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
    subscriptions: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    loading: boolean
}

export default function AzureTabs({
    principals,
    subscriptions,
    loading,
}: IAzure) {
    const [selectedTab, setSelectedTab] = useState(0)
    const navigate = useNavigate()
    const tabs = useLocation().hash
    useEffect(() => {
        if (tabs === '#principals') {
            setSelectedTab(1)
        } else {
            setSelectedTab(0)
        }
    }, [tabs])
    return (
        <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
            <TabList className="mb-3">
                <Tab onClick={() => navigate('#subscriptions')}>
                    Azure Subscriptions
                </Tab>
                <Tab onClick={() => navigate('#principals')}>Principals</Tab>
            </TabList>
            <TabPanels>
                <TabPanel key="sub">
                    <Subscriptions
                        subscriptions={subscriptions}
                        spns={principals}
                        loading={loading}
                    />
                </TabPanel>
                <TabPanel key="pri">
                    <Principals principals={principals} />
                </TabPanel>
            </TabPanels>
        </TabGroup>
    )
}
