import { Dayjs } from 'dayjs'
import { GridOptions, ValueFormatterParams } from 'ag-grid-community'
import { useNavigate } from 'react-router-dom'
import { Select, SelectItem, Text } from '@tremor/react'
import { Dispatch, SetStateAction } from 'react'
import { IFilter } from '../../../../../store'
import { useInventoryApiV2AnalyticsSpendTableList } from '../../../../../api/inventory.gen'
import Table, { IColumn } from '../../../../../components/Table'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow } from '../../../../../api/api'
import { exactPriceDisplay } from '../../../../../utilities/numericDisplay'
import { capitalizeFirstLetter } from '../../../../../utilities/labelMaker'

interface IServices {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    connections: IFilter
    selectedGranularity: 'none' | 'monthly' | 'daily'
    isSummary?: boolean
    onGranularityChange: Dispatch<SetStateAction<'monthly' | 'daily' | 'none'>>
}

export const rowGenerator = (
    input:
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
            })
        }
    }
    const finalRow = roww.sort((a, b) => b.totalCost - a.totalCost)
    return {
        finalRow,
        pinnedRow,
    }
}

export const defaultColumns: IColumn<any, any>[] = [
    {
        field: 'connector',
        headerName: 'Cloud provider',
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
        headerName: 'Metric',
        type: 'string',
        filter: true,
        sortable: true,
        resizable: true,
        pivot: false,
        pinned: true,
    },
    {
        field: 'totalCost',
        headerName: 'Total spend',
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

export default function Metrics({
    activeTimeRange,
    connections,
    selectedGranularity,
    isSummary = false,
    onGranularityChange,
}: IServices) {
    const navigate = useNavigate()

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
                selectedGranularity !== 'none'
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

    const query = (): {
        connector: ('' | 'AWS' | 'Azure')[]
        granularity: 'daily' | 'monthly'
        connectionId: string[]
        startTime: number
        endTime: number
        dimension: 'metric'
        connectionGroup: string[]
    } => {
        let gra: 'monthly' | 'daily' = 'daily'
        if (selectedGranularity === 'monthly') {
            gra = 'monthly'
        }

        return {
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            dimension: 'metric',
            granularity: gra,
            connector: [connections.provider],
            connectionId: connections.connections,
            connectionGroup: connections.connectionGroup,
        }
    }
    const { response, isLoading } = useInventoryApiV2AnalyticsSpendTableList(
        query()
    )

    const columns: IColumn<any, any>[] = [
        {
            field: 'category',
            headerName: 'Category',
            type: 'string',
            width: 130,
            rowGroup: isSummary,
            hide: false,
            filter: true,
            enableRowGroup: true,
            sortable: true,
            resizable: true,
            pinned: true,
        },
        ...defaultColumns,
        {
            field: 'percent',
            headerName: '%',
            type: 'string',
            width: 90,
            pinned: true,
            aggFunc: 'sum',
            resizable: true,
            valueFormatter: (param: ValueFormatterParams) => {
                return param.value ? `${param.value.toFixed(2)}%` : ''
            },
            hide: isSummary,
        },
        ...columnGenerator(response),
    ]

    return (
        <Table
            title="Metric list"
            downloadable
            id={isSummary ? 'spend_summary_table' : 'spend_service_table'}
            loading={isLoading}
            columns={columns}
            rowData={rowGenerator(response, isLoading).finalRow}
            pinnedRow={rowGenerator(response, isLoading).pinnedRow}
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
        >
            <Select
                enableClear={false}
                value={selectedGranularity}
                placeholder={
                    selectedGranularity
                        ? capitalizeFirstLetter(selectedGranularity)
                        : ''
                }
                onValueChange={(v) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onGranularityChange(v)
                }}
                className="w-10"
            >
                <SelectItem value="none">
                    <Text>None</Text>
                </SelectItem>
                <SelectItem value="daily">
                    <Text>Daily</Text>
                </SelectItem>
                <SelectItem value="monthly">
                    <Text>Monthly</Text>
                </SelectItem>
            </Select>
        </Table>
    )
}
