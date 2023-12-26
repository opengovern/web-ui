import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Badge,
    Card,
    Color,
    Flex,
    Text,
    Title,
} from '@tremor/react'
import {
    GridOptions,
    IServerSideGetRowsParams,
    ValueFormatterParams,
} from 'ag-grid-community'
import { Radio } from 'pretty-checkbox-react'
import { useMemo } from 'react'
import Table, { IColumn } from '../../../components/Table'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgDescribeApiJob,
} from '../../../api/api'
import AxiosAPI from '../../../api/ApiConfig'

const columns = () => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'id',
            headerName: 'Job ID',
            type: 'string',
            sortable: true,
            filter: false,
            resizable: true,
            hide: true,
        },
        {
            field: 'type',
            headerName: 'Job Type',
            type: 'string',
            sortable: true,
            filter: true,
            filterParams: {
                values: ['compliance', 'analytics', 'insight', 'discovery'],
            },
            resizable: true,
        },
        {
            field: 'connectionID',
            headerName: 'Kaytu Connection ID',
            type: 'string',
            sortable: true,
            filter: false,
            resizable: true,
            hide: true,
        },
        {
            field: 'connectionProviderID',
            headerName: 'Account ID',
            type: 'string',
            sortable: false,
            filter: false,
            resizable: true,
            hide: true,
        },
        {
            field: 'connectionProviderName',
            headerName: 'Account Name',
            type: 'string',
            sortable: false,
            filter: false,
            resizable: true,
        },
        {
            field: 'title',
            headerName: 'Title',
            type: 'string',
            sortable: false,
            filter: false,
            resizable: true,
        },
        {
            field: 'status',
            headerName: 'Status',
            type: 'string',
            sortable: true,
            filter: true,
            filterParams: {
                values: [
                    'CREATED',
                    'QUEUED',
                    'IN_PROGRESS',
                    'RUNNERS_IN_PROGRESS',
                    'SUMMARIZER_IN_PROGRESS',
                    'OLD_RESOURCE_DELETION',
                    'SUCCEEDED',
                    'COMPLETED',
                    'FAILED',
                    'TIMEOUT',
                ],
            },
            resizable: true,
            cellRenderer: (
                param: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgDescribeApiJob>
            ) => {
                let jobStatus = ''
                let jobColor: Color = 'gray'
                switch (param.data?.status) {
                    case 'CREATED':
                        jobStatus = 'created'
                        break
                    case 'QUEUED':
                        jobStatus = 'queued'
                        break
                    case 'IN_PROGRESS':
                        jobStatus = 'in progress'
                        jobColor = 'orange'
                        break
                    case 'RUNNERS_IN_PROGRESS':
                        jobStatus = 'in progress'
                        jobColor = 'orange'
                        break
                    case 'SUMMARIZER_IN_PROGRESS':
                        jobStatus = 'summarizing'
                        jobColor = 'orange'
                        break
                    case 'OLD_RESOURCE_DELETION':
                        jobStatus = 'summarizing'
                        jobColor = 'orange'
                        break
                    case 'SUCCEEDED':
                        jobStatus = 'succeeded'
                        jobColor = 'emerald'
                        break
                    case 'COMPLETED':
                        jobStatus = 'completed'
                        jobColor = 'emerald'
                        break
                    case 'FAILED':
                        jobStatus = 'failed'
                        jobColor = 'red'
                        break
                    case 'TIMEOUT':
                        jobStatus = 'time out'
                        jobColor = 'red'
                        break
                    default:
                        jobStatus = String(param.data?.status)
                }

                return <Badge color={jobColor}>{jobStatus}</Badge>
            },
        },
        {
            field: 'failureReason',
            headerName: 'Failure Reason',
            type: 'string',
            sortable: false,
            filter: true,
            resizable: true,
            hide: true,
        },
    ]
    return temp
}

export default function SettingsJobs() {
    const ssr = () => {
        return {
            getRows: (params: IServerSideGetRowsParams) => {
                console.log(params)
                let statusFilter = []
                try {
                    const v: any = params.request.filterModel
                    statusFilter = v.status.values
                } catch (e) {
                    //
                }

                let typeFilters = []
                try {
                    const v: any = params.request.filterModel
                    typeFilters = v.type.values
                } catch (e) {
                    //
                }

                const api = new Api()
                api.instance = AxiosAPI
                api.schedule
                    .apiV1JobsCreate({
                        hours: 24,
                        pageStart: params.request.startRow || 0,
                        pageEnd: params.request.endRow || 0,
                        sortBy: params.request.sortModel.at(0)?.colId,
                        sortOrder: params.request.sortModel
                            .at(0)
                            ?.sort?.toUpperCase(),
                        statusFilter,
                        typeFilters,
                        // afterSortKey:
                        //     params.request.startRow === 0 ||
                        //     sortKey.length < 1 ||
                        //     sortKey === 'none'
                        //         ? []
                        //         : [sortKey],
                    })
                    .then((resp) => {
                        console.log('fffff', resp.data.jobs || [])
                        params.success({
                            rowData: resp.data.jobs || [],
                            rowCount: resp.data.summaries
                                ?.map((v) => v.count)
                                .reduce(
                                    (prev, curr) => (prev || 0) + (curr || 0)
                                ),
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                        params.fail()
                    })
            },
        }
    }

    const serverSideRows = ssr()

    return (
        <Card>
            <Title className="font-semibold">Jobs</Title>

            <Table
                id="jobs"
                columns={columns()}
                serverSideDatasource={serverSideRows}
                options={{
                    rowModelType: 'serverSide',
                    serverSideDatasource: serverSideRows,
                }}
            />
        </Card>
    )
}
