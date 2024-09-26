import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import { useAtomValue } from 'jotai'
import Organizations from './Organizations'
import AccountList from './AccountList'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
} from '../../../../../api/api'
import { searchAtom } from '../../../../../utilities/urlstate'

interface IAWS {
    accounts: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection[]
    organizations: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
    loading: boolean
}

export default function AWSTabs({ accounts, organizations, loading }: IAWS) {
    const [selectedTab, setSelectedTab] = useState(0)
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
    const tabs = useLocation().hash
    useEffect(() => {
        if (tabs === '#organizations') {
            setSelectedTab(1)
        } else {
            setSelectedTab(0)
        }
    }, [tabs])
    return (
        <>
            <AccountList
                accounts={accounts}
                organizations={organizations}
                loading={loading}
            />
        </>
    )
}
