import {
    BadgeDelta,
    Button,
    Card,
    DateRangePicker,
    DeltaType,
    Flex,
    SearchSelect,
    SearchSelectItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    Title,
} from '@tremor/react'
import { FunnelIcon as FunnelIconOutline } from '@heroicons/react/24/outline'
import { FunnelIcon as FunnelIconSolid } from '@heroicons/react/24/solid'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import {
    filterAtom,
    selectedResourceCategoryAtom,
    timeAtom,
} from '../../../../store'
import {
    useInventoryApiV2ResourcesMetricList,
    useInventoryApiV2ResourcesTagList,
} from '../../../../api/inventory.gen'
import Spinner from '../../../../components/Spinner'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import Breadcrumbs from '../../../../components/Breadcrumbs'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import ConnectionList from '../../ConnectionList'
import { useOnboardApiV1SourcesList } from '../../../../api/onboard.gen'

interface IResourceMetric {
    metricName: string
    from: number
    count: number
    changes: number
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
export default function ResourceMetricsDetails() {
    const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)

    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)
    const [openDrawer, setOpenDrawer] = useState(false)
    const { response: connections, isLoading: connectionsLoading } =
        useOnboardApiV1SourcesList()

    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )
    const [tableData, setTableData] = useState<any>([])

    const { response: inventoryCategories } =
        useInventoryApiV2ResourcesTagList()

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
        pageSize: 1000,
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { response: metrics } = useInventoryApiV2ResourcesMetricList(query)

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

    const percentage = (a?: number, b?: number): number => {
        return a && b ? ((a - b) / b) * 100 : 0
    }

    useEffect(() => {
        const newData: {
            metricName: string | undefined
            count: number | undefined
            from: number | undefined
            changes: number | string | undefined
            deltaType: DeltaType
        }[] = []
        // eslint-disable-next-line array-callback-return
        metrics?.resource_types?.map((res) => {
            const percent = percentage(res.count, res.old_count)
            newData.push({
                metricName: res.resource_type,
                count: res.count,
                from: res.old_count,
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
        setTableData(newData)
    }, [metrics])

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

    const breadcrumbsPages = [
        {
            name: 'Assets',
            path: () => {
                navigate(-1)
            },
            current: false,
        },
        { name: 'Resource metrics', path: '', current: true },
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
            </Flex>
            <Card className="mt-10">
                <Flex>
                    <Title>Resources Metrics</Title>
                    <SearchSelect
                        onValueChange={(e) => setSelectedResourceCategory(e)}
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
                </Flex>

                <div className="ag-theme-alpine mt-10">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                        rowData={tableData}
                    />
                </div>
            </Card>
        </LoggedInLayout>
    )
}
