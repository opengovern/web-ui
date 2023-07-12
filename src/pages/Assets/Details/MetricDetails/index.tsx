import { Card, Flex, Title } from '@tremor/react'
import { useRef } from 'react'
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
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceSortItem,
} from '../../../../api/api'
import AxiosAPI, { setWorkspace } from '../../../../api/ApiConfig'

const columns: ColDef[] = [
    {
        field: 'connector',
        headerName: 'Connector',
        width: 50,
        sortable: true,
        // filter: true,
        cellStyle: { padding: 0 },
        cellRenderer: (params: ICellRendererParams) => {
            return (
                <Flex justifyContent="center" className="w-full h-full">
                    {params.data?.connector === 'Azure' ? (
                        <AzureIcon />
                    ) : (
                        <AWSIcon />
                    )}
                </Flex>
            )
        },
        // checkboxSelection: true,
    },
    {
        field: 'resourceName',
        headerName: 'Resource Name',
        sortable: true,
        // filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'resourceID',
        headerName: 'Resource ID',
        sortable: true,
        // filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'location',
        headerName: 'Location',
        sortable: true,
        filter: 'agTextColumnFilter',
        // filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'providerConnectionName',
        headerName: 'Connection Name',
        sortable: true,
        // filter: true,
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

    const getSort = (
        sortModel: {
            colId: string
            sort: 'asc' | 'desc'
        }[]
    ): GithubComKaytuIoKaytuEnginePkgInventoryApiResourceSortItem[] => {
        const out: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceSortItem[] =
            []
        sortModel.forEach((col) => {
            const item: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceSortItem =
                {}
            item.direction = col.sort
            switch (col.colId) {
                case 'resourceID':
                    item.field = 'resourceID'
                    break
                case 'connector':
                    item.field = 'connector'
                    break
                case 'resourceType':
                    item.field = 'resourceType'
                    break
                case 'resourceGroup':
                    item.field = 'resourceGroup'
                    break
                case 'location':
                    item.field = 'location'
                    break
                default:
                    item.field = 'connectionID'
                    break
            }
            out.push(item)
        })
        return out
    }

    const getLocFilter = (filterModel: any): string[] => {
        const out: string[] = []
        if (filterModel) {
            if (filterModel.location) {
                const locs = filterModel.location
                if (locs) {
                    out.push(locs.filter)
                }
            }
        }
        return out
    }

    const datasource = {
        getRows(params: IServerSideGetRowsParams) {
            const { endRow, startRow, sortModel } = params.request
            const psize = endRow && startRow ? endRow - startRow : 100
            console.log('params', params)
            try {
                api.inventory
                    .apiV1ResourcesCreate(
                        {
                            filters: {
                                resourceType: metricId ? [metricId] : [],
                                connectionID: selectedConnections.connections,
                                location: getLocFilter(
                                    params.request.filterModel
                                ),
                            },
                            page: {
                                no: Math.floor(endRow ? endRow / 100 : 1),
                                size: psize,
                            },
                            sorts: getSort(sortModel),
                        },
                        {}
                    )
                    .then((res) => {
                        if (res.data.resources && res.data.totalCount) {
                            params.success({
                                rowData: res.data.resources,
                                rowCount: res.data.totalCount,
                            })
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
        serverSideFilterOnServer: true,
        getRowHeight: (params) => 50,
        onGridReady: (params) => {
            params.api.setServerSideDatasource(datasource)
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

    return (
        <LoggedInLayout currentPage="assets">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Breadcrumbs pages={breadcrumbsPages} />

                <Flex flexDirection="row" justifyContent="end">
                    <ConnectionList />
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
