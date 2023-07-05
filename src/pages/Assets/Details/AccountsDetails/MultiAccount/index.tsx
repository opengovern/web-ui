import dayjs from 'dayjs'
import {
    CellClickedEvent,
    ColDef,
    GridOptions,
    ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { Button, Flex } from '@tremor/react'
import { useRef, useState } from 'react'
import { ArrowDownOnSquareIcon } from '@heroicons/react/20/solid'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import {
    numberGroupedDisplay,
    priceDisplay,
} from '../../../../../utilities/numericDisplay'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import Summary from './Summary'
import DrawerPanel from '../../../../../components/DrawerPanel'
import { ConnectionDetails } from './ConnectionDetails'
import { ReactComponent as AzureIcon } from '../../../../../icons/elements-supplemental-provider-logo-azure-new.svg'
import { ReactComponent as AWSIcon } from '../../../../../icons/elements-supplemental-provider-logo-aws-original.svg'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
} from '../../../../../api/api'
import { agGridDateComparator } from '../../../../../utilities/dateComparator'

interface IMultiAccount {
    topAccounts:
        | GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse
        | undefined
    topAccountLoading: boolean
    selectedConnections: any
    activeTimeRange: any
}

interface IAccount {
    connector: string
    providerConnectionName: string
    providerConnectionID: string
    id: string
    lifecycleState: string
    cost: string
    resourceCount: string
    onboardDate: string
    lastInventory: string
}

const columns: ColDef[] = [
    {
        field: 'connector',
        headerName: 'Connector',
        width: 50,
        sortable: true,
        filter: true,
        cellStyle: { padding: 0 },
        cellRenderer: (params: ICellRendererParams<IAccount>) => (
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
                return new Date(Date.parse(param.value)).toLocaleDateString(
                    'en-US'
                )
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
            return new Date(Date.parse(param.value)).toLocaleDateString('en-US')
        },
    },
]

export default function MultiAccount({
    topAccounts,
    topAccountLoading,
    selectedConnections,
    activeTimeRange,
}: IMultiAccount) {
    const gridRef = useRef<AgGridReact>(null)

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedAccountIndex, setSelectedAccountIndex] = useState(0)

    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector: selectedConnections?.provider,
            connectionId: selectedConnections?.connections,
            startTime: dayjs(activeTimeRange.from).unix(),
            endTime: dayjs(activeTimeRange.to).unix(),
            pageSize: 10000,
            pageNumber: 1,
        })

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
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
                // {
                //     id: 'customStats',
                //     labelDefault: 'Custom Stats',
                //     labelKey: 'customStats',
                //     // toolPanel: CustomStatsToolPanel,
                // },
            ],
            defaultToolPanel: '',
        },
        getRowHeight: (params) => 50,
        onGridReady: (params) => {
            if (topAccountLoading) {
                params.api.showLoadingOverlay()
            }
        },
        onCellClicked(event: CellClickedEvent<any>) {
            if (event.rowIndex !== null) {
                setSelectedAccountIndex(event.rowIndex)
                setDrawerOpen(true)
            }
        },
    }

    return (
        <>
            <Summary accounts={topAccounts} loading={topAccountLoading} />
            <div className="ag-theme-alpine mt-4">
                <Flex
                    justifyContent="end"
                    className="w-100 mb-3"
                    alignItems="end"
                >
                    <Button
                        variant="secondary"
                        onClick={() => gridRef?.current?.api.exportDataAsCsv()}
                        icon={ArrowDownOnSquareIcon}
                    >
                        Download
                    </Button>
                </Flex>
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
                <ConnectionDetails
                    connection={accounts?.connections}
                    index={selectedAccountIndex}
                />
            </DrawerPanel>
        </>
    )
}
