import { GridOptions, ValueFormatterParams } from 'ag-grid-community'
import { useNavigate } from 'react-router-dom'
import { Dispatch, SetStateAction, useState } from 'react'
import {
    CurrencyDollarIcon,
    ListBulletIcon,
    ArrowTrendingUpIcon,
    CloudIcon,
} from '@heroicons/react/24/outline'
import dayjs, { Dayjs } from 'dayjs'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow } from '../../../api/api'
import AdvancedTable, { IColumn } from '../../../components/AdvancedTable'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'
import { renderText } from '../../../components/DateRangePicker'

type MSort = {
    sortCol: string
    sortType: 'asc' | 'desc' | null
}

interface IAccountTable {
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
    ref?: React.MutableRefObject<any>
}

export const pickFromRecord = (
    v: Record<string, number> | undefined,
    item: 'oldest' | 'latest'
) => {
    if (v === undefined) {
        return 0
    }
    const m = Object.entries(v)
        .map((i) => {
            return {
                date: dayjs(i[0]),
                value: i[1],
            }
        })
        .sort((a, b) => {
            if (a.date.isSame(b.date)) {
                return 0
            }
            return a.date.isAfter(b.date) ? 1 : -1
        })

    const idx = item === 'oldest' ? 0 : m.length - 1
    const res = m.at(idx)?.value || 0
    return res
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

    let pinnedRow = [
        { totalCost: sum, dimension: 'Total spend', ...granularity },
    ]
    if (!loading) {
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
                const totalSpendInPrev =
                    inputPrev
                        ?.filter((v) => v.accountID === row.accountID)
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
                    changePercent: ((latest - oldest) / oldest) * 100.0,
                    change: latest - oldest,
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

const defaultColumns: IColumn<any, any>[] = [
    {
        field: 'dimension',
        headerName: 'Account name',
        type: 'string',
        filter: true,
        sortable: true,
        resizable: true,
        pivot: false,
        pinned: true,
        cellRenderer: (param: ValueFormatterParams) => (
            <span>{param.value}</span>
        ),
    },
    {
        field: 'accountId',
        headerName: 'Account ID',
        type: 'string',
        filter: true,
        sortable: true,
        resizable: true,
        pivot: false,
        pinned: true,
        cellRenderer: (param: ValueFormatterParams) => (
            <span>{param.value}</span>
        ),
    },
    {
        field: 'dimensionId',
        headerName: 'Kaytu Connection ID',
        type: 'string',
        filter: true,
        sortable: true,
        resizable: true,
        pivot: false,
        hide: true,
        pinned: true,
        cellRenderer: (param: ValueFormatterParams) => (
            <span>{param.value}</span>
        ),
    },
]

const gridOptions: GridOptions = {
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
    enableRangeSelection: true,
    groupIncludeFooter: true,
    groupIncludeTotalFooter: true,
    maintainColumnOrder: true,
}

export default function AccountTable({
    timeRange,
    prevTimeRange,
    selectedGranularity,
    onGranularityChange,
    response,
    responsePrev,
    isLoading,
    ref,
}: IAccountTable) {
    const navigate = useNavigate()

    const [granularityEnabled, setGranularityEnabled] = useState<boolean>(false)

    const columnGenerator = (
        input:
            | GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow[]
            | undefined
    ) => {
        let columns: IColumn<any, any>[] = []
        if (input) {
            const columnNames =
                input?.flatMap((row) => {
                    if (row.costValue) {
                        return Object.entries(row.costValue).map(
                            (value) => value[0]
                        )
                    }
                    return []
                }) || []
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
            columns = [
                ...dynamicCols,
                {
                    field: 'percent',
                    headerName: '% of Total',
                    type: 'string',
                    width: 90,
                    pinned: true,
                    hide: true,
                    aggFunc: 'sum',
                    resizable: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value ? `${param.value.toFixed(2)}%` : ''
                    },
                },
                {
                    field: 'prevTotalCost',
                    headerName: `Spend in previous period [${renderText(
                        prevTimeRange.start,
                        prevTimeRange.end
                    )}]`,
                    type: 'string',
                    width: 90,
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
                    field: 'change',
                    headerName: 'Change in Spend',
                    type: 'string',
                    width: 90,
                    pinned: true,
                    hide: true,
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
                    headerName: 'Change %',
                    type: 'string',
                    width: 90,
                    pinned: true,
                    aggFunc: 'sum',
                    resizable: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value !== undefined
                            ? `${param.value.toFixed(0)}%`
                            : ''
                    },
                },
            ]
        }
        return columns
    }
    const [manualGrouping, onManualGrouping] = useState<string>('none')

    const columns: IColumn<any, any>[] = [
        {
            field: 'connector',
            headerName: 'Provider',
            type: 'string',
            width: 140,
            enableRowGroup: true,
            rowGroup: manualGrouping === 'connector',
            filter: true,
            resizable: true,
            sortable: true,
            pinned: true,
        },
        ...defaultColumns,
        {
            field: 'totalCost',
            headerName: `Total spend [${renderText(
                timeRange.start,
                timeRange.end
            )}]`,
            type: 'price',
            width: 110,
            sortable: true,
            aggFunc: 'sum',
            resizable: true,
            pivot: false,
            pinned: true,
            valueFormatter: (param: ValueFormatterParams) => {
                return param.value ? exactPriceDisplay(param.value) : ''
            },
        },
        ...columnGenerator(response),
    ]

    const [manualTableSort, onManualSortChange] = useState<MSort>({
        sortCol: 'none',
        sortType: null,
    })

    const filterTabs = [
        {
            type: 0,
            icon: CurrencyDollarIcon,
            name: 'Highest Spend Accounts',
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
            name: 'Accounts by Name (A-z)',
            function: () => {
                onManualSortChange({
                    sortCol: 'dimension',
                    sortType: 'asc',
                })
                onManualGrouping('none')
            },
        },
        {
            type: 2,
            icon: ArrowTrendingUpIcon,
            name: 'Fastest Growth Accounts',
            function: () => {
                onManualSortChange({
                    sortCol: 'percent',
                    sortType: 'desc',
                })
                onManualGrouping('none')
            },
        },
        {
            type: 3,
            icon: CloudIcon,
            name: 'Accounts by Provider',
            function: () => {
                onManualGrouping('connector')
                onManualSortChange({
                    sortCol: 'none',
                    sortType: null,
                })
            },
        },
    ]

    return (
        <AdvancedTable
            title="Cloud account list"
            downloadable
            id="spend_connection_table"
            loading={isLoading}
            columns={columns}
            rowData={rowGenerator(response, responsePrev, isLoading).finalRow}
            pinnedRow={
                rowGenerator(response, responsePrev, isLoading).pinnedRow
            }
            options={gridOptions}
            onRowClicked={(event) => {
                if (event.data.id) {
                    navigate(`account_${event.data.id}`)
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
            // manualGrouping={manualGrouping}
            filterTabs={filterTabs}
            ref={ref}
        />
    )
}
