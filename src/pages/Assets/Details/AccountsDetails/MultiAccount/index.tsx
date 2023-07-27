import dayjs from 'dayjs'
import {
    CellClickedEvent,
    ColDef,
    GridOptions,
    ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { Button, Flex, Title } from '@tremor/react'
import { useRef, useState } from 'react'
import { ArrowDownOnSquareIcon } from '@heroicons/react/20/solid'
import { useAtomValue } from 'jotai'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import {
    numberGroupedDisplay,
    priceDisplay,
} from '../../../../../utilities/numericDisplay'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import Summary from './Summary'
import DrawerPanel from '../../../../../components/DrawerPanel'
import { agGridDateComparator } from '../../../../../utilities/dateComparator'
import { filterAtom, timeAtom } from '../../../../../store'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../api/api'
import { AWSIcon, AzureIcon } from '../../../../../icons/icons'
import { RenderObject } from '../../../../../components/RenderObject'

const columns: ColDef[] = [
    {
        field: 'connector',
        headerName: 'Connector',
        width: 50,
        sortable: true,
        filter: true,
        cellStyle: { padding: 0 },
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
        ) => (
            <Flex
                justifyContent="center"
                alignItems="center"
                className="w-full h-full"
            >
                {params.data?.connector === 'Azure' ? (
                    <AzureIcon />
                ) : (
                    <AWSIcon />
                )}
            </Flex>
        ),
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
        field: 'cost',
        headerName: 'Cost',
        sortable: true,
        filter: 'agNumberColumnFilter',
        resizable: true,
        flex: 1,
        cellDataType: 'text',
        valueFormatter: (param) => {
            return priceDisplay(param.value) || ''
        },
    },
    {
        field: 'resourceCount',
        headerName: 'Resources',
        sortable: true,
        filter: 'agNumberColumnFilter',
        resizable: true,
        flex: 1,
        cellDataType: 'number',
        valueFormatter: (param) => {
            return numberGroupedDisplay(param.value) || ''
        },
    },
    {
        field: 'lastInventory',
        headerName: 'Last Inventory Date',
        sortable: true,
        filter: 'agDateColumnFilter',
        filterParams: {
            comparator: agGridDateComparator,
        },
        resizable: true,
        flex: 1,
        valueFormatter: (param) => {
            if (param.value) {
                return new Date(Date.parse(param.value)).toLocaleDateString()
            }
            return ''
        },
    },
    {
        field: 'id',
        headerName: 'Connection ID',
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
        filter: 'agDateColumnFilter',
        filterParams: {
            comparator: agGridDateComparator,
        },
        resizable: true,
        hide: true,
        flex: 1,
        valueFormatter: (param) => {
            return new Date(Date.parse(param.value)).toLocaleDateString()
        },
    },
]

export default function MultiAccount() {
    const gridRef = useRef<AgGridReact>(null)
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedConnection, setSelectedConnection] =
        useState<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>()

    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            ...(selectedConnections.provider !== '' && {
                connector: [selectedConnections.provider],
            }),
            connectionId: selectedConnections?.connections,
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            pageSize: 10000,
            pageNumber: 1,
        })

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        paginationPageSize: 25,
        rowSelection: 'multiple',
        animateRows: true,
        suppressExcelExport: true,
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
        getRowHeight: (params) => 50,
        onGridReady: () => {
            if (isAccountsLoading) {
                gridRef.current?.api.showLoadingOverlay()
            }
        },
        onCellClicked(
            event: CellClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
        ) {
            if (event.data !== null) {
                setSelectedConnection(event.data)
                setDrawerOpen(true)
            }
        },
    }

    return (
        <>
            <Summary />
            <Flex className="mb-4 mt-6">
                <Title>Accounts</Title>
                <Button
                    variant="secondary"
                    onClick={() => gridRef?.current?.api.exportDataAsCsv()}
                    icon={ArrowDownOnSquareIcon}
                >
                    Download
                </Button>
            </Flex>
            <div className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    domLayout="autoHeight"
                    gridOptions={gridOptions}
                    rowData={accounts?.connections || []}
                />
            </div>
            <DrawerPanel
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Connection Details"
            >
                <RenderObject obj={selectedConnection} />
            </DrawerPanel>
        </>
    )
}
