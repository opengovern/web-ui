import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import { useEffect, useState } from 'react'
import FindingsWithFailure from './FindingsWithFailure'
import TopHeader from '../../../components/Layout/Header'
import Filter from './Filter'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    SourceType,
    TypesFindingSeverity,
} from '../../../api/api'
import ResourcesWithFailure from './ResourcesWithFailure'
import ControlsWithFailure from './ControlsWithFailure'
import FailingCloudAccounts from './FailingCloudAccounts'
import { DateRange } from '../../../utilities/urlstate'
import Events from './Events'

export default function Findings() {
    const [tab, setTab] = useState(0)
    const [selectedGroup, setSelectedGroup] = useState<
        'findings' | 'resources' | 'controls' | 'accounts' | 'events'
    >('findings')
    useEffect(() => {
        switch (tab) {
            case 0:
                setSelectedGroup('findings')
                break
            case 1:
                setSelectedGroup('resources')
                break
            case 2:
                setSelectedGroup('events')
                break
            case 3:
                setSelectedGroup('accounts')
                break
            case 4:
                setSelectedGroup('controls')
                break
            default:
                setSelectedGroup('findings')
                break
        }
    }, [tab])

    const [query, setQuery] = useState<{
        connector: SourceType
        conformanceStatus:
            | GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus[]
            | undefined
        severity: TypesFindingSeverity[] | undefined
        connectionID: string[] | undefined
        controlID: string[] | undefined
        benchmarkID: string[] | undefined
        resourceTypeID: string[] | undefined
        lifecycle: boolean[] | undefined
        activeTimeRange: DateRange | undefined
        eventTimeRange: DateRange | undefined
    }>({
        connector: SourceType.Nil,
        conformanceStatus: [
            GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed,
        ],
        severity: [
            TypesFindingSeverity.FindingSeverityCritical,
            TypesFindingSeverity.FindingSeverityHigh,
            TypesFindingSeverity.FindingSeverityMedium,
            TypesFindingSeverity.FindingSeverityLow,
            TypesFindingSeverity.FindingSeverityNone,
        ],
        connectionID: [],
        controlID: [],
        benchmarkID: [],
        resourceTypeID: [],
        lifecycle: [true, false],
        activeTimeRange: undefined,
        eventTimeRange: undefined,
    })

    return (
        <>
            <TopHeader />
            <TabGroup index={tab} onIndexChange={setTab}>
                <TabList>
                    <Tab>Findings</Tab>
                    <Tab>Resources</Tab>
                    <Tab>Events</Tab>
                    <Tab>Accounts</Tab>
                    <Tab>Controls</Tab>
                </TabList>
                <Filter
                    isFinding={
                        selectedGroup === 'findings' ||
                        selectedGroup === 'resources' ||
                        selectedGroup === 'events'
                    }
                    type={selectedGroup}
                    onApply={(e) => setQuery(e)}
                />
                <TabPanels className="mt-4">
                    <TabPanel>
                        <FindingsWithFailure query={query} />
                    </TabPanel>
                    <TabPanel>
                        <ResourcesWithFailure query={query} />
                    </TabPanel>
                    <TabPanel>
                        <Events query={query} />
                    </TabPanel>
                    <TabPanel>
                        <FailingCloudAccounts query={query} />
                    </TabPanel>
                    <TabPanel>
                        <ControlsWithFailure query={query} />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </>
    )
}
