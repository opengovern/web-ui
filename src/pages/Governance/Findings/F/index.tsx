import { Button, Card, Flex, Icon, Text } from '@tremor/react'
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
    }) => void
}

export default function Filter({ onApply }: IFilters) {
    const [open, isOpen] = useState(false)
    const [connector, setConnector] = useState<SourceType>(SourceType.Nil)
    const [conformanceStatus, setConformanceStatus] = useState<
        | GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus[]
        | undefined
    >([
        GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed,
    ])
    const [severity, setSeverity] = useState<
        TypesFindingSeverity[] | undefined
    >([
        TypesFindingSeverity.FindingSeverityCritical,
        TypesFindingSeverity.FindingSeverityHigh,
        TypesFindingSeverity.FindingSeverityMedium,
        TypesFindingSeverity.FindingSeverityLow,
        TypesFindingSeverity.FindingSeverityNone,
    ])
    const [connectionID, setConnectionID] = useState<string[] | undefined>([])
    const [controlID, setControlID] = useState<string[] | undefined>([])
    const [benchmarkID, setBenchmarkID] = useState<string[] | undefined>([])
    const [resourceTypeID, setResourceTypeID] = useState<string[] | undefined>(
        []
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
        })
    }, [
        connector,
        conformanceStatus,
        severity,
        connectionID,
        controlID,
        benchmarkID,
        resourceTypeID,
    ])

    const { response: filters, isLoading: filtersLoading } =
        useComplianceApiV1FindingsFiltersCreate({})

    const options = [
        {
            id: 'provider',
            name: 'Provider',
            icon: CloudIcon,
            component: (
                <Provider value={connector} onChange={(p) => setConnector(p)} />
            ),
            removable: false,
        },
        {
            id: 'conformance_status',
            name: 'Conformance Status',
            icon: CloudIcon,
            component: (
                <ConformanceStatus
                    value={conformanceStatus}
                    onChange={(c) => setConformanceStatus(c)}
                />
            ),
            removable: false,
        },
        {
            id: 'severity',
            name: 'Severity',
            icon: CloudIcon,
            component: (
                <Severity data={filters} onChange={(s) => setSeverity(s)} />
            ),
            removable: false,
        },
        {
            id: 'connection',
            name: 'Connection',
            icon: CloudIcon,
            component: (
                <Others
                    data={filters}
                    type="connectionID"
                    onChange={(o) => setConnectionID(o)}
                />
            ),
            removable: false,
        },
        {
            id: 'control',
            name: 'Control',
            icon: CloudIcon,
            component: (
                <Others
                    data={filters}
                    type="controlID"
                    onChange={(o) => setControlID(o)}
                />
            ),
            removable: false,
        },
        {
            id: 'benchmark',
            name: 'Benchmark',
            icon: CloudIcon,
            component: (
                <Others
                    data={filters}
                    type="benchmarkID"
                    onChange={(o) => setBenchmarkID(o)}
                />
            ),
            removable: false,
        },
        {
            id: 'resource',
            name: 'Resource Type',
            icon: CloudIcon,
            component: (
                <Others
                    data={filters}
                    type="resourceTypeID"
                    onChange={(o) => setResourceTypeID(o)}
                />
            ),
            removable: false,
        },
    ]

    return (
        <Flex justifyContent="start" className="mt-4 gap-3">
            {options.map((f) => (
                <Popover className="relative border-0 z-50" key={f.id}>
                    <Popover.Button className="border border-gray-400 py-1 px-2 rounded-3xl">
                        <Flex className="w-fit">
                            <Icon
                                icon={f.icon}
                                className="w-3 p-0 mr-3 text-inherit"
                            />
                            <Text className="text-inherit whitespace-nowrap">
                                {f.name}
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
