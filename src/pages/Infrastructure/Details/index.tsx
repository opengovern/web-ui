import {
    BadgeDelta,
    Button,
    Card,
    Flex,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline'
import { AgGridReact } from 'ag-grid-react'
import Header from '../../../components/Header'
import { IColumn } from '../../../components/Table'
import Menu from '../../../components/Menu'
import { filterAtom, notificationAtom, timeAtom } from '../../../store'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../api/onboard.gen'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiMetric } from '../../../api/api'
import { badgeDelta, badgeTypeByDelta } from '../../../utilities/deltaType'
import { useInventoryApiV2AnalyticsMetricList } from '../../../api/inventory.gen'
import { capitalizeFirstLetter } from '../../../utilities/labelMaker'

export const resourceTableColumns: IColumn<any, any>[] = [
    {
        headerName: 'Connectors',
        field: 'connectors',
        type: 'string',
        filter: true,
        width: 120,
        enableRowGroup: true,
    },
    {
        field: 'name',
        headerName: 'Resource name',
        filter: true,
        type: 'string',
    },
    {
        field: 'category',
        enableRowGroup: true,
        headerName: 'Category',
        filter: true,
        type: 'string',
    },
    {
        field: 'count',
        headerName: 'Count',
        filter: true,
        type: 'number',
    },
    {
        headerName: 'Change (%)',
        type: 'string',
        filter: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiMetric>
        ) =>
            params.data?.name && (
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    className="mt-1"
                >
                    {params.data?.old_count
                        ? badgeDelta(params.data?.old_count, params.data?.count)
                        : badgeDelta(1, 2)}
                </Flex>
            ),
    },
    {
        headerName: 'Change (Δ)',
        type: 'string',
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiMetric>
        ) =>
            params.data?.name && (
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    className="mt-1"
                >
                    <BadgeDelta
                        deltaType={badgeTypeByDelta(
                            params.data?.old_count,
                            params.data?.count
                        )}
                    >
                        {Math.abs(
                            (params.data?.old_count || 0) -
                                (params.data?.count || 0)
                        )}
                    </BadgeDelta>
                </Flex>
            ),
    },
]

const columns: IColumn<any, any>[] = [
    {
        field: 'connector',
        headerName: 'Connector',
        type: 'string',
        width: 120,
        sortable: true,
        filter: true,
        enableRowGroup: true,
    },
    {
        field: 'providerConnectionName',
        headerName: 'Account name',
        type: 'string',
        sortable: true,
        filter: true,
    },
    {
        field: 'providerConnectionID',
        headerName: 'Account ID',
        type: 'string',
        sortable: true,
        filter: true,
    },
    {
        field: 'lifecycleState',
        headerName: 'State',
        type: 'string',
        sortable: true,
        filter: true,
        enableRowGroup: true,
    },
    {
        field: 'resourceCount',
        headerName: 'Resources',
        type: 'number',
        sortable: true,
    },
    {
        field: 'lastInventory',
        headerName: 'Last inventory',
        type: 'date',
        sortable: true,
    },
    {
        field: 'onboardDate',
        headerName: 'Onboard Date',
        type: 'date',
        hide: true,
        sortable: true,
    },
]

const dimensionList = ['connection', 'resource', 'category']

export const rowGenerator = (data: any) => {
    const rows = []
    if (data) {
        for (let i = 0; i < data.length; i += 1) {
            if (data[i].tags.category.length > 1) {
                for (let j = 0; j < data[i].tags.category.length; j += 1) {
                    rows.push({
                        ...data[i],
                        category: data[i].tags.category[j],
                    })
                }
            } else {
                rows.push({
                    ...data[i],
                    category: data[i].tags.category,
                })
            }
        }
    }
    return rows
}

