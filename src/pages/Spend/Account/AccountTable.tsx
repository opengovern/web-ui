import dayjs, { Dayjs } from 'dayjs'
import { GridOptions, ValueFormatterParams } from 'ag-grid-community'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import {
    CurrencyDollarIcon,
    ListBulletIcon,
    ArrowTrendingUpIcon,
    CloudIcon,
} from '@heroicons/react/24/outline'
import { IFilter } from '../../../store'
import AdvancedTable, { IColumn } from '../../../components/AdvancedTable'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow } from '../../../api/api'
import { rowGenerator } from '../Metric/MetricTable'

type MSort = {
    sortCol: string
    sortType: 'asc' | 'desc' | null
}

interface IAccountTable {
    activeTimeRange: { start: Dayjs; end: Dayjs }
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

const defaultColumns = (start: Dayjs, end: Dayjs) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'connector',
            headerName: 'Provider',
            type: 'string',
            width: 140,
            enableRowGroup: true,
            filter: true,
            resizable: true,
            sortable: true,
            pinned: true,
        },
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
        {
            field: 'totalCost',
            headerName: `Total spend ${start.format(
                'MMM DD, YYYY'
            )} - ${end.format('MMM DD, YYYY')}`,
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
    ]
    return temp
}

export default function AccountTable({
    activeTimeRange,
    selectedGranularity,
    onGranularityChange,
    response,
    responsePrev,
    isLoading,
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
            columns = [
                ...dynamicCols,
                {
                    field: 'percent',
                    headerName: '% of Total',
                    type: 'string',
                    width: 90,
                    pinned: true,
                    aggFunc: 'sum',
                    resizable: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value ? `${param.value.toFixed(2)}%` : ''
                    },
                },
                {
                    field: 'spendInPrev',
                    headerName: `Spend in previous period ${activeTimeRange.start.format(
                        'MMM DD, YYYY'
                    )} - ${activeTimeRange.end.format('MMM DD, YYYY')}`,
                    type: 'string',
                    width: 90,
                    pinned: true,
                    aggFunc: 'sum',
                    resizable: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value ? `${param.value.toFixed(2)}%` : ''
                    },
                },
                {
                    field: 'change',
                    headerName: 'Change in Spend',
                    type: 'string',
                    width: 90,
                    pinned: true,
                    aggFunc: 'sum',
                    resizable: true,
                    valueFormatter: (
                        param: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow>
                    ) => {
                        if (param.data?.costValue === undefined) {
                            return ''
                        }
                        const arr = Object.entries(param.data.costValue)
                            .map(([k, v]) => ({
                                date: dayjs.utc(k),
                                amount: v,
                            }))
                            .sort((a, b) => {
                                if (a.date.isSame(b.date)) {
                                    return 0
                                }
                                return a.date.isBefore(b.date) ? 1 : -1
                            })

                        const start = arr[0]
                        const end = arr[arr.length - 1]

                        return (end.amount - start.amount).toFixed(2)
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
                    valueFormatter: (
                        param: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow>
                    ) => {
                        if (param.data?.costValue === undefined) {
                            return ''
                        }
                        const arr = Object.entries(param.data.costValue)
                            .map(([k, v]) => ({
                                date: dayjs.utc(k),
                                amount: v,
                            }))
                            .sort((a, b) => {
                                if (a.date.isSame(b.date)) {
                                    return 0
                                }
                                return a.date.isBefore(b.date) ? 1 : -1
                            })

                        const start = arr[0]
                        const end = arr[arr.length - 1]

                        const percentage =
                            ((end.amount - start.amount) / start.amount) * 100.0

                        return `${percentage.toFixed(2)}%`
                    },
                },
            ]
        }
        return columns
    }

    const [manualTableSort, onManualSortChange] = useState<MSort>({
        sortCol: 'none',
        sortType: null,
    })

    const [manualGrouping, onManualGrouping] = useState<string>('none')

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
            name: ' Accounts by Name (A-z)',
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
    }

    return (
        <AdvancedTable
            title="Cloud account list"
            downloadable
            id="spend_connection_table"
            loading={isLoading}
            columns={[
                ...defaultColumns(activeTimeRange.start, activeTimeRange.end),
                ...columnGenerator(response),
            ]}
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
            manualGrouping={manualGrouping}
            filterTabs={filterTabs}
        />
    )
}
