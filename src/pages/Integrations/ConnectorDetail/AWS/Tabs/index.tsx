import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import Organizations from './Organizations'
import AccountList from './AccountList'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
} from '../../../../../api/api'

interface IAWS {
    accounts: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection[]
    organizations: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
    loading: boolean
}

export default function AWSTabs({ accounts, organizations, loading }: IAWS) {
    const [selectedTab, setSelectedTab] = useState(0)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const tabs = useLocation().hash
    useEffect(() => {
        if (tabs === '#organizations') {
            setSelectedTab(1)
        } else {
            setSelectedTab(0)
        }
    }, [tabs])
    return (
        <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
            <TabList className="mb-3">
                <Tab onClick={() => navigate(`#accounts?${searchParams}`)}>
                    AWS Accounts
                </Tab>
                <Tab onClick={() => navigate(`#organizations${searchParams}`)}>
                    Organizations
                </Tab>
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
