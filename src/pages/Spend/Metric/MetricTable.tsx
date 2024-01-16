import { GridOptions, ValueFormatterParams } from 'ag-grid-community'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
    CurrencyDollarIcon,
    ListBulletIcon,
    ArrowTrendingUpIcon,
    SwatchIcon,
} from '@heroicons/react/24/outline'
import dayjs, { Dayjs } from 'dayjs'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow } from '../../../api/api'
import AdvancedTable, { IColumn } from '../../../components/AdvancedTable'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'
import { renderText } from '../../../components/Layout/Header/DateRangePicker'

type MSort = {
    sortCol: string
    sortType: 'asc' | 'desc' | null
}

interface IMetricTable {
    timeRange: { start: Dayjs; end: Dayjs }
    prevTimeRange: { start: Dayjs; end: Dayjs }
    selectedGranularity: 'monthly' | 'daily'
    onGranularityChange: Dispatch<SetStateAction<'monthly' | 'daily'>>
    response:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow[]
        | undefined
    responsePrev:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow[]
        | undefined
    isLoading: boolean
}

const rowGenerator = (
    input:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow[]
        | undefined,
    inputPrev:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow[]
        | undefined,
    loading: boolean
) => {
    let sum = 0
    const roww = []
    const granularity: any = {}
    let pinnedRow = [
        { totalCost: sum, dimension: 'Total spend', ...granularity },
    ]
    if (!loading) {
        const sortedDate =
            input
                ?.flatMap((row) => Object.entries(row.costValue || {}))
                .map((v) => dayjs(v[0]))
                .sort((a, b) => {
                    if (a.isSame(b)) {
                        return 0
                    }
                    return a.isBefore(b) ? -1 : 1
                }) || []
        const oldestDate = sortedDate.at(0)?.format('YYYY-MM-DD')
        const latestDate = sortedDate
            .at(sortedDate.length - 1)
            ?.format('YYYY-MM-DD')

        const rows =
            input?.map((row) => {
                let temp = {}
                let totalCost = 0
                if (row.costValue) {
                    temp = Object.fromEntries(Object.entries(row.costValue))
                }
                Object.values(temp).map(
                    // eslint-disable-next-line no-return-assign
                    (v: number | unknown) => (totalCost += Number(v))
                )
                const totalMetricSpendInPrev =
                    inputPrev
                        ?.flatMap((v) => Object.entries(v.costValue || {}))
                        .map((v) => v[1])
                        .reduce((prev, curr) => prev + curr, 0) || 0
                const totalSpendInPrev =
                    inputPrev
                        ?.filter((v) => v.dimensionId === row.dimensionId)
                        .flatMap((v) => Object.entries(v.costValue || {}))
                        .map((v) => v[1])
                        .reduce((prev, curr) => prev + curr, 0) || 0
                const oldest =
                    Object.entries(row.costValue || {})
                        .filter((v) => v[0] === oldestDate)
                        .at(0)?.[1] || 0
                const latest =
                    Object.entries(row.costValue || {})
                        .filter((v) => v[0] === latestDate)
                        .at(0)?.[1] || 0
                return {
                    dimension: row.dimensionName
                        ? row.dimensionName
                        : row.dimensionId,
                    dimensionId: row.dimensionId,
                    category: row.category,
                    accountId: row.accountID,
                    connector: row.connector,
                    id: row.dimensionId,
                    totalCost,
                    prevTotalCost: totalSpendInPrev,
                    prevPercent:
                        (totalSpendInPrev / totalMetricSpendInPrev) * 100.0,
                    changePercent:
                        ((totalCost - totalSpendInPrev) / totalSpendInPrev) *
                        100.0,
                    change: totalCost - totalSpendInPrev,
                    ...temp,
                }
            }) || []
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
        pinnedRow = [
            { totalCost: sum, dimension: 'Total spend', ...granularity },
        ]
        for (let i = 0; i < rows.length; i += 1) {
            roww.push({
                ...rows[i],
                percent: (rows[i].totalCost / sum) * 100,
                spendInPrev: 0,
            })
        }
    }
    const finalRow = roww.sort((a, b) => b.totalCost - a.totalCost)
    return {
        finalRow,
        pinnedRow,
    }
}

