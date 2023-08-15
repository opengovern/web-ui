import { useEffect, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
    ColDef,
    GridApi,
    GridOptions,
    ICellRendererParams,
    IRowNode,
} from 'ag-grid-community'
import { Button, Flex, Text } from '@tremor/react'
import { FunnelIcon as FunnelIconSolid } from '@heroicons/react/24/solid'
import { FunnelIcon as FunnelIconOutline } from '@heroicons/react/24/outline'
import { useAtom } from 'jotai'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import DrawerPanel from '../DrawerPanel'
import Spinner from '../Spinner'
import { useOnboardApiV1ConnectionsSummaryList } from '../../api/onboard.gen'
import { filterAtom } from '../../store'
import { AWSIcon, AzureIcon } from '../../icons/icons'

interface IConnection {
    id: string
    connector: string
    providerConnectionID: string
    providerConnectionName: string
    lifecycleState: string
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
        floatingFilter: true,
        cellStyle: { padding: 0 },
        cellRenderer: (params: ICellRendererParams<IConnection>) => {
            return (
                <div className="flex justify-center items-center w-full h-full">
                    {params.data?.connector === 'Azure' ? (
                        <AzureIcon />
                    ) : (
                        <AWSIcon />
                    )}
                </div>
            )
        },
    },
    {
        field: 'providerConnectionName',
        headerName: 'Name',
        sortable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'providerConnectionID',
        headerName: 'ID',
        sortable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'lifecycleState',
        headerName: 'State',
        sortable: true,
        filter: true,
        floatingFilter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'id',
        headerName: 'Kaytu Connection ID',
        sortable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'lastInventory',
        headerName: 'Last Inventory',
        sortable: true,
        filter: 'agDateColumnFilter',
        floatingFilter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'onboardDate',
        headerName: 'Onboard Date',
        sortable: true,
        filter: 'agDateColumnFilter',
        floatingFilter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
]

const tags = [
    { label: 'All', value: 'All' },
    { label: 'AWS', value: 'AWS' },
    { label: 'Azure', value: 'Azure' },
]

