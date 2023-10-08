import {
    Button,
    Card,
    Flex,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'ag-grid-enterprise'
import { useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import {
    ColDef,
    FilterChangedEvent,
    GridOptions,
    MenuItemDef,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline'
import Menu from '../../../components/Menu'
import { useInventoryApiV2AnalyticsSpendTableList } from '../../../api/inventory.gen'
import { filterAtom, spendTimeAtom } from '../../../store'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'
import { checkGranularity } from '../../../utilities/dateComparator'
import Header from '../../../components/Header'
import { capitalizeFirstLetter } from '../../../utilities/labelMaker'

const dimensionList = ['connection', 'metric', 'category']

export default function CostMetricsDetails() {
    const navigate = useNavigate()
    const { hash } = useLocation()
    const page = () => {
        switch (hash) {
            case '#connections':
                return 'connection'
            case '#services':
                return 'metric'
            default:
                return 'category'
        }
    }

    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const [dimension, setDimension] = useState<string>(page())
    const dimensionName = () => {
        switch (dimension) {
            case 'connection':
                return 'Connection Name'
            default:
                return 'Service Name'
        }
    }
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'none'
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

    useEffect(() => {
        switch (selectedIndex) {
            case 0:
                setSelectedGranularity('none')
                break
            case 1:
                setSelectedGranularity('daily')
                break
            case 2:
                setSelectedGranularity('monthly')
                break
            default:
                setSelectedGranularity('monthly')
                break
        }
    }, [selectedIndex])
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
        let dim: 'metric' | 'connection' = 'metric'
        if (dimension === 'connection') {
            dim = 'connection'
        }

        let gra: 'monthly' | 'daily' = 'daily'
        if (selectedGranularity === 'monthly') {
            gra = 'monthly'
        }

        return {
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            dimension: dim,
            granularity: gra,
            connector: selectedConnections.provider,
            connectionId: selectedConnections.connections,
            connectionGroup: selectedConnections.connectionGroup,
        }
    }
    const { response, isLoading } = useInventoryApiV2AnalyticsSpendTableList(
        query()
    )

    const gridRef = useRef<AgGridReact>(null)

    function getContextMenuItems(): (string | MenuItemDef)[] {
        return ['copy', 'separator', 'chartRange']
    }

    const filterPanel = () => {
        return (
            <Flex
                flexDirection="col"
                justifyContent="start"
                alignItems="start"
                className="w-full px-6"
            >
                <Text className="my-3">Granularity</Text>
                <TabGroup
                    index={selectedIndex}
                    onIndexChange={setSelectedIndex}
                    className="w-fit rounded-lg"
                >
                    <TabList variant="solid">
                        <Tab>None</Tab>
                        <Tab>Daily</Tab>
                        <Tab
                            disabled={
                                !checkGranularity(
                                    activeTimeRange.start,
                                    activeTimeRange.end
                                ).monthly
                            }
                        >
                            Monthly
                        </Tab>
                    </TabList>
                </TabGroup>
                <Text className="my-3">Show by</Text>
                {dimensionList.map((d) => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                    <label
                        onClick={() => setDimension(d)}
                        htmlFor={d}
                        className="flex items-center gap-2 mb-1.5"
                    >
                        <input id={d} type="radio" checked={dimension === d} />
                        <Text>
                            {d === 'metric'
                                ? 'Services'
                                : capitalizeFirstLetter(d)}
                        </Text>
                    </label>
                ))}
            </Flex>
        )
    }

    useEffect(() => {
        gridRef.current?.api?.setSideBar({
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
                {
                    id: 'chart',
                    labelDefault: 'Options',
                    labelKey: 'chart',
                    iconKey: 'chart',
                    minWidth: 300,
                    maxWidth: 300,
                    width: 300,
                    toolPanel: filterPanel,
                },
            ],
            defaultToolPanel: '',
        })
    }, [selectedGranularity, dimension])

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
        onFilterChanged(e: FilterChangedEvent<any>) {
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
                {
                    id: 'chart',
                    labelDefault: 'Options',
                    labelKey: 'chart',
                    iconKey: 'chart',
                    minWidth: 300,
                    maxWidth: 300,
                    width: 300,
                    toolPanel: filterPanel,
                },
            ],
            defaultToolPanel: '',
        },
        enableRangeSelection: true,
        getContextMenuItems,
        groupIncludeFooter: true,
        groupIncludeTotalFooter: true,
        onRowClicked(event: RowClickedEvent) {
            if (event.data) {
                if (event.data.category.length) {
                    navigate(`metric_${event.data.id}`)
                } else navigate(`account_${event.data.id}`)
            }
        },
    }

    // eslint-disable-next-line consistent-return
    const categoryOptions = () => {
        if (dimension !== 'connection') {
            return [
                {
                    field: 'percent',
                    headerName: '%',
                    pinned: true,
                    sortable: true,
                    aggFunc: 'sum',
                    resizable: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value ? `${param.value.toFixed(2)}%` : ''
                    },
                    hide: dimension === 'metric',
                },
                {
                    field: 'category',
                    headerName: 'Category',
                    rowGroup: dimension === 'category',
                    filter: true,
                    enableRowGroup: true,
                    sortable: true,
                    resizable: true,
                    pinned: true,
                },
            ]
        }
        return []
    }

    const accountOptions = () => {
        if (dimension === 'connection') {
            return [
                {
                    field: 'accountId',
                    headerName: 'Provider ID',
                    filter: true,
                    sortable: true,
                    resizable: true,
                    pivot: false,
                    pinned: true,
                },
            ]
        }
        return []
    }

    useEffect(() => {
        if (!isLoading) {
            const defaultCols: ColDef[] = [
                {
                    field: 'connector',
                    headerName: 'Connector',
                    type: 'connector',
                    enableRowGroup: true,
                    filter: true,
                    resizable: true,
                    sortable: true,
                    pinned: true,
                },
                {
                    field: 'dimension',
                    headerName: dimensionName(),
                    filter: true,
                    sortable: true,
                    resizable: true,
                    pivot: false,
                    pinned: true,
                },
                ...accountOptions(),
                {
                    field: 'totalCost',
                    headerName: 'Total Cost',
                    sortable: true,
                    aggFunc: 'sum',
                    resizable: true,
                    pivot: false,
                    pinned: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value ? exactPriceDisplay(param.value) : ''
                    },
                },
                ...categoryOptions(),
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

            const dynamicCols: ColDef[] =
                selectedGranularity !== 'none'
                    ? columnNames
                          .filter(
                              (value, index, array) =>
                                  array.indexOf(value) === index
                          )
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
                    : []

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
                        dimension: row.dimensionName
                            ? row.dimensionName
                            : row.dimensionId,
                        category: row.category,
                        accountId: row.accountID,
                        connector: row.connector,
                        id: row.dimensionId,
                        totalCost,
                        ...temp,
                    }
                }) || []
            let sum = 0
            const newRow = []
            for (let i = 0; i < rows.length; i += 1) {
                sum += rows[i].totalCost
            }
            const pinnedRow = [{ totalCost: sum, dimension: 'All' }]
            for (let i = 0; i < rows.length; i += 1) {
                newRow.push({
                    ...rows[i],
                    percent: (rows[i].totalCost / sum) * 100,
                })
            }
            gridRef.current?.api?.setPinnedTopRowData(pinnedRow)
            gridRef.current?.api?.setColumnDefs(cols)
            gridRef.current?.api?.setRowData(newRow)
        } else gridRef.current?.api?.showLoadingOverlay()
    }, [selectedConnections, isLoading, dimension, selectedGranularity])

    return (
        <Menu currentPage="spend">
            <Header breadCrumb={['Spend detail']} filter datePicker />
            <Card>
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
        </Menu>
    )
}
