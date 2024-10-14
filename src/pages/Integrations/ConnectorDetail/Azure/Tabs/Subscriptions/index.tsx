import { useState } from 'react'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { Badge, Button, Color, Flex } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useAtomValue } from 'jotai'
import NewAzureSubscription from './NewSubscription'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
    SourceHealthStatus,
} from '../../../../../../api/api'
import SubscriptionInfo from './SubscriptionInfo'
import Table, { IColumn } from '../../../../../../components/Table'
import { snakeCaseToLabel } from '../../../../../../utilities/labelMaker'
import { isDemoAtom } from '../../../../../../store'
import KTable from '@cloudscape-design/components/table'
import { Box, Modal, Select, SpaceBetween, Spinner } from '@cloudscape-design/components'

import KBadge from '@cloudscape-design/components/badge'
import {
    BreadcrumbGroup,
    Header,
    Link,
    Pagination,
    PropertyFilter,
} from '@cloudscape-design/components'
import { AppLayout, SplitPanel } from '@cloudscape-design/components'
import KButton from '@cloudscape-design/components/button'

interface ISubscriptions {
    subscriptions: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection[]
    spns: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
    loading: boolean
    credintalsSendNow?: Function
    accountSendNow?: Function

}

function getBadgeColor(status: string) {
    switch (status) {
        case 'NOT_ONBOARD':
            return 'neutral'
        case 'IN_PROGRESS':
            return 'yellow'
        case 'ONBOARD':
            return 'emerald'
        case 'UNHEALTHY':
            return 'rose'
        default:
            return 'gray'
    }
}

function getBadgeText(status: string) {
    switch (status) {
        case 'NOT_ONBOARD':
            return 'Not Onboarded'
        case 'IN_PROGRESS':
            return 'In Progress'
        case 'ONBOARD':
            return 'Onboarded'
        case 'UNHEALTHY':
            return 'Unhealthy'
        case 'DISCOVERED':
            return 'Discovered'
        default:
            return 'Archived'
    }
}

const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'providerConnectionName',
            headerName: 'Name',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'providerConnectionID',
            headerName: 'ID',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'credentialName',
            headerName: 'Parent SPN Name',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'credentialType',
            headerName: 'Subscription Type',
            type: 'string',
            hide: true,
            sortable: true,
            filter: true,
            resizable: true,
            valueFormatter: (param: ValueFormatterParams) =>
                snakeCaseToLabel(param.value),
            flex: 1,
        },
        {
            field: 'credentialID',
            headerName: 'Parent SPN ID',
            type: 'string',
            hide: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'lifecycleState',
            headerName: 'State',
            type: 'string',
            rowGroup: false,
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (params: ICellRendererParams) => {
                if (params.value === undefined) {
                    return null
                }
                return (
                    <Badge color={getBadgeColor(params.value)}>
                        {getBadgeText(params.value)}
                    </Badge>
                )
            },
            hide: true,
        },
        {
            field: 'healthState',
            type: 'string',
            headerName: 'Health state',
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'id',
            headerName: 'OpenGovernance Connection ID',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
            flex: 1,
        },
        {
            field: 'lastInventory',
            headerName: 'Last Inventory',
            type: 'date',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
            flex: 1,
        },
        {
            field: 'onboardDate',
            headerName: 'Onboard Date',
            type: 'date',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
            flex: 1,
        },
    ]
    return temp
}

const generateRows = (data: any) => {
    const rows = []
    if (data) {
        for (let i = 0; i < data.length; i += 1) {
            if (data[i].metadata) {
                // eslint-disable-next-line no-param-reassign
                data[i].type = snakeCaseToLabel(
                    data[i].metadata.account_type || ''
                )
                rows.push(data[i])
            }
        }
    }
    return rows
}

const options: GridOptions = {
    enableGroupEdit: true,
    columnTypes: {
        dimension: {
            enableRowGroup: true,
            enablePivot: true,
        },
    },
    rowGroupPanelShow: 'always',
    groupAllowUnbalanced: true,
    autoGroupColumnDef: {
        headerName: 'State',
        flex: 2,
        sortable: true,
        filter: true,
        resizable: true,
    },
}

