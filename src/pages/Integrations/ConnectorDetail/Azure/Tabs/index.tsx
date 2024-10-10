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
import { Tabs } from '@cloudscape-design/components'

interface IAzure {
    principals: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
    subscriptions: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection[]
    loading: boolean
    credintalsSendNow: Function
    accountSendNow: Function
}

export default function AzureTabs({
    principals,
    subscriptions,
    loading,
    credintalsSendNow,
    accountSendNow
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
        <>
            <Tabs
                tabs={[
                    {
                        label: 'Azure Subscriptions',
                        id: '0',
                        content: (
                            <>
                                <Subscriptions
                                    subscriptions={subscriptions}
                                    spns={principals}
                                    loading={loading}
                                    accountSendNow={accountSendNow}
                                    credintalsSendNow={credintalsSendNow}
                                />
                            </>
                        ),
                    },
                    {
                        label: 'Principals',
                        id: '1',
                        content: (
                            <>
                                <Principals
                                    credintalsSendNow={credintalsSendNow}
                                    principals={principals}
                                />
                            </>
                        ),
                    },
                ]}
            />
            {/* <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
                <TabList className="mb-3">
                    <Tab
                        onClick={() =>
                            navigate(`#subscriptions?${searchParams}`)
                        }
                    >
                        Azure Subscriptions
                    </Tab>
                    <Tab onClick={() => navigate(`#principals${searchParams}`)}>
                        Principals
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel key="sub"></TabPanel>
                    <TabPanel key="pri"></TabPanel>
                </TabPanels>
            </TabGroup> */}
        </>
    )
}
