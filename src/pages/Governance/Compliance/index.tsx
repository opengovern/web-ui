import { Flex, Grid, Icon, Title } from '@tremor/react'
import { useState } from 'react'
import { PuzzlePieceIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../api/compliance.gen'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary,
    SourceType,
} from '../../../api/api'
import ComplianceListCard from '../../../components/Cards/ComplianceListCard'
import TopHeader from '../../../components/Layout/Header'
import FilterGroup, { IFilter } from '../../../components/FilterGroup'
import { useURLParam, useURLState } from '../../../utilities/urlstate'
import {
    BenchmarkStateFilter,
    ConnectorFilter,
} from '../../../components/FilterGroup/FilterTypes'
import { errorHandling } from '../../../types/apierror'
import RadioSelector, {
    RadioItem,
} from '../../../components/FilterGroup/RadioSelector'
import { benchmarkChecks } from '../../../components/Cards/ComplianceCard'
import Spinner from '../../../components/Spinner'

export default function Compliance() {
    const defaultSelectedConnectors = ''
    const [selectedConnectors, setSelectedConnectors] = useURLParam<
        '' | 'AWS' | 'Azure' | 'EntraID'
    >('provider', defaultSelectedConnectors)
    const parseConnector = (v: string) => {
        switch (v) {
            case 'AWS':
                return 'AWS'
            case 'Azure':
                return 'Azure'
            case 'EntraID':
                return 'EntraID'
            default:
                return ''
        }
    }

    const defaultSelectedBenchmarkState = ''
    const [selectedBenchmarkState, setSelectedBenchmarkState] = useURLParam<
        '' | 'active' | 'notactive'
    >('benchmarkstate', defaultSelectedBenchmarkState)
    const parseState = (v: string) => {
        switch (v) {
            case 'active':
                return 'active'
            case 'notactive':
                return 'notactive'
            default:
                return ''
        }
    }

    const defaultSelectedCategory = ''
    const [selectedCategory, setSelectedCategory] = useURLState<string>(
        defaultSelectedCategory,
        (v) => {
            const res = new Map<string, string[]>()
            res.set('category', [v])
            return res
        },
        (v) => {
            return (v.get('category') || []).at(0) || ''
        }
    )

    const defaultSelectedFramework: string[] = []
    const [selectedFrameworks, setSelectedFrameworks] = useURLState<string[]>(
        defaultSelectedFramework,
        (v) => {
            const res = new Map<string, string[]>()
            res.set('frameworks', v)
            return res
        },
        (v) => {
            return v.get('frameworks') || []
        }
    )

    const calcInitialFilters = () => {
        const resp = ['State', 'Connector', 'Score Category']

        if (selectedFrameworks !== defaultSelectedFramework) {
            resp.push('Framework')
        }
        return resp
    }
    const [addedFilters, setAddedFilters] = useState<string[]>(
        calcInitialFilters()
    )

    const {
        response: benchmarks,
        isLoading,
        error,
        sendNow,
    } = useComplianceApiV1BenchmarksSummaryList()

    const allCategoryValues =
        benchmarks?.benchmarkSummary
            ?.flatMap((b) => {
                const ent = Object.entries(b.tags || {})
                return ent
                    .filter((t) => t[0] === 'kaytu_category')
                    .flatMap((t) =>
                        t[1].map((tv) => {
                            const v: RadioItem = {
                                title: tv,
                                value: tv,
                            }
                            return v
                        })
                    )
            })
            .reduce<RadioItem[]>((prev, curr) => {
                if (prev.filter((r) => r.title === curr.title).length > 0) {
                    return prev
                }
                return [...prev, curr]
            }, [])
            .sort((a, b) => {
                if (a.title === b.title) {
                    return 0
                }
                return a.title > b.title ? 1 : -1
            }) || []

    const categoryValues = [
        {
            title: 'All',
            value: '',
        },
        ...allCategoryValues,
    ]

    const filters: IFilter[] = [
        ConnectorFilter(
            selectedConnectors,
            selectedConnectors !== '',
            (sv) => setSelectedConnectors(parseConnector(sv)),
            () => {
                setAddedFilters(addedFilters.filter((a) => a !== 'Connector'))
                setSelectedConnectors(defaultSelectedConnectors)
            },
            () => setSelectedConnectors(defaultSelectedConnectors)
        ),

        {
            title: 'Category',
            icon: PuzzlePieceIcon,
            itemsTitles: categoryValues
                .filter((i) => selectedCategory === i.value)
                .map((i) => i.title),
            isValueChanged: selectedCategory.length > 0,
            selector: (
                <RadioSelector
                    title="Category"
                    radioItems={categoryValues}
                    selectedValue={selectedCategory}
                    onItemSelected={(t) => setSelectedCategory(t.value)}
                    supportedConditions={['is']}
                    selectedCondition="is"
                    onRemove={() => {
                        setAddedFilters(
                            addedFilters.filter((a) => a !== 'Category')
                        )
                        setSelectedCategory(defaultSelectedCategory)
                    }}
                    onReset={() => setSelectedCategory(defaultSelectedCategory)}
                    onConditionChange={() => ''}
                />
            ),
        },

        BenchmarkStateFilter(
            selectedBenchmarkState,
            selectedBenchmarkState !== defaultSelectedBenchmarkState,
            (sv) => setSelectedBenchmarkState(parseState(sv)),
            () => setSelectedBenchmarkState(defaultSelectedBenchmarkState)
        ),

        // BenchmarkFrameworkFilter(
        //     selectedFrameworks,
        //     selectedFrameworks.length > 0,
        //     (sv) => {
        //         if (selectedFrameworks.includes(sv)) {
        //             setSelectedFrameworks(
        //                 selectedFrameworks.filter((i) => i !== sv)
        //             )
        //         } else setSelectedFrameworks([...selectedFrameworks, sv])
        //     },
        //     () => {
        //         setAddedFilters(addedFilters.filter((a) => a !== 'Framework'))
        //         setSelectedFrameworks(defaultSelectedFramework)
        //     },
        //     () => setSelectedFrameworks(defaultSelectedFramework)
        // ),
    ]

    const filtered = benchmarks?.benchmarkSummary
        ?.sort((a, b) => {
            const aZero = benchmarkChecks(a).total === 0
            const bZero = benchmarkChecks(b).total === 0

            const aScore = aZero
                ? 2
                : (a?.controlsSeverityStatus?.total?.passed || 0) /
                  (a?.controlsSeverityStatus?.total?.total || 1)
            const bScore = bZero
                ? 2
                : (b?.controlsSeverityStatus?.total?.passed || 0) /
                  (b?.controlsSeverityStatus?.total?.total || 1)

            if ((aZero && bZero) || aScore === bScore) {
                return 0
            }
            return aScore > bScore ? 1 : -1
        })
        .filter((b) => {
            if (selectedConnectors !== '') {
                if (!b.connectors?.includes(selectedConnectors as SourceType)) {
                    return false
                }
            }
            if (
                selectedBenchmarkState === 'active' &&
                (b.controlsSeverityStatus?.total?.total || 0) <= 0
            ) {
                return false
            }
            if (
                selectedBenchmarkState === 'notactive' &&
                (b.controlsSeverityStatus?.total?.total || 0) > 0
            ) {
                return false
            }

            if (selectedCategory !== '') {
                const ent = Object.entries(b.tags || {})
                const cat = ent
                    .filter((t) => t[0] === 'kaytu_category')
                    .flatMap((t) =>
                        t[1].map((tv) => {
                            const v: RadioItem = {
                                title: tv,
                                value: tv,
                            }
                            return v
                        })
                    )
                if (
                    cat.filter((c) => c.value === selectedCategory).length === 0
                ) {
                    return false
                }
            }
            return true
        })

    return (
        <>
            <TopHeader />
            <Flex className="mb-4">
                <Flex className="gap-2 w-fit">
                    <Icon icon={ShieldCheckIcon} />
                    <Title>Benchmark list</Title>
                </Flex>
            </Flex>
            <Flex className="mb-6">
                <FilterGroup
                    filterList={filters}
                    addedFilters={addedFilters}
                    onFilterAdded={(i) => setAddedFilters([...addedFilters, i])}
                    alignment="left"
                />
            </Flex>
            {isLoading ? (
                <Spinner />
            ) : (
                <Grid className="w-full gap-4">
                    {filtered?.map(
                        (
                            bm: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                        ) => (
                            <ComplianceListCard benchmark={bm} />
                        )
                    )}
                </Grid>
            )}

            {errorHandling(sendNow, error)}
        </>
    )
}
