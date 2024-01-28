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

export default function Findings() {
    const [tab, setTab] = useState(0)
    const [selectedGroup, setSelectedGroup] = useState<
        'findings' | 'resources' | 'controls' | 'accounts'
    >('findings')
    const [findingCount, setFindingCount] = useState<number | undefined>(
        undefined
    )
    const [resourceCount, setResourceCount] = useState<number | undefined>(
        undefined
    )
    const [controlCount, setControlCount] = useState<number | undefined>(
        undefined
    )
    const [accountCount, setAccountCount] = useState<number | undefined>(
        undefined
    )
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

    const tabs = [
        {
            type: 0,
            icon: ShieldExclamationIcon,
            name: 'Findings with failure',
            count: findingCount,
        },
        {
            type: 1,
            icon: DocumentCheckIcon,
            name: 'Resources with failure',
            count: resourceCount,
        },
        {
            type: 2,
            icon: ServerStackIcon,
            name: 'Controls with failure',
            count: controlCount,
        },
        {
            type: 3,
            icon: CloudIcon,
            name: 'Failing cloud accounts',
            count: accountCount,
        },
    ]

    const renderPanels = () => {
        switch (selectedGroup) {
            case 'findings':
                return (
                    <TabPanels className="mt-4">
                        <TabPanel>
                            <FindingsWithFailure
                                query={query}
                                count={(x) => setFindingCount(x)}
                            />
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
                                count={(x) => setFindingCount(x)}
                            />
                        </TabPanel>
                    </TabPanels>
                )
            case 'resources':
                return (
                    <TabPanels className="mt-4">
                        <TabPanel>
                            <ResourcesWithFailure
                                query={query}
                                count={(x) => setResourceCount(x)}
                            />
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
                                count={(x) => setResourceCount(x)}
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
                                count={(x) => setResourceCount(x)}
                            />
                        </TabPanel>
                        <TabPanel>
                            <ControlsWithFailure
                                // query={query}
                                count={(x) => setResourceCount(x)}
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
                                count={(x) => setResourceCount(x)}
                            />
                        </TabPanel>
                        <TabPanel>
                            <FailingCloudAccounts
                                // query={query}
                                count={(x) => setResourceCount(x)}
                            />
                        </TabPanel>
                    </TabPanels>
                )
            default:
                return (
                    <TabPanels className="mt-4">
                        <TabPanel>
                            <FindingsWithFailure
                                query={query}
                                count={(x) => setFindingCount(x)}
                            />
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
                        <Tab>Active Issues</Tab>
                    </TabList>
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
