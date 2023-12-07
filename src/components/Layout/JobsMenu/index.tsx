import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
    ArrowDownIcon,
    ArrowPathRoundedSquareIcon,
    ArrowRightIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ClipboardDocumentListIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Badge,
    BarList,
    Bold,
    Button,
    Card,
    Color,
    Divider,
    Flex,
    Grid,
    Icon,
    Legend,
    ProgressBar,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { Radio } from 'pretty-checkbox-react'
import { stat } from 'fs'
import { useScheduleApiV1JobsList } from '../../../api/schedule.gen'
import {
    GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus,
    GithubComKaytuIoKaytuEnginePkgDescribeApiJobSummary,
    GithubComKaytuIoKaytuEnginePkgDescribeApiJobType,
} from '../../../api/api'
import { numberDisplay } from '../../../utilities/numericDisplay'

interface IStatusNumber {
    status: string
    count?: number
    className: string
}
function StatusNumber({ status, count, className }: IStatusNumber) {
    return (
        <Flex flexDirection="col" alignItems="start" className="p-2 w-24">
            <Text className={className}>{status}</Text>
            <Text className={className}>{count || 0}</Text>
        </Flex>
    )
}

interface ISummary {
    title: string
    className?: string
    summaries?: GithubComKaytuIoKaytuEnginePkgDescribeApiJobSummary[]
}
function Summary({ title, summaries, className }: ISummary) {
    return (
        <Flex
            flexDirection="col"
            className={`p-3 ${className} rounded-lg border border-gray-200 bg-white`}
            alignItems="start"
            justifyContent="start"
        >
            <Text className="text-gray-800 !text-base font-bold mb-3">
                {title}
            </Text>
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="start"
            >
                <StatusNumber
                    status="Created"
                    className="text-gray-700"
                    count={
                        summaries?.find(
                            (v) =>
                                v.status ===
                                GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusCreated
                        )?.count
                    }
                />
                <StatusNumber
                    status="Queued"
                    className="text-neutral-700"
                    count={
                        summaries?.find(
                            (v) =>
                                v.status ===
                                GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusQueued
                        )?.count
                    }
                />
                <StatusNumber
                    status="In Progress"
                    className="text-orange-700"
                    count={
                        summaries?.find(
                            (v) =>
                                v.status ===
                                GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusInProgress
                        )?.count
                    }
                />
            </Flex>
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="start"
            >
                <StatusNumber
                    status="Succeded"
                    className="text-emerald-700"
                    count={
                        summaries?.find(
                            (v) =>
                                v.status ===
                                GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusSuccessful
                        )?.count
                    }
                />
                <StatusNumber
                    status="Failed"
                    className="text-red-700"
                    count={
                        summaries?.find(
                            (v) =>
                                v.status ===
                                GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusFailure
                        )?.count
                    }
                />
                <StatusNumber
                    status="Timeout"
                    className="text-rose-700"
                    count={
                        summaries?.find(
                            (v) =>
                                v.status ===
                                GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusTimeout
                        )?.count
                    }
                />
            </Flex>
        </Flex>
    )
}

interface IJobCategoryItem {
    title: string
    summaries?: GithubComKaytuIoKaytuEnginePkgDescribeApiJobSummary[]
}

function JobCategoryItem({ title, summaries }: IJobCategoryItem) {
    const result = () => {
        const inProgressJobs = summaries?.filter(
            (job) =>
                job.status ===
                    GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusCreated ||
                job.status ===
                    GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusQueued ||
                job.status ===
                    GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusInProgress
        )

        const failedJobs = summaries?.filter(
            (job) =>
                job.status ===
                    GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusFailure ||
                job.status ===
                    GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusTimeout
        )

        const succeeded = summaries?.filter(
            (job) =>
                job.status ===
                GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus.JobStatusSuccessful
        )

        if ((inProgressJobs?.length || 0) > 0) {
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
        if ((failedJobs?.length || 0) > 0) {
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
        const color: Color = 'emerald'
        return {
            status: 'Succeeded',
            count:
                succeeded
                    ?.map((v) => v.count)
                    .reduce((prev, curr) => (prev || 0) + (curr || 0)) || 0,
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
                    className="mt-2"
                    color={color}
                    onClick={(e) => {
                        console.log(String(e.target))
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
    } = useScheduleApiV1JobsList({ limit: 0 })

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
                                summaries={jobs?.summaries?.filter(
                                    (v) =>
                                        v.type ===
                                        GithubComKaytuIoKaytuEnginePkgDescribeApiJobType.JobTypeDiscovery
                                )}
                            />
                            <JobCategoryItem
                                title="Metric"
                                summaries={jobs?.summaries?.filter(
                                    (v) =>
                                        v.type ===
                                        GithubComKaytuIoKaytuEnginePkgDescribeApiJobType.JobTypeAnalytics
                                )}
                            />
                            <JobCategoryItem
                                title="Insight"
                                summaries={jobs?.summaries?.filter(
                                    (v) =>
                                        v.type ===
                                        GithubComKaytuIoKaytuEnginePkgDescribeApiJobType.JobTypeInsight
                                )}
                            />
                            <JobCategoryItem
                                title="Governance"
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
