import dayjs, { Dayjs } from 'dayjs'
import { ValueFormatterParams } from 'ag-grid-community'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import {
    CurrencyDollarIcon,
    ListBulletIcon,
    ArrowTrendingUpIcon,
    CloudIcon,
} from '@heroicons/react/24/outline'
import { IFilter, isDemoAtom } from '../../../../../store'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow } from '../../../../../api/api'
import AdvancedTable, { IColumn } from '../../../../../components/AdvancedTable'
import { exactPriceDisplay } from '../../../../../utilities/numericDisplay'
import { useInventoryApiV2AnalyticsSpendTableList } from '../../../../../api/inventory.gen'

import { gridOptions, rowGenerator } from '../Metrics'

type MSort = {
    sortCol: string
    sortType: 'asc' | 'desc' | null
}

interface IConnections {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    connections: IFilter
    selectedGranularity: 'monthly' | 'daily'
    onGranularityChange: Dispatch<SetStateAction<'monthly' | 'daily'>>
}

const defaultColumns = (isDemo: boolean, start: Dayjs, end: Dayjs) => {
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
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
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
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
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
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
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

export default function CloudAccounts({
    activeTimeRange,
    connections,
    selectedGranularity,
    onGranularityChange,
}: IConnections) {
    const navigate = useNavigate()
    const isDemo = useAtomValue(isDemoAtom)

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

    const query = (
        prev = false
    ): {
        startTime?: number | undefined
        endTime?: number | undefined
        granularity?: 'daily' | 'monthly' | 'yearly' | undefined
        dimension?: 'metric' | 'connection' | undefined
        connectionId?: string[]
        connector: ('' | 'AWS' | 'Azure')[]
        metricIds?: string[]
        connectionGroup?: string[]
    } => {
        let gra: 'monthly' | 'daily' = 'daily'
        if (selectedGranularity === 'monthly') {
            gra = 'monthly'
        }

        return {
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            dimension: 'connection',
            granularity: gra,
            connector: [connections.provider],
            connectionId: connections.connections,
            connectionGroup: connections.connectionGroup,
        }
    }
    const { response, isLoading } = useInventoryApiV2AnalyticsSpendTableList(
        query()
    )
    const { response: responsePrev, isLoading: prevIsLoading } =
        useInventoryApiV2AnalyticsSpendTableList(query(true))

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

    return (
        <AdvancedTable
            title="Cloud account list"
            downloadable
            id="spend_connection_table"
            loading={isLoading}
            columns={[
                ...defaultColumns(
                    isDemo,
                    activeTimeRange.start,
                    activeTimeRange.end
                ),
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
