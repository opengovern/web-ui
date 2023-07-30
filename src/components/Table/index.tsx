import {
    CellClickedEvent,
    ColDef,
    ColGroupDef,
    GridOptions,
    GridReadyEvent,
    ICellRendererParams,
    NestedFieldPaths,
    ValueFormatterFunc,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'
import { Flex } from '@tremor/react'
import { AWSIcon, AzureIcon } from '../../icons/icons'
import {
    numberGroupedDisplay,
    priceDisplay,
} from '../../utilities/numericDisplay'
import { agGridDateComparator } from '../../utilities/dateComparator'

export interface IColumn<TData, TValue> {
    type: 'string' | 'number' | 'price' | 'date' | 'connector'
    field?: NestedFieldPaths<TData, any>
    headerName: string
    cellDataType?: boolean | string
    valueFormatter?: string | ValueFormatterFunc<TData, TValue>
    cellRenderer?: any

    hide?: boolean
    filter?: boolean
    sortable?: boolean
    resizable?: boolean
    flex?: number
}

interface IProps<TData, TValue> {
    columns?: IColumn<TData, TValue>[]
    rowData: TData[] | null
    onGridReady?: (event: GridReadyEvent<TData>) => void
    onCellClicked?: (event: CellClickedEvent<TData>) => void
}

export default function Table<TData = any, TValue = any>({
    columns,
    rowData,
    onGridReady,
    onCellClicked,
}: IProps<TData, TValue>) {
    const gridRef = useRef<AgGridReact>(null)

    const buildColumnDef = () =>
        columns?.map((item) => {
            const v: ColDef<TData> | ColGroupDef<TData> = {
                field: item.field,
                headerName: item.headerName,
                filter: true,
                sortable: item.sortable || true,
                resizable: item.resizable || true,
                hide: item.hide || false,
                cellRenderer: item.cellRenderer,
                flex: item.flex || 1,
            }

            if (item.type === 'price') {
                v.filter = 'agNumberColumnFilter'
                v.cellDataType = 'text'
                v.valueFormatter = (param) => {
                    return priceDisplay(String(param.value)) || ''
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
                        return new Date(
                            Date.parse(String(param.value))
                        ).toLocaleDateString()
                    }
                    return ''
                }
            } else if (item.type === 'connector') {
                v.width = 50
                v.cellStyle = { padding: 0 }
                v.cellRenderer = (params: ICellRendererParams<TData>) => (
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        className="w-full h-full"
                    >
                        {params.value === 'Azure' ? <AzureIcon /> : <AWSIcon />}
                    </Flex>
                )
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
    }

    return (
        <div className="ag-theme-alpine mt-10">
            <AgGridReact
                ref={gridRef}
                domLayout="autoHeight"
                gridOptions={gridOptions}
                rowData={rowData}
            />
        </div>
    )
}
