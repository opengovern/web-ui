import {
    Button,
    Card,
    Flex,
    Icon,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
} from '@tremor/react'
import { Fragment, useState } from 'react'
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
import { BulletList } from '../../../icons/icons'
import { DateRange } from '../../../utilities/urlstate'
import Events from './Events'

export default function Findings() {
    const [tab, setTab] = useState(0)
    const [selectedGroup, setSelectedGroup] = useState<
        'findings' | 'resources' | 'controls' | 'accounts' | 'events'
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
        activeTimeRange: DateRange | undefined
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
    })

    const renderPanels = () => {
        switch (selectedGroup) {
            case 'findings':
                return <FindingsWithFailure query={query} />
            case 'resources':
                return <ResourcesWithFailure query={query} />
            case 'controls':
                return <ControlsWithFailure query={query} />
            case 'accounts':
                return <FailingCloudAccounts query={query} />
            case 'events':
                return <Events query={query} />
            default:
                return <FindingsWithFailure query={query} />
        }
    }

    return (
        <>
            <TopHeader />
            <TabGroup index={tab} onIndexChange={setTab}>
                <Flex>
                    <TabList>
                        <Tab>All Findings</Tab>
                    </TabList>
                    <Popover className="relative border-0">
                        <Popover.Button>
                            <Icon
                                icon={BulletList}
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
                                    <Text className="mb-3 font-semibold">
                                        View Options
                                    </Text>
                                    <Flex
                                        flexDirection="col"
                                        justifyContent="start"
                                        alignItems="start"
                                        className="gap-2"
                                    >
                                        <Button
                                            variant="light"
                                            color="slate"
                                            disabled={
                                                selectedGroup === 'findings'
                                            }
                                            onClick={() =>
                                                setSelectedGroup('findings')
                                            }
                                        >
                                            Findings
                                        </Button>
                                        <Button
                                            variant="light"
                                            color="slate"
                                            disabled={
                                                selectedGroup === 'resources'
                                            }
                                            onClick={() =>
                                                setSelectedGroup('resources')
                                            }
                                        >
                                            Resources
                                        </Button>
                                        <Button
                                            variant="light"
                                            color="slate"
                                            disabled={
                                                selectedGroup === 'events'
                                            }
                                            onClick={() =>
                                                setSelectedGroup('events')
                                            }
                                        >
                                            Security Events
                                        </Button>
                                        <Button
                                            variant="light"
                                            color="slate"
                                            disabled={
                                                selectedGroup === 'controls'
                                            }
                                            onClick={() =>
                                                setSelectedGroup('controls')
                                            }
                                        >
                                            Controls
                                        </Button>
                                        <Button
                                            variant="light"
                                            color="slate"
                                            disabled={
                                                selectedGroup === 'accounts'
                                            }
                                            onClick={() =>
                                                setSelectedGroup('accounts')
                                            }
                                        >
                                            Cloud Accounts
                                        </Button>
                                    </Flex>
                                </Card>
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                </Flex>
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
                    <TabPanel>{renderPanels()}</TabPanel>
                </TabPanels>
            </TabGroup>
        </>
    )
}
