import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
    ArrowPathIcon,
    ArrowRightIcon,
    ClipboardDocumentListIcon,
    CommandLineIcon,
    DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'
import {
    BadgeDelta,
    Button,
    Card,
    Color,
    Flex,
    Legend,
    Text,
    Title,
} from '@tremor/react'
import { GridOptions, ValueFormatterParams } from 'ag-grid-community'
import DrawerPanel from '../../DrawerPanel'
import Table, { IColumn } from '../../Table'
import { useScheduleApiV1JobsList } from '../../../api/schedule.gen'
import { GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus } from '../../../api/api'

const columns = () => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'id',
            headerName: 'Job ID',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'job_type',
            headerName: 'Job Type',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
        },
        {
            field: 'connection_id',
            headerName: 'Kaytu Connection ID',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'connection_provider_id',
            headerName: 'Account ID',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'connection_provider_name',
            headerName: 'Account Name',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
        },
        {
            field: 'title',
            headerName: 'Title',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
        },
        {
            field: 'status',
            headerName: 'Status',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            // valueFormatter: (param: ValueFormatterParams) => {
            //     return `${param.value ? Number(param.value).toFixed(2) : '0'}%`
            // },
        },
    ]
    return temp
}

export default function JobsMenu() {
    const [open, setOpen] = useState<boolean>(false)
    const { response: jobs, isLoading, error } = useScheduleApiV1JobsList()

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
    }

    const recentJobs = jobs?.slice(0, 5)

    return (
        <>
            <Popover className="relative isolate z-50 border-0">
                <Popover.Button
                    className="-mx-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                    id="Jobs"
                >
                    <span className="sr-only">Jobs</span>
                    <ArrowPathIcon className="h-6 w-6" />
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                        <Card className="w-96">
                            <Flex justifyContent="between">
                                <Title>Recents Jobs</Title>
                                <Button
                                    size="xs"
                                    variant="light"
                                    icon={ArrowRightIcon}
                                    iconPosition="right"
                                    onClick={() => setOpen(true)}
                                >
                                    View more
                                </Button>
                            </Flex>
                            {recentJobs?.map((job, idx) => {
                                let jobStatus = ''
                                let jobColor: Color = 'gray'
                                switch (job.status) {
                                    case GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusCreated:
                                        jobStatus = 'created'
                                        break
                                    case GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusQueued:
                                        jobStatus = 'queued'
                                        break
                                    case GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusInProgress:
                                        jobStatus = 'in progress'
                                        jobColor = 'orange'
                                        break
                                    case GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusSuccessful:
                                        jobStatus = 'succeeded'
                                        jobColor = 'emerald'
                                        break
                                    case GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusFailure:
                                        jobStatus = 'failed'
                                        jobColor = 'red'
                                        break
                                    case GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusTimeout:
                                        jobStatus = 'time out'
                                        jobColor = 'red'
                                        break
                                    default:
                                        jobStatus = String(job.status)
                                }

                                return (
                                    <Flex
                                        flexDirection="col"
                                        className={`py-3 ${
                                            idx === recentJobs.length - 1
                                                ? ''
                                                : 'border-b-2'
                                        }`}
                                    >
                                        <Flex
                                            className="pb-2"
                                            flexDirection="row"
                                            justifyContent="between"
                                        >
                                            <Text>{String('discovery')}</Text>
                                            <Legend
                                                categories={[jobStatus]}
                                                colors={[jobColor]}
                                            />
                                        </Flex>
                                        <Flex>
                                            <Text>
                                                {job.title} -
                                                {job.connectionProviderName}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                )
                            })}
                        </Card>
                    </Popover.Panel>
                </Transition>
            </Popover>
            <DrawerPanel
                title="Recents Jobs"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Table
                    id="jobs"
                    columns={columns()}
                    rowData={jobs}
                    options={options}
                    onGridReady={(e) => {
                        if (isLoading) {
                            e.api.showLoadingOverlay()
                        }
                    }}
                    loading={isLoading}
                />
            </DrawerPanel>
        </>
    )
}
