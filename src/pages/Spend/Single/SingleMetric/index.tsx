import { Dayjs } from 'dayjs'
import { useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import {
    Button,
    Callout,
    Card,
    Col,
    Flex,
    Grid,
    Select,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridOptions, ValueFormatterParams } from 'ag-grid-community'
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline'
import { useParams } from 'react-router-dom'
import { filterAtom, isDemoAtom } from '../../../../store'
import {
    useInventoryApiV2AnalyticsMetricsDetail,
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTableList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../../../api/inventory.gen'
import {
    checkGranularity,
    generateItems,
} from '../../../../utilities/dateComparator'
import Header from '../../../../components/Header'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import {
    exactPriceDisplay,
    numberDisplay,
} from '../../../../utilities/numericDisplay'
import { capitalizeFirstLetter } from '../../../../utilities/labelMaker'
import {
    AreaChartIcon,
    BarChartIcon,
    LineChartIcon,
} from '../../../../icons/icons'
import Chart from '../../../../components/Chart'
import { costTrendChart, getConnections } from '../../index'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'
import { generateVisualMap } from '../../../Infrastructure'
import { dateDisplay } from '../../../../utilities/dateDisplay'

interface ISingle {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    metricId: string | undefined
}

export default function SingleSpendMetric({
    activeTimeRange,
    metricId,
}: ISingle) {
    const selectedConnections = useAtomValue(filterAtom)
    const gridRef = useRef<AgGridReact>(null)
    const { id, metric } = useParams()
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'area'
    )
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'yearly'
    >(
        checkGranularity(activeTimeRange.start, activeTimeRange.end).monthly
            ? 'monthly'
            : 'daily'
    )
    useEffect(() => {
        setSelectedGranularity(
            checkGranularity(activeTimeRange.start, activeTimeRange.end).monthly
                ? 'monthly'
                : 'daily'
        )
    }, [activeTimeRange])
    const isDemo = useAtomValue(isDemoAtom)

    const [selectedDatapoint, setSelectedDatapoint] = useState<any>(undefined)

    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('area')
        if (selectedIndex === 1) setSelectedChart('line')
        if (selectedIndex === 2) setSelectedChart('bar')
    }, [selectedIndex])

    const query = {
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        connectionId: metric
            ? [String(id).replace('account_', '')]
            : selectedConnections.connections,
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
        pageNumber: 1,
    }

    const { response: costTrend, isLoading: costTrendLoading } =
        useInventoryApiV2AnalyticsSpendTrendList({
            ...query,
            granularity: selectedGranularity,
            metricIds: [String(metricId)],
        })
    const { response: metricDetail, isLoading: metricDetailLoading } =
        useInventoryApiV2AnalyticsSpendMetricList({
            ...query,
            metricIDs: [String(metricId)],
        })
    const { response: metricName, isLoading: metricLoading } =
        useInventoryApiV2AnalyticsMetricsDetail(
            String(id).replace('metric_', '')
        )

    const tableQuery = (): {
        startTime?: number | undefined
        endTime?: number | undefined
        granularity?: 'daily' | 'monthly' | 'yearly' | undefined
        dimension?: 'metric' | 'connection' | undefined
        metricIds?: string[]
        connectionId: string[]
    } => {
        let gra: 'monthly' | 'daily' = 'daily'
        if (selectedGranularity === 'monthly') {
            gra = 'monthly'
        }

        return {
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            connectionId: metric
                ? [String(id).replace('account_', '')]
                : selectedConnections.connections,
            dimension: 'connection',
            granularity: gra,
            metricIds: [String(metricId)],
        }
    }

    const { response, isLoading } = useInventoryApiV2AnalyticsSpendTableList(
        tableQuery()
    )

    const gridOptions: GridOptions = {
        pagination: true,
        paginationPageSize: 25,
        suppressExcelExport: true,
        animateRows: true,
        enableGroupEdit: true,
        columnTypes: {
            dimension: {
                enableRowGroup: true,
                enablePivot: true,
            },
        },
        rowGroupPanelShow: 'always',
        groupAllowUnbalanced: true,
        autoGroupColumnDef: {
            pinned: true,
            flex: 2,
            sortable: true,
            filter: true,
            resizable: true,
            cellRendererParams: {
                footerValueGetter: (params: any) => {
                    const isRootLevel = params.node.level === -1
                    if (isRootLevel) {
                        return 'Grand Total'
                    }
                    return `Sub Total (${params.value})`
                },
            },
        },
        getRowHeight: () => 50,
        onGridReady: (e) => {
            if (isLoading) {
                e.api.showLoadingOverlay()
            }
        },
        sideBar: {
            toolPanels: [
                {
                    id: 'columns',
                    labelDefault: 'Columns',
                    labelKey: 'columns',
                    iconKey: 'columns',
                    toolPanel: 'agColumnsToolPanel',
                },
                {
                    id: 'filters',
                    labelDefault: 'Table Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                },
            ],
            defaultToolPanel: '',
        },
        enableRangeSelection: true,
        groupIncludeFooter: true,
        groupIncludeTotalFooter: true,
    }

    useEffect(() => {
        if (!isLoading) {
            const defaultCols: ColDef[] = [
                {
                    field: 'connector',
                    headerName: 'Cloud Provider',
                    width: 120,
                    enableRowGroup: true,
                    resizable: true,
                    filter: true,
                    sortable: true,
                    pinned: true,
                },
                {
                    field: 'accountId',
                    headerName: 'Provider ID',
                    filter: true,
                    sortable: true,
                    resizable: true,
                    pivot: false,
                    pinned: true,
                    // eslint-disable-next-line react/no-unstable-nested-components
                    cellRenderer: (param: ValueFormatterParams) => (
                        <span className={isDemo ? 'blur-md' : ''}>
                            {param.value}
                        </span>
                    ),
                },
                {
                    field: 'category',
                    headerName: 'Category',
                    filter: true,
                    enableRowGroup: true,
                    sortable: true,
                    resizable: true,
                    pinned: true,
                    hide: true,
                },
                {
                    field: 'totalCost',
                    headerName: 'Total cost',
                    filter: true,
                    sortable: true,
                    aggFunc: 'sum',
                    width: 150,
                    resizable: true,
                    pivot: false,
                    pinned: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value ? exactPriceDisplay(param.value) : ''
                    },
                },
            ]

            const columnNames =
                response
                    ?.map((row) => {
                        if (row.costValue) {
                            return Object.entries(row.costValue).map(
                                (value) => value[0]
                            )
                        }
                        return []
                    })
                    .flat() || []

            const dynamicCols: ColDef[] = columnNames
                .filter((value, index, array) => array.indexOf(value) === index)
                .map((colName) => {
                    const v: ColDef = {
                        field: colName,
                        headerName: colName,
                        sortable: true,
                        suppressMenu: true,
                        resizable: true,
                        pivot: false,
                        aggFunc: 'sum',
                        valueFormatter: (param) => {
                            return param.value
                                ? exactPriceDisplay(param.value)
                                : ''
                        },
                    }
                    return v
                })

            const cols = [...defaultCols, ...dynamicCols]
            const rows =
                response?.map((row) => {
                    let temp = {}
                    let totalCost = 0
                    if (row.costValue) {
                        temp = Object.fromEntries(Object.entries(row.costValue))
                    }
                    Object.values(temp).map(
                        // eslint-disable-next-line no-return-assign
                        (v: number | unknown) => (totalCost += Number(v))
                    )
                    return {
                        category: row.category,
                        accountId: row.accountID,
                        connector: row.connector,
                        totalCost,
                        ...temp,
                    }
                }) || []
            let sum = 0
            const newRow = []
            const granularity: any = {}
            for (let i = 0; i < rows.length; i += 1) {
                sum += rows[i].totalCost
                // eslint-disable-next-line array-callback-return
                Object.entries(rows[i]).map(([key, value]) => {
                    if (Number(key[0])) {
                        if (granularity[key]) {
                            granularity[key] += value
                        } else {
                            granularity[key] = value
                        }
                    }
                })
            }
            const pinnedRow = [
                { totalCost: sum, accountId: 'Total cost', ...granularity },
            ]
            for (let i = 0; i < rows.length; i += 1) {
                newRow.push({
                    ...rows[i],
                    percent: (rows[i].totalCost / sum) * 100,
                })
            }
            gridRef.current?.api?.setPinnedTopRowData(pinnedRow)
            gridRef.current?.api?.setColumnDefs(cols)
            gridRef.current?.api?.setRowData(newRow)
        }
    }, [isLoading])

    return (
        <>
            <Header
                breadCrumb={[
                    metricName ? metricName.name : 'Single metric detail',
                ]}
                datePicker
                filter
            />
            <Flex className="mb-6">
                <Flex alignItems="start" className="gap-2">
                    {getConnectorIcon(
                        metricName && metricName?.connectors
                            ? metricName?.connectors[0]
                            : undefined
                    )}
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        justifyContent="start"
                    >
                        <Title className="font-semibold whitespace-nowrap">
                            {metricName ? metricName.name : ''}
                        </Title>
                        <Text>{metricName ? metricName.id : ''}</Text>
                    </Flex>
                </Flex>
            </Flex>
            <Card className="mb-4">
                <Grid numItems={4} className="gap-4">
                    <SummaryCard
                        title={getConnections(selectedConnections)}
                        metric={metricDetail?.total_cost}
                        loading={metricDetailLoading}
                        border={false}
                    />
                    <div className="pl-4 border-l border-l-gray-200">
                        <SummaryCard
                            border={false}
                            title="Evaluated"
                            loading={isLoading}
                            metric={response?.length}
                        />
                    </div>
                    <Col numColSpan={2}>
                        <Flex justifyContent="end" className="gap-4">
                            <Select
                                value={selectedGranularity}
                                placeholder={capitalizeFirstLetter(
                                    selectedGranularity
                                )}
                                onValueChange={(v) => {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    setSelectedGranularity(v)
                                }}
                                className="w-10"
                            >
                                {generateItems(
                                    activeTimeRange.start,
                                    activeTimeRange.end
                                )}
                            </Select>
                            <TabGroup
                                index={selectedIndex}
                                onIndexChange={setSelectedIndex}
                                className="w-fit rounded-lg"
                            >
                                <TabList variant="solid">
                                    <Tab value="area">
                                        <AreaChartIcon className="h-5" />
                                    </Tab>
                                    <Tab value="line">
                                        <LineChartIcon className="h-5" />
                                    </Tab>
                                    <Tab value="bar">
                                        <BarChartIcon className="h-5" />
                                    </Tab>
                                </TabList>
                            </TabGroup>
                        </Flex>
                    </Col>
                </Grid>
                {costTrend
                    ?.filter(
                        (t) =>
                            selectedDatapoint?.color === '#E01D48' &&
                            dateDisplay(t.date) === selectedDatapoint?.name
                    )
                    .map((t) => (
                        <Callout
                            color="rose"
                            title="Incomplete data"
                            className="w-fit mt-4"
                        >
                            Checked{' '}
                            {numberDisplay(
                                t.totalSuccessfulDescribedConnectionCount,
                                0
                            )}{' '}
                            accounts out of{' '}
                            {numberDisplay(t.totalConnectionCount, 0)} on{' '}
                            {dateDisplay(t.date)}
                        </Callout>
                    ))}
                <Flex justifyContent="end" className="mt-2 gap-2.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-kaytu-950" />
                    {selectedChart === 'area' ? (
                        <Text>Accumulated cost</Text>
                    ) : (
                        <Text>Spend</Text>
                    )}
                </Flex>
                <Chart
                    labels={
                        costTrendChart(
                            costTrend,
                            selectedChart,
                            selectedGranularity
                        ).label
                    }
                    chartData={
                        costTrendChart(
                            costTrend,
                            selectedChart,
                            selectedGranularity
                        ).data
                    }
                    chartType={selectedChart}
                    isCost
                    loading={costTrendLoading}
                    // visualMap={
                    //     selectedChart === 'area'
                    //         ? undefined
                    //         : generateVisualMap(
                    //               costTrendChart(costTrend, selectedChart).flag,
                    //               costTrendChart(costTrend, selectedChart).label
                    //           ).visualMap
                    // }
                    // markArea={
                    //     selectedChart === 'area'
                    //         ? undefined
                    //         : generateVisualMap(
                    //               costTrendChart(costTrend, selectedChart).flag,
                    //               costTrendChart(costTrend, selectedChart).label
                    //           ).markArea
                    // }
                    onClick={
                        selectedChart === 'area'
                            ? undefined
                            : (p) => setSelectedDatapoint(p)
                    }
                />
            </Card>
            <Card className="mt-4">
                <Flex>
                    <Title className="font-semibold">Spend</Title>
                    <Flex className="gap-4 w-fit">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                gridRef.current?.api?.exportDataAsCsv()
                            }}
                            icon={ArrowDownOnSquareIcon}
                        >
                            Download
                        </Button>
                    </Flex>
                </Flex>
                <div className="ag-theme-alpine mt-4">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                    />
                </div>
            </Card>
        </>
    )
}
