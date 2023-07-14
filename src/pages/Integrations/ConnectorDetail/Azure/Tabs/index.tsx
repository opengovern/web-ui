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
}

export default function AzureTabs({ principals, subscriptions }: IAzure) {
    return (
        <TabGroup>
            <TabList className="mb-3">
                <Tab>Azure Subscriptions</Tab>
                <Tab>Principals</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Subscriptions
                        subscriptions={subscriptions}
                        spns={principals}
                    />
                </TabPanel>
                <TabPanel>
                    <Principals principals={principals} />
                </TabPanel>
            </TabPanels>
        </TabGroup>
    )
}
