import { useAtomValue } from 'jotai'
import { Button, Card, Flex, Title } from '@tremor/react'
import { Fragment, ReactNode, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Popover, Transition } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import {
    kebabCaseToLabel,
    snakeCaseToLabel,
} from '../../../utilities/labelMaker'
import {
    DateRange,
    defaultTime,
    searchAtom,
    useFilterState,
} from '../../../utilities/urlstate'
import NewDatePicker from './NewDatePicker'
import NewFilter from './NewFilter'
import { CloudConnect, Id } from '../../../icons/icons'
import { SourceType } from '../../../api/api'

interface IHeader {
    filter?: boolean
    filterList?: string[]
    datePicker?: boolean
    datePickerDefault?: DateRange
    children?: ReactNode
    breadCrumb?: (string | undefined)[]
}

export default function TopHeader({
    filter = false,
    filterList = ['cloud-account', 'connector'],
    datePicker = false,
    children,
    datePickerDefault,
    breadCrumb,
}: IHeader) {
    const { ws } = useParams()
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
    const url = window.location.pathname.split('/')
    const { value: selectedConnectionFilters } = useFilterState()
    const defaultFilters = () => {
        const v: ('connector' | 'cloud-account')[] = []

        if (selectedConnectionFilters.connections.length > 0) {
            v.push('cloud-account')
            return v
        }

        if (selectedConnectionFilters.provider !== SourceType.Nil) {
            v.push('connector')
            return v
        }
        return v
    }

    const [selectedFilters, setSelectedFilters] = useState<
        ('connector' | 'cloud-account')[]
    >(defaultFilters())
    const filterOptions = [
        { id: 'connector', name: 'Connector', icon: CloudConnect },
        { id: 'cloud-account', name: 'Cloud Account', icon: Id },
    ].filter((v) => {
        return filterList.includes(v.id)
    })

    const mainPage = () => {
        if (url[1] === 'billing') {
            return 'Usage & Billing'
        }
        if (url[2] === 'score') {
            return 'SCORE'
        }
        if (url[2] === 'spend-metrics') {
            return 'Services'
        }
        if (url[2] === 'asset-metrics') {
            return 'Inventory'
        }
        return url[2] ? kebabCaseToLabel(url[2]) : 'Workspaces'
    }

    const subPages = () => {
        const pages = []
        for (let i = 3; i < url.length; i += 1) {
            pages.push(kebabCaseToLabel(url[i]))
        }
        return pages
    }

    const goBack = (n: number) => {
        let temp = '.'
        for (let i = 0; i < n; i += 1) {
            temp += '/..'
        }
        return temp
    }

    document.title = `${mainPage()} | Kaytu`

    return (
        <div className="px-12 z-10 absolute top-0 left-0 w-full flex h-16 items-center justify-center gap-x-4 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-sm">
            <Flex className="max-w-7xl">
                {subPages().length > 0 ? (
                    <Flex justifyContent="start">
                        <Button
                            onClick={() =>
                                navigate(
                                    `${goBack(
                                        subPages().length > 1
                                            ? subPages().length
                                            : 1
                                    )}?${searchParams}`
                                )
                            }
                            variant="light"
                            className="!text-lg mr-2 hover:text-kaytu-600"
                        >
                            {mainPage()}
                        </Button>
                        {subPages().map((page, i) => (
                            <Flex
                                key={page}
                                justifyContent="start"
                                className="w-fit mr-2"
                            >
                                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                                <Button
                                    onClick={() =>
                                        navigate(
                                            `${goBack(
                                                subPages().length - i - 1
                                            )}?${searchParams}`
                                        )
                                    }
                                    variant="light"
                                    className={`${
                                        i === subPages().length - 1
                                            ? 'text-black'
                                            : ''
                                    } opacity-100 ml-2 !text-lg`}
                                    disabled={i === subPages().length - 1}
                                >
                                    {i === subPages().length - 1 &&
                                    breadCrumb?.length
                                        ? breadCrumb
                                        : snakeCaseToLabel(page)}
                                </Button>
                            </Flex>
                        ))}
                    </Flex>
                ) : (
                    <Title className="font-semibold !text-xl whitespace-nowrap">
                        {mainPage()}
                    </Title>
                )}
                <Flex className="gap-3" justifyContent="end">
                    {children}
                    {filter && (
                        <NewFilter
                            selectedFilter={selectedFilters}
                            setSelectedFilter={setSelectedFilters}
                        />
                    )}
                    {datePicker && (
                        <Flex
                            className={`w-fit h-full ${
                                filter && selectedFilters.length > 0
                                    ? ' pl-3 border-l border-l-gray-200'
                                    : ''
                            }`}
                        >
                            <NewDatePicker
                                defaultTime={
                                    datePickerDefault || defaultTime(ws || '')
                                }
                            />
                        </Flex>
                    )}
                    {filter && selectedFilters.length < 2 && (
                        <Flex className="w-fit pl-3 border-l border-l-gray-200 h-full">
                            <Popover className="relative border-0">
                                <Popover.Button>
                                    <Button
                                        variant="light"
                                        icon={PlusIcon}
                                        className="pt-1"
                                    >
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
                                    <Popover.Panel className="absolute z-50 top-full right-0">
                                        <Card className="mt-2 p-4 w-64">
                                            <Flex
                                                flexDirection="col"
                                                justifyContent="start"
                                                alignItems="start"
                                                className="gap-1.5 max-h-[200px] overflow-y-scroll no-scroll max-w-full"
                                            >
                                                {filterOptions
                                                    .filter(
                                                        (f) =>
                                                            !selectedFilters.includes(
                                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                // @ts-ignore
                                                                f.id
                                                            )
                                                    )
                                                    .map((f) => (
                                                        <Button
                                                            icon={f.icon}
                                                            color="slate"
                                                            variant="light"
                                                            className="w-full pl-1 flex justify-start"
                                                            onClick={() => {
                                                                setSelectedFilters(
                                                                    [
                                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                        // @ts-ignore
                                                                        ...selectedFilters,
                                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                        // @ts-ignore
                                                                        f.id,
                                                                    ]
                                                                )
                                                            }}
                                                        >
                                                            {f.name}
                                                        </Button>
                                                    ))}
                                            </Flex>
                                        </Card>
                                    </Popover.Panel>
                                </Transition>
                            </Popover>
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </div>
    )
}
