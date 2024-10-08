import { Badge, Bold, Button, Flex } from '@tremor/react'
import { ColDef, GridOptions, RowClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef, useState } from 'react'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
} from '../../../../../../../../api/api'
import { Alert, Box, Header, Pagination, SpaceBetween, StatusIndicator } from '@cloudscape-design/components'
import KTable from '@cloudscape-design/components/table'

interface IStep {
    onNext: (selectedSPNID: string) => void
    onPrevious: () => void
    spns: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
}

const columns: ColDef[] = [
    {
        field: 'name',
        headerName: 'Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'credentialType',
        headerName: 'Credential Type',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'enabled',
        headerName: 'Enabled',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'healthStatus',
        headerName: 'Health Status',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'healthReason',
        headerName: 'Health Reason',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'total_connections',
        headerName: 'Total Connections',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'enabled_connections',
        headerName: 'Enabled Connections',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'unhealthy_connections',
        headerName: 'Unhealthy Connections',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
]

export default function FirstStep({ onNext, onPrevious, spns }: IStep) {
    const gridRef = useRef<AgGridReact>(null)
    const [goingToNext, setGoingToNext] = useState<boolean>(false)

    const [selectedSPN, setSelectedSPN] = useState<string>('')
   const [selectedItems, setSelectedItems] = useState([
       { name: 'Item 2' },
   ])

    const [page, setPage] = useState(0)

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
        paginationPageSize: 10,
        alwaysShowHorizontalScroll: true,
        getRowHeight: (params) => 50,
        onRowClicked(
            event: RowClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiCredential>
        ) {
            setSelectedSPN(event.data?.id || '')
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
            ],
            defaultToolPanel: '',
        },
    }
    return (
        <Flex flexDirection="col" justifyContent="between" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                {/* <Bold className="my-6">Select SPN</Bold> */}
                <div className="ag-theme-alpine w-full">
                    <KTable
                        className="  min-h-[450px]"
                        // variant="full-page"
                        // resizableColumns
                        renderAriaLive={({
                            firstIndex,
                            lastIndex,
                            totalItemsCount,
                        }) =>
                            `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
                        }
                      
                        onSelectionChange={({ detail }) => {
                            const row = detail.selectedItems[0]
                            if (row && row?.id) {
                                setSelectedSPN(row?.id)
                                onNext(row?.id)
                            }
                            // @ts-ignore
                            setSelectedItems(detail.selectedItems)
                        }}
                        selectedItems={selectedItems}
                        columnDefinitions={[
                            {
                                id: 'name',
                                header: 'Name',
                                cell: (item) => (
                                    <>
                                        <span>{item.name}</span>
                                    </>
                                ),
                                // sortingField: 'providerConnectionID',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'credentialType',
                                header: 'Credential Type',
                                cell: (item) => (
                                    <>
                                        <span>{item.credentialType}</span>
                                    </>
                                ),
                                // sortingField: 'providerConnectionID',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'enabled',
                                header: 'Enabled',
                                cell: (item) => (
                                    <>
                                        <>
                                            {item.enabled ? (
                                                <StatusIndicator type="success"></StatusIndicator>
                                            ) : (
                                                <StatusIndicator type="error"></StatusIndicator>
                                            )}
                                        </>
                                    </>
                                ),
                                // sortingField: 'providerConnectionID',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'healthStatus',
                                header: 'Health Status',
                                cell: (item) => {
                                    function getBadgeColor(status: string) {
                                        switch (status) {
                                            case 'healthy':
                                                return 'emerald'
                                            case 'unhealthy':
                                                return 'rose'
                                            default:
                                                return 'neutral'
                                        }
                                    }

                                    return (
                                        <Badge
                                            color={getBadgeColor(
                                                // @ts-ignore
                                                item?.healthStatus
                                            )}
                                        >
                                            {item?.healthStatus}
                                        </Badge>
                                    )
                                },
                                // sortingField: 'providerConnectionID',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                        ]}
                        columnDisplay={[
                            { id: 'name', visible: true },
                            { id: 'credentialType', visible: true },
                            { id: 'enabled', visible: true },
                            { id: 'healthStatus', visible: true },
                            // { id: 'lifecycleState', visible: true },

                            // { id: 'severity', visible: true },
                            // { id: 'evaluatedAt', visible: true },

                            // { id: 'action', visible: true },
                        ]}
                        selectionType="single"
                        enableKeyboardNavigation
                        // @ts-ignore
                        items={spns?.slice(page * 10, (page + 1) * 10)}
                        loading={false}
                        loadingText="Loading resources"
                        // stickyColumns={{ first: 0, last: 1 }}
                        // stripedRows
                        trackBy="id"
                        empty={
                            <Box
                                margin={{ vertical: 'xs' }}
                                textAlign="center"
                                color="inherit"
                            >
                                <SpaceBetween size="m">
                                    <b>No resources</b>
                                </SpaceBetween>
                            </Box>
                        }
                        filter={
                            ''
                            // <PropertyFilter
                            //     // @ts-ignore
                            //     query={undefined}
                            //     // @ts-ignore
                            //     onChange={({ detail }) => {
                            //         // @ts-ignore
                            //         setQueries(detail)
                            //     }}
                            //     // countText="5 matches"
                            //     enableTokenGroups
                            //     expandToViewport
                            //     filteringAriaLabel="Control Categories"
                            //     // @ts-ignore
                            //     // filteringOptions={filters}
                            //     filteringPlaceholder="Control Categories"
                            //     // @ts-ignore
                            //     filteringOptions={undefined}
                            //     // @ts-ignore

                            //     filteringProperties={undefined}
                            //     // filteringProperties={
                            //     //     filterOption
                            //     // }
                            // />
                        }
                        header={
                            <Header className="w-full">
                                Principals{' '}
                                <span className=" font-medium">
                                    ({spns?.length})
                                </span>
                            </Header>
                        }
                        pagination={
                            <Pagination
                                currentPageIndex={page + 1}
                                pagesCount={Math.ceil(spns?.length / 10)}
                                onChange={({ detail }) =>
                                    setPage(detail.currentPageIndex - 1)
                                }
                            />
                        }
                    />
                </div>
                {selectedSPN == '' && (
                    <Alert
                        className="w-full mt-2"
                        statusIconAriaLabel="Error"
                        type="error"
                        header=""
                    >
                        Please Select a SPN
                    </Alert>
                )}
            </Flex>
            {/* <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        setGoingToNext(true)
                        onNext(selectedSPN)
                    }}
                    loading={goingToNext}
                    disabled={selectedSPN === ''}
                    className="ml-3"
                >
                    Next
                </Button>
            </Flex> */}
        </Flex>
    )
}
