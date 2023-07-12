import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import Organizations from './Organizations'
import AccountList from './AccountList'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
} from '../../../../../api/api'

interface IAWS {
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    organizations: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
}

export default function AWSTabs({ accounts, organizations }: IAWS) {
    return (
        <TabGroup>
            <TabList className="mb-3">
                <Tab>Organizations</Tab>
                <Tab>AWS Accounts</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Organizations
                        accounts={accounts}
                        organizations={organizations}
                    />
                </TabPanel>
                <TabPanel>
                    <AccountList
                        accounts={accounts}
                        organizations={organizations}
                    />
                </TabPanel>
            </TabPanels>
        </TabGroup>
    )
}
