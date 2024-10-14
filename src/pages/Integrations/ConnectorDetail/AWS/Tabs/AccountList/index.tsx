import { Badge, Button, Color, Flex, TextInput } from '@tremor/react'
import { useState } from 'react'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useAtomValue } from 'jotai'
import AccountInfo from './AccountInfo'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
    SourceHealthStatus,
} from '../../../../../../api/api'
import Table, { IColumn } from '../../../../../../components/Table'
import { snakeCaseToLabel } from '../../../../../../utilities/labelMaker'
import { isDemoAtom } from '../../../../../../store'
import OnboardDrawer from '../../../../Onboard/AWS'
import { Box, Modal, Select, SpaceBetween } from '@cloudscape-design/components'
import { PencilIcon } from '@heroicons/react/24/outline'
import KTable from '@cloudscape-design/components/table'

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
import Spinner from '../../../../../../components/Spinner'
interface IAccountList {
    accounts: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection[]
    organizations: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
    loading: boolean
    accountSendNow: Function
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
            headerName: 'Account Type',
            field: 'type',
            type: 'string',
            rowGroup: false,
            enableRowGroup: true,
            sortable: true,
            hide: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'credentialName',
            type: 'string',
            headerName: 'Parent Organization Name',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
            ),
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
            cellRenderer: (
                params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
            ) => {
                if (params.value === undefined) {
                    return null
                }

                let color: Color
                let text: string
                switch (params.value) {
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
                        text = String(params.value)
                }

                return <Badge color={color}>{text}</Badge>
            },
        },
        {
            field: 'credentialID',
            type: 'string',
            headerName: 'Parent Organization ID',
            hide: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'lifecycleState',
            type: 'string',
            headerName: 'State',
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    params.value !== undefined && (
                        <Badge color={getBadgeColor(params.value)}>
                            {getBadgeText(params.value)}
                        </Badge>
                    )
                )
            },
        },
        {
            field: 'id',
            type: 'string',
            headerName: 'OpenGovernance Connection ID',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
            flex: 1,
        },
        {
            field: 'lastInventory',
            type: 'date',
            headerName: 'Last Inventory',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
            flex: 1,
        },
        {
            field: 'onboardDate',
            type: 'date',
            headerName: 'Onboard Date',
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
                    data[i].metadata.account_type || 'N/A'
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
    // groupDefaultExpanded: -1,
    rowGroupPanelShow: 'always',
    groupAllowUnbalanced: true,
    autoGroupColumnDef: {
        headerName: 'Account Type',
        flex: 2,
        sortable: true,
        filter: true,
        resizable: true,
        // cellRendererParams: {
        //     suppressCount: true,
        // },
    },
}

