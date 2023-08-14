import {
    Button,
    Card,
    Flex,
    Select,
    SelectItem,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'ag-grid-enterprise'
import { useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import {
    ColDef,
    GetContextMenuItemsParams,
    GridOptions,
    MenuItemDef,
} from 'ag-grid-community'
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline'
import DateRangePicker from '../../../components/DateRangePicker'
import Menu from '../../../components/Menu'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { useInventoryApiV2AnalyticsSpendTableList } from '../../../api/inventory.gen'
import { spendTimeAtom } from '../../../store'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'

export default function CostMetricsDetails() {
    const navigate = useNavigate()
    const breadcrumbsPages = [
        {
            name: 'Spend',
            path: () => {
                navigate('./..')
            },
            current: false,
        },
        { name: 'Spend metrics', path: '', current: true },
    ]

    const activeTimeRange = useAtomValue(spendTimeAtom)
    const [dimension, setDimension] = useState<string>('metric')
    const dimensionName = () => {
        switch (dimension) {
            case 'metric':
                return 'Service Name'
            case 'connection':
                return 'Connection Name'
            default:
                return ''
        }
    }
    const [granularity, setGranularity] = useState<string>('daily')
    const query = (): {
        startTime?: number | undefined
        endTime?: number | undefined
        granularity?: 'daily' | 'monthly' | 'yearly' | undefined
        dimension?: 'metric' | 'connection' | undefined
    } => {
        let dim: 'metric' | 'connection' = 'metric'
        if (dimension === 'connection') {
            dim = 'connection'
        }

        let gra: 'monthly' | 'daily' = 'daily'
        if (granularity === 'monthly') {
            gra = 'monthly'
        }
        return {
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            dimension: dim,
            granularity: gra,
        }
    }
    const { response, isLoading } = useInventoryApiV2AnalyticsSpendTableList(
        query()
    )

    const gridRef = useRef<AgGridReact>(null)
    const filterPanel = () => {
        return (
            <Flex
                flexDirection="col"
                justifyContent="start"
                alignItems="start"
                className="w-full"
            >
                <Text className="m-3">Date filter</Text>
                <DateRangePicker isSpend />
                <Text className="m-3">Granularity</Text>
                <Select
                    value={granularity}
                    onValueChange={(v) => setGranularity(v)}
                >
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                </Select>
                <Text className="m-3">Group by</Text>
                <Select
                    value={dimension}
                    onValueChange={(v) => setDimension(v)}
                >
                    <SelectItem value="metric">Metric</SelectItem>
                    <SelectItem value="connection">Connection</SelectItem>
                </Select>
            </Flex>
        )
    }
    useEffect(() => {
        gridRef.current?.api?.setSideBar({
            toolPanels: [
                {
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    minWidth: 300,
                    maxWidth: 300,
                    width: 300,
                    toolPanel: filterPanel,
                },
            ],
            defaultToolPanel: '',
        })
    }, [granularity, dimension])

    function getContextMenuItems(
        params: GetContextMenuItemsParams
    ): (string | MenuItemDef)[] {
        const result: (string | MenuItemDef)[] = [
            'copy',
            'separator',
            'chartRange',
        ]
        return result
    }

    const gridOptions: GridOptions = {
        pagination: true,
        paginationPageSize: 25,
        suppressExcelExport: true,
        animateRows: true,
        getRowHeight: () => 50,
        onGridReady: (e) => {
            if (isLoading) {
                e.api.showLoadingOverlay()
            }
        },
        onRowDataUpdated: (e) => {
            window.setTimeout(() => {
                try {
                    e.columnApi?.autoSizeAllColumns(false)
                } catch (err) {
                    //
                }
            }, 100)
        },
        sideBar: {
            toolPanels: [
                {
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    minWidth: 300,
                    maxWidth: 300,
                    width: 300,
                    toolPanel: filterPanel,
                },
            ],
            defaultToolPanel: 'filters',
        },
        statusBar: {
            statusPanels: [{ statusPanel: 'agAggregationComponent' }],
        },
        enableRangeSelection: true,
        getContextMenuItems,
    }

    useEffect(() => {
        if (!isLoading) {
            const defaultCols: ColDef[] = [
                {
                    field: 'dimension',
                    headerName: dimensionName(),
                    sortable: true,
                    filter: 'agTextColumnFilter',
                    suppressMenu: true,
                    floatingFilter: true,
                    resizable: true,
                    pivot: false,
                    pinned: true,
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
                        filter: 'agNumberColumnFilter',
                        suppressMenu: true,
                        floatingFilter: true,
                        resizable: true,
                        pivot: false,
                        valueFormatter: (param) => {
                            return exactPriceDisplay(param.value)
                        },
                    }
                    return v
                })

            const cols = [...defaultCols, ...dynamicCols]
            const rows =
                response?.map((row) => {
                    let temp = {}
                    if (row.costValue) {
                        temp = Object.fromEntries(Object.entries(row.costValue))
                    }
                    return {
                        dimension: row.dimensionName
                            ? row.dimensionName
                            : row.dimensionId,
                        ...temp,
                    }
                }) || []

            gridRef.current?.api?.setColumnDefs(cols)
            gridRef.current?.api?.setRowData(rows)
        } else {
            gridRef.current?.api?.showLoadingOverlay()
        }
    }, [isLoading])

    return (
        <Menu currentPage="spend">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Breadcrumbs pages={breadcrumbsPages} />
            </Flex>
            <Card className="mt-10">
                <Flex>
                    <Title className="font-semibold">Cost Metrics</Title>
                    <Flex className="w-fit gap-3">
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
                <div className="ag-theme-alpine mt-10">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                    />
                </div>
            </Card>
        </Menu>
    )
}
