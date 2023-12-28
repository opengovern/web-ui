import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
    ArrowPathRoundedSquareIcon,
    ArrowRightIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ClipboardDocumentListIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { BarList, Button, Card, Color, Flex, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    GithubComKaytuIoKaytuEnginePkgDescribeApiJobSummary,
    GithubComKaytuIoKaytuEnginePkgDescribeApiJobType,
} from '../../../api/api'
import { numberDisplay } from '../../../utilities/numericDisplay'
import { useScheduleApiV1JobsCreate } from '../../../api/schedule.gen'

interface IJobCategoryItem {
    title: string
    jobType: string
    summaries?: GithubComKaytuIoKaytuEnginePkgDescribeApiJobSummary[]
}

const inProgressStatuses = ['CREATED', 'QUEUED', 'IN_PROGRESS']
const failedStatuses = ['FAILED', 'TIMEOUT', 'COMPLETED_WITH_FAILURE']
const succeededStatuses = ['SUCCEEDED', 'COMPLETED']

const checkStatus = (v: string, arr: string[]) => {
    let exists = false
    arr.forEach((element) => {
        if (element === v) {
            exists = true
        }
    })
    return exists
}

function JobCategoryItem({ title, jobType, summaries }: IJobCategoryItem) {
    const navigate = useNavigate()
    const workspace = useParams<{ ws: string }>().ws

    const result = () => {
        const inProgressJobs =
            summaries?.filter((job) =>
                checkStatus(job.status || '', inProgressStatuses)
            ) || []

        const failedJobs =
            summaries?.filter((job) =>
                checkStatus(job.status || '', failedStatuses)
            ) || []

        const succeededJobs =
            summaries?.filter((job) =>
                checkStatus(job.status || '', succeededStatuses)
            ) || []

        const unknownJobs =
            summaries?.filter(
                (job) =>
                    !checkStatus(job.status || '', succeededStatuses) &&
                    !checkStatus(job.status || '', inProgressStatuses) &&
                    !checkStatus(job.status || '', failedStatuses)
            ) || []

        if (inProgressJobs.length > 0) {
            const color: Color = 'neutral'

            return {
                status: 'In Progress',
                count:
                    inProgressJobs
                        ?.map((v) => v.count)
                        .reduce((prev, curr) => (prev || 0) + (curr || 0)) || 0,
                icon: ArrowPathRoundedSquareIcon,
                color,
            }
        }
        if (failedJobs.length > 0) {
            const color: Color = 'rose'
            return {
                status: 'Failed',
                count:
                    failedJobs
                        ?.map((v) => v.count)
                        .reduce((prev, curr) => (prev || 0) + (curr || 0)) || 0,
                icon: ExclamationTriangleIcon,
                color,
            }
        }
        if (unknownJobs.length > 0) {
            const color: Color = 'neutral'
            return {
                status: 'Unknown',
                count:
                    unknownJobs
                        ?.map((v) => v.count)
                        .reduce((prev, curr) => (prev || 0) + (curr || 0)) || 0,
                icon: ArrowPathRoundedSquareIcon,
                color,
            }
        }
        const color: Color = 'emerald'
        return {
            status: 'Succeeded',
            count:
                (succeededJobs?.length || 0) === 0
                    ? 0
                    : succeededJobs
                          ?.map((v) => v.count)
                          .reduce((prev, curr) => (prev || 0) + (curr || 0)) ||
                      0,
            icon: CheckIcon,
            color,
        }
    }

    const { status, count, icon, color } = result()

    const totalJobs =
        summaries
            ?.map((v) => v.count)
            .reduce((prev, current) => {
                return (prev || 0) + (current || 0)
            }) || 0

    const data =
        summaries?.map((v) => {
            return { name: String(v.status), value: v.count || 0 }
        }) || []

    const fullTitle = () => {
        const percentage = numberDisplay((count / totalJobs) * 100)
        if (status === 'Failed') {
            return `${percentage}% of ${title} jobs failed`
        }
        if (status === 'In Progress') {
            return `${percentage}% of ${title} jobs are running`
        }
        return `${title} jobs finished successfully`
    }
    const [open, setOpen] = useState(false)

    return (
        <Card
            decoration="left"
            decorationColor={color}
            key={title}
            className="h-fit w-96 m-2 p-3 px-3"
        >
            <Flex
                justifyContent="between"
                className="cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <Flex justifyContent="start" className="space-x-4">
                    {/* <Icon
                        variant="outlined"
                        icon={icon}
                        size="sm"
                        color={color}
                    /> */}
                    <Title className="!text-base truncate">{fullTitle()}</Title>
                </Flex>
                {open ? (
                    <ChevronUpIcon height={20} color="text-blue-500" />
                ) : (
                    <ChevronDownIcon height={20} color="text-blue-500" />
                )}
            </Flex>
            {open && (
                <BarList
                    key={title}
                    data={data}
                    className="mt-2 cursor-pointer"
                    color={color}
                    onClick={(e) => {
                        navigate(
                            `/${workspace}/settings?sp=jobs&type=${jobType}`
                        )
                    }}
                    // valueFormatter={dataFormatter}
                />
            )}
        </Card>
    )
}

export default function JobsMenu() {
    const navigate = useNavigate()
    const workspace = useParams<{ ws: string }>().ws
    const {
        response: jobs,
        isLoading,
        error,
    } = useScheduleApiV1JobsCreate({ pageStart: 0, pageEnd: 1, hours: 24 })

    if (workspace === undefined || workspace === '') {
        return null
    }
    return (
        <Popover className="relative isolate z-50 border-0">
            <Popover.Button
                className="-mx-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                id="Jobs"
            >
                <span className="sr-only">Jobs</span>
                <ClipboardDocumentListIcon className="h-6 w-6" />
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
                    <Card className="w-fit ">
                        <Flex justifyContent="between">
                            <Title className="font-bold text-gray-800">
                                Jobs in last 24 hours
                            </Title>
                            <Button
                                size="xs"
                                variant="light"
                                icon={ArrowRightIcon}
                                iconPosition="right"
                                onClick={() =>
                                    navigate(`/${workspace}/settings#jobs`)
                                }
                            >
                                See All
                            </Button>
                        </Flex>
                        <Flex
                            flexDirection="col"
                            justifyContent="between"
                            alignItems="start"
                            className="mt-6"
                        >
                            <JobCategoryItem
                                title="Discovery"
                                jobType="discovery"
                                summaries={jobs?.summaries?.filter(
                                    (v) =>
                                        v.type ===
                                        GithubComKaytuIoKaytuEnginePkgDescribeApiJobType.JobTypeDiscovery
                                )}
                            />
                            <JobCategoryItem
                                title="Metric"
                                jobType="analytics"
                                summaries={jobs?.summaries?.filter(
                                    (v) =>
                                        v.type ===
                                        GithubComKaytuIoKaytuEnginePkgDescribeApiJobType.JobTypeAnalytics
                                )}
                            />
                            <JobCategoryItem
                                title="Insight"
                                jobType="insight"
                                summaries={jobs?.summaries?.filter(
                                    (v) =>
                                        v.type ===
                                        GithubComKaytuIoKaytuEnginePkgDescribeApiJobType.JobTypeInsight
                                )}
                            />
                            <JobCategoryItem
                                title="Governance"
                                jobType="compliance"
                                summaries={jobs?.summaries?.filter(
                                    (v) =>
                                        v.type ===
                                        GithubComKaytuIoKaytuEnginePkgDescribeApiJobType.JobTypeCompliance
                                )}
                            />
                        </Flex>
                    </Card>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}