export default function AccountList({
    accounts,
    organizations,
    loading,
    accountSendNow,
}: IAccountList) {
    const [accData, setAccData] = useState<
        GithubComKaytuIoKaytuEnginePkgOnboardApiConnection | undefined
    >(undefined)
    const [openInfo, setOpenInfo] = useState(false)
    const [open, setOpen] = useState(false)
    const isDemo = useAtomValue(isDemoAtom)
    const [edit, setEdit] = useState<boolean>(false)
    const [selectedOrg, setSelectedOrg] = useState<string | undefined>(
        undefined
    )
    const [orgInfo,setOrgInfo] = useState({
        access:'',
        secret: '',
        role: ''
    })
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
                            accData && openInfo
                                ? accData?.providerConnectionName
                                : 'No Account Selected'
                        }
                    >
                        {openInfo && accData ? (
                            <>
                                <AccountInfo
                                    data={accData}
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    type={accData?.type}
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
                            setAccData(row)
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
                                id: 'type',
                                header: 'Account Type',
                                cell: (item) => <>{item.type}</>,
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
                            {
                                id: 'lifecycleState',
                                header: 'State',
                                cell: (item) => {
                                    return (
                                        item?.lifecycleState !== undefined && (
                                            <Badge
                                                color={getBadgeColor(
                                                    item?.lifecycleState
                                                )}
                                            >
                                                {getBadgeText(
                                                    item?.lifecycleState
                                                )}
                                            </Badge>
                                        )
                                    )
                                },
                                // sortingField: 'providerConnectionID',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                        ]}
                        columnDisplay={[
                            { id: 'providerConnectionName', visible: true },
                            { id: 'providerConnectionID', visible: true },
                            { id: 'type', visible: true },
                            { id: 'healthState', visible: true },
                            { id: 'lifecycleState', visible: true },

                            // { id: 'severity', visible: true },
                            // { id: 'evaluatedAt', visible: true },

                            // { id: 'action', visible: true },
                        ]}
                        enableKeyboardNavigation
                        // @ts-ignore
                        items={generateRows(accounts)?.slice(
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
                                        <KButton
                                            // icon={PlusIcon}
                                            onClick={() => setOpen(true)}
                                        >
                                            Onboard New AWS Account
                                        </KButton>
                                        <KButton
                                            // icon={PencilIcon}
                                            onClick={() => setEdit(true)}
                                        >
                                            Edit Credintials
                                        </KButton>
                                    </Flex>
                                }
                                className="w-full"
                            >
                                AWS Accounts{' '}
                                <span className=" font-medium">
                                    ({generateRows(accounts)?.length})
                                </span>
                            </Header>
                        }
                        pagination={
                            <Pagination
                                currentPageIndex={page + 1}
                                pagesCount={Math.ceil(
                                    generateRows(accounts)?.length / 10
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
                // downloadable
                title="Accounts"
                id="aws_account_list"
                options={options}
                rowData={generateRows(accounts)}
                columns={columns(isDemo)}
                loading={loading}
                onRowClicked={(
                    event: RowClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
                ) => {
                    if (event.data) {
                        setAccData(event.data)
                        setOpenInfo(true)
                    }
                }}
            >
                <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                    Onboard New AWS Account
                </Button>
                <Button icon={PencilIcon} onClick={() => setEdit(true)}>
                    Edit Credintials
                </Button>
            </Table> */}
            <Modal
                onDismiss={() => setEdit(false)}
                visible={edit}
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button
                                variant="secondary"
                                onClick={() => setEdit(false)}
                            >
                                Close
                            </Button>

                            <Button
                                disabled={selectedOrg === undefined}
                                onClick={() => {
                                    setEdit(false)
                                }}
                            >
                                Edit
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
                header="Edit Credintials"
            >
                <Select
                    // @ts-ignore
                    selectedOption={selectedOrg}
                    // @ts-ignore

                    onChange={({ detail }) => {
                        // @ts-ignore
                        setSelectedOrg(detail.selectedOption)
                    }}
                    placeholder="Select organization"
                    options={organizations?.map((org) => {
                        return {
                            label: org?.name,
                            value: org?.id,
                        }
                    })}
                />
                {selectedOrg && (
                    <>
                        <TextInput
                            className="w-full my-3"
                            value={orgInfo?.access}
                            placeholder="Access key ID"
                            onChange={(e) => {
                                // @ts-ignore
                                setOrgInfo({
                                    ...orgInfo,
                                    access: e.target.value,
                                })
                            }}
                        />
                        <TextInput
                            className="w-full my-3"
                            value={orgInfo?.secret}
                            placeholder="Secret access key"
                            onChange={(e) => {
                                // @ts-ignore
                                setOrgInfo({
                                    ...orgInfo,
                                    secret: e.target.value,
                                })
                            }}
                        />
                        <TextInput
                            className="w-full my-3"
                            value={orgInfo?.role}
                            placeholder="Role name"
                            onChange={(e) => {
                                // @ts-ignore
                                setOrgInfo({ ...orgInfo, role: e.target.value })
                            }}
                        />
                    </>
                )}
            </Modal>

            <OnboardDrawer
                open={open}
                onClose={() => setOpen(false)}
                accountSendNow={accountSendNow}
                // bootstrapMode={false}
            />
        </>
    )
}
