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
    loading: boolean
}

export default function AWSTabs({ accounts, organizations, loading }: IAWS) {
    return (
        <TabGroup>
            <TabList className="mb-3">
                <Tab>AWS Accounts</Tab>
                <Tab>Organizations</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <AccountList
                        accounts={accounts}
                        organizations={organizations}
                        loading={loading}
                    />
                </TabPanel>
                <TabPanel>
                    <Organizations
                        accounts={accounts}
                        organizations={organizations}
                    />
                </TabPanel>
            </TabPanels>
        </TabGroup>
    )
}
