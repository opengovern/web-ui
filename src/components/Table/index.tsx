import {
    CellClickedEvent,
    ColDef,
    ColGroupDef,
    GridOptions,
    GridReadyEvent,
    ICellRendererParams,
    IServerSideDatasource,
    NestedFieldPaths,
    RowClickedEvent,
    ValueFormatterFunc,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-enterprise'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'ag-grid-community/styles/agGridMaterialFont.css'
import { ReactNode, useEffect, useRef } from 'react'
import { Button, Flex, Title } from '@tremor/react'
import { ArrowDownOnSquareIcon } from '@heroicons/react/20/solid'
import {
    exactPriceDisplay,
    numberGroupedDisplay,
} from '../../utilities/numericDisplay'
import { agGridDateComparator } from '../../utilities/dateComparator'
import { getConnectorIcon } from '../Cards/ConnectorCard'
import { dateDisplay, dateTimeDisplay } from '../../utilities/dateDisplay'

export interface IColumn<TData, TValue> {
    type: 'string' | 'number' | 'price' | 'date' | 'datetime' | 'connector'
    field?: NestedFieldPaths<TData, any>
    width?: number
    cellStyle?: any
    headerName?: string
    cellDataType?: boolean | string
    valueFormatter?: string | ValueFormatterFunc<TData, TValue>
    cellRenderer?: any
    rowGroup?: boolean
    enableRowGroup?: boolean
    pinned?: boolean
    aggFunc?: string
    suppressMenu?: boolean
    floatingFilter?: boolean
    pivot?: boolean
    hide?: boolean
    filter?: boolean
    sortable?: boolean
    resizable?: boolean
    flex?: number
}

interface IProps<TData, TValue> {
    id: string
    columns: IColumn<TData, TValue>[]
    rowData?: TData[] | undefined
    pinnedRow?: TData[] | undefined
    serverSideDatasource?: IServerSideDatasource | undefined
    onGridReady?: (event: GridReadyEvent<TData>) => void
    onCellClicked?: (event: CellClickedEvent<TData>) => void
    onRowClicked?: (event: RowClickedEvent<TData>) => void
    downloadable?: boolean
    title?: string
    children?: ReactNode
    options?: GridOptions
    loading?: boolean
    fullWidth?: boolean
}

export default function Table<TData = any, TValue = any>({
    id,
    columns,
    rowData,
    pinnedRow,
    serverSideDatasource,
    onGridReady,
    onCellClicked,
    onRowClicked,
    downloadable = false,
    fullWidth = false,
    title,
    children,
    options,
    loading,
}: IProps<TData, TValue>) {
    const gridRef = useRef<AgGridReact>(null)
    const visibility = useRef<Map<string, boolean> | undefined>(undefined)

    if (visibility.current === undefined) {
        visibility.current = new Map()
        const columnVisibility = localStorage.getItem(
            `table_${id}_columns_visibility`
        )
        if (columnVisibility) {
            const v = JSON.parse(columnVisibility)
            if (typeof v === 'object') {
                Object.entries(v).forEach((vi) => {
                    visibility.current?.set(vi[0], Boolean(vi[1]))
                })
            }
        }
    }

    useEffect(() => {
        if (loading) {
            gridRef.current?.api?.showLoadingOverlay()
        }
    }, [loading])

    useEffect(() => {
        gridRef.current?.api?.setPinnedTopRowData(pinnedRow)
    }, [pinnedRow])

    useEffect(() => {
        if (rowData) {
            gridRef.current?.api?.setRowData(rowData || [])
        }
    }, [rowData])

    useEffect(() => {
        if (serverSideDatasource) {
            gridRef.current?.api?.setServerSideDatasource(serverSideDatasource)
        }
    }, [serverSideDatasource])

    const saveVisibility = () => {
        if (visibility.current) {
            const o = Object.fromEntries(visibility.current.entries())
            localStorage.setItem(
                `table_${id}_columns_visibility`,
                JSON.stringify(o)
            )
        }
    }

    const buildColumnDef = () => {
        return columns?.map((item) => {
            const v: ColDef<TData> | ColGroupDef<TData> | any = {
                field: item.field,
                headerName: item.headerName,
                filter: true,
                width: item.width,
                sortable: item.sortable || true,
                resizable: item.resizable || true,
                rowGroup: item.rowGroup || false,
                enableRowGroup: item.enableRowGroup || false,
                hide: item.hide || false,
                cellRenderer: item.cellRenderer,
                flex: item.width ? 0 : item.flex || 1,
                pinned: item.pinned || false,
                aggFunc: item.aggFunc,
                suppressMenu: item.suppressMenu || false,
                floatingFilter: item.floatingFilter || false,
                pivot: item.pivot || false,
                valueFormatter: item.valueFormatter,
            }

            if (
                item.field &&
                visibility.current?.get(item.field || '') !== undefined
            ) {
                v.hide = !visibility.current.get(item.field || '')
            }

            if (item.type === 'price') {
                v.filter = 'agNumberColumnFilter'
                v.cellDataType = 'text'
                v.valueFormatter = (param: any) => {
                    return exactPriceDisplay(String(param.value)) || ''
                }
            } else if (item.type === 'number') {
                v.filter = 'agNumberColumnFilter'
                v.cellDataType = 'number'
                v.valueFormatter = (param: any) => {
                    return param.value || param.value === 0
                        ? numberGroupedDisplay(String(param.value))
                        : ''
                }
            } else if (item.type === 'date') {
                v.filter = 'agDateColumnFilter'
                v.filterParams = {
                    comparator: agGridDateComparator,
                }
                v.valueFormatter = (param: any) => {
                    if (param.value) {
                        let value = ''
                        if (!Number.isNaN(Number(param.value))) {
                            value = dateDisplay(
                                Number(param.value) > 16000000000
                                    ? Number(param.value)
                                    : Number(param.value) * 1000
                            )
                        } else {
                            value = dateDisplay(param.value)
                        }
                        return value
                    }
                    return ''
                }
            } else if (item.type === 'datetime') {
                v.filter = 'agDateColumnFilter'
                v.filterParams = {
                    comparator: agGridDateComparator,
                }
                v.valueFormatter = (param: any) => {
                    if (param.value) {
                        let value = ''
                        if (!Number.isNaN(Number(param.value))) {
                            value = dateTimeDisplay(
                                Number(param.value) > 16000000000
                                    ? Number(param.value)
                                    : Number(param.value) * 1000
                            )
                        } else {
                            value = dateTimeDisplay(param.value)
                        }
                        return value
                    }
                    return ''
                }
            } else if (item.type === 'connector') {
                v.width = 50
                v.cellStyle = { padding: 0 }
                v.cellRenderer = (params: ICellRendererParams<TData>) =>
                    getConnectorIcon(params.value)
            }
            return v
        })
    }

    useEffect(() => {
        gridRef.current?.api?.setColumnDefs(buildColumnDef())
    }, [columns])

    const gridOptions: GridOptions = {
        columnDefs: buildColumnDef(),
        rowData,
        rowModelType: serverSideDatasource ? 'serverSide' : 'clientSide',
        pagination: true,
        paginationPageSize: 25,
        rowSelection: 'multiple',
        suppressExcelExport: true,
        animateRows: false,
        getRowHeight: () => 50,
        onGridReady: (e) => {
            if (onGridReady) {
                onGridReady(e)
            }
        },
        onCellClicked,
        onRowClicked,
        onColumnVisible: (e) => {
            if (e.column?.getId() && e.visible !== undefined) {
                visibility.current?.set(e.column?.getId(), e.visible)
                saveVisibility()
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
                // {
                //     id: 'filters',
                //     labelDefault: 'Table Filters',
                //     labelKey: 'filters',
                //     iconKey: 'filter',
                //     toolPanel: 'agFiltersToolPanel',
                // },
            ],
            defaultToolPanel: '',
        },
        ...options,
    }

    return (
        <Flex flexDirection="col" className="w-full">
            <Flex
                className={
                    !!title?.length || downloadable || children ? 'mb-3' : ''
                }
            >
                {!!title?.length && (
                    <Title className="font-semibold">{title}</Title>
                )}
                <Flex
                    flexDirection={fullWidth ? 'row-reverse' : 'row'}
                    alignItems={fullWidth ? 'start' : 'center'}
                    className={`${fullWidth ? '' : 'w-fit'} gap-3`}
                >
                    {downloadable && (
                        <Button
                            variant="secondary"
                            onClick={() => {
                                gridRef.current?.api.exportDataAsCsv()
                            }}
                            icon={ArrowDownOnSquareIcon}
                        >
                            Download
                        </Button>
                    )}
                    {children}
                </Flex>
            </Flex>
            <div className="w-full ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    domLayout="autoHeight"
                    gridOptions={gridOptions}
                    // rowData={rowData}
                />
            </div>
        </Flex>
    )
}
