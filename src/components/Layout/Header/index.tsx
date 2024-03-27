import { useAtomValue } from 'jotai'
import { Button, Flex, Title } from '@tremor/react'
import { ReactNode, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
    kebabCaseToLabel,
    snakeCaseToLabel,
} from '../../../utilities/labelMaker'
import {
    DateRange,
    defaultTime,
    searchAtom,
    useFilterState,
    useURLParam,
    useURLState,
    useUrlDateRangeState,
} from '../../../utilities/urlstate'
import FilterGroup, { IFilter } from '../../FilterGroup'
import {
    CloudAccountFilter,
    ConnectorFilter,
    DateFilter,
    SeverityFilter,
} from '../../FilterGroup/FilterTypes'
import { CheckboxItem } from '../../FilterGroup/CheckboxSelector'
import { useIntegrationApiV1ConnectionsSummariesList } from '../../../api/integration.gen'
import { DateSelectorOptions } from '../../FilterGroup/ConditionSelector/DateConditionSelector'

interface IHeader {
    supportedFilters?: string[]
    initialFilters?: string[]
    datePickerDefault?: DateRange
    children?: ReactNode
    breadCrumb?: (string | undefined)[]
}

export default function TopHeader({
    supportedFilters = [],
    initialFilters = [],
    children,
    datePickerDefault,
    breadCrumb,
}: IHeader) {
    const { ws } = useParams()
    const { value: activeTimeRange, setValue: setActiveTimeRange } =
        useUrlDateRangeState(datePickerDefault || defaultTime(ws || ''))
    const [selectedDateCondition, setSelectedDateCondition] =
        useState<DateSelectorOptions>('isBetween')
    const [addedFilters, setAddedFilters] = useState<string[]>(initialFilters)
    const [selectedConnectors, setSelectedConnectors] = useURLParam<
        '' | 'AWS' | 'Azure'
    >('provider', '')
    const parseConnector = (v: string) => {
        switch (v) {
            case 'AWS':
                return 'AWS'
            case 'Azure':
                return 'Azure'
            default:
                return ''
        }
    }
    const [selectedSeverities, setSelectedSeverities] = useURLState<string[]>(
        ['critical', 'high', 'medium', 'low', 'none'],
        (v) => {
            const res = new Map<string, string[]>()
            res.set('severities', v)
            return res
        },
        (v) => {
            return v.get('severities') || []
        }
    )
    const [selectedCloudAccounts, setSelectedCloudAccounts] = useURLState<
        string[]
    >(
        [],
        (v) => {
            const res = new Map<string, string[]>()
            res.set('connections', v)
            return res
        },
        (v) => {
            return v.get('connections') || []
        }
    )
    const [connectionSearch, setConnectionSearch] = useState('')
    const { response } = useIntegrationApiV1ConnectionsSummariesList({
        connector: selectedConnectors.length ? [selectedConnectors] : [],
        pageNumber: 1,
        pageSize: 10000,
        needCost: false,
        needResourceCount: false,
    })

    const filters: IFilter[] = [
        ConnectorFilter(
            selectedConnectors,
            selectedConnectors !== '',
            (sv) => setSelectedConnectors(parseConnector(sv)),
            () => {
                setAddedFilters(addedFilters.filter((a) => a !== 'Connector'))
                setSelectedConnectors('')
            },
            () => setSelectedConnectors('')
        ),

        SeverityFilter(
            selectedSeverities,
            selectedSeverities.length < 5,
            (sv) => {
                if (selectedSeverities.includes(sv)) {
                    setSelectedSeverities(
                        selectedSeverities.filter((i) => i !== sv)
                    )
                } else setSelectedSeverities([...selectedSeverities, sv])
            },
            () => {
                setAddedFilters(addedFilters.filter((a) => a !== 'Severity'))
                setSelectedSeverities([
                    'critical',
                    'high',
                    'medium',
                    'low',
                    'none',
                ])
            },
            () =>
                setSelectedSeverities([
                    'critical',
                    'high',
                    'medium',
                    'low',
                    'none',
                ])
        ),

        CloudAccountFilter(
            response?.connections
                ?.filter((v) => {
                    if (connectionSearch === '') {
                        return true
                    }
                    return (
                        v.providerConnectionID
                            ?.toLowerCase()
                            .includes(connectionSearch.toLowerCase()) ||
                        v.providerConnectionName
                            ?.toLowerCase()
                            .includes(connectionSearch.toLowerCase())
                    )
                })
                .map((c) => {
                    const vc: CheckboxItem = {
                        title: c.providerConnectionName || '',
                        value: c.id || '',
                    }
                    return vc
                }) || [],
            (sv) => {
                if (selectedCloudAccounts.includes(sv)) {
                    setSelectedCloudAccounts(
                        selectedCloudAccounts.filter((i) => i !== sv)
                    )
                } else setSelectedCloudAccounts([...selectedCloudAccounts, sv])
            },
            selectedCloudAccounts,
            selectedCloudAccounts.length > 0,
            () => {
                setAddedFilters(
                    addedFilters.filter((a) => a !== 'Cloud Account')
                )
                setSelectedCloudAccounts([])
            },
            () => setSelectedCloudAccounts([]),
            (s) => setConnectionSearch(s)
        ),

        DateFilter(
            activeTimeRange,
            setActiveTimeRange,
            selectedDateCondition,
            setSelectedDateCondition
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
