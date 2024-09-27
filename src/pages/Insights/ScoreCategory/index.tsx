import { useCallback, useEffect, useState } from 'react'
import {
    Button,
    Card,
    Flex,
    Text,
    Switch,
    TextInput,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from '@tremor/react'
import Table from '@cloudscape-design/components/table'
import Box from '@cloudscape-design/components/box'
import SpaceBetween from '@cloudscape-design/components/space-between'
import TextFilter from '@cloudscape-design/components/text-filter'
import Header from '@cloudscape-design/components/header'
import Badge from '@cloudscape-design/components/badge'
import KButton from '@cloudscape-design/components/button'
import { useAtomValue } from 'jotai'
import {
    CommandLineIcon,
    BookOpenIcon,
    CodeBracketIcon,
    Cog8ToothIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    FunnelIcon,
    CloudIcon,
} from '@heroicons/react/24/outline'
import {
    GridOptions,
    IAggFuncParams,
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import {  useNavigate } from 'react-router-dom'
import Link from '@cloudscape-design/components/link'
import {
    useComplianceApiV1BenchmarksControlsDetail,
    useInventoryApiV3AllBenchmarksControls,
} from '../../../api/compliance.gen'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary,
    GithubComKaytuIoKaytuEnginePkgControlApiListV2ResponseItem,
} from '../../../api/api'
import TopHeader from '../../../components/Layout/Header'
import {
    searchAtom,
    useFilterState,
    useURLParam,
    useURLState,
} from '../../../utilities/urlstate'
import { getConnectorIcon } from '../../../components/Cards/ConnectorCard'
import { severityBadge } from '../../Governance/Controls'
import {
    exactPriceDisplay,
    numberDisplay,
} from '../../../utilities/numericDisplay'
import { useInventoryApiV3AllQueryCategory } from '../../../api/inventory.gen'
import { Api } from '../../../api/api'
import AxiosAPI from '../../../api/ApiConfig'
import ButtonDropdown from '@cloudscape-design/components/button-dropdown'
import Pagination from '@cloudscape-design/components/pagination'
import CollectionPreferences from '@cloudscape-design/components/collection-preferences'
import KFilter from '../../../components/Filter'
import { ContentLayout, Grid, LineChart } from '@cloudscape-design/components'
import './style.css'
interface IRecord
    extends GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary {
    serviceName: string
    tags: string[]
    passedResourcesCount?: number
}

interface IDetailCellRenderer {
    data: IRecord
}

// const DetailCellRenderer = ({ data }: IDetailCellRenderer) => {
//     const searchParams = useAtomValue(searchAtom)
//     return (
//         <Flex
//             flexDirection="row"
//             className="w-full h-full"
//             alignItems="center"
//             justifyContent="between"
//         >
//             <Text className="ml-12 truncate">{data.control?.description}</Text>
//             <Link
//                 className="mr-2"
//                 to={`${data?.control?.id || ''}?${searchParams}`}
//             >
//                 <Button size="xs">Open</Button>
//             </Link>
//         </Flex>
//     )
// }

export default function ScoreCategory() {
    const { value: selectedConnections } = useFilterState()
    const [category, setCategory] = useURLParam('score_category', '')
    const [listofTables, setListOfTables] = useState([])
    const [selectedServiceNames, setSelectedServiceNames] = useURLState<
        string[]
    >(
        [],
        (v) => {
            const res = new Map<string, string[]>()
            res.set('serviceNames', v)
            return res
        },
        (v) => {
            return v.get('serviceNames') || []
        }
    )
    const [selectedScoreTags, setSelectedScoreTags] = useURLState<string[]>(
        [],
        (v) => {
            const res = new Map<string, string[]>()
            res.set('tags', v)
            return res
        },
        (v) => {
            return v.get('tags') || []
        }
    )
    const [selectedSeverities, setSelectedSeverities] = useURLState<string[]>(
        [],
        (v) => {
            const res = new Map<string, string[]>()
            res.set('severities', v)
            return res
        },
        (v) => {
            return v.get('severities') || []
        }
    )

    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
    const [hideZero, setHideZero] = useState(true)
    const [quickFilterValue, setQuickFilterValue] = useState<string>('')
    const [openSearch, setOpenSearch] = useState(true)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState<number>(0)
    const [rows, setRows] = useState<
        GithubComKaytuIoKaytuEnginePkgControlApiListV2ResponseItem[]
    >([])
    const [totalPage, setTotalPage] = useState<number>(0)
    const [searchCategory, setSearchCategory] = useState('')
    const categories = [
        'security',
        'cost_optimization',
        'operational_excellence',
        'reliability',
        'performance_efficiency',
    ]

    const navigateToInsightsDetails = (id: string) => {
        navigate(`${id}?${searchParams}`)
    }

    const GetControls = () => {
        // setLoading(true)
        const api = new Api()
        api.instance = AxiosAPI
        const benchmarks = category
        const temp = []
        temp.push(`aws_score_${benchmarks}`)
        temp.push(`azure_score_${benchmarks}`)

        let body = {
            list_of_tables: listofTables,
            root_benchmark: temp,
            cursor: page,
            per_page: 9,
            finding_summary: true,
        }
        if (listofTables.length == 0) {
            // @ts-ignore
            delete body['list_of_tables']
        }
        api.compliance
            .apiV2ControlList(body)
            .then((resp) => {
                setTotalPage(Math.ceil(resp.data.total_count / 9))
                if (resp.data.items) {
                    setRows(resp.data.items)
                }

                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                setRows([])
            })
    }

    const { response: categoriesAll, isLoading: categoryLoading } =
        useInventoryApiV3AllBenchmarksControls()

    useEffect(() => {
        GetControls()
    }, [categoriesAll, listofTables])

    return (
        <>
            {/* <TopHeader
            // serviceNames={serviceNames}
            // tags={tags}
            // supportedFilters={[
            //     // 'Environment',
            //     // 'Product',
            //     'Cloud Account',
            //     'Service Name',
            //     'Severity',
            //     'Tag',
            //     'Score Category',
            // ]}
            // initialFilters={[
            //     'Score Category',
            //     'Cloud Account',
            //     // 'Product',
            //     'Tag',
            // ]}
            /> */}
            <ContentLayout
                defaultPadding
                className="rounded-xl"
                disableOverlap
                headerVariant="high-contrast"
                headerBackgroundStyle={'#0F2940'}
                maxContentWidth={1200}
                header={
                    <Box
                        className="rounded-xl same"
                        padding={{ vertical: 'l' }}
                    >
                        <Grid
                            gridDefinition={[
                                { colspan: { default: 12, xs: 8, s: 9 } },
                                { colspan: { default: 12, xs: 4, s: 3 } },
                            ]}
                        >
                            <div>
                                <Box variant="h1">
                                    Elastic Cloud (Elastic search service)
                                </Box>
                                <Box
                                    variant="p"
                                    color="text-body-secondary"
                                    margin={{ top: 'xxs', bottom: 's' }}
                                >
                                    With solutions in Enterprise Search,
                                    Observability, and Security, Elastic
                                    enhances customer and employee search
                                    experiences, keeps mission-critical
                                    applications running smoothly, and protects
                                    against cyber threats.
                                </Box>
                                <SpaceBetween size="xs">
                                    <div>
                                        Sold by:{' '}
                                        <Link variant="primary" href="#">
                                            Elastic
                                        </Link>
                                    </div>
                                    <div>
                                        Tags:{' '}
                                        <Link variant="primary" href="#">
                                            Free trial
                                        </Link>
                                        {' | '}
                                        <Link variant="primary" href="#">
                                            Vendor insights
                                        </Link>
                                    </div>
                                </SpaceBetween>
                            </div>

                            {/* <Box margin={{ top: 'l' }}>
                                <SpaceBetween size="s">
                                    <KButton variant="primary" fullWidth={true}>
                                        View purchase options
                                    </KButton>
                                    <KButton fullWidth={true}>
                                        Request a demo
                                    </KButton>
                                    <KButton fullWidth={true}>
                                        Save to a list
                                    </KButton>
                                </SpaceBetween>
                            </Box> */}
                        </Grid>
                    </Box>
                }
            >
                {' '}
            </ContentLayout>
            <Flex flexDirection="col" className="w-full mt-4">
                <Flex className="bg-white  w-full border-solid border-2    rounded-xl p-4">
                    <LineChart
                        className="w-full"
                        series={[
                            {
                                title: 'Site 1',
                                type: 'line',
                                data: [
                                    {
                                        x: new Date(1600979400000),
                                        y: 58020,
                                    },
                                    {
                                        x: new Date(1600980300000),
                                        y: 102402,
                                    },
                                    {
                                        x: new Date(1600981200000),
                                        y: 104920,
                                    },
                                    {
                                        x: new Date(1600982100000),
                                        y: 94031,
                                    },
                                    {
                                        x: new Date(1600983000000),
                                        y: 125021,
                                    },
                                    {
                                        x: new Date(1600983900000),
                                        y: 159219,
                                    },
                                    {
                                        x: new Date(1600984800000),
                                        y: 193082,
                                    },
                                    {
                                        x: new Date(1600985700000),
                                        y: 162592,
                                    },
                                    {
                                        x: new Date(1600986600000),
                                        y: 274021,
                                    },
                                    {
                                        x: new Date(1600987500000),
                                        y: 264286,
                                    },
                                    {
                                        x: new Date(1600988400000),
                                        y: 289210,
                                    },
                                    {
                                        x: new Date(1600989300000),
                                        y: 256362,
                                    },
                                    {
                                        x: new Date(1600990200000),
                                        y: 257306,
                                    },
                                    {
                                        x: new Date(1600991100000),
                                        y: 186776,
                                    },
                                    {
                                        x: new Date(1600992000000),
                                        y: 294020,
                                    },
                                    {
                                        x: new Date(1600992900000),
                                        y: 385975,
                                    },
                                    {
                                        x: new Date(1600993800000),
                                        y: 486039,
                                    },
                                    {
                                        x: new Date(1600994700000),
                                        y: 490447,
                                    },
                                    {
                                        x: new Date(1600995600000),
                                        y: 361845,
                                    },
                                    {
                                        x: new Date(1600996500000),
                                        y: 339058,
                                    },
                                    {
                                        x: new Date(1600997400000),
                                        y: 298028,
                                    },
                                    {
                                        x: new Date(1600998300000),
                                        y: 231902,
                                    },
                                    {
                                        x: new Date(1600999200000),
                                        y: 224558,
                                    },
                                    {
                                        x: new Date(1601000100000),
                                        y: 253901,
                                    },
                                    {
                                        x: new Date(1601001000000),
                                        y: 102839,
                                    },
                                    {
                                        x: new Date(1601001900000),
                                        y: 234943,
                                    },
                                    {
                                        x: new Date(1601002800000),
                                        y: 204405,
                                    },
                                    {
                                        x: new Date(1601003700000),
                                        y: 190391,
                                    },
                                    {
                                        x: new Date(1601004600000),
                                        y: 183570,
                                    },
                                    {
                                        x: new Date(1601005500000),
                                        y: 162592,
                                    },
                                    {
                                        x: new Date(1601006400000),
                                        y: 148910,
                                    },
                                    {
                                        x: new Date(1601007300000),
                                        y: 229492,
                                    },
                                    {
                                        x: new Date(1601008200000),
                                        y: 293910,
                                    },
                                ],
                                valueFormatter: function s(e) {
                                    return Math.abs(e) >= 1e9
                                        ? (e / 1e9)
                                              .toFixed(1)
                                              .replace(/\.0$/, '') + 'G'
                                        : Math.abs(e) >= 1e6
                                        ? (e / 1e6)
                                              .toFixed(1)
                                              .replace(/\.0$/, '') + 'M'
                                        : Math.abs(e) >= 1e3
                                        ? (e / 1e3)
                                              .toFixed(1)
                                              .replace(/\.0$/, '') + 'K'
                                        : e.toFixed(2)
                                },
                            },
                            {
                                title: 'Site 2',
                                type: 'line',
                                data: [
                                    {
                                        x: new Date(1600979400000),
                                        y: 151023,
                                    },
                                    {
                                        x: new Date(1600980300000),
                                        y: 169975,
                                    },
                                    {
                                        x: new Date(1600981200000),
                                        y: 176980,
                                    },
                                    {
                                        x: new Date(1600982100000),
                                        y: 168852,
                                    },
                                    {
                                        x: new Date(1600983000000),
                                        y: 149130,
                                    },
                                    {
                                        x: new Date(1600983900000),
                                        y: 147299,
                                    },
                                    {
                                        x: new Date(1600984800000),
                                        y: 169552,
                                    },
                                    {
                                        x: new Date(1600985700000),
                                        y: 163401,
                                    },
                                    {
                                        x: new Date(1600986600000),
                                        y: 154091,
                                    },
                                    {
                                        x: new Date(1600987500000),
                                        y: 199516,
                                    },
                                    {
                                        x: new Date(1600988400000),
                                        y: 195503,
                                    },
                                    {
                                        x: new Date(1600989300000),
                                        y: 189953,
                                    },
                                    {
                                        x: new Date(1600990200000),
                                        y: 181635,
                                    },
                                    {
                                        x: new Date(1600991100000),
                                        y: 192975,
                                    },
                                    {
                                        x: new Date(1600992000000),
                                        y: 205951,
                                    },
                                    {
                                        x: new Date(1600992900000),
                                        y: 218958,
                                    },
                                    {
                                        x: new Date(1600993800000),
                                        y: 220516,
                                    },
                                    {
                                        x: new Date(1600994700000),
                                        y: 213557,
                                    },
                                    {
                                        x: new Date(1600995600000),
                                        y: 165899,
                                    },
                                    {
                                        x: new Date(1600996500000),
                                        y: 173557,
                                    },
                                    {
                                        x: new Date(1600997400000),
                                        y: 172331,
                                    },
                                    {
                                        x: new Date(1600998300000),
                                        y: 186492,
                                    },
                                    {
                                        x: new Date(1600999200000),
                                        y: 131541,
                                    },
                                    {
                                        x: new Date(1601000100000),
                                        y: 142262,
                                    },
                                    {
                                        x: new Date(1601001000000),
                                        y: 194091,
                                    },
                                    {
                                        x: new Date(1601001900000),
                                        y: 185899,
                                    },
                                    {
                                        x: new Date(1601002800000),
                                        y: 173401,
                                    },
                                    {
                                        x: new Date(1601003700000),
                                        y: 171635,
                                    },
                                    {
                                        x: new Date(1601004600000),
                                        y: 179130,
                                    },
                                    {
                                        x: new Date(1601005500000),
                                        y: 185951,
                                    },
                                    {
                                        x: new Date(1601006400000),
                                        y: 144091,
                                    },
                                    {
                                        x: new Date(1601007300000),
                                        y: 152975,
                                    },
                                    {
                                        x: new Date(1601008200000),
                                        y: 157299,
                                    },
                                ],
                                valueFormatter: function s(e) {
                                    return Math.abs(e) >= 1e9
                                        ? (e / 1e9)
                                              .toFixed(1)
                                              .replace(/\.0$/, '') + 'G'
                                        : Math.abs(e) >= 1e6
                                        ? (e / 1e6)
                                              .toFixed(1)
                                              .replace(/\.0$/, '') + 'M'
                                        : Math.abs(e) >= 1e3
                                        ? (e / 1e3)
                                              .toFixed(1)
                                              .replace(/\.0$/, '') + 'K'
                                        : e.toFixed(2)
                                },
                            },
                            {
                                title: 'Performance goal',
                                type: 'threshold',
                                y: 250000,
                                valueFormatter: function s(e) {
                                    return Math.abs(e) >= 1e9
                                        ? (e / 1e9)
                                              .toFixed(1)
                                              .replace(/\.0$/, '') + 'G'
                                        : Math.abs(e) >= 1e6
                                        ? (e / 1e6)
                                              .toFixed(1)
                                              .replace(/\.0$/, '') + 'M'
                                        : Math.abs(e) >= 1e3
                                        ? (e / 1e3)
                                              .toFixed(1)
                                              .replace(/\.0$/, '') + 'K'
                                        : e.toFixed(2)
                                },
                            },
                        ]}
                        xDomain={[
                            new Date(1600979400000),
                            new Date(1601008200000),
                        ]}
                        yDomain={[0, 500000]}
                        i18nStrings={{
                            xTickFormatter: (e) =>
                                e
                                    .toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: !1,
                                    })
                                    .split(',')
                                    .join('\n'),
                            yTickFormatter: function s(e) {
                                return Math.abs(e) >= 1e9
                                    ? (e / 1e9).toFixed(1).replace(/\.0$/, '') +
                                          'G'
                                    : Math.abs(e) >= 1e6
                                    ? (e / 1e6).toFixed(1).replace(/\.0$/, '') +
                                      'M'
                                    : Math.abs(e) >= 1e3
                                    ? (e / 1e3).toFixed(1).replace(/\.0$/, '') +
                                      'K'
                                    : e.toFixed(2)
                            },
                        }}
                        ariaLabel="Multiple data series line chart"
                        fitHeight
                        height={300}
                        hideFilter
                        xScaleType="time"
                        xTitle="Time (UTC)"
                        yTitle="Bytes transferred"
                        empty={
                            <Box textAlign="center" color="inherit">
                                <b>No data available</b>
                                <Box variant="p" color="inherit">
                                    There is no data available
                                </Box>
                            </Box>
                        }
                        noMatch={
                            <Box textAlign="center" color="inherit">
                                <b>No matching data</b>
                                <Box variant="p" color="inherit">
                                    There is no matching data to display
                                </Box>
                                <Button>Clear filter</Button>
                            </Box>
                        }
                    />
                </Flex>
                <Flex alignItems="start" className="gap-4 w-full mt-4">
                    {openSearch ? (
                        <Card className="sticky w-fit">
                            <TextInput
                                className="w-56 mb-6"
                                icon={MagnifyingGlassIcon}
                                placeholder="Search..."
                                value={searchCategory}
                                onChange={(e) =>
                                    setSearchCategory(e.target.value)
                                }
                            />
                            {categoriesAll?.categories.map(
                                (cat) =>
                                    !!cat.tables?.filter((catt) =>
                                        catt.name
                                            .toLowerCase()
                                            .includes(
                                                searchCategory.toLowerCase()
                                            )
                                    ).length && (
                                        <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                                            <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                                                <Text className="text-gray-800 text-left">
                                                    {cat.category}
                                                </Text>
                                            </AccordionHeader>
                                            <AccordionBody className="p-0 w-full pr-0.5 cursor-default bg-transparent">
                                                <Flex
                                                    flexDirection="col"
                                                    justifyContent="start"
                                                >
                                                    {cat.tables
                                                        ?.filter((catt) =>
                                                            catt.name
                                                                .toLowerCase()
                                                                .includes(
                                                                    searchCategory.toLowerCase()
                                                                )
                                                        )
                                                        .map((subCat) => (
                                                            <Flex
                                                                justifyContent="start"
                                                                onClick={() => {
                                                                    if (
                                                                        // @ts-ignore
                                                                        listofTables.includes(
                                                                            // @ts-ignore
                                                                            subCat.table
                                                                        )
                                                                    ) {
                                                                        // @ts-ignore
                                                                        setListOfTables(
                                                                            // @ts-ignore
                                                                            listofTables.filter(
                                                                                (
                                                                                    item
                                                                                ) =>
                                                                                    item !==
                                                                                    subCat.table
                                                                            )
                                                                        )
                                                                    }
                                                                    // @ts-ignore
                                                                    else {
                                                                        // @ts-ignore
                                                                        setListOfTables(
                                                                            [
                                                                                // @ts-ignore
                                                                                ...listofTables,
                                                                                // @ts-ignore
                                                                                subCat.table,
                                                                            ]
                                                                        )
                                                                    }
                                                                }}
                                                            >
                                                                <Text className="ml-4 w-full truncate text-start py-2 cursor-pointer hover:text-kaytu-600">
                                                                    {
                                                                        subCat.name
                                                                    }
                                                                </Text>
                                                            </Flex>
                                                        ))}
                                                </Flex>
                                            </AccordionBody>
                                        </Accordion>
                                    )
                            )}
                            {listofTables.length > 0 && (
                                <>
                                    <Flex
                                        flexDirection="col"
                                        justifyContent="start"
                                        alignItems="start"
                                    >
                                        <Text>Selected Filters</Text>
                                        {listofTables.map((item, index) => {
                                            return (
                                                <Flex
                                                    justifyContent="start"
                                                    className="w-full"
                                                >
                                                    <Text>{item}</Text>
                                                </Flex>
                                            )
                                        })}
                                    </Flex>
                                </>
                            )}
                            <Flex justifyContent="end" className="mt-12">
                                <Button
                                    variant="light"
                                    onClick={() => setOpenSearch(false)}
                                >
                                    <ChevronDoubleLeftIcon className="h-4" />
                                </Button>
                            </Flex>
                        </Card>
                    ) : (
                        <Flex
                            flexDirection="col"
                            justifyContent="center"
                            className="min-h-full w-fit"
                        >
                            <Button
                                variant="light"
                                onClick={() => setOpenSearch(true)}
                            >
                                <Flex flexDirection="col" className="gap-4 w-4">
                                    <FunnelIcon />
                                    <Text className="rotate-90">Options</Text>
                                </Flex>
                            </Button>
                        </Flex>
                    )}

                    <Flex className="flex flex-col space-y-2">
                        <Table
                            className="p-3 max-w-[60vw]"
                            // resizableColumns
                            renderAriaLive={({
                                firstIndex,
                                lastIndex,
                                totalItemsCount,
                            }) =>
                                `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
                            }
                            columnDefinitions={[
                                {
                                    id: 'id',
                                    header: 'ID',
                                    cell: (item) => item.id,
                                    sortingField: 'id',
                                    isRowHeader: true,
                                },
                                {
                                    id: 'title',
                                    header: 'Title',
                                    cell: (item) => item.title,
                                    sortingField: 'alt',
                                    minWidth: 500,
                                },
                                {
                                    id: 'connector',
                                    header: 'Connector',
                                    cell: (item) => item.connector,
                                },
                                {
                                    id: 'query',
                                    header: 'Primary Table',
                                    cell: (item) => item?.query?.primary_table,
                                },
                                {
                                    id: 'severity',
                                    header: 'Severity',
                                    cell: (item) => (
                                        <Badge
                                            // @ts-ignore
                                            color={`severity-${item.severity}`}
                                        >
                                            {item.severity
                                                .charAt(0)
                                                .toUpperCase() +
                                                item.severity.slice(1)}
                                        </Badge>
                                    ),
                                },
                                {
                                    id: 'query.parameters',
                                    header: 'Has Parametrs',
                                    cell: (item) => (
                                        // @ts-ignore
                                        <>
                                            {item.query?.parameters.length > 0
                                                ? 'True'
                                                : 'False'}
                                        </>
                                    ),
                                },
                                {
                                    id: 'incidents',
                                    header: 'Incidents',
                                    cell: (item) => (
                                        // @ts-ignore
                                        <>
                                            {item?.findings_summary?.alarm
                                                ? item?.findings_summary?.alarm
                                                : 0}
                                        </>
                                    ),
                                    minWidth: 50,
                                },
                                {
                                    id: 'passing_resources',
                                    header: 'Passing Resources',
                                    cell: (item) => (
                                        // @ts-ignore
                                        <>
                                            {item?.findings_summary?.ok
                                                ? item?.findings_summary?.ok
                                                : 0}
                                        </>
                                    ),
                                },
                                {
                                    id: 'action',
                                    header: 'Action',
                                    cell: (item) => (
                                        // @ts-ignore
                                        <KButton
                                            onClick={() => {
                                                navigateToInsightsDetails(
                                                    item.id
                                                )
                                            }}
                                            variant="inline-link"
                                            ariaLabel={`Open Detail`}
                                        >
                                            Open
                                        </KButton>
                                    ),
                                },
                            ]}
                            columnDisplay={[
                                { id: 'id', visible: false },
                                { id: 'title', visible: true },
                                { id: 'connector', visible: false },
                                { id: 'query', visible: false },
                                { id: 'severity', visible: true },
                                { id: 'incidents', visible: true },
                                { id: 'passing_resources', visible: true },

                                // { id: 'action', visible: true },
                            ]}
                            enableKeyboardNavigation
                            items={rows}
                            loadingText="Loading resources"
                            // stickyColumns={{ first: 0, last: 1 }}
                            // stripedRows
                            trackBy="id"
                            empty={
                                <Box
                                    margin={{ vertical: 'xs' }}
                                    textAlign="center"
                                    color="inherit"
                                >
                                    <SpaceBetween size="m">
                                        <b>No resources</b>
                                        <Button>Create resource</Button>
                                    </SpaceBetween>
                                </Box>
                            }
                            filter={
                                <TextFilter
                                    className="w-100"
                                    filteringPlaceholder="Find Control"
                                    filteringText=""
                                />
                            }
                            header={
                                <Header className="w-full">
                                    Controls{' '}
                                    <span className=" font-medium">
                                        ({totalPage * 9})
                                    </span>
                                </Header>
                            }
                            pagination={
                                <Pagination
                                    currentPageIndex={page}
                                    pagesCount={totalPage}
                                />
                            }
                        />
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}
