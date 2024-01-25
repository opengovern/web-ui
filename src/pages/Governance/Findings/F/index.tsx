import { Card, Flex, Icon, Text } from '@tremor/react'
import { Popover, Transition } from '@headlessui/react'
import {
    ChevronDownIcon,
    CloudIcon,
    TrashIcon,
} from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'
import Provider from './Provider'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    SourceType,
} from '../../../../api/api'
import ConformanceStatus from './ConformanceStatus'

export default function Filter() {
    const [provider, setProvider] = useState<SourceType>(SourceType.Nil)
    const [conformanceStatus, setConformanceStatus] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus[]
    >([
        GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed,
    ])

    const options = [
        {
            id: 'provider',
            name: 'Provider',
            icon: CloudIcon,
            component: (
                <Provider value={provider} onChange={(p) => setProvider(p)} />
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
                <Provider value={provider} onChange={(p) => setProvider(p)} />
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
                            <Text className="text-inherit">{f.name}</Text>
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
                        <Popover.Panel className="absolute top-full left-0">
                            <Card className="mt-2 p-4 w-56">
                                <Flex className="mb-3">
                                    <Text>{f.name}</Text>
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
