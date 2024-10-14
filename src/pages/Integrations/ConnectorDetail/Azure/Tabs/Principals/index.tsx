import { Badge, Button, Flex } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import {
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { useAtomValue } from 'jotai'
import PrincipalInfo from './PrincipalInfo'
import NewPrincipal from './NewPrincipal'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
} from '../../../../../../api/api'
import Table, { IColumn } from '../../../../../../components/Table'
import { isDemoAtom } from '../../../../../../store'

interface IPrincipals {
    principals: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
    credintalsSendNow?: Function
    

}
import KTable from '@cloudscape-design/components/table'
import {
    Box,
    Modal,
    Select,
    SpaceBetween,
    Spinner,
    StatusIndicator,
} from '@cloudscape-design/components'

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
const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'name',
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
            field: 'credentialType',
            headerName: 'Credential Type',
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
            field: 'enabled',
            headerName: 'Enabled',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'healthStatus',
            headerName: 'Health Status',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (params: ICellRendererParams) => {
                function getBadgeColor(status: string) {
                    switch (status) {
                        case 'healthy':
                            return 'emerald'
                        case 'unhealthy':
                            return 'rose'
                        default:
                            return 'neutral'
                    }
                }

                return (
                    <Badge color={getBadgeColor(params.value)}>
                        {params.value}
                    </Badge>
                )
            },
        },
        {
            field: 'healthReason',
            headerName: 'Health Reason',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
            flex: 1,
        },
        {
            field: 'total_connections',
            headerName: 'Total Connections',
            type: 'number',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
            flex: 1,
        },
        {
            field: 'enabled_connections',
            headerName: 'Enabled Connections',
            type: 'number',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
            flex: 1,
        },
        {
            field: 'unhealthy_connections',
            headerName: 'Unhealthy Connections',
            type: 'number',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
            flex: 1,
        },
    ]
    return temp
}

export default function Principals({ principals ,credintalsSendNow}: IPrincipals) {
    const [open, setOpen] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const [priData, setPriData] = useState<
        | GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential
        | undefined
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
                                ? 'SPN Info'
                                : 'No Principals selected'
                        }
                    >
                        {openInfo && priData ? (
                            <>
                                <PrincipalInfo
                                    data={priData}
                                    open={openInfo}
                                    onClose={() => setOpenInfo(false)}
                                    isDemo={isDemo}
                                    credintalsSendNow={credintalsSendNow}
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
                                id: 'name',
                                header: 'Name',
                                cell: (item) => (
                                    <>
                                        <span
                                            className={isDemo ? 'blur-sm' : ''}
                                        >
                                            {item.metadata?.spn_name}
                                        </span>
                                    </>
                                ),
                                // sortingField: 'providerConnectionID',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'credentialType',
                                header: 'Credential Type',
                                cell: (item) => (
                                    <>
                                        <span
                                            className={isDemo ? 'blur-sm' : ''}
                                        >
                                            {item.credentialType}
                                        </span>
                                    </>
                                ),
                                // sortingField: 'providerConnectionID',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'enabled',
                                header: 'Enabled',
                                cell: (item) => (
                                    <>
                                        {item.enabled ? (
                                            <StatusIndicator type="success"></StatusIndicator>
                                        ) : (
                                            <StatusIndicator type="error"></StatusIndicator>
                                        )}
                                    </>
                                ),
                                // sortingField: 'providerConnectionID',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'healthStatus',
                                header: 'Health Status',
                                cell: (item) => {
                                    function getBadgeColor(status: string) {
                                        switch (status) {
                                            case 'healthy':
                                                return 'emerald'
                                            case 'unhealthy':
                                                return 'rose'
                                            default:
                                                return 'neutral'
                                        }
                                    }

                                    return (
                                        <Badge
                                            color={getBadgeColor(
                                                // @ts-ignore
                                                item?.healthStatus
                                            )}
                                        >
                                            {item?.healthStatus}
                                        </Badge>
                                    )
                                },
                                // sortingField: 'providerConnectionID',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                        ]}
                        columnDisplay={[
                            { id: 'name', visible: true },
                            { id: 'credentialType', visible: true },
                            { id: 'enabled', visible: true },
                            { id: 'healthStatus', visible: true },
                            // { id: 'lifecycleState', visible: true },

                            // { id: 'severity', visible: true },
                            // { id: 'evaluatedAt', visible: true },

                            // { id: 'action', visible: true },
                        ]}
                        enableKeyboardNavigation
                        // @ts-ignore
                        items={principals?.slice(page * 10, (page + 1) * 10)}
                        loading={false}
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
                                            Create New Principal
                                        </KButton>
                                        <KButton
                                            onClick={() => {
                                                if (credintalsSendNow) {
                                                    credintalsSendNow()
                                                }
                                            }}
                                        >
                                            Realod
                                        </KButton>
                                    </Flex>
                                }
                                className="w-full"
                            >
                                Principals{' '}
                                <span className=" font-medium">
                                    ({principals?.length})
                                </span>
                            </Header>
                        }
                        pagination={
                            <Pagination
                                currentPageIndex={page + 1}
                                pagesCount={Math.ceil(principals?.length / 10)}
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
                title="Principals"
                id="azure_pri_list"
                columns={columns(isDemo)}
                rowData={principals}
                onRowClicked={(
                    event: RowClickedEvent<GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential>
                ) => {
                    setPriData(event.data)
                    setOpenInfo(true)
                }}
            >
                <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                    Create New Principal
                </Button>
            </Table> */}
            {/* <PrincipalInfo
                data={priData}
                open={openInfo}
                onClose={() => setOpenInfo(false)}
                isDemo={isDemo}
            /> */}
            <Modal
                visible={open}
                onDismiss={() => setOpen(false)}
                header="Create New Principal"
            >
                <NewPrincipal
                    useDrawer={false}
                    credintalsSendNow={credintalsSendNow}
                    open={open}
                    onClose={() => setOpen(false)}
                />
            </Modal>
        </>
    )
}
