import {
    Card,
    Flex,
    SearchSelect,
    SearchSelectItem,
    Title,
} from '@tremor/react'
import { useRef } from 'react'
import { useAtom, useAtomValue } from 'jotai'
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
import { numberDisplay } from '../../../../utilities/numericDisplay'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import DateRangePicker from '../../../../components/DateRangePicker'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import ConnectionList from '../../../../components/ConnectionList'
import { badgeDelta } from '../../../../utilities/deltaType'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType } from '../../../../api/api'

const columns: ColDef[] = [
    {
        field: 'resource_name',
        headerName: 'Metric Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        valueFormatter: (params) =>
            params.data?.resource_name || params.data?.resource_type || '',
    },
    {
        field: 'old_count',
        headerName: 'From',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        valueFormatter: (params) => numberDisplay(params.value, 0),
    },
    {
        field: 'count',
        headerName: 'Count',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        valueFormatter: (params) => numberDisplay(params.value, 0),
    },
    {
        field: 'changes',
        headerName: 'Change',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType>
        ) => (
            <Flex justifyContent="center" alignItems="center" className="mt-1">
                {badgeDelta(params.data?.old_count, params.data?.count)}
            </Flex>
        ),
    },
]
export default function ResourceMetricsDetails() {
    const navigate = useNavigate()
    const gridRef = useRef<AgGridReact>(null)

    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )
    const {
        response: inventoryCategories,
        isLoading: inventoryCategoriesLoading,
    } = useInventoryApiV2ResourcesTagList()

    const activeCategory =
        selectedResourceCategory === 'All Categories'
            ? ''
            : selectedResourceCategory
    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
        ...(activeTimeRange.start && {
            startTime: dayjs(activeTimeRange.start.toString())
                .unix()
                .toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: dayjs(activeTimeRange.end.toString()).unix().toString(),
        }),
        pageSize: 1000,
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
    }

    const { response: metrics, isLoading: metricsLoading } =
        useInventoryApiV2ResourcesMetricList(query)

    const categoryOptions = () => {
        if (inventoryCategoriesLoading)
            return [{ label: 'Loading', value: 'loading' }]

        return [{ label: 'All Categories', value: 'All Categories' }].concat(
            inventoryCategories?.category.map((categoryName) => ({
                label: categoryName,
                value: categoryName,
            })) || []
        )
    }

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        paginationPageSize: 25,
        rowSelection: 'multiple',
        animateRows: true,
        getRowHeight: (params) => 50,
        onGridReady: (params) => {
            if (metricsLoading) {
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

    return (
        <LoggedInLayout currentPage="assets">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Breadcrumbs pages={breadcrumbsPages} />

                <Flex flexDirection="row" justifyContent="end">
                    <DateRangePicker />
                    <ConnectionList />
                </Flex>
            </Flex>
            <Card className="mt-10">
                <Flex>
                    <Title>Resources Metrics</Title>
                    <SearchSelect
                        onValueChange={(e) => setSelectedResourceCategory(e)}
                        value={selectedResourceCategory}
                        placeholder={
                            inventoryCategoriesLoading
                                ? 'Loading'
                                : 'Source Selection'
                        }
                        disabled={inventoryCategoriesLoading}
                        className="max-w-xs mb-6"
                    >
                        {categoryOptions().map((category) => (
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
                        rowData={metrics?.resource_types}
                    />
                </div>
            </Card>
        </LoggedInLayout>
    )
}
