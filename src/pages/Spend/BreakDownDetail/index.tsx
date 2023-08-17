import { useNavigate } from 'react-router-dom'
import { GridOptions, ICellRendererParams } from 'ag-grid-community'
import { Card, Flex } from '@tremor/react'
import { useInventoryApiV2AnalyticsMetricsListList } from '../../../api/inventory.gen'
import Breadcrumbs from '../../../components/Breadcrumbs'
import DateRangePicker from '../../../components/DateRangePicker'
import ConnectionList from '../../../components/ConnectionList'
import Table, { IColumn } from '../../../components/Table'
import Menu from '../../../components/Menu'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiMetric,
    SourceType,
} from '../../../api/api'
import { getConnectorIcon } from '../../../components/Cards/ConnectorCard'

const columns: IColumn<any, any>[] = [
    {
        headerName: 'Connectors',
        field: 'connectors',
        type: 'string',
        enableRowGroup: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiMetric>
        ) =>
            params.data?.name && (
                <Flex justifyContent="center" alignItems="center">
                    {params.value.includes('AWS' as SourceType) &&
                        getConnectorIcon('AWS')}
                    {params.value.includes('Azure' as SourceType) &&
                        getConnectorIcon('Azure')}
                </Flex>
            ),
    },
    {
        field: 'name',
        headerName: 'Service Name',
        type: 'string',
    },
    {
        field: 'category',
        rowGroup: true,
        enableRowGroup: true,
        headerName: 'Category',
        type: 'string',
    },
    // {
    //     field: 'count',
    //     headerName: 'Count',
    //     type: 'number',
    // },
    // {
    //     headerName: 'Change (%)',
    //     type: 'string',
    //     cellRenderer: (
    //         params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiMetric>
    //     ) =>
    //         params.data?.name && (
    //             <Flex
    //                 justifyContent="center"
    //                 alignItems="center"
    //                 className="mt-1"
    //             >
    //                 {params.data?.old_count
    //                     ? badgeDelta(params.data?.old_count, params.data?.count)
    //                     : badgeDelta(1, 2)}
    //             </Flex>
    //         ),
    // },
    // {
    //     headerName: 'Change (Δ)',
    //     type: 'string',
    //     cellRenderer: (
    //         params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgInventoryApiMetric>
    //     ) =>
    //         params.data?.name && (
    //             <Flex
    //                 justifyContent="center"
    //                 alignItems="center"
    //                 className="mt-1"
    //             >
    //                 <BadgeDelta
    //                     deltaType={badgeTypeByDelta(
    //                         params.data?.old_count,
    //                         params.data?.count
    //                     )}
    //                 >
    //                     {Math.abs(
    //                         (params.data?.old_count || 0) -
    //                             (params.data?.count || 0)
    //                     )}
    //                 </BadgeDelta>
    //             </Flex>
    //         ),
    // },
]

const rowGenerator = (data: any) => {
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

export default function BreakDownDetail() {
    const navigate = useNavigate()

    const { response: services, isLoading: servicesLoading } =
        useInventoryApiV2AnalyticsMetricsListList({ metricType: 'spend' })

    const breadcrumbsPages = [
        {
            name: 'Spend',
            path: () => {
                navigate('./..')
            },
            current: false,
        },
        { name: 'details', path: '', current: true },
    ]

    const options: GridOptions = {
        enableGroupEdit: true,
        columnTypes: {
            dimension: {
                enableRowGroup: true,
                enablePivot: true,
            },
        },
        groupDefaultExpanded: -1,
        rowGroupPanelShow: 'always',
        groupAllowUnbalanced: true,
    }
    return (
        <Menu currentPage="spend">
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
            <Card className="mt-4">
                <Table
                    options={options}
                    title="Spend Breakdown"
                    downloadable
                    id="spend_breakdown"
                    rowData={rowGenerator(services)}
                    columns={columns}
                    onGridReady={(params) => {
                        if (servicesLoading) {
                            params.api.showLoadingOverlay()
                        }
                    }}
                />
            </Card>
        </Menu>
    )
}