export default function AssetDetail() {
    const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)

    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const setNotification = useSetAtom(notificationAtom)

    const { hash } = useLocation()
    const page = () => {
        switch (hash) {
            case '#connections':
                return 'connection'
            case '#resources':
                return 'resource'
            default:
                return 'category'
        }
    }
    const [dimension, setDimension] = useState<string>(page())
    const [isOnboarded, setIsOnboarded] = useState(true)

    const filterPanel = () => {
        return (
            <Flex
                flexDirection="col"
                justifyContent="start"
                alignItems="start"
                className="w-full px-6"
            >
                <Text className="my-3">Scope</Text>
                <TabGroup className="w-fit rounded-lg">
                    <TabList variant="solid">
                        <Tab onClick={() => setIsOnboarded(true)}>
                            Onboarded
                        </Tab>
                        <Tab onClick={() => setIsOnboarded(false)}>
                            Show all
                        </Tab>
                    </TabList>
                </TabGroup>
                <Text className="my-3">Show by</Text>
                {dimensionList.map((d) => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                    <label
                        onClick={() => setDimension(d)}
                        htmlFor={d}
                        className="flex items-center gap-2 mb-1.5"
                    >
                        <input id={d} type="radio" checked={dimension === d} />
                        <Text>{capitalizeFirstLetter(d)}</Text>
                    </label>
                ))}
            </Flex>
        )
    }

    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
        pageSize: 1000,
        needCost: false,
    }

    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList(query)

    const { response: metrics, isLoading: metricsLoading } =
        useInventoryApiV2AnalyticsMetricList(query)

    const RT = () => {
        const temp = resourceTableColumns
        if (dimension === 'category') {
            temp[2].rowGroup = true
        }
        return temp
    }

    const options: GridOptions = {
        pagination: true,
        paginationPageSize: 25,
        enableGroupEdit: true,
        rowGroupPanelShow: 'always',
        groupAllowUnbalanced: true,
        autoGroupColumnDef: {
            width: 200,
            sortable: true,
            filter: true,
            resizable: true,
        },
        getRowHeight: () => 50,
        onGridReady: (e) => {
            if (dimension === 'connection' && isAccountsLoading) {
                e.api.showLoadingOverlay()
            }
            if (dimension !== 'connection' && metricsLoading) {
                e.api.showLoadingOverlay()
            }
        },
        onFilterChanged(e) {
            if (dimension === 'connection' && isAccountsLoading) {
                e.api.showLoadingOverlay()
            }
            if (dimension !== 'connection' && metricsLoading) {
                e.api.showLoadingOverlay()
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
                    labelDefault: 'Table Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                },
                {
                    id: 'chart',
                    labelDefault: 'Options',
                    labelKey: 'chart',
                    iconKey: 'chart',
                    minWidth: 300,
                    maxWidth: 300,
                    width: 300,
                    toolPanel: filterPanel,
                },
            ],
            defaultToolPanel: '',
        },
        onRowClicked(event: RowClickedEvent) {
            if (event.data) {
                if (event.data.category) {
                    navigate(`metric_${event.data.id}`)
                } else if (event.data.lifecycleState === 'ONBOARD') {
                    navigate(`account_${event.data.id}`)
                } else {
                    setNotification({
                        text: 'Account is not onboarded',
                        type: 'warning',
                    })
                }
            }
        },
    }

    useEffect(() => {
        gridRef.current?.api?.setSideBar({
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
                {
                    id: 'chart',
                    labelDefault: 'Options',
                    labelKey: 'chart',
                    iconKey: 'chart',
                    minWidth: 300,
                    maxWidth: 300,
                    width: 300,
                    toolPanel: filterPanel,
                },
            ],
            defaultToolPanel: '',
        })
    }, [dimension])

    useEffect(() => {
        if (dimension === 'connection') {
            if (!isAccountsLoading) {
                gridRef.current?.api?.setColumnDefs(columns)
                gridRef.current?.api?.setRowData(
                    accounts?.connections?.filter((acc) => {
                        if (isOnboarded) {
                            return acc.lifecycleState === 'ONBOARD'
                        }
                        return acc
                    }) || []
                )
            } else gridRef.current?.api?.showLoadingOverlay()
        } else if (!metricsLoading) {
            gridRef.current?.api?.setColumnDefs(RT())
            gridRef.current?.api?.setRowData(rowGenerator(metrics?.metrics))
        } else gridRef.current?.api?.showLoadingOverlay()
    }, [dimension, isAccountsLoading, metricsLoading, isOnboarded])

    return (
        <Menu currentPage="infrastructure">
            <Header breadCrumb={['Infrastructure detail']} filter datePicker />
            <Card>
                <Flex>
                    <Title className="font-semibold">
                        {dimension === 'connection' ? 'Accounts' : 'Resources'}
                    </Title>
                    <Flex className="gap-4 w-fit">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                gridRef.current?.api?.exportDataAsCsv()
                            }}
                            icon={ArrowDownOnSquareIcon}
                        >
                            Download
                        </Button>
                    </Flex>
                </Flex>
                <div className="ag-theme-alpine mt-4">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={options}
                    />
                </div>
            </Card>
        </Menu>
    )
}
