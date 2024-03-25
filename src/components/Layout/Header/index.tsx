import { useAtomValue } from 'jotai'
import { Button, Flex, Title } from '@tremor/react'
import { ReactNode, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
    kebabCaseToLabel,
    snakeCaseToLabel,
} from '../../../utilities/labelMaker'
import { DateRange, defaultTime, searchAtom } from '../../../utilities/urlstate'
import FilterGroup, { IFilter } from '../../FilterGroup'
import {
    CloudAccountFilter,
    ConnectorFilter,
    DateFilter,
    SeverityFilter,
} from '../../FilterGroup/FilterTypes'
import { CheckboxItem } from '../../FilterGroup/CheckboxSelector'

interface IHeader {
    supportedFilters?: string[]
    initialFilters?: string[]
    datePickerDefault?: DateRange
    children?: ReactNode
    breadCrumb?: (string | undefined)[]
}

const cloudAccountsList: CheckboxItem[] = [
    { title: 'App-Development', value: '0e1757f9-6183-42e0-bcf7' },
    { title: 'Kaytu-Temp Sandbox', value: '0e1757f9-6183-42e0-bcf7' },
    { title: 'Sandbox', value: '0e1757f9-6183-42e0-bcf7' },
    { title: 'Kaytu', value: '0e1757f9-6183-42e0-bcf7' },
    { title: 'App-Production', value: '0e1757f9-6183-42e0-bcf7' },
    { title: 'App-Staging', value: '0e1757f9-6183-42e0-bcf7' },
]

export default function TopHeader({
    supportedFilters = [],
    initialFilters = [],
    children,
    datePickerDefault,
    breadCrumb,
}: IHeader) {
    const { ws } = useParams()
    const [addedFilters, setAddedFilters] = useState<string[]>(initialFilters)
    const [selectedConnectors, setSelectedConnectors] = useState<string>('All')
    const [selectedSeverities, setSelectedSeverities] = useState<string[]>([
        'Critical',
        'High',
        'Medium',
        'Low',
        'None',
    ])
    const [selectedCloudAccounts, setSelectedCloudAccounts] = useState<
        string[]
    >([])

    const filters: IFilter[] = [
        ConnectorFilter(
            selectedConnectors,
            selectedConnectors !== 'All',
            (sv) => setSelectedConnectors(sv.title),
            () =>
                setAddedFilters(addedFilters.filter((a) => a !== 'Connector')),
            () => setSelectedConnectors('All'),
            (i: any) => console.log(i) // onConditionChange
        ),

        SeverityFilter(
            selectedSeverities,
            selectedSeverities.length < 5,
            (sv) => {
                if (selectedSeverities.includes(sv.title)) {
                    setSelectedSeverities(
                        selectedSeverities.filter((i) => i !== sv.title)
                    )
                } else setSelectedSeverities([...selectedSeverities, sv.title])
            },
            () => setAddedFilters(addedFilters.filter((a) => a !== 'Severity')),
            () =>
                setSelectedSeverities([
                    'Critical',
                    'High',
                    'Medium',
                    'Low',
                    'None',
                ]),
            (i: any) => console.log(i) // onConditionChange
        ),

        CloudAccountFilter(
            cloudAccountsList,
            selectedCloudAccounts,
            selectedCloudAccounts.length > 0,
            (sv) => {
                if (selectedCloudAccounts.includes(sv.title)) {
                    setSelectedCloudAccounts(
                        selectedCloudAccounts.filter((i) => i !== sv.title)
                    )
                } else
                    setSelectedCloudAccounts([
                        ...selectedCloudAccounts,
                        sv.title,
                    ])
            },
            () =>
                setAddedFilters(
                    addedFilters.filter((a) => a !== 'Cloud Account')
                ),
            () => setSelectedCloudAccounts([]),
            (i: any) => console.log(i), // onConditionChange
            (i: any) => console.log(i)
        ),

        DateFilter(
            datePickerDefault || defaultTime(ws || ''),
            (sv) => console.log(sv),
            (i) => console.log(i)
        ),
    ]

    const activeFilters = filters.filter((v) => {
        return supportedFilters?.includes(v.title)
    })

    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
    const url = window.location.pathname.split('/')

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
                    <Flex justifyContent="start" className="w-fit">
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
                <Flex className="gap-3 w-fit">
                    {children}

                    <FilterGroup
                        filterList={activeFilters}
                        addedFilters={addedFilters}
                        onFilterAdded={(i) =>
                            setAddedFilters([i, ...addedFilters])
                        }
                        alignment="right"
                    />
                </Flex>
            </Flex>
        </div>
    )
}
