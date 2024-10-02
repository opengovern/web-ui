// @ts-nocheck
import { Card, Flex, Text } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { ICellRendererParams, RowClickedEvent } from 'ag-grid-community'
import { useAtomValue } from 'jotai'
import { useComplianceApiV1FindingsTopDetail } from '../../../../api/compliance.gen'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    SourceType,
    TypesFindingSeverity,
} from '../../../../api/api'
import Table, { IColumn } from '../../../../components/Table'
import { topControls } from '../../Compliance/BenchmarkSummary/TopDetails/Controls'
import { severityBadge } from '../../Controls'
import { DateRange, searchAtom } from '../../../../utilities/urlstate'
import { useState } from 'react'
import KTable from '@cloudscape-design/components/table'
import Box from '@cloudscape-design/components/box'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Badge from '@cloudscape-design/components/badge'
import {
    BreadcrumbGroup,
    Header,
    Link,
    Pagination,
    PropertyFilter,
} from '@cloudscape-design/components'

const policyColumns: IColumn<any, any>[] = [
    {
        headerName: 'Control',
        field: 'title',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (param: ICellRendererParams) => (
            <Flex
                flexDirection="col"
                alignItems="start"
                justifyContent="center"
                className="h-full"
            >
                <Text className="text-gray-800">{param.value}</Text>
                <Text>{param.data.id}</Text>
            </Flex>
        ),
    },
    {
        headerName: 'Severity',
        field: 'sev',
        width: 120,
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (params: ICellRendererParams) => (
            <Flex
                className="h-full w-full"
                justifyContent="center"
                alignItems="center"
            >
                {severityBadge(params.data.severity)}
            </Flex>
        ),
    },
    {
        headerName: 'Findings',
        field: 'count',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        cellRenderer: (param: ICellRendererParams) => (
            <Flex
                flexDirection="col"
                alignItems="start"
                justifyContent="center"
                className="h-full"
            >
                <Text className="text-gray-800">{param.value || 0} issues</Text>
                <Text>
                    {(param.data.totalCount || 0) - (param.value || 0)} passed
                </Text>
            </Flex>
        ),
    },
    {
        headerName: 'Resources',
        field: 'resourceCount',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        cellRenderer: (param: ICellRendererParams) => (
            <Flex
                flexDirection="col"
                alignItems="start"
                justifyContent="center"
                className="h-full"
            >
                <Text className="text-gray-800">{param.value || 0} issues</Text>
                <Text>
                    {(param.data.resourceTotalCount || 0) - (param.value || 0)}{' '}
                    passed
                </Text>
            </Flex>
        ),
    },
]

interface ICount {
    query: {
        connector: SourceType
        conformanceStatus:
            | GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus[]
            | undefined
        severity: TypesFindingSeverity[] | undefined
        connectionID: string[] | undefined
        controlID: string[] | undefined
        benchmarkID: string[] | undefined
        resourceTypeID: string[] | undefined
        lifecycle: boolean[] | undefined
        activeTimeRange: DateRange | undefined
    }
}

