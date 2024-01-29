import {
    Button,
    Card,
    Flex,
    Icon,
    Select,
    SelectItem,
    Text,
} from '@tremor/react'
import { Popover, Transition } from '@headlessui/react'
import {
    ChevronDownIcon,
    CloudIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline'
import { Fragment, useEffect, useState } from 'react'
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react'
import Provider from './Provider'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    SourceType,
    TypesFindingSeverity,
} from '../../../../api/api'
import ConformanceStatus from './ConformanceStatus'
import Severity from './Severity'
import { useComplianceApiV1FindingsFiltersCreate } from '../../../../api/compliance.gen'
import Others from './Others'
import FindingLifecycle from './FindingLifecycle'
import { compareArrays } from '../../../../components/Layout/Header/Filter'
import ConditionDropdown from './ConditionDropdown'

function removeItem<T>(arr: Array<T>, value: T): Array<T> {
    const index = arr.indexOf(value)
    if (index > -1) {
        arr.splice(index, 1)
    }
    return arr
}

interface IFilters {
    onApply: (obj: {
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
    }) => void
}

export default function Filter({ onApply }: IFilters) {
    const defConnector = SourceType.Nil
    const [connector, setConnector] = useState<SourceType>(defConnector)

    const defConformanceStatus = [
        GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed,
    ]
    const [conformanceStatus, setConformanceStatus] = useState<
        | GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus[]
        | undefined
    >(defConformanceStatus)

    const defLifecycle = [true, false]
    const [lifecycle, setLifecycle] = useState<boolean[]>(defLifecycle)

    const defSeverity = [
        TypesFindingSeverity.FindingSeverityCritical,
        TypesFindingSeverity.FindingSeverityHigh,
        TypesFindingSeverity.FindingSeverityMedium,
        TypesFindingSeverity.FindingSeverityLow,
        TypesFindingSeverity.FindingSeverityNone,
    ]
    const [severity, setSeverity] = useState<
        TypesFindingSeverity[] | undefined
    >(defSeverity)
    const [severityCon, setSeverityCon] = useState('is')

    const defOthers: string[] = []
    const [connectionID, setConnectionID] = useState<string[] | undefined>(
        defOthers
    )
    const [connectionCon, setConnectionCon] = useState('is')
    const [controlID, setControlID] = useState<string[] | undefined>(defOthers)
    const [controlCon, setControlCon] = useState('is')
    const [benchmarkID, setBenchmarkID] = useState<string[] | undefined>(
        defOthers
    )
    const [benchmarkCon, setBenchmarkCon] = useState('is')
    const [resourceTypeID, setResourceTypeID] = useState<string[] | undefined>(
        defOthers
    )
    const [resourceCon, setResourceCon] = useState('is')

    useEffect(() => {
        onApply({
            connector,
            conformanceStatus,
            severity,
            connectionID,
            controlID,
            benchmarkID,
            resourceTypeID,
            lifecycle,
        })
    }, [
        connector,
        conformanceStatus,
        severity,
        connectionID,
        controlID,
        benchmarkID,
        resourceTypeID,
        lifecycle,
    ])

    const { response: filters } = useComplianceApiV1FindingsFiltersCreate({})

    const filterCheckbox = useCheckboxState({ state: ['conformance_status'] })
    const filterOptions = [
        {
            id: 'conformance_status',
            name: 'Conformance Status',
            icon: CloudIcon,
            component: (
                <ConformanceStatus
                    value={conformanceStatus}
                    defaultValue={defConformanceStatus}
                    onChange={(c) => setConformanceStatus(c)}
                />
            ),
            conditions: ['is'],
            setCondition: (c: string) => console.log(c),
            value: conformanceStatus,
            defaultValue: defConformanceStatus,
            removable: false,
        },
        {
            id: 'provider',
            name: 'Provider',
            icon: CloudIcon,
            component: (
                <Provider
                    value={connector}
                    defaultValue={defConnector}
                    onChange={(p) => setConnector(p)}
                />
            ),
            conditions: ['is'],
            setCondition: (c: string) => console.log(c),
            value: [connector],
            defaultValue: [defConnector],
            removable: true,
        },
        {
            id: 'lifecycle',
            name: 'Lifecycle',
            icon: CloudIcon,
            component: (
                <FindingLifecycle
                    value={lifecycle}
                    defaultValue={defLifecycle}
                    onChange={(l) => setLifecycle(l)}
                />
            ),
            conditions: ['is'],
            setCondition: (c: string) => console.log(c),
            value: lifecycle,
            defaultValue: defLifecycle,
            removable: true,
        },
        {
            id: 'severity',
            name: 'Severity',
            icon: CloudIcon,
            component: (
                <Severity
                    value={severity}
                    defaultValue={defSeverity}
                    condition={severityCon}
                    data={filters}
                    onChange={(s) => setSeverity(s)}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setSeverityCon(c),
            value: severity,
            defaultValue: defSeverity,
            removable: true,
        },
        {
            id: 'connection',
            name: 'Cloud Account',
            icon: CloudIcon,
            component: (
                <Others
                    value={connectionID}
                    defaultValue={defOthers}
                    data={filters}
                    type="connectionID"
                    onChange={(o) => setConnectionID(o)}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setConnectionCon(c),
            value: connectionID,
            defaultValue: defOthers,
            removable: true,
        },
        {
            id: 'control',
            name: 'Control',
            icon: CloudIcon,
            component: (
                <Others
                    value={controlID}
                    defaultValue={defOthers}
                    data={filters}
                    type="controlID"
                    onChange={(o) => setControlID(o)}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setControlCon(c),
            value: controlID,
            defaultValue: defOthers,
            removable: true,
        },
        {
            id: 'benchmark',
            name: 'Benchmark',
            icon: CloudIcon,
            component: (
                <Others
                    value={benchmarkID}
                    defaultValue={defOthers}
                    data={filters}
                    type="benchmarkID"
                    onChange={(o) => setBenchmarkID(o)}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setBenchmarkCon(c),
            value: benchmarkID,
            defaultValue: defOthers,
            removable: true,
        },
        {
            id: 'resource',
            name: 'Resource Type',
            icon: CloudIcon,
            component: (
                <Others
                    value={resourceTypeID}
                    defaultValue={defOthers}
                    data={filters}
                    type="resourceTypeID"
                    onChange={(o) => setResourceTypeID(o)}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setResourceCon(c),
            value: resourceTypeID,
            defaultValue: defOthers,
            removable: true,
        },
    ]

    return (
        <Flex justifyContent="start" className="mt-4 gap-3 flex-wrap z-10">
            {filterOptions
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                .filter((f) => filterCheckbox.state.includes(f.id))
                .map((f) => (
                    <Popover className="relative border-0" key={f.id}>
                        <Popover.Button
                            className={`border ${
                                compareArrays(
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    f.value?.sort(),
                                    f.defaultValue?.sort()
                                )
                                    ? 'border-gray-400'
                                    : 'border-kaytu-500 text-kaytu-500'
                            } py-1 px-2 rounded-3xl`}
                        >
                            <Flex className="w-fit">
                                <Icon
                                    icon={f.icon}
                                    className="w-3 p-0 mr-3 text-inherit"
                                />
                                <Text className="text-inherit whitespace-nowrap">
                                    {`${f.name}${
                                        compareArrays(
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            f.value?.sort(),
                                            f.defaultValue?.sort()
                                        )
                                            ? ''
                                            : `${
                                                  f.value && f.value.length < 2
                                                      ? `: ${f.value}`
                                                      : `(${f.value?.length})`
                                              }`
                                    }`}
                                </Text>
                                <ChevronDownIcon className="ml-1 w-3 text-inherit" />
                            </Flex>
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
                            <Popover.Panel className="absolute z-50 top-full left-0">
                                <Card className="mt-2 p-4 w-64">
                                    <Flex className="mb-3">
                                        <Flex className="w-fit gap-1.5">
                                            <Text className="font-semibold">
                                                {f.name}
                                            </Text>
                                            <ConditionDropdown
                                                onChange={(c) =>
                                                    f.setCondition(c)
                                                }
                                                conditions={f.conditions}
                                            />
                                        </Flex>
                                        {f.removable && (
                                            <div className="group relative">
                                                <TrashIcon
                                                    onClick={() => {
                                                        console.log(
                                                            removeItem(
                                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                // @ts-ignore
                                                                filterCheckbox.state,
                                                                f.id
                                                            )
                                                        )
                                                        filterCheckbox.setState(
                                                            () =>
                                                                removeItem(
                                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                    // @ts-ignore
                                                                    filterCheckbox.state,
                                                                    f.id
                                                                )
                                                        )
                                                    }}
                                                    className="w-4 cursor-pointer hover:text-kaytu-500"
                                                />
                                                <Card className="absolute w-fit z-40 -top-2 left-full ml-2 scale-0 transition-all p-2 group-hover:scale-100">
                                                    <Text className="whitespace-nowrap">
                                                        Remove filter
                                                    </Text>
                                                </Card>
                                            </div>
                                        )}
                                    </Flex>
                                    {f.component}
                                </Card>
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                ))}
            <Flex className="w-fit pl-3 border-l border-l-gray-200">
                <Popover className="relative border-0">
                    <Popover.Button>
                        <Button variant="light" icon={PlusIcon}>
                            Add Filter
                        </Button>
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
                        <Popover.Panel className="absolute z-50 top-full left-0">
                            <Card className="mt-2 p-4 w-64">
                                <Flex
                                    flexDirection="col"
                                    justifyContent="start"
                                    alignItems="start"
                                    className="gap-1.5 max-h-[200px] overflow-y-scroll no-scroll max-w-full"
                                >
                                    {filterOptions
                                        .filter(
                                            (f) => f.id !== 'conformance_status'
                                        )
                                        .map((f) => (
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            <Checkbox
                                                shape="curve"
                                                className="!items-start w-[224px]"
                                                value={f.id}
                                                disabled={
                                                    f.id ===
                                                    'conformance_status'
                                                }
                                                {...filterCheckbox}
                                            >
                                                <Flex className="gap-1">
                                                    <Icon
                                                        icon={f.icon}
                                                        className="w-3 p-0 mr-3 text-inherit"
                                                    />
                                                    <Text>{f.name}</Text>
                                                </Flex>
                                            </Checkbox>
                                        ))}
                                </Flex>
                            </Card>
                        </Popover.Panel>
                    </Transition>
                </Popover>
            </Flex>
        </Flex>
    )
}
