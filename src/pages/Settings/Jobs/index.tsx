import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Badge,
    Card,
    Color,
    Divider,
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
import { useEffect, useMemo, useState } from 'react'
import Table, { IColumn } from '../../../components/Table'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgDescribeApiJob,
} from '../../../api/api'
import AxiosAPI from '../../../api/ApiConfig'
import { useScheduleApiV1JobsCreate } from '../../../api/schedule.gen'

const columns = () => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'id',
            headerName: 'Job ID',
            type: 'string',
            sortable: true,
            filter: false,
            suppressMenu: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'type',
            headerName: 'Job Type',
            type: 'string',
            sortable: true,
            filter: true,
            suppressMenu: true,
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
            suppressMenu: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'connectionProviderID',
            headerName: 'Account ID',
            type: 'string',
            sortable: false,
            filter: false,
            suppressMenu: true,
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
            suppressMenu: true,
        },
        {
            field: 'title',
            headerName: 'Title',
            type: 'string',
            sortable: false,
            filter: false,
            resizable: true,
            suppressMenu: true,
        },
        {
            field: 'status',
            headerName: 'Status',
            type: 'string',
            sortable: true,
            suppressMenu: true,
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
            suppressMenu: true,
            filter: true,
            resizable: true,
            hide: true,
        },
    ]
    return temp
}

const jobTypes = [
    {
        label: 'All',
        value: '',
    },
    {
        label: 'Discovery',
        value: 'discovery',
    },
    {
        label: 'Insight',
        value: 'insight',
    },
    {
        label: 'Compliance',
        value: 'compliance',
    },
    {
        label: 'Metrics',
        value: 'analytics',
    },
]

export default function SettingsJobs() {
    const [jobTypeFilter, setJobTypeFilter] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [allStatuses, setAllStatuses] = useState<string[]>([])
    const { response } = useScheduleApiV1JobsCreate({
        hours: 24,
        pageStart: 0,
        pageEnd: 1,
    })

    useEffect(() => {
        setAllStatuses(response?.summaries?.map((v) => v.status || '') || [])
    }, [response])

    const ssr = () => {
        return {
            getRows: (params: IServerSideGetRowsParams) => {
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
                        statusFilter: statusFilter === '' ? [] : [statusFilter],
                        typeFilters:
                            jobTypeFilter === '' ? [] : [jobTypeFilter],
                    })
                    .then((resp) => {
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
            <Title className="font-semibold mb-5">Jobs</Title>
            <Flex alignItems="start">
                <Card className="sticky top-6 min-w-[200px] max-w-[200px]">
                    <Accordion
                        defaultOpen
                        className="border-0 rounded-none bg-transparent mb-1"
                    >
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Job Type
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="gap-1.5"
                            >
                                {jobTypes.map((jobType) => (
                                    <Radio
                                        name="jobType"
                                        onClick={() =>
                                            setJobTypeFilter(jobType.value)
                                        }
                                        checked={
                                            jobTypeFilter === jobType.value
                                        }
                                    >
                                        {jobType.label}
                                    </Radio>
                                ))}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion
                        defaultOpen
                        className="border-0 rounded-none bg-transparent mb-1"
                    >
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Status
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="gap-1.5"
                            >
                                <Radio
                                    name="status"
                                    onClick={() => setStatusFilter('')}
                                    checked={statusFilter === ''}
                                >
                                    All
                                </Radio>
                                {allStatuses.map((status) => (
                                    <Radio
                                        name="status"
                                        onClick={() => setStatusFilter(status)}
                                        checked={statusFilter === status}
                                    >
                                        {status}
                                    </Radio>
                                ))}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                </Card>
                <Flex className="pl-4">
                    <Table
                        id="jobs"
                        columns={columns()}
                        serverSideDatasource={serverSideRows}
                        options={{
                            rowModelType: 'serverSide',
                            serverSideDatasource: serverSideRows,
                        }}
                    />
                </Flex>
            </Flex>
        </Card>
    )
}
