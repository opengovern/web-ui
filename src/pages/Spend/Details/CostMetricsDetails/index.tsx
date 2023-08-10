import {
    BadgeDelta,
    Card,
    Flex,
    SearchSelect,
    SearchSelectItem,
    Tab,
    TabGroup,
    TabList,
    Title,
} from '@tremor/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { useLocation, useNavigate } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community'
import {
    filterAtom,
    selectedResourceCategoryAtom,
    spendTimeAtom,
} from '../../../../store'
import {
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsTagList,
} from '../../../../api/inventory.gen'
import Spinner from '../../../../components/Spinner'
import DateRangePicker from '../../../../components/DateRangePicker'
import { exactPriceDisplay } from '../../../../utilities/numericDisplay'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../api/onboard.gen'
import Menu from '../../../../components/Menu'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import ConnectionList from '../../../../components/ConnectionList'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostMetric,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
} from '../../../../api/api'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../../utilities/deltaType'

const columnsServices: ColDef[] = [
    {
        field: 'cost_dimension_name',
        headerName: 'Service Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'total_cost',
        headerName: 'Aggregated Cost',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        valueFormatter: (params) => {
            return exactPriceDisplay(params.data?.total_cost, 2)
        },
    },
    {
        field: 'daily_cost_at_start_time',
        headerName: 'From',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
        valueFormatter: (params) => {
            return exactPriceDisplay(params.data?.daily_cost_at_start_time, 2)
        },
    },
    {
        field: 'daily_cost_at_end_time',
        headerName: 'Now',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
        valueFormatter: (params) => {
            return exactPriceDisplay(params.data?.daily_cost_at_end_time, 2)
        },
    },
    {
        field: 'changes',
        headerName: 'Change',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiCostMetric>
        ) => (
            <Flex justifyContent="center" alignItems="center" className="mt-1">
                <BadgeDelta
                    deltaType={badgeTypeByDelta(
                        params.data?.daily_cost_at_start_time,
                        params.data?.daily_cost_at_end_time
                    )}
                >
                    {percentageByChange(
                        params.data?.daily_cost_at_start_time,
                        params.data?.daily_cost_at_end_time
                    )}
                    %
                </BadgeDelta>
            </Flex>
        ),
    },
]

const columnsAccounts: ColDef[] = [
    {
        field: 'providerConnectionName',
        headerName: 'Account Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'cost',
        headerName: 'Aggregated Cost',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        valueFormatter: (params) => {
            return exactPriceDisplay(params.data?.cost, 2)
        },
    },
    {
        field: 'dailyCostAtStartTime',
        headerName: 'From',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
        valueFormatter: (params) => {
            return exactPriceDisplay(params.data?.dailyCostAtStartTime, 2)
        },
    },
    {
        field: 'dailyCostAtEndTime',
        headerName: 'Now',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
        valueFormatter: (params) => {
            return exactPriceDisplay(params.data?.dailyCostAtEndTime, 2)
        },
    },
    {
        field: 'changes',
        headerName: 'Change',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
        ) => (
            <Flex justifyContent="center" alignItems="center" className="mt-1">
                <BadgeDelta
                    deltaType={badgeTypeByDelta(
                        params.data?.dailyCostAtStartTime,
                        params.data?.dailyCostAtEndTime
                    )}
                >
                    {percentageByChange(
                        params.data?.dailyCostAtStartTime,
                        params.data?.dailyCostAtEndTime
                    )}
                    %
                </BadgeDelta>
            </Flex>
        ),
    },
]

