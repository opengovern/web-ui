import {
    Button,
    Card,
    Flex,
    Icon,
    Select,
    SelectItem,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@tremor/react'
import { Fragment, useState } from 'react'
import {
    CloudIcon,
    DocumentCheckIcon,
    PlusIcon,
    ServerStackIcon,
    ShieldExclamationIcon,
} from '@heroicons/react/24/outline'
import { Popover, Transition } from '@headlessui/react'
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
                    <Popover className="relative border-0">
                        <Popover.Button>
                            <Icon
                                icon={CloudIcon}
                                variant="outlined"
                                className="!ring-0 border border-gray-200 text-gray-800"
                            />
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute z-50 top-full right-0">
                                <Card className="mt-2 p-4 w-64">
                                    <Select
                                        value={selectedGroup}
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        onChange={(g) => setSelectedGroup(g)}
                                        enableClear={false}
                                        className="w-full"
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
                                </Card>
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                </Flex>
                <Filter onApply={(e) => setQuery(e)} />
                {renderPanels()}
            </TabGroup>
        </>
    )
}
