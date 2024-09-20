import { Flex, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
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
}
export default function Summary({ query, setSelectedGroup } : Props) {
    const [tab,setTab] = useState<number>(0);
    return (
        <>
            <TabGroup>
                <TabList>
                    <Tab
                        onClick={() => {
                            setSelectedGroup('accounts')
                            setTab(2)
                        }}
                    >
                        Account Summary
                    </Tab>
                    <Tab
                        onClick={() => {
                            setSelectedGroup('resources')
                            setTab(0)
                        }}
                    >
                        Resource Summary
                    </Tab>
                    <Tab
                        onClick={() => {
                            setSelectedGroup('controls')
                            setTab(1)
                        }}
                    >
                        Control Summary
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel key={'resource'}>
                        {tab ==  2 && (
                            <>
                                <FailingCloudAccounts query={query} />
                            </>
                        )}
                    </TabPanel>
                    <TabPanel key={'resource'}>
                        {tab == 0 && (
                            <>
                                <ResourcesWithFailure query={query} />
                            </>
                        )}
                    </TabPanel>
                    <TabPanel key={'control'}>
                        {tab == 1 && <ControlsWithFailure query={query} />}
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </>
    )
}
