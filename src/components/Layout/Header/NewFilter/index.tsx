import { Card, Flex, Icon, Text } from '@tremor/react'
import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
    ChevronDownIcon,
    CloudIcon,
    TrashIcon,
} from '@heroicons/react/24/outline'
import { SourceType } from '../../../../api/api'
import { CloudConnect, Id } from '../../../../icons/icons'
import { useIntegrationApiV1ConnectionsSummariesList } from '../../../../api/integration.gen'
import CloudAccounts from './Filters/CloudAccounts'
import { compareArrays } from '../Filter'
import ConditionDropdown from '../../../../pages/Governance/Findings/Filter/ConditionDropdown'
import Connector from './Filters/Connector'

interface IFilters {
    selectedFilter: ('connector' | 'cloud-account')[]
    setSelectedFilter: (f: ('connector' | 'cloud-account')[]) => void
}

export default function NewFilter({
    selectedFilter,
    setSelectedFilter,
}: IFilters) {
    const defConnector = SourceType.Nil
    const [connector, setConnector] = useState<SourceType>(defConnector)
    const [connectionID, setConnectionID] = useState<string[] | undefined>([])
    const [connectionCon, setConnectionCon] = useState('is')

    const { response, isLoading } = useIntegrationApiV1ConnectionsSummariesList(
        {
            connector: connector.length ? [connector] : [],
            pageNumber: 1,
            pageSize: 10000,
            needCost: false,
            needResourceCount: false,
        }
    )

    const filterOptions = [
        {
            id: 'connector',
            name: 'Connector',
            icon: CloudConnect,
            component: (
                <Connector
                    value={connector}
                    defaultValue={defConnector}
                    onChange={(p) => setConnector(p)}
                />
            ),
            conditions: ['is'],
            setCondition: (c: string) => undefined,
            value: [connector],
            defaultValue: [defConnector],
            onDelete: () => setConnector(defConnector),
            findingOnly: false,
        },
        {
            id: 'connection',
            name: 'Cloud Account',
            icon: Id,
            component: (
                <CloudAccounts
                    value={connectionID}
                    defaultValue={[]}
                    data={response}
                    condition={connectionCon}
                    onChange={(o) => setConnectionID(o)}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setConnectionCon(c),
            value: connectionID,
            defaultValue: [],
            onDelete: () => setConnectionID([]),
            findingOnly: false,
        },
    ]

    const renderFilters = selectedFilter.map((sf) => {
        const f = filterOptions.find((o) => o.id === sf)
        return (
            <Popover className="relative border-0">
                <Popover.Button
                    id={f?.id}
                    className={`border ${
                        f?.id !== 'date' &&
                        compareArrays(
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            f?.value?.sort(),
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            f?.defaultValue?.sort()
                        )
                            ? 'border-gray-200 bg-white'
                            : 'border-kaytu-500 text-kaytu-500 bg-kaytu-50'
                    } py-1.5 px-2 rounded-md`}
                >
                    <Flex className="w-fit">
                        <Icon
                            icon={f?.icon || CloudIcon}
                            className="w-3 p-0 mr-3 text-inherit"
                        />
                        <Text className="text-inherit whitespace-nowrap">
                            {`${f?.name}${
                                compareArrays(
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    f?.value?.sort(),
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    f?.defaultValue?.sort()
                                )
                                    ? ''
                                    : `${
                                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                          // @ts-ignore
                                          f?.value && f.value.length < 2
                                              ? `: ${f.value}`
                                              : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                ` (${f?.value?.length})`
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
                    <Popover.Panel
                        static
                        className="absolute z-50 top-full left-0"
                    >
                        <Card className="mt-2 p-4 min-w-[256px] w-fit">
                            <Flex className="mb-3">
                                <Flex className="w-fit gap-1.5">
                                    <Text className="font-semibold">
                                        {f?.name}
                                    </Text>
                                    <ConditionDropdown
                                        onChange={(c) =>
                                            f?.setCondition
                                                ? f?.setCondition(c)
                                                : undefined
                                        }
                                        conditions={f?.conditions}
                                        isDate={f?.id === 'date'}
                                    />
                                </Flex>
                                {f?.onDelete && (
                                    <div className="group relative">
                                        <TrashIcon
                                            onClick={() => {
                                                f?.onDelete()
                                                setSelectedFilter(
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-ignore
                                                    (
                                                        prevState: (
                                                            | 'connector'
                                                            | 'cloud-account'
                                                        )[]
                                                    ) => {
                                                        return prevState.filter(
                                                            (s) => s !== f?.id
                                                        )
                                                    }
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
                            {f?.component}
                        </Card>
                    </Popover.Panel>
                </Transition>
            </Popover>
        )
    })

    return <Flex className="w-fit gap-4">{renderFilters}</Flex>
}