export const gridOptions: GridOptions = {
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
        width: 150,
        suppressMenu: true,
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
    enableRangeSelection: true,
    groupIncludeFooter: true,
    groupIncludeTotalFooter: true,
}

export default function MetricTable({
    timeRange,
    prevTimeRange,
    response,
    responsePrev,
    isLoading,
    selectedGranularity,
    onGranularityChange,
}: IMetricTable) {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const [granularityEnabled, setGranularityEnabled] = useState<boolean>(false)

    const columnGenerator = (
        input:
            | GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow[]
            | undefined
    ) => {
        let columns: IColumn<any, any>[] = []
        if (input) {
            const columnNames =
                input
                    ?.map((row) => {
                        if (row.costValue) {
                            return Object.entries(row.costValue).map(
                                (value) => value[0]
                            )
                        }
                        return []
                    })
                    .flat() || []
            const dynamicCols: IColumn<any, any>[] =
                granularityEnabled === true
                    ? columnNames
                          .filter(
                              (value, index, array) =>
                                  array.indexOf(value) === index
                          )
                          .map((colName) => {
                              const v: IColumn<any, any> = {
                                  field: colName,
                                  headerName: colName,
                                  type: 'price',
                                  width: 130,
                                  sortable: true,
                                  suppressMenu: true,
                                  resizable: true,
                                  pivot: false,
                                  aggFunc: 'sum',
                                  valueFormatter: (
                                      param: ValueFormatterParams
                                  ) => {
                                      return param.value
                                          ? exactPriceDisplay(param.value)
                                          : ''
                                  },
                              }
                              return v
                          })
                    : []
            columns = [...dynamicCols]
        }
        return columns
    }

    const columns: IColumn<any, any>[] = [
        {
            headerName: 'Metric Metadata',
            type: 'parent',
            pinned: true,
            children: [
                {
                    field: 'category',
                    headerName: 'Category',
                    type: 'string',
                    width: 110,
                    hide: false,
                    filter: true,
                    enableRowGroup: true,
                    suppressMenu: true,
                    sortable: true,
                    resizable: true,
                    pinned: true,
                },
                {
                    field: 'connector',
                    headerName: 'Provider',
                    type: 'string',
                    width: 100,
                    suppressMenu: true,
                    enableRowGroup: true,
                    filter: true,
                    resizable: true,
                    sortable: true,
                    pinned: true,
                },
                {
                    field: 'dimension',
                    headerName: 'Name',
                    type: 'string',
                    width: 230,
                    suppressMenu: true,
                    filter: true,
                    sortable: true,
                    resizable: true,
                    pivot: false,
                    pinned: true,
                },
            ],
        },
        {
            headerName: `Current Period [${renderText(
                timeRange.start,
                timeRange.end
            )}]`,
            type: 'parent',
            pinned: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            children: [
                {
                    field: 'totalCost',
                    headerName: 'Spend',
                    type: 'price',
                    wrapHeaderText: true,
                    autoHeaderHeight: true,
                    suppressMenu: true,
                    width: 80,
                    sortable: true,
                    aggFunc: 'sum',
                    resizable: true,
                    pivot: false,
                    pinned: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value ? exactPriceDisplay(param.value) : ''
                    },
                },
                {
                    field: 'percent',
                    headerName: '% of Total',
                    type: 'string',
                    suppressMenu: true,
                    width: 100,
                    pinned: true,
                    aggFunc: 'sum',
                    resizable: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value ? `${param.value.toFixed(2)}%` : ''
                    },
                },
            ],
        },
        {
            headerName: `Previous Period [${renderText(
                prevTimeRange.start,
                prevTimeRange.end
            )}]`,
            type: 'parent',
            pinned: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            children: [
                {
                    field: 'prevTotalCost',
                    headerName: 'Spend',
                    type: 'string',
                    wrapHeaderText: true,
                    autoHeaderHeight: true,
                    suppressMenu: true,
                    width: 80,
                    pinned: true,
                    aggFunc: 'sum',
                    resizable: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value !== undefined
                            ? `$${param.value.toFixed(0)}`
                            : ''
                    },
                },
                {
                    field: 'prevPercent',
                    headerName: '% of Total',
                    type: 'string',
                    suppressMenu: true,
                    width: 100,
                    pinned: true,
                    aggFunc: 'sum',
                    resizable: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value ? `${param.value.toFixed(2)}%` : ''
                    },
                },
            ],
        },
        {
            headerName: 'Change',
            type: 'parent',
            wrapHeaderText: true,
            autoHeaderHeight: true,
            pinned: true,
            children: [
                {
                    field: 'change',
                    headerName: 'Delta',
                    type: 'string',
                    suppressMenu: true,
                    width: 80,
                    pinned: true,
                    aggFunc: 'sum',
                    resizable: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value !== undefined
                            ? `$${param.value.toFixed(0)}`
                            : ''
                    },
                },
                {
                    field: 'changePercent',
                    headerName: '%',
                    type: 'string',
                    suppressMenu: true,
                    width: 80,
                    pinned: true,
                    hide: true,
                    aggFunc: 'sum',
                    resizable: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value !== undefined
                            ? `${param.value.toFixed(0)}%`
                            : ''
                    },
                },
            ],
        },
        {
            headerName: 'Granular Details',
            type: 'parent',
            wrapHeaderText: true,
            autoHeaderHeight: true,
            children: [...columnGenerator(response)],
        },
    ]

    const [manualTableSort, onManualSortChange] = useState<MSort>({
        sortCol: 'none',
        sortType: null,
    })

    const [manualGrouping, onManualGrouping] = useState<string>(
        searchParams.get('groupby') === 'category' ? 'category' : 'none'
    )

    const filterTabs = [
        {
            type: 0,
            icon: CurrencyDollarIcon,
            name: 'Sort by Spend',
            function: () => {
                onManualSortChange({
                    sortCol: 'totalCost',
                    sortType: 'desc',
                })
                onManualGrouping('none')
            },
        },
        {
            type: 1,
            icon: ListBulletIcon,
            name: 'Sort by Change',
            function: () => {
                onManualSortChange({
                    sortCol: 'change',
                    sortType: 'desc',
                })
                onManualGrouping('none')
            },
        },
        {
            type: 2,
            icon: ArrowTrendingUpIcon,
            name: 'Group by Metric Category',
            function: () => {
                onManualGrouping('category')
                onManualSortChange({
                    sortCol: 'none',
                    sortType: null,
                })
            },
        },
        {
            type: 3,
            icon: SwatchIcon,
            name: 'Group by Provider',
            function: () => {
                onManualGrouping('connector')
                onManualSortChange({
                    sortCol: 'none',
                    sortType: null,
                })
            },
        },
    ]

    const [tab, setTab] = useState(
        searchParams.get('groupby') === 'category' ? 3 : 0
    )

    const [tableKey, setTableKey] = useState('')

    useEffect(() => {
        setTableKey(Math.random().toString(16).slice(2, 8))
    }, [manualGrouping, timeRange, granularityEnabled])

    return (
        <AdvancedTable
            key={`metric_${tableKey}`}
            title="Metric list"
            downloadable
            id="spend_service_table"
            loading={isLoading}
            columns={columns}
            rowData={rowGenerator(response, responsePrev, isLoading).finalRow}
            pinnedRow={
                rowGenerator(response, responsePrev, isLoading).pinnedRow
            }
            options={gridOptions}
            onRowClicked={(event) => {
                if (event.data.category.length) {
                    navigate(`metric_${event.data.id}`)
                }
            }}
            onGridReady={(event) => {
                if (isLoading) {
                    event.api.showLoadingOverlay()
                }
            }}
            granularityEnabled={granularityEnabled}
            setGranularityEnabled={setGranularityEnabled}
            selectedGranularity={selectedGranularity}
            onGranularityChange={onGranularityChange}
            manualSort={manualTableSort}
            manualGrouping={manualGrouping}
            filterTabs={filterTabs}
            tabIdx={tab}
            setTabIdx={setTab}
        />
    )
}
