import {
    Flex,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@tremor/react'
import { useEffect, useState } from 'react'

import ResourcesWithFailure from '../ResourcesWithFailure'
import ControlsWithFailure from '../ControlsWithFailure'

import Spinner from '../../../../components/Spinner'
import {
    SourceType,
    TypesFindingSeverity,
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
} from '../../../../api/api'
import { DateRange } from '../../../../utilities/urlstate'
import FailingCloudAccounts from '../FailingCloudAccounts'
import Events from '../Events'
import FindingsWithFailure from '../FindingsWithFailure'
interface ICount {
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
}
interface Props {
    query: ICount
    setSelectedGroup: Function
    tab: number
    setTab: Function
}
export default function AllIncidents({ query, setSelectedGroup ,tab,setTab}: Props) {
    return (
        <>
            <TabGroup
                index={tab}
                onIndexChange={(index) => {
                    setTab(index)
                }}
            >
                <TabList>
                    <Tab
                        onClick={() => {
                            setSelectedGroup('findings')
                            setTab(0)
                        }}
                    >
                        All Incidents
                    </Tab>
                    <Tab
                        onClick={() => {
                            setSelectedGroup('events')
                            setTab(1)
                        }}
                    >
                        Drift Events
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel key={'resource'}>
                        {tab == 0 && (
                            <>
                                <FindingsWithFailure query={query} />
                            </>
                        )}
                    </TabPanel>

                    <TabPanel key={'events'}>
                        {tab == 1 && <Events query={query} />}
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </>
    )
}
