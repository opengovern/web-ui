// @ts-nocheck
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
    IServerSideGetRowsParams,
    ValueFormatterParams,
} from 'ag-grid-community'
import { Radio } from 'pretty-checkbox-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Table, { IColumn } from '../../../components/Table'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgDescribeApiJob,
} from '../../../api/api'
import AxiosAPI from '../../../api/ApiConfig'
import { useScheduleApiV1JobsCreate } from '../../../api/schedule.gen'
import DrawerPanel from '../../../components/DrawerPanel'
import KFilter from '../../../components/Filter'
import { CloudIcon } from '@heroicons/react/24/outline'
import { string } from 'prop-types'

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
            field: 'createdAt',
            headerName: 'Created At',
            type: 'date',
            sortable: true,
            filter: false,
            suppressMenu: true,
            resizable: true,
            hide: false,
        },

        {
            field: 'type',
            headerName: 'Job Type',
            type: 'string',
            sortable: true,
            filter: false,
            suppressMenu: true,
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
            hide: true,
        },
        {
            field: 'title',
            headerName: 'Title',
            type: 'string',
            sortable: false,
            filter: false,
            resizable: true,
            suppressMenu: false,
        },

        {
            field: 'status',
            headerName: 'Status',
            type: 'string',
            sortable: true,
            suppressMenu: true,
            filter: false,
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
                    case 'COMPLETED_WITH_FAILURE':
                        jobStatus = 'completed with failed'
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
            field: 'updatedAt',
            headerName: 'Updated At',
            type: 'date',
            sortable: true,
            filter: false,
            suppressMenu: true,
            resizable: true,
            hide: false,
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
        label: 'Governance',
        value: 'compliance',
    },
    {
        label: 'Metrics',
        value: 'analytics',
    },
]
interface Option {
    label: string | undefined
    value: string | undefined
}
export default function SettingsJobs() {
    const findParmas = (key: string): string[] => {
        const params = searchParams.getAll(key)
        const temp = []
        if (params) {
            params.map((item, index) => {
                temp.push(item)
            })
        }
        return temp
    }
    const [open, setOpen] = useState(false)
    const [clickedJob, setClickedJob] =
        useState<GithubComKaytuIoKaytuEnginePkgDescribeApiJob>()
    const [searchParams, setSearchParams] = useSearchParams()
    const [jobTypeFilter, setJobTypeFilter] = useState<string[] | undefined>(
        findParmas('type')
    )
    const [jobTypeContains, setJobTypeContains] = useState<string>(
        findParmas('is')
    )
    const [jobStatusContains, setJobStatusContains] = useState<string>(
        findParmas('is')
    )
    const [statusFilter, setStatusFilter] = useState<string[] | undefined>(
        findParmas('status')
    )
    const [allStatuses, setAllStatuses] = useState<Option[]>([])

    const { response } = useScheduleApiV1JobsCreate({
        hours: 24,
        pageStart: 0,
        pageEnd: 1,
    })

    useEffect(() => {
        setAllStatuses(
            response?.summaries
                ?.map((v) => {
                    return { label: v.status, value: v.status }
                })
                .filter(
                    (thing, i, arr) => arr.findIndex((t) => t.label === thing.label) === i
                ) || []
        )
    }, [response])
    const arrayToString = (arr: string[], title: string) => {
        let temp = ``
        arr.map((item, index) => {
            if (index == 0) {
                temp += arr[index]
            } else {
                temp += `&${title}=${arr[index]}`
            }
        })
        console.log(temp)
        return temp
    }

    useEffect(() => {
        if (
            searchParams.getAll('type') !== jobTypeFilter ||
            searchParams.get('status') !== statusFilter
        ) {
            if (jobTypeFilter?.length != 0) {
                searchParams.set('type',jobTypeFilter)
            } else {
                searchParams.delete('type')
            }
            if (statusFilter?.length != 0) {
                searchParams.set('status', statusFilter)
            } else {
                searchParams.delete('status')
            }
            window.history.pushState({}, '', `?${searchParams.toString()}`)
        }
    }, [jobTypeFilter, statusFilter])

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
                        statusFilter: statusFilter,
                        typeFilters: jobTypeFilter,
                    })
                    .then((resp) => {
                        params.success({
                            rowData: resp.data.jobs || [],
                            rowCount: resp.data.summaries
                                ?.map((v) => v.count)
                                .reduce(
                                    (prev, curr) => (prev || 0) + (curr || 0),
                                    0
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

    const clickedJobDetails = [
        { title: 'ID', value: clickedJob?.id },
        { title: 'Title', value: clickedJob?.title },
        { title: 'Type', value: clickedJob?.type },
        { title: 'Created At', value: clickedJob?.createdAt },
        { title: 'Updated At', value: clickedJob?.updatedAt },
        { title: 'Kaytu Connection ID', value: clickedJob?.connectionID },
        { title: 'Account ID', value: clickedJob?.connectionProviderID },
        { title: 'Account Name', value: clickedJob?.connectionProviderName },
        { title: 'Status', value: clickedJob?.status },
        { title: 'Failure Reason', value: clickedJob?.failureReason },
    ]

    return (
        <Flex flexDirection="col">
            <Flex
                flexDirection="row"
                alignItems="start"
                justifyContent="start"
                className="gap-2"
            >
                <KFilter
                    options={jobTypes}
                    type="multi"
                    selectedItems={jobTypeFilter}
                    onChange={(values: string[]) => {
                        setJobTypeFilter(values)
                    }}
                    label="Job Types"
                    icon={CloudIcon}
                />
                <KFilter
                    options={allStatuses}
                    type="multi"
                    selectedItems={statusFilter}
                    onChange={(values: string[]) => {
                        setStatusFilter(values)
                    }}
                    label="Job Status"
                    icon={CloudIcon}
                />
            </Flex>
            <Card className="mt-4">
                <Title className="font-semibold mb-5">Jobs</Title>

                <Flex alignItems="start">
                    {/* <Card className="sticky top-6 min-w-[200px] max-w-[200px]">
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
                </Card> */}
                    <Flex className="pl-4">
                        <Table
                            id="jobs"
                            columns={columns()}
                            serverSideDatasource={serverSideRows}
                            onCellClicked={(event) => {
                                setClickedJob(event.data)
                                setOpen(true)
                            }}
                            options={{
                                rowModelType: 'serverSide',
                                serverSideDatasource: serverSideRows,
                            }}
                        />
                    </Flex>
                </Flex>
                <DrawerPanel
                    open={open}
                    onClose={() => setOpen(false)}
                    title="Job Details"
                >
                    <Flex flexDirection="col">
                        {clickedJobDetails.map((item) => {
                            return (
                                <Flex
                                    flexDirection="row"
                                    justifyContent="between"
                                    alignItems="start"
                                    className="mt-2"
                                >
                                    <Text className="w-56 font-bold">
                                        {item.title}
                                    </Text>
                                    <Text className="w-full">{item.value}</Text>
                                </Flex>
                            )
                        })}
                    </Flex>
                </DrawerPanel>
            </Card>
        </Flex>
    )
}
