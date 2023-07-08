import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import Organizations from './Organizations'
import AccountList from './AccountList'

interface IAWS {
    accounts: any
    organizations: any
}

export default function AWSPanels({ accounts, organizations }: IAWS) {
    return (
        <TabGroup>
            <TabList className="mb-3">
                <Tab>Organizations</Tab>
                <Tab>AWS Accounts</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Organizations organizations={organizations} />
                </TabPanel>
                <TabPanel>
                    <AccountList accounts={accounts} />
                </TabPanel>
            </TabPanels>
        </TabGroup>
    )
}
