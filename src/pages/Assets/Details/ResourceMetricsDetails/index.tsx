import {
    Card,
    Flex,
    SearchSelect,
    SearchSelectItem,
    Title,
} from '@tremor/react'
import { useRef } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import {
    filterAtom,
    selectedResourceCategoryAtom,
    timeAtom,
} from '../../../../store'
import {
    useInventoryApiV2AnalyticsMetricList,
    useInventoryApiV2AnalyticsTagList,
} from '../../../../api/inventory.gen'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import DateRangePicker from '../../../../components/DateRangePicker'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import ConnectionList from '../../../../components/ConnectionList'
import { badgeDelta } from '../../../../utilities/deltaType'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiMetric } from '../../../../api/api'
import Table, { IColumn } from '../../../../components/Table'

const columns: IColumn<any, any>[] = [
    {
        field: 'name',
        headerName: 'Metric Name',
        type: 'string',
    },
    {
        field: 'old_count',
        headerName: 'From',
        type: 'number',
    },
    {
        field: 'count',
        headerName: 'Count',
        type: 'number',
    },
    {
        field: 'changes',
        headerName: 'Change',
        type: 'string',
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiMetric>
        ) => (
            <Flex justifyContent="center" alignItems="center" className="mt-1">
                {badgeDelta(params.data?.old_count, params.data?.count)}
            </Flex>
        ),
    },
]
export default function ResourceMetricsDetails() {
    const navigate = useNavigate()

    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )
    const {
        response: inventoryCategories,
        isLoading: inventoryCategoriesLoading,
    } = useInventoryApiV2AnalyticsTagList()

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
            startTime: activeTimeRange.start.unix().toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix().toString(),
        }),
        pageSize: 1000,
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
    }

    const { response: metrics, isLoading: metricsLoading } =
        useInventoryApiV2AnalyticsMetricList(query)

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

                <Table
                    id="asset_resource_metrics"
                    rowData={metrics?.metrics || []}
                    columns={columns}
                    onGridReady={(params) => {
                        if (metricsLoading) {
                            params.api.showLoadingOverlay()
                        }
                    }}
                />
            </Card>
        </LoggedInLayout>
    )
}
