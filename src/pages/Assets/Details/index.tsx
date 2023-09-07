import { BadgeDelta, Card, Flex } from '@tremor/react'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import Header from '../../../components/Header'
import Table, { IColumn } from '../../../components/Table'
import Menu from '../../../components/Menu'
import { filterAtom, notificationAtom, timeAtom } from '../../../store'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../api/onboard.gen'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiMetric } from '../../../api/api'
import { badgeDelta, badgeTypeByDelta } from '../../../utilities/deltaType'
import { useInventoryApiV2AnalyticsMetricList } from '../../../api/inventory.gen'

const options: GridOptions = {
    enableGroupEdit: true,
    columnTypes: {
        dimension: {
            enableRowGroup: true,
            enablePivot: true,
        },
    },
    // groupDefaultExpanded: -1,
    rowGroupPanelShow: 'always',
    groupAllowUnbalanced: true,
    animateRows: false,
}

export const resourceTableColumns: IColumn<any, any>[] = [
    {
        headerName: 'Connectors',
        field: 'connectors',
        type: 'string',
        width: 120,
        enableRowGroup: true,
    },
    {
        field: 'name',
        headerName: 'Service name',
        type: 'string',
    },
    {
        field: 'category',
        rowGroup: true,
        enableRowGroup: true,
        headerName: 'Category',
        type: 'string',
        hide: true,
    },
    {
        field: 'count',
        headerName: 'Count',
        type: 'number',
    },
    {
        headerName: 'Change (%)',
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
        rowGroup: true,
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
        headerName: 'Last inventory date',
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

    const query = {
        ...(selectedConnections.provider && {
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
        pageSize: 1000,
        needCost: false,
    }

    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList(query)

    const { response: metrics, isLoading: metricsLoading } =
        useInventoryApiV2AnalyticsMetricList(query)

    return (
        <Menu currentPage="assets">
            <Header breadCrumb={['Asset detail']} filter datePicker />
            <Card>
                <Table
                    title="Accounts"
                    downloadable
                    id="asset_detail_table"
                    columns={
                        dimension === 'connection'
                            ? columns
                            : resourceTableColumns
                    }
                    rowData={
                        dimension === 'connection'
                            ? accounts?.connections
                            : rowGenerator(metrics?.metrics)
                    }
                    onGridReady={(e) => {
                        if (isAccountsLoading) {
                            e.api?.showLoadingOverlay()
                        }
                    }}
                    onRowClicked={(event: RowClickedEvent) => {
                        if (event.data && dimension === 'connection') {
                            if (event.data.lifecycleState === 'ONBOARD') {
                                navigate(`${event.data.id}`)
                            } else {
                                setNotification({
                                    text: 'Account is not onboarded',
                                    type: 'warning',
                                })
                            }
                        }
                    }}
                    options={options}
                />
            </Card>
        </Menu>
    )
}
