import {
    CellClickedEvent,
    ColDef,
    ColGroupDef,
    GridOptions,
    GridReadyEvent,
    ICellRendererParams,
    NestedFieldPaths,
    RowClickedEvent,
    ValueFormatterFunc,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-enterprise'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useRef } from 'react'
import { Button, Flex, Title } from '@tremor/react'
import { ArrowDownOnSquareIcon } from '@heroicons/react/20/solid'
import dayjs from 'dayjs'
import {
    exactPriceDisplay,
    numberGroupedDisplay,
} from '../../utilities/numericDisplay'
import { agGridDateComparator } from '../../utilities/dateComparator'
import { getConnectorIcon } from '../Cards/ConnectorCard'

export interface IColumn<TData, TValue> {
    type: 'string' | 'number' | 'price' | 'date' | 'connector'
    field?: NestedFieldPaths<TData, any>
    width?: number
    cellStyle?: any
    headerName?: string
    cellDataType?: boolean | string
    valueFormatter?: string | ValueFormatterFunc<TData, TValue>
    cellRenderer?: any
    rowGroup?: boolean
    enableRowGroup?: boolean

    hide?: boolean
    filter?: boolean
    sortable?: boolean
    resizable?: boolean
    flex?: number
}

interface IProps<TData, TValue> {
    id: string
    columns: IColumn<TData, TValue>[]
    rowData: TData[] | null
    onGridReady?: (event: GridReadyEvent<TData>) => void
    onCellClicked?: (event: CellClickedEvent<TData>) => void
    onRowClicked?: (event: RowClickedEvent<TData>) => void
    downloadable?: boolean
    title?: string
    children?: any
    options?: GridOptions
}

export default function Table<TData = any, TValue = any>({
    id,
    columns,
    rowData,
    onGridReady,
    onCellClicked,
    onRowClicked,
    downloadable = false,
    title,
    children,
    options,
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
    console.log(rowData)

    const saveVisibility = () => {
        if (visibility.current) {
            const o = Object.fromEntries(visibility.current.entries())
            localStorage.setItem(
                `table_${id}_columns_visibility`,
                JSON.stringify(o)
            )
        }
    }

    const buildColumnDef = () =>
        columns?.map((item) => {
            const v: ColDef<TData> | ColGroupDef<TData> = {
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
                flex: item.flex || 1,
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
                v.valueFormatter = (param) => {
                    return exactPriceDisplay(String(param.value)) || ''
                }
            } else if (item.type === 'number') {
                v.filter = 'agNumberColumnFilter'
                v.cellDataType = 'number'
                v.valueFormatter = (param) => {
                    return param.value || param.value === 0
                        ? numberGroupedDisplay(String(param.value))
                        : ''
                }
            } else if (item.type === 'date') {
                v.filter = 'agDateColumnFilter'
                v.filterParams = {
                    comparator: agGridDateComparator,
                }
                v.valueFormatter = (param) => {
                    if (param.value) {
                        return dayjs(
                            Number(param.value)
                                ? param.value * 1000
                                : param.value
                        ).format('MMM DD, YYYY')
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

    const gridOptions: GridOptions = {
        columnDefs: buildColumnDef(),
        pagination: true,
        paginationPageSize: 25,
        rowSelection: 'multiple',
        suppressExcelExport: true,
        animateRows: true,
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
                {
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                },
            ],
            defaultToolPanel: '',
        },
        ...options,
    }

    return (
        <Flex flexDirection="col" className="w-full">
            <Flex>
                {!!title?.length && (
                    <Title className="font-semibold">{title}</Title>
                )}
                <Flex className="w-fit gap-3">
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
            <div className="w-full ag-theme-alpine mt-4">
                <AgGridReact
                    ref={gridRef}
                    domLayout="autoHeight"
                    gridOptions={gridOptions}
                    rowData={rowData}
                />
            </div>
        </Flex>
    )
}
