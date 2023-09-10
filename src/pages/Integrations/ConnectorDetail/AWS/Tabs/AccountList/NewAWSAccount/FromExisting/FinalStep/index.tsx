import { Bold, Button, Flex, Text } from '@tremor/react'
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community'
import { useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../../../../../api/api'
import { AWSIcon } from '../../../../../../../../../icons/icons'

interface IStep {
    onNext: () => void
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
}

const columns: ColDef[] = [
    {
        field: 'connector',
        headerName: 'Connector',
        width: 50,
        sortable: true,
        filter: true,
        cellStyle: { padding: 0 },
        cellRenderer: (params: ICellRendererParams) => {
            return (
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    className="w-full h-full"
                >
                    <AWSIcon />
                </Flex>
            )
        },
    },
    {
        field: 'providerConnectionName',
        headerName: 'Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'providerConnectionID',
        headerName: 'ID',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'lifecycleState',
        headerName: 'State',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'id',
        headerName: 'Kaytu Connection ID',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'lastInventory',
        headerName: 'Last Inventory',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'onboardDate',
        headerName: 'Onboard Date',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
]

export default function FinalStep({ onNext, accounts }: IStep) {
    const gridRef = useRef<AgGridReact>(null)

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
        paginationPageSize: 10,
        getRowHeight: (params) => 50,
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
            ],
            defaultToolPanel: '',
        },
    }
    return (
        <Flex flexDirection="col" className="h-full ">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">Discovered Accounts</Bold>
                <Text className="mb-6">
                    This is new discovered accounts for selected organization
                </Text>
                <div className="ag-theme-alpine w-full">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                        rowData={accounts}
                    />
                </div>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button onClick={() => onNext()} className="ml-3">
                    Done
                </Button>
            </Flex>
        </Flex>
    )
}
