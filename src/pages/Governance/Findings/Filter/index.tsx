import { Card, Flex, Icon, Text } from '@tremor/react'
import { Popover, Transition } from '@headlessui/react'
import {
    ChevronDownIcon,
    CloudIcon,
    TrashIcon,
} from '@heroicons/react/24/outline'
import { Fragment, useEffect, useState } from 'react'
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

    const defOthers: string[] = []
    const [connectionID, setConnectionID] = useState<string[] | undefined>(
        defOthers
    )
    const [controlID, setControlID] = useState<string[] | undefined>(defOthers)
    const [benchmarkID, setBenchmarkID] = useState<string[] | undefined>(
        defOthers
    )
    const [resourceTypeID, setResourceTypeID] = useState<string[] | undefined>(
        defOthers
    )

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

    const options = [
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
            value: [connector],
            defaultValue: [defConnector],
            removable: false,
        },
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
            value: conformanceStatus,
            defaultValue: defConformanceStatus,
            removable: false,
        },
        {
            id: 'severity',
            name: 'Severity',
            icon: CloudIcon,
            component: (
                <Severity
                    value={severity}
                    defaultValue={defSeverity}
                    data={filters}
                    onChange={(s) => setSeverity(s)}
                />
            ),
            value: severity,
            defaultValue: defSeverity,
            removable: false,
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
            value: lifecycle,
            defaultValue: defLifecycle,
            removable: false,
        },
        {
            id: 'connection',
            name: 'Connection',
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
            value: connectionID,
            defaultValue: defOthers,
            removable: false,
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
            value: controlID,
            defaultValue: defOthers,
            removable: false,
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
            value: benchmarkID,
            defaultValue: defOthers,
            removable: false,
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
            value: resourceTypeID,
            defaultValue: defOthers,
            removable: false,
        },
    ]

    return (
        <Flex justifyContent="start" className="mt-4 gap-3 flex-wrap z-10">
            {options.map((f) => (
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
                                    <Text className="font-semibold">
                                        {f.name}
                                    </Text>
                                    {f.removable && (
                                        <div className="group relative">
                                            <TrashIcon className="w-4 cursor-pointer hover:text-kaytu-500" />
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
        </Flex>
    )
}
