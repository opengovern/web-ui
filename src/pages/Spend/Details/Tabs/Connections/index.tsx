import { Dayjs } from 'dayjs'
import { ValueFormatterParams } from 'ag-grid-community'
import { Select, SelectItem, Text } from '@tremor/react'
import { Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { IFilter } from '../../../../../store'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow } from '../../../../../api/api'
import Table, { IColumn } from '../../../../../components/Table'
import { exactPriceDisplay } from '../../../../../utilities/numericDisplay'
import { useInventoryApiV2AnalyticsSpendTableList } from '../../../../../api/inventory.gen'
import { capitalizeFirstLetter } from '../../../../../utilities/labelMaker'
import { gridOptions, rowGenerator } from '../Services'

interface IConnections {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    connections: IFilter
    selectedGranularity: 'none' | 'monthly' | 'daily'
    onGranularityChange: Dispatch<SetStateAction<'monthly' | 'daily' | 'none'>>
}

const defaultColumns: IColumn<any, any>[] = [
    {
        field: 'connector',
        headerName: 'Connector',
        type: 'string',
        width: 115,
        enableRowGroup: true,
        filter: true,
        resizable: true,
        sortable: true,
        pinned: true,
    },
    {
        field: 'dimension',
        headerName: 'Connection name',
        type: 'string',
        filter: true,
        sortable: true,
        resizable: true,
        pivot: false,
        pinned: true,
    },
    {
        field: 'accountId',
        headerName: 'Provider ID',
        type: 'string',
        filter: true,
        sortable: true,
        resizable: true,
        pivot: false,
        pinned: true,
    },
    {
        field: 'totalCost',
        headerName: 'Total cost',
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

export default function Connections({
    activeTimeRange,
    connections,
    selectedGranularity,
    onGranularityChange,
}: IConnections) {
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
        startTime?: number | undefined
        endTime?: number | undefined
        granularity?: 'daily' | 'monthly' | 'yearly' | undefined
        dimension?: 'metric' | 'connection' | undefined
        connectionId?: string[]
        connector?: 'AWS' | 'Azure' | ''
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
            connector: connections.provider,
            connectionId: connections.connections,
            connectionGroup: connections.connectionGroup,
        }
    }
    const { response, isLoading } = useInventoryApiV2AnalyticsSpendTableList(
        query()
    )

    return (
        <Table
            title="Connections"
            downloadable
            id="spend_connection_table"
            loading={isLoading}
            columns={[...defaultColumns, ...columnGenerator(response)]}
            rowData={rowGenerator(response).finalRow}
            pinnedRow={rowGenerator(response).pinnedRow}
            options={gridOptions}
            onRowClicked={(event) => {
                if (event.data.connectionId) {
                    navigate(`account_${event.data.id}`)
                }
            }}
            onGridReady={(event) => {
                if (isLoading) {
                    event.api.showLoadingOverlay()
                }
            }}
        >
            <Select
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
