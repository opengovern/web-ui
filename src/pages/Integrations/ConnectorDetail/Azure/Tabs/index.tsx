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
    return (
        <TabGroup>
            <TabList className="mb-3">
                <Tab>Azure Subscriptions</Tab>
                <Tab>Principals</Tab>
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
