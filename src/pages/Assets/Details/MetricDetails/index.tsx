import { BadgeDelta, Button, Card, Flex, Text, Title } from '@tremor/react'
import { FunnelIcon as FunnelIconOutline } from '@heroicons/react/24/outline'
import { FunnelIcon as FunnelIconSolid } from '@heroicons/react/24/solid'

import { useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { useNavigate, useParams } from 'react-router-dom'
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { filterAtom } from '../../../../store'
import {
    useInventoryApiV1ResourcesAwsCreate,
    useInventoryApiV1ResourcesAzureCreate,
    useInventoryApiV1ResourcesCreate,
} from '../../../../api/inventory.gen'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import ConnectionList from '../../ConnectionList'
import { useOnboardApiV1SourcesList } from '../../../../api/onboard.gen'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiSourceType } from '../../../../api/api'

interface IResourceMetric {
    metricName: string
    from: number
    count: number
    changes: number
}

interface IResource {
    attributes?: Record<string, string>
    /** The Region of the resource */
    location?: string
    /** Provider Connection Id */
    providerConnectionID?: string
    /** Provider Connection Name */
    providerConnectionName?: string
    /** Resource Category */
    resourceCategory?: string
    /** Resource Group */
    resourceGroup?: string
    /** Resource Id */
    resourceID?: string
    /** Resource Name */
    resourceName?: string
    /** Resource Type */
    resourceType?: string
    /** Resource Type Name */
    resourceTypeName?: string
    /** Resource Provider */
    provider?: GithubComKaytuIoKaytuEnginePkgInventoryApiSourceType
}

const columns: ColDef[] = [
    {
        field: 'metricName',
        headerName: 'Metric Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'from',
        headerName: 'From',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'count',
        headerName: 'Count',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'changes',
        headerName: 'Change',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (params: ICellRendererParams<IResourceMetric>) => (
            <Flex justifyContent="center" alignItems="center" className="mt-1">
                <BadgeDelta
                    deltaType={
                        // eslint-disable-next-line no-nested-ternary
                        params.value > 0
                            ? 'moderateIncrease'
                            : params.value < 0
                            ? 'moderateDecrease'
                            : 'unchanged'
                    }
                >
                    {params.value}%
                </BadgeDelta>
            </Flex>
        ),
    },
]
export default function MetricDetails() {
    const metricId = useParams<{ metricid: string }>().metricid

    const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)

    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)
    const [openDrawer, setOpenDrawer] = useState(false)
    const { response: connections, isLoading: connectionsLoading } =
        useOnboardApiV1SourcesList()

    const {
        response: resourcesAll,
        isLoading: isLoadingAll,
        isExecuted: isExecutedAll,
    } = useInventoryApiV1ResourcesCreate(
        {
            filters: {
                resourceType: metricId ? [metricId.toLowerCase()] : [],
                // sourceID: selectedConnections.connections,
            },
            page: { no: 1, size: 10000 },
        },
        undefined,
        {},
        selectedConnections.provider === 'All' ||
            selectedConnections.provider === ''
    )

    const {
        response: resourcesAWS,
        isLoading: isLoadingAWS,
        isExecuted: isExecutedAWS,
    } = useInventoryApiV1ResourcesAwsCreate(
        {
            filters: {
                resourceType: metricId ? [metricId] : [],
                sourceID: selectedConnections.connections,
            },
            page: { no: 1, size: 10000 },
        },
        undefined,
        {},
        selectedConnections.provider === 'AWS'
    )

    const {
        response: resourcesAzure,
        isLoading: isLoadingAzure,
        isExecuted: isExecutedAzure,
    } = useInventoryApiV1ResourcesAzureCreate(
        {
            filters: {
                resourceType: metricId ? [metricId] : [],
                sourceID: selectedConnections.connections,
            },
            page: { no: 1, size: 10000 },
        },
        undefined,
        {},
        selectedConnections.provider === 'Azure'
    )

    const isLoading =
        (isExecutedAWS && isLoadingAWS) ||
        (isExecutedAll && isLoadingAll) ||
        (isExecutedAzure && isLoadingAzure)

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
        getRowHeight: (params) => 50,
        onGridReady: (params) => {
            if (isLoading) {
                gridRef.current?.api.showLoadingOverlay()
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

    const response = () => {
        switch (selectedConnections.provider) {
            case 'AWS':
                return resourcesAWS?.resources?.map((item) => {
                    const v: IResource = {
                        attributes: item.attributes,
                        location: item.location,
                        providerConnectionID: item.providerConnectionID,
                        providerConnectionName: item.providerConnectionName,
                        resourceCategory: item.resourceCategory,
                        resourceGroup: '',
                        resourceID: item.resourceID,
                        resourceName: item.resourceName,
                        resourceType: item.resourceType,
                        resourceTypeName: item.resourceTypeName,
                        provider:
                            GithubComKaytuIoKaytuEnginePkgInventoryApiSourceType.SourceCloudAWS,
                    }
                    return v
                })
            case 'Azure':
                return resourcesAzure?.resources?.map((item) => {
                    const v: IResource = {
                        attributes: item.attributes,
                        location: item.location,
                        providerConnectionID: item.providerConnectionID,
                        providerConnectionName: item.providerConnectionName,
                        resourceCategory: item.resourceCategory,
                        resourceGroup: item.resourceGroup,
                        resourceID: item.resourceID,
                        resourceName: item.resourceName,
                        resourceType: item.resourceType,
                        resourceTypeName: item.resourceTypeName,
                        provider:
                            GithubComKaytuIoKaytuEnginePkgInventoryApiSourceType.SourceCloudAzure,
                    }
                    return v
                })
            default:
                return resourcesAll?.resources?.map((item) => {
                    const v: IResource = {
                        attributes: item.attributes,
                        location: item.location,
                        providerConnectionID: item.providerConnectionID,
                        providerConnectionName: item.providerConnectionName,
                        resourceCategory: item.resourceCategory,
                        resourceGroup: '',
                        resourceID: item.resourceID,
                        resourceName: item.resourceName,
                        resourceType: item.resourceType,
                        resourceTypeName: item.resourceTypeName,
                        provider: item.provider,
                    }
                    return v
                })
        }
    }

    console.log(
        selectedConnections.provider === 'All' ||
            selectedConnections.provider === ''
    )

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
                        rowData={response()}
                    />
                </div>
            </Card>
        </LoggedInLayout>
    )
}