export default function CostMetricsDetails() {
    const navigate = useNavigate()
    const tabs = useLocation().hash
    const gridRef = useRef<AgGridReact>(null)
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const { hash } = useLocation()

    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )
    const [selectedIndex, setSelectedIndex] = useState(
        hash === '#accounts' ? 1 : 0
    )
    const activeCategory =
        selectedResourceCategory === 'All Categories'
            ? ''
            : selectedResourceCategory

    const provider: ('' | 'AWS' | 'Azure')[] = [selectedConnections.provider]

    const { response: serviceMetrics, isLoading: serviceMetricsLoading } =
        useInventoryApiV2AnalyticsSpendMetricList({
            ...(selectedConnections.provider && {
                connector: provider,
            }),
            ...(selectedConnections.connections && {
                connectionId: selectedConnections.connections,
            }),
            ...(activeCategory && { tag: [`category=${activeCategory}`] }),
            ...(activeTimeRange.start && {
                startTime: activeTimeRange.start.unix().toString(),
            }),
            ...(activeTimeRange.end && {
                endTime: activeTimeRange.end.unix().toString(),
            }),
            pageSize: 10000,
            pageNumber: 1,
        })

    const { response: accountMetrics, isLoading: accountMetricsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            ...(selectedConnections.provider !== '' && {
                connector: [selectedConnections.provider],
            }),
            ...(selectedConnections.connections && {
                connectionId: selectedConnections.connections,
            }),
            ...(activeTimeRange.start && {
                startTime: activeTimeRange.start.unix(),
            }),
            ...(activeTimeRange.end && {
                endTime: activeTimeRange.end.unix(),
            }),
            pageSize: 10000,
            pageNumber: 1,
        })

    const { response: inventoryCategories, isLoading: categoriesLoading } =
        useInventoryApiV2AnalyticsTagList()

    const categoryOptions = useMemo(() => {
        if (categoriesLoading) {
            return [{ label: 'Loading', value: 'Loading' }]
        }
        if (!inventoryCategories?.category)
            return [{ label: 'no data', value: 'no data' }]
        return [{ label: 'All Categories', value: 'All Categories' }].concat(
            inventoryCategories.category.map((categoryName) => ({
                label: categoryName,
                value: categoryName,
            }))
        )
    }, [inventoryCategories])

    const breadcrumbsPages = [
        {
            name: 'Spend',
            path: () => {
                navigate('./..')
            },
            current: false,
        },
        { name: 'Spend metrics', path: '', current: true },
    ]

    useEffect(() => {
        if (selectedIndex === 0) {
            gridRef.current?.api.setColumnDefs(columnsServices)
        } else {
            gridRef.current?.api.setColumnDefs(columnsAccounts)
        }
    }, [selectedIndex])

    const gridOptions: GridOptions = {
        columnDefs: columnsServices,
        pagination: true,
        paginationPageSize: 25,
        rowSelection: 'multiple',
        animateRows: true,
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
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                },
            ],
            defaultToolPanel: '',
        },
    }

    useEffect(() => {
        if (tabs === '#services') {
            setSelectedIndex(0)
        } else {
            setSelectedIndex(1)
        }
    }, [tabs])

    return (
        <Menu currentPage="spend">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Breadcrumbs pages={breadcrumbsPages} />
                <Flex flexDirection="row" justifyContent="end" alignItems="end">
                    <DateRangePicker isSpend />
                    <ConnectionList />
                </Flex>
            </Flex>
            <Card className="mt-10">
                <Flex>
                    <Title>Cost Metrics</Title>
                    <div className="flex flex-row">
                        <SearchSelect
                            onValueChange={(e) =>
                                setSelectedResourceCategory(e)
                            }
                            value={selectedResourceCategory}
                            placeholder={
                                categoriesLoading
                                    ? 'Loading'
                                    : 'Source Selection'
                            }
                            className="max-w-xs mb-6"
                            disabled={categoriesLoading}
                        >
                            {categoryOptions.map((category) => (
                                <SearchSelectItem
                                    key={category.label}
                                    value={category.value}
                                >
                                    {category.value}
                                </SearchSelectItem>
                            ))}
                        </SearchSelect>
                        <span className="ml-5">
                            <TabGroup
                                index={selectedIndex}
                                onIndexChange={setSelectedIndex}
                            >
                                <TabList variant="solid">
                                    <Tab onClick={() => navigate('#services')}>
                                        Services
                                    </Tab>
                                    <Tab onClick={() => navigate('#accounts')}>
                                        Accounts
                                    </Tab>
                                </TabList>
                            </TabGroup>
                        </span>
                    </div>
                </Flex>
                {accountMetricsLoading ||
                serviceMetricsLoading ||
                categoriesLoading ? (
                    <Spinner />
                ) : (
                    <div className="ag-theme-alpine mt-10">
                        <AgGridReact
                            ref={gridRef}
                            domLayout="autoHeight"
                            gridOptions={gridOptions}
                            rowData={
                                selectedIndex === 0
                                    ? serviceMetrics?.metrics
                                    : accountMetrics?.connections
                            }
                        />
                    </div>
                )}
            </Card>
        </Menu>
    )
}