export default function Subscriptions({
    subscriptions,
    spns,
    loading,
    credintalsSendNow,
    accountSendNow,
}: ISubscriptions) {
    const [open, setOpen] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const [priData, setPriData] = useState<
        GithubComKaytuIoKaytuEnginePkgOnboardApiConnection | undefined
    >(undefined)
    const isDemo = useAtomValue(isDemoAtom)
    const [page, setPage] = useState(0)

    return (
        <>
            <AppLayout
                toolsOpen={false}
                navigationOpen={false}
                contentType="table"
                toolsHide={true}
                navigationHide={true}
                splitPanelOpen={openInfo}
                onSplitPanelToggle={() => {
                    setOpenInfo(!openInfo)
                }}
                splitPanel={
                    <SplitPanel
                        // @ts-ignore
                        header={
                            priData && openInfo
                                ? priData?.providerConnectionName
                                : 'No Account Selected'
                        }
                    >
                        {openInfo && priData ? (
                            <>
                                <SubscriptionInfo
                                    data={priData}
                                    open={openInfo}
                                    onClose={() => setOpenInfo(false)}
                                    isDemo={isDemo}
                                    accountSendNow={accountSendNow}
                                />
                            </>
                        ) : (
                            <>
                                <Spinner />
                            </>
                        )}
                    </SplitPanel>
                }
                content={
                    <KTable
                        className="  min-h-[450px]"
                        variant="full-page"
                        // resizableColumns
                        renderAriaLive={({
                            firstIndex,
                            lastIndex,
                            totalItemsCount,
                        }) =>
                            `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
                        }
                        onSortingChange={(event) => {
                            // setSort(event.detail.sortingColumn.sortingField)
                            // setSortOrder(!sortOrder)
                        }}
                        // sortingColumn={sort}
                        // sortingDescending={sortOrder}
                        // sortingDescending={sortOrder == 'desc' ? true : false}
                        // @ts-ignore
                        onRowClick={(event) => {
                            const row = event.detail.item
                            setPriData(row)
                            setOpenInfo(true)
                        }}
                        columnDefinitions={[
                            {
                                id: 'providerConnectionName',
                                header: 'Name',
                                cell: (item) => (
                                    <>
                                        <span
                                            className={isDemo ? 'blur-sm' : ''}
                                        >
                                            {item.providerConnectionName}
                                        </span>
                                    </>
                                ),
                                // sortingField: 'providerConnectionID',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'providerConnectionID',
                                header: 'ID',
                                cell: (item) => (
                                    <>
                                        <span
                                            className={isDemo ? 'blur-sm' : ''}
                                        >
                                            {item.providerConnectionID}
                                        </span>
                                    </>
                                ),
                                // sortingField: 'providerConnectionID',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'credentialName',
                                header: 'Parent SPN Name',
                                cell: (item) => <>{item.credentialName}</>,
                                // sortingField: 'providerConnectionID',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'healthState',
                                header: 'Health state',
                                cell: (item) => {
                                    if (item.healthState === undefined) {
                                        return null
                                    }

                                    let color: Color
                                    let text: string
                                    switch (item?.healthState) {
                                        case SourceHealthStatus.HealthStatusHealthy:
                                            color = 'emerald'
                                            text = 'Healthy'
                                            break
                                        case SourceHealthStatus.HealthStatusUnhealthy:
                                            color = 'rose'
                                            text = 'Unhealthy'
                                            break
                                        default:
                                            color = 'neutral'
                                            text = String(item?.healthState)
                                    }

                                    return <Badge color={color}>{text}</Badge>
                                },
                                // sortingField: 'providerConnectionID',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                        ]}
                        columnDisplay={[
                            { id: 'providerConnectionName', visible: true },
                            { id: 'providerConnectionID', visible: true },
                            { id: 'credentialName', visible: true },
                            { id: 'healthState', visible: true },
                            // { id: 'lifecycleState', visible: true },

                            // { id: 'severity', visible: true },
                            // { id: 'evaluatedAt', visible: true },

                            // { id: 'action', visible: true },
                        ]}
                        enableKeyboardNavigation
                        // @ts-ignore
                        items={generateRows(subscriptions)?.slice(
                            page * 10,
                            (page + 1) * 10
                        )}
                        loading={loading}
                        loadingText="Loading resources"
                        // stickyColumns={{ first: 0, last: 1 }}
                        // stripedRows
                        trackBy="id"
                        empty={
                            <Box
                                margin={{ vertical: 'xs' }}
                                textAlign="center"
                                color="inherit"
                            >
                                <SpaceBetween size="m">
                                    <b>No resources</b>
                                </SpaceBetween>
                            </Box>
                        }
                        filter={
                            ''
                            // <PropertyFilter
                            //     // @ts-ignore
                            //     query={undefined}
                            //     // @ts-ignore
                            //     onChange={({ detail }) => {
                            //         // @ts-ignore
                            //         setQueries(detail)
                            //     }}
                            //     // countText="5 matches"
                            //     enableTokenGroups
                            //     expandToViewport
                            //     filteringAriaLabel="Control Categories"
                            //     // @ts-ignore
                            //     // filteringOptions={filters}
                            //     filteringPlaceholder="Control Categories"
                            //     // @ts-ignore
                            //     filteringOptions={undefined}
                            //     // @ts-ignore

                            //     filteringProperties={undefined}
                            //     // filteringProperties={
                            //     //     filterOption
                            //     // }
                            // />
                        }
                        header={
                            <Header
                                actions={
                                    <Flex className="gap-1">
                                        <KButton onClick={() => setOpen(true)}>
                                            Onboard New Azure Principal
                                        </KButton>
                                        <KButton
                                            onClick={() => {
                                                if (accountSendNow) {
                                                    accountSendNow()
                                                }
                                            }}
                                        >
                                            Realod
                                        </KButton>
                                    </Flex>
                                }
                                className="w-full"
                            >
                                Azure Accounts{' '}
                                <span className=" font-medium">
                                    ({generateRows(subscriptions)?.length})
                                </span>
                            </Header>
                        }
                        pagination={
                            <Pagination
                                currentPageIndex={page + 1}
                                pagesCount={Math.ceil(
                                    generateRows(subscriptions)?.length / 10
                                )}
                                onChange={({ detail }) =>
                                    setPage(detail.currentPageIndex - 1)
                                }
                            />
                        }
                    />
                }
            />
            {/* <Table
                downloadable
                title="Subscriptions"
                id="azure_subscription_list"
                rowData={generateRows(subscriptions)}
                columns={columns(isDemo)}
                options={options}
                loading={loading}
                onRowClicked={(event: RowClickedEvent) => {
                    if (event.data) {
                        setPriData(event.data)
                        setOpenInfo(true)
                    }
                }}
            >
                <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                    Onboard New Azure Principal
                </Button>
            </Table>
            <SubscriptionInfo
                data={priData}
                open={openInfo}
                onClose={() => setOpenInfo(false)}
                isDemo={isDemo}
            /> */}
            <NewAzureSubscription
                spns={spns}
                open={open}
                credintalsSendNow={credintalsSendNow}
                accountSendNow={accountSendNow}
                onClose={() => setOpen(false)}
            />
        </>
    )
}
