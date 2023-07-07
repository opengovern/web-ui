import {
    Card,
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Text,
    Title,
    BadgeDelta,
    SearchSelectItem,
    SearchSelect,
    Flex,
    DeltaType,
    TabGroup,
    TabList,
    Tab,
    DateRangePicker,
    Button,
} from '@tremor/react'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community'
import { FunnelIcon as FunnelIconOutline } from '@heroicons/react/24/outline'
import { FunnelIcon as FunnelIconSolid } from '@heroicons/react/24/solid'
import {
    filterAtom,
    selectedResourceCategoryAtom,
    timeAtom,
} from '../../../../store'
import {
    useInventoryApiV2CostMetricList,
    useInventoryApiV2ResourcesTagList,
} from '../../../../api/inventory.gen'
import Spinner from '../../../../components/Spinner'
import {
    numericDisplay,
    exactPriceDisplay,
} from '../../../../utilities/numericDisplay'
import {
    useOnboardApiV1ConnectionsSummaryList,
    useOnboardApiV1SourcesList,
} from '../../../../api/onboard.gen'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import ConnectionList from '../../../../components/ConnectionList'

interface ICostMetric {
    metricName: string
    from: number
    count: number
    changes: number
}

const columns: ColDef[] = [
    {
        field: 'metricName',
        headerName: 'Service Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'aggregatedCost',
        headerName: 'Aggregated Cost',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        valueFormatter: (params) => exactPriceDisplay(params.value),
    },
    {
        field: 'from',
        headerName: 'From',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
        valueFormatter: (params) => exactPriceDisplay(params.value),
    },
    {
        field: 'now',
        headerName: 'Now',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
        valueFormatter: (params) => exactPriceDisplay(params.value),
    },
    {
        field: 'changes',
        headerName: 'Change',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (params: ICellRendererParams<ICostMetric>) => (
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
export default function CostMetricsDetails() {
    const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)
    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )
    const [tableData, setTableDdata] = useState<any>([])
    const [accTableData, setAccTableDdata] = useState<any>([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [openDrawer, setOpenDrawer] = useState(false)
    const activeCategory =
        selectedResourceCategory === 'All Categories'
            ? ''
            : selectedResourceCategory
    const query = {
        ...(selectedConnections.provider && {
            connector: selectedConnections.provider,
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
        ...(activeTimeRange.from && {
            startTime: dayjs(activeTimeRange.from).unix(),
        }),
        ...(activeTimeRange.to && {
            endTime: dayjs(activeTimeRange.to).unix(),
        }),
        pageSize: 10000,
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { response: metrics } = useInventoryApiV2CostMetricList(query)
    const summaryQuery = {
        pageNumber: 1,
        ...(selectedConnections.provider && {
            connector: selectedConnections.provider,
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(activeTimeRange.from && {
            startTime: dayjs(activeTimeRange.from).unix(),
        }),
        ...(activeTimeRange.to && {
            endTime: dayjs(activeTimeRange.to).unix(),
        }),
        pageSize: 10000,
    }
    const { response: accounts, isLoading: isAccountsLoading } =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        useOnboardApiV1ConnectionsSummaryList(summaryQuery)
    const { response: inventoryCategories } =
        useInventoryApiV2ResourcesTagList()
    const { response: connections, isLoading: connectionsLoading } =
        useOnboardApiV1SourcesList()
    const percentage = (a?: number, b?: number): number => {
        return a && b ? ((a - b) / b) * 100 : 0
    }
    useEffect(() => {
        const newData: {
            metricName: string | undefined
            aggregatedCost: number | undefined
            from: number | undefined
            now: number | undefined
            changes: number | string | undefined
            deltaType: DeltaType
        }[] = []
        // eslint-disable-next-line array-callback-return
        metrics?.metrics?.map((res) => {
            const percent = percentage(
                res.daily_cost_at_end_time,
                res.daily_cost_at_start_time
            )
            newData.push({
                metricName: res.cost_dimension_name,
                aggregatedCost: res.total_cost,
                from: res.daily_cost_at_start_time,
                now: res.daily_cost_at_end_time,
                changes: Math.ceil(Math.abs(percent)),
                deltaType:
                    // eslint-disable-next-line no-nested-ternary
                    percent > 0
                        ? 'moderateIncrease'
                        : percent < 0
                        ? 'moderateDecrease'
                        : 'unchanged',
            })
        })
        setTableDdata(newData)
    }, [metrics])
    useEffect(() => {
        const newData: {
            metricName: string | undefined
            aggregatedCost: number | undefined
            from: number | undefined
            now: number | undefined
            changes: number | string | undefined
            deltaType: DeltaType
        }[] = []
        // eslint-disable-next-line array-callback-return
        accounts?.connections?.map((res) => {
            const percent = percentage(
                res.dailyCostAtEndTime,
                res.dailyCostAtStartTime
            )
            newData.push({
                metricName: res.credentialName,
                aggregatedCost: res.cost,
                from: res.dailyCostAtStartTime ? res.dailyCostAtStartTime : 0,
                now: res.dailyCostAtEndTime ? res.dailyCostAtEndTime : 0,
                changes: Math.ceil(Math.abs(percent)),
                deltaType:
                    // eslint-disable-next-line no-nested-ternary
                    percent > 0
                        ? 'moderateIncrease'
                        : percent < 0
                        ? 'moderateDecrease'
                        : 'unchanged',
            })
        })
        setAccTableDdata(newData)
    }, [accounts])

    const categoryOptions = useMemo(() => {
        if (!inventoryCategories)
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
                navigate(-1)
            },
            current: false,
        },
        { name: 'Spend metrics', path: '', current: true },
    ]

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
        getRowHeight: (params) => 50,
        onGridReady: (params) => {
            if (tableData.length === 0) {
                params.api.showLoadingOverlay()
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
                // {
                //     id: 'customStats',
                //     labelDefault: 'Custom Stats',
                //     labelKey: 'customStats',
                //     // toolPanel: CustomStatsToolPanel,
                // },
            ],
            defaultToolPanel: '',
        },
    }

    const renderTable = (type: string | 'Service' | 'Account') => {
        return (
            <div className="ag-theme-alpine mt-10">
                <AgGridReact
                    ref={gridRef}
                    domLayout="autoHeight"
                    gridOptions={gridOptions}
                    rowData={type === 'Service' ? tableData : accTableData}
                />
            </div>
        )
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
    const handleDrawer = (data: any) => {
        if (openDrawer) {
            setSelectedConnections(data)
            setOpenDrawer(false)
        } else setOpenDrawer(true)
    }

    return (
        <LoggedInLayout currentPage="spend">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Breadcrumbs pages={breadcrumbsPages} />
                <DateRangePicker
                    className="max-w-md"
                    value={activeTimeRange}
                    onValueChange={setActiveTimeRange}
                    enableClear={false}
                    maxDate={new Date()}
                />
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
            <Card className="mt-10">
                <Flex>
                    <Title>Cost Metrics</Title>
                    <div className="flex flex-row">
                        <SearchSelect
                            onValueChange={(e) =>
                                setSelectedResourceCategory(e)
                            }
                            value={selectedResourceCategory}
                            placeholder="Source Selection"
                            className="max-w-xs mb-6"
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
                                    <Tab>Services</Tab>
                                    <Tab>Accounts</Tab>
                                </TabList>
                            </TabGroup>
                        </span>
                    </div>
                </Flex>
                {/* eslint-disable-next-line no-nested-ternary */}
                {selectedIndex === 0 ? (
                    tableData.length > 0 ? (
                        renderTable('Service')
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <Spinner />
                            <Text className="mt-5">
                                It might take some time
                            </Text>
                        </div>
                    )
                ) : accTableData.length > 0 && selectedIndex === 1 ? (
                    renderTable('Account')
                ) : (
                    <div className="flex flex-col justify-center items-center">
                        <Spinner />
                        <Text className="mt-5">It might take some time</Text>
                    </div>
                )}
            </Card>
        </LoggedInLayout>
    )
}