export default function ControlsWithFailure({ query }: ICount) {
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
    const topQuery = {
        connector: query.connector.length ? [query.connector] : [],
        connectionId: query.connectionID,
        benchmarkId: query.benchmarkID,
    }
    const { response: controls, isLoading } =
        useComplianceApiV1FindingsTopDetail('controlID', 10000, topQuery)
    const [page, setPage] = useState(0)

    return (
        <KTable
            className="p-3   min-h-[450px]"
            // resizableColumns
            renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
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
                if (row) {
                    navigate(`${row?.Control.id}?${searchParams}`)
                }
            }}
            columnDefinitions={[
                {
                    id: 'title',
                    header: 'Control',
                    cell: (item) => (
                        <>
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                justifyContent="center"
                                className="h-full"
                            >
                                <Text className="text-gray-800">
                                    {item.Control.title}
                                </Text>
                                <Text>{item.Control.id}</Text>
                            </Flex>
                        </>
                    ),
                    sortingField: 'id',
                    isRowHeader: true,
                    maxWidth: 300,
                },
                {
                    id: 'severity',
                    header: 'Severity',
                    sortingField: 'severity',
                    cell: (item) => (
                        <Badge
                            // @ts-ignore
                            color={`severity-${item.Control.severity}`}
                        >
                            {item.Control.severity.charAt(0).toUpperCase() +
                                item.Control.severity.slice(1)}
                        </Badge>
                    ),
                    maxWidth: 100,
                },
                {
                    id: 'count',
                    header: 'Findings',
                    maxWidth: 100,

                    cell: (item) => (
                        <>
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                justifyContent="center"
                                className="h-full"
                            >
                                <Text className="text-gray-800">{`${item.count} issues`}</Text>
                                <Text>{`${
                                    item.totalCount - item.count
                                } passed`}</Text>
                            </Flex>
                        </>
                    ),
                },
                {
                    id: 'resourceCount',
                    header: 'Resources',
                    cell: (item) => (
                        <>
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                justifyContent="center"
                                className="h-full"
                            >
                                <Text className="text-gray-800">
                                    {item.resourceCount || 0} issues
                                </Text>
                                <Text>
                                    {(item.resourceTotalCount || 0) -
                                        (item.resourceCount || 0)}{' '}
                                    passed
                                </Text>
                            </Flex>
                        </>
                    ),
                    sortingField: 'title',
                    // minWidth: 400,
                    maxWidth: 200,
                },
                // {
                //     id: 'providerConnectionName',
                //     header: 'Cloud account',
                //     maxWidth: 100,
                //     cell: (item) => (
                //         <>
                //             <Flex
                //                 justifyContent="start"
                //                 className={`h-full gap-3 group relative ${
                //                     isDemo ? 'blur-sm' : ''
                //                 }`}
                //             >
                //                 {getConnectorIcon(item.connector)}
                //                 <Flex flexDirection="col" alignItems="start">
                //                     <Text className="text-gray-800">
                //                         {item.providerConnectionName}
                //                     </Text>
                //                     <Text>{item.providerConnectionID}</Text>
                //                 </Flex>
                //                 <Card className="cursor-pointer absolute w-fit h-fit z-40 right-1 scale-0 transition-all py-1 px-4 group-hover:scale-100">
                //                     <Text color="blue">Open</Text>
                //                 </Card>
                //             </Flex>
                //         </>
                //     ),
                // },

                // {
                //     id: 'conformanceStatus',
                //     header: 'Status',
                //     sortingField: 'severity',
                //     cell: (item) => (
                //         <Badge
                //             // @ts-ignore
                //             color={`${
                //                 item.conformanceStatus == 'passed'
                //                     ? 'green'
                //                     : 'red'
                //             }`}
                //         >
                //             {item.conformanceStatus}
                //         </Badge>
                //     ),
                //     maxWidth: 100,
                // },
                // {
                //     id: 'severity',
                //     header: 'Severity',
                //     sortingField: 'severity',
                //     cell: (item) => (
                //         <Badge
                //             // @ts-ignore
                //             color={`severity-${item.severity}`}
                //         >
                //             {item.severity.charAt(0).toUpperCase() +
                //                 item.severity.slice(1)}
                //         </Badge>
                //     ),
                //     maxWidth: 100,
                // },
                // {
                //     id: 'evaluatedAt',
                //     header: 'Last Evaluation',
                //     cell: (item) => (
                //         // @ts-ignore
                //         <>{dateTimeDisplay(item.value)}</>
                //     ),
                // },
            ]}
            columnDisplay={[
                { id: 'title', visible: true },
                { id: 'severity', visible: true },
                { id: 'count', visible: true },
                { id: 'resourceCount', visible: true },
                // { id: 'severity', visible: true },
                // { id: 'evaluatedAt', visible: true },

                // { id: 'action', visible: true },
            ]}
            enableKeyboardNavigation
            // @ts-ignore
            items={controls?.records?.slice(page * 10, (page + 1) * 10)}
            loading={isLoading}
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
                <Header className="w-full">
                    Controls{' '}
                    <span className=" font-medium">
                        ({controls?.totalCount})
                    </span>
                </Header>
            }
            pagination={
                <Pagination
                    currentPageIndex={page+1}
                    pagesCount={Math.ceil(controls?.totalCount / 10)}
                    onChange={({ detail }) => setPage(detail.currentPageIndex-1)}
                />
            }
        />
    )
}