export default function ConnectionList() {
    const gridRef = useRef<AgGridReact<IConnection>>(null)
    const [isConnectionSelected, setIsConnectionSelected] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)
    const [selectedProvider, setSelectedProvider] = useState({
        label: 'All',
        value: '',
    })

    const { response, isLoading } = useOnboardApiV1ConnectionsSummaryList({
        connector: [],
        pageNumber: 1,
        pageSize: 10000,
        needCost: false,
        needResourceCount: false,
    })

    const updateSelectionByProvider = (
        api: GridApi | undefined,
        newValue: string
    ) => {
        if (newValue.length) {
            if (newValue === 'All') {
                api?.deselectAll()
                setIsConnectionSelected(false)
                setSelectedProvider({ label: 'All', value: '' })
                return
            }

            api?.forEachNode((node: IRowNode) => {
                if (node.data?.connector === newValue) {
                    node.setSelected(true, false, 'checkboxSelected')
                } else {
                    node.setSelected(false, false, 'checkboxSelected')
                }
            })
        }
    }

    const initializeSelectedConnections = (api: GridApi) => {
        if (selectedConnections === undefined) {
            return
        }

        if (
            selectedConnections.provider !== undefined &&
            selectedConnections.provider.length > 0
        ) {
            const selectedTag = tags.find(
                (item) => item.value === selectedConnections.provider
            )
            if (selectedTag !== undefined) {
                setSelectedProvider(selectedTag)
                updateSelectionByProvider(api, selectedTag.value)
            } else {
                console.error("couldn't find tag", selectedConnections.provider)
            }
        } else {
            api?.forEachNode((node: IRowNode) => {
                const item = selectedConnections.connections?.find(
                    (data: string) => data === node.data?.id
                )

                if (item) {
                    node.setSelected(true, false, 'checkboxSelected')
                } else {
                    node.setSelected(false, false, 'checkboxSelected')
                }
            })
        }
    }

    const selectionText = (api: GridApi | undefined) => {
        if (api === undefined) {
            return ''
        }

        const conns =
            selectedProvider.value === ''
                ? api.getSelectedNodes().map((data: IRowNode) => data.data?.id)
                : []

        if (selectedProvider.value === '') {
            if (conns !== undefined && conns.length > 0) {
                return `${conns.length} connections selected`
            }
        } else {
            return `All ${selectedProvider.value} connections selected`
        }
        return 'All connections are selected'
    }

    const gridOptions: GridOptions = {
        rowData: response?.connections || [],
        columnDefs: columns,
        paginationPageSize: 25,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
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
        onGridReady: (params) => {
            initializeSelectedConnections(params.api)
            setSelectedProvider({ ...selectedProvider })
        },
        onSelectionChanged: (params) => {
            if (params.source === 'checkboxSelected') {
                return
            }

            const selected = params.api.getSelectedNodes()
            if (selected.length > 20) {
                for (let i = 20; i < selected.length; i += 1) {
                    selected.at(i)?.setSelected(false, false)
                }
            }
            setIsConnectionSelected(selected.length > 0)
            setSelectedProvider({ label: 'All', value: '' })
        },
        getRowHeight: (params) => 50,
        isRowSelectable: (rowNode) => {
            return rowNode.data
                ? rowNode.data.lifecycleState === 'ONBOARD'
                : false
        },
        getRowStyle: (params) => {
            if (params.data.lifecycleState !== 'ONBOARD') {
                return { opacity: 0.4 }
            }
            return { opacity: 1 }
        },
    }

    useEffect(() => {
        updateSelectionByProvider(gridRef.current?.api, selectedProvider.value)
    }, [selectedProvider])

    const getProvider = (provider: string) => {
        if (provider === 'AWS') {
            return 'AWS'
        }
        if (provider === 'Azure') {
            return 'Azure'
        }
        return ''
    }

    const getConnections = (): string[] => {
        const conns =
            selectedProvider.value === ''
                ? gridRef.current?.api
                      .getSelectedNodes()
                      .map((data) => data.data?.id || '')
                : []
        return conns || []
    }

    const handleClose = () => {
        if (openDrawer) {
            setSelectedConnections({
                provider: getProvider(selectedProvider.value),
                connections: getConnections(),
            })
            setOpenDrawer(false)
        }
    }

    const filterText = () => {
        if (selectedConnections.connections.length > 0) {
            return `${selectedConnections.connections.length} Filters`
        }
        if (selectedConnections.provider !== '') {
            return selectedConnections.provider
        }
        return 'Filters'
    }

    return (
        <>
            <Button
                variant="secondary"
                className="ml-2 h-9"
                onClick={() => setOpenDrawer(true)}
                icon={
                    selectedConnections.connections.length > 0 ||
                    selectedConnections.provider !== ''
                        ? FunnelIconSolid
                        : FunnelIconOutline
                }
            >
                {filterText()}
            </Button>
            <DrawerPanel
                open={openDrawer}
                onClose={() => handleClose()}
                title="Connections"
            >
                {isLoading ? (
                    <Flex justifyContent="center" className="mt-56">
                        <Spinner />
                    </Flex>
                ) : (
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="h-full w-full"
                    >
                        <Flex justifyContent="start" className="mb-4">
                            {tags.map((tag) => (
                                <Button
                                    size="xs"
                                    variant={
                                        selectedProvider.label === tag.label
                                            ? 'primary'
                                            : 'secondary'
                                    }
                                    onClick={() => {
                                        if (selectedProvider === tag)
                                            setSelectedProvider({
                                                label: 'All',
                                                value: '',
                                            })
                                        else setSelectedProvider(tag)
                                    }}
                                    className="mr-2 w-14"
                                >
                                    {tag.label}
                                </Button>
                            ))}
                        </Flex>
                        <Text className="mb-2">
                            {selectionText(gridRef.current?.api)}
                        </Text>
                        <div className="ag-theme-alpine h-full w-full">
                            <AgGridReact
                                ref={gridRef}
                                gridOptions={gridOptions}
                            />
                        </div>
                    </Flex>
                )}
            </DrawerPanel>
        </>
    )
}
