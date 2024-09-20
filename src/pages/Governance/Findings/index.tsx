import { Flex, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
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
import {
    DateRange,
    useURLParam,
    useURLState,
} from '../../../utilities/urlstate'
import Events from './Events'
import Spinner from '../../../components/Spinner'

export default function Findings() {
    const [tab, setTab] = useState<number>(0);
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
    useEffect(() => {
        const url = window.location.pathname.split('/')[4]
        switch (url) {
            case 'resource-summary':
                setTab(1)
                break
            case 'drift-events':
                setTab(2)
                break
            case 'account-posture':
                setTab(3)
                break
            case 'control-summary':
                setTab(4)
                break
            default:
                setTab(0)
                break
        }
    }, [window.location.pathname])
    const findComponent = () => {
        switch (tab) {
            case 0:
                return <FindingsWithFailure query={query} />
            case 1:
                return <ResourcesWithFailure query={query} />
            case 2:
               return <Events query={query} />
            case 3:
               return <FailingCloudAccounts query={query} />
            case 4:
                return <ControlsWithFailure query={query} />
            default:
                return <Spinner/>
        }
    }

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
            <Filter type={selectedGroup} onApply={(e) => setQuery(e)} />
            <Flex className="mt-2">{findComponent()}</Flex>
        </>
    )
}
