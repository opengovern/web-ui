import { Card, Flex, Grid, Icon, Title } from '@tremor/react'
import { useState } from 'react'
import { DocumentTextIcon, PuzzlePieceIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
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

    const defaultSelectedBenchmarkState = 'active'
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
        const resp = ['State', 'Connector', 'Category']

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
            true,
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
            isValueChanged: true,
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
            true,
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
            {/* <TopHeader /> */}
            <Flex
                className="bg-white w-[90%] rounded-xl border-solid  border-2 border-gray-200   "
                flexDirection="col"
                justifyContent="center"
                alignItems="center"
            >
                <div className="border-b w-full rounded-xl border-tremor-border bg-tremor-background-muted p-4 dark:border-dark-tremor-border dark:bg-gray-950 sm:p-6 lg:p-8">
                    <header>
                        <h1 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Frameworks
                        </h1>
                        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            Assign, Audit, and govern your tech stack with
                            Compliance Frameworks.
                        </p>
                        <div className="mt-8 w-full md:flex md:max-w-3xl md:items-stretch md:space-x-4">
                            <Card className="w-full md:w-7/12">
                                <div className="inline-flex items-center justify-center rounded-tremor-small border border-tremor-border p-2 dark:border-dark-tremor-border">
                                    <DocumentTextIcon
                                        className="size-5 text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis"
                                        aria-hidden={true}
                                    />
                                </div>
                                <h3 className="mt-4 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    <a
                                        href="https://docs.opengovernance.io/"
                                        target="_blank"
                                        className="focus:outline-none"
                                    >
                                        {/* Extend link to entire card */}
                                        <span
                                            className="absolute inset-0"
                                            aria-hidden={true}
                                        />
                                        Documentation
                                    </a>
                                </h3>
                                <p className="dark:text-dark-tremor-cont text-tremor-default text-tremor-content">
                                    Learn how to audit for compliance.
                                </p>
                            </Card>
                        </div>
                    </header>
                </div>
                <div className="w-full">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <main>
                            <div className="flex items-center justify-between">
                                {/* <h2 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                            Available Dashboards
                                        </h2> */}
                                <div className="flex items-center space-x-2">
                                    {/* <Select
                                        placeholder="Sorty by"
                                        enableClear={false}
                                        className="[&>button]:rounded-tremor-small"
                                    >
                                        <SelectItem value="1">Name</SelectItem>
                                        <SelectItem value="2">
                                            Last edited
                                        </SelectItem>
                                        <SelectItem value="3">Size</SelectItem>
                                    </Select> */}
                                    {/* <button
                                                type="button"
                                                onClick={() => {
                                                    f()
                                                    setOpen(true)
                                                }}
                                                className="hidden h-9 items-center gap-1.5 whitespace-nowrap rounded-tremor-small bg-tremor-brand px-3 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis sm:inline-flex"
                                            >
                                                <PlusIcon
                                                    className="-ml-1 size-5 shrink-0"
                                                    aria-hidden={true}
                                                />
                                                Create new Dashboard
                                            </button> */}
                                </div>
                            </div>
                            <div className="flex items-center w-full">
                                <Grid
                                    numItemsMd={1}
                                    numItemsLg={1}
                                    className="gap-[10px] mt-1 w-full justify-items-start"
                                >
                                    {/* <Flex
                                        className="mb-4 w-3/5"
                                        justifyContent="center"
                                    >
                                        <Flex className="gap-2 w-fit">
                                            <Icon icon={ShieldCheckIcon} />
                                            <Title>Benchmark list</Title>
                                        </Flex>
                                    </Flex> */}
                                    <Flex
                                        className="mb-2 w-100"
                                        justifyContent="start"
                                    >
                                        <FilterGroup
                                            filterList={filters}
                                            addedFilters={addedFilters}
                                            onFilterAdded={(i) =>
                                                setAddedFilters([
                                                    ...addedFilters,
                                                    i,
                                                ])
                                            }
                                            alignment="left"
                                        />
                                    </Flex>
                                    {isLoading ? (
                                        <Spinner />
                                    ) : (
                                        <Grid className="w-full gap-4 justify-items-start">
                                            {filtered?.map(
                                                (
                                                    bm: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                                                ) => (
                                                    <ComplianceListCard
                                                        benchmark={bm}
                                                    />
                                                )
                                            )}
                                        </Grid>
                                    )}

                                    {errorHandling(sendNow, error)}
                                </Grid>
                            </div>
                        </main>
                    </div>
                </div>
            </Flex>
        </>
    )
}
