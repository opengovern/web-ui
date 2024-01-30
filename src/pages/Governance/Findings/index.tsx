import {
    Flex,
    Select,
    SelectItem,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@tremor/react'
import { useState } from 'react'
import {
    CloudIcon,
    DocumentCheckIcon,
    ServerStackIcon,
    ShieldExclamationIcon,
} from '@heroicons/react/24/outline'
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
import { Popover } from '@headlessui/react'

export default function Findings() {
    const [tab, setTab] = useState(0)
    const [selectedGroup, setSelectedGroup] = useState<
        'findings' | 'resources' | 'controls' | 'accounts'
    >('findings')

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
    })

    const renderPanels = () => {
        switch (selectedGroup) {
            case 'findings':
                return (
                    <TabPanels className="mt-4">
                        <TabPanel>
                            <FindingsWithFailure query={query} />
                        </TabPanel>
                        <TabPanel>
                            <FindingsWithFailure
                                query={{
                                    ...query,
                                    conformanceStatus: [
                                        GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed,
                                    ],
                                    lifecycle: [true],
                                }}
                            />
                        </TabPanel>
                    </TabPanels>
                )
            case 'resources':
                return (
                    <TabPanels className="mt-4">
                        <TabPanel>
                            <ResourcesWithFailure query={query} />
                        </TabPanel>
                        <TabPanel>
                            <ResourcesWithFailure
                                query={{
                                    ...query,
                                    conformanceStatus: [
                                        GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed,
                                    ],
                                    lifecycle: [true],
                                }}
                            />
                        </TabPanel>
                    </TabPanels>
                )
            case 'controls':
                return (
                    <TabPanels className="mt-4">
                        <TabPanel>
                            <ControlsWithFailure
                            // query={query}
                            />
                        </TabPanel>
                        <TabPanel>
                            <ControlsWithFailure
                            // query={query}
                            />
                        </TabPanel>
                    </TabPanels>
                )
            case 'accounts':
                return (
                    <TabPanels className="mt-4">
                        <TabPanel>
                            <FailingCloudAccounts
                            // query={query}
                            />
                        </TabPanel>
                        <TabPanel>
                            <FailingCloudAccounts
                            // query={query}
                            />
                        </TabPanel>
                    </TabPanels>
                )
            default:
                return (
                    <TabPanels className="mt-4">
                        <TabPanel>
                            <FindingsWithFailure query={query} />
                        </TabPanel>
                    </TabPanels>
                )
        }
    }

    return (
        <>
            <TopHeader />
            <TabGroup index={tab} onIndexChange={setTab}>
                <Flex>
                    <TabList>
                        <Tab>All Findings</Tab>
                        {/* <Tab>Active Issues</Tab> */}
                    </TabList>
                    <Popover></Popover>
                    <Select
                        value={selectedGroup}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        onChange={(g) => setSelectedGroup(g)}
                        enableClear={false}
                        className="w-64"
                    >
                        <SelectItem value="findings">
                            Findings With Failure
                        </SelectItem>
                        <SelectItem value="resources">
                            Resources With Failure
                        </SelectItem>
                        <SelectItem value="controls">
                            Controls With Failure
                        </SelectItem>
                        <SelectItem value="accounts">
                            Cloud Accounts With Failure
                        </SelectItem>
                    </Select>
                </Flex>
                <Filter onApply={(e) => setQuery(e)} />
                {renderPanels()}
            </TabGroup>
        </>
    )
}
