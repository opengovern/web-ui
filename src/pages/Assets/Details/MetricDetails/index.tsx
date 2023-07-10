import { BadgeDelta, Button, Card, Flex, Text, Title } from '@tremor/react'
import { FunnelIcon as FunnelIconOutline } from '@heroicons/react/24/outline'
import { FunnelIcon as FunnelIconSolid } from '@heroicons/react/24/solid'

import React, { useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { useNavigate, useParams } from 'react-router-dom'
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import { filterAtom } from '../../../../store'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import 'ag-grid-enterprise'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import ConnectionList from '../../../../components/ConnectionList'
import { ReactComponent as AzureIcon } from '../../../../icons/elements-supplemental-provider-logo-azure-new.svg'
import { ReactComponent as AWSIcon } from '../../../../icons/elements-supplemental-provider-logo-aws-original.svg'
import { useOnboardApiV1SourcesList } from '../../../../api/onboard.gen'
import { Api } from '../../../../api/api'
import AxiosAPI, { setWorkspace } from '../../../../api/ApiConfig'

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
                <div className="flex justify-center items-center w-full h-full">
                    {params.data?.connector === 'Azure' ? (
                        <AzureIcon />
                    ) : (
                        <AWSIcon />
                    )}
                </div>
            )
        },
        // checkboxSelection: true,
    },
    {
        field: 'resourceName',
        headerName: 'Resource Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'resourceID',
        headerName: 'Resource ID',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'resourceTypeLabel',
        headerName: 'Resource Type',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        valueFormatter: (params) => {
            return params.data?.resourceTypeLabel === ''
                ? params.data?.resourceType
                : ''
        },
    },
    {
        field: 'providerConnectionName',
        headerName: 'Connection Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
]
export default function MetricDetails() {
    const api = new Api()
    api.instance = AxiosAPI
    const workspace = useParams<{ ws: string }>().ws
    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }
    const metricId = useParams<{ metricid: string }>().metricid

    const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)

    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)
    const [openDrawer, setOpenDrawer] = useState(false)
    const { response: connections, isLoading: connectionsLoading } =
        useOnboardApiV1SourcesList()

    const datasource = {
        getRows(params: IServerSideGetRowsParams) {
            let psize
            if (params.request.endRow && params.request.startRow) {
                psize = params.request.endRow - params.request.startRow
            } else {
                psize = 100
            }
            try {
                api.inventory
                    .apiV1ResourcesCreate(
                        {
                            filters: {
                                resourceType: metricId ? [metricId] : [],

                                connectionID: selectedConnections.connections,
                            },
                            page: {
                                no: Math.floor(psize / 100),
                                size: psize,
                            },
                        },
                        {}
                    )
                    .then((res) => {
                        if (res.data.resources && res.data.totalCount) {
                            params.successCallback(
                                res.data.resources,
                                res.data.totalCount
                            )
                        } else {
                            params.fail()
                        }
                    })
                    .catch((err) => {
                        // console.log(err)
                        params.fail()
                    })
            } catch (err) {
                // console.log(err)
                params.fail()
            }
        },
    }

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        paginationPageSize: 25,
        rowSelection: 'multiple',
        animateRows: true,
        rowModelType: 'serverSide',
        getRowHeight: (params) => 50,
        onGridReady: (params) => {
            try {
                params.api.setServerSideDatasource(datasource)
            } catch (err) {
                console.log(err)
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
    }

    const breadcrumbsPages = [
        {
            name: 'Assets',
            path: () => {
                navigate(-1)
            },
            current: false,
        },
        {
            name: 'Metrics',
            path: () => {
                navigate(-1)
            },
            current: false,
        },
        { name: metricId, path: '', current: true },
    ]

    const handleDrawer = (data: any) => {
        if (openDrawer) {
            setSelectedConnections(data)
            setOpenDrawer(false)
        } else setOpenDrawer(true)
    }

    const filterText = () => {
        if (selectedConnections.connections.length > 0) {
            return <Text>{selectedConnections.connections.length} Filters</Text>
        }
        if (selectedConnections.provider !== '') {
            return <Text>{selectedConnections.provider}</Text>
        }
        return 'Filters'
    }

    return (
        <LoggedInLayout currentPage="assets">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Breadcrumbs pages={breadcrumbsPages} />

                <Flex flexDirection="row" justifyContent="end">
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
                    <ConnectionList
                        connections={connections || []}
                        loading={connectionsLoading}
                        open={openDrawer}
                        selectedConnectionsProps={selectedConnections}
                        onClose={(data: any) => handleDrawer(data)}
                    />
                </Flex>
            </Flex>
            <Card className="mt-10">
                <Flex>
                    <Title>Metric Details</Title>
                </Flex>

                <div className="ag-theme-alpine mt-10">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                    />
                </div>
            </Card>
        </LoggedInLayout>
    )
}
