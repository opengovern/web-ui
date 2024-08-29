import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import { useAtomValue } from 'jotai'
import Directories from './Directories'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
} from '../../../../../api/api'
import { searchAtom } from '../../../../../utilities/urlstate'

interface IEntraID {
    directories: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
    loading: boolean
}

export default function EntraIDTabs({ directories, loading }: IEntraID) {
    const [selectedTab, setSelectedTab] = useState(0)
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
    const tabs = useLocation().hash
    useEffect(() => {
        if (tabs === '#directories') {
            setSelectedTab(0)
        }
    }, [tabs])
    return (
        <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
            <TabList className="mb-3">
                <Tab onClick={() => navigate(`#directories?${searchParams}`)}>
                    EntraID Directories
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel key="pri">
                    <Directories directories={directories} />
                </TabPanel>
            </TabPanels>
        </TabGroup>
    )
}
