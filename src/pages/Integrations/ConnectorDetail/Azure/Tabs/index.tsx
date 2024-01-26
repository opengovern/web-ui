import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import { useAtomValue } from 'jotai'
import Subscriptions from './Subscriptions'
import Principals from './Principals'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
} from '../../../../../api/api'
import { searchAtom } from '../../../../../utilities/urlstate'

interface IAzure {
    principals: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
    subscriptions: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection[]
    loading: boolean
}

export default function AzureTabs({
    principals,
    subscriptions,
    loading,
}: IAzure) {
    const [selectedTab, setSelectedTab] = useState(0)
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
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
                <Tab onClick={() => navigate(`#subscriptions?${searchParams}`)}>
                    Azure Subscriptions
                </Tab>
                <Tab onClick={() => navigate(`#principals${searchParams}`)}>
                    Principals
                </Tab>
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
