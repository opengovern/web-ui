import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
    ArrowRightIcon,
    ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline'
import {
    Badge,
    Button,
    Card,
    Color,
    Flex,
    Legend,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useScheduleApiV1JobsList } from '../../../api/schedule.gen'
import {
    GithubComKaytuIoKaytuEnginePkgDescribeApiJobStatus,
    GithubComKaytuIoKaytuEnginePkgDescribeApiJobSummary,
    GithubComKaytuIoKaytuEnginePkgDescribeApiJobType,
} from '../../../api/api'

interface IStatusNumber {
    status: string
    count?: number
    className: string
}
function StatusNumber({ status, count, className }: IStatusNumber) {
    return (
        <Flex flexDirection="col" alignItems="start" className="p-2 w-20">
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
            className={`p-3 ${className} rounded-lg border border-gray-200`}
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
                    status="InProgress"
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

export default function JobsMenu() {
    const navigate = useNavigate()
    const workspace = useParams<{ ws: string }>().ws
    const {
        response: jobs,
        isLoading,
        error,
    } = useScheduleApiV1JobsList({ limit: 0 })

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
                    <Card className="w-fit">
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
                            flexDirection="row"
                            justifyContent="between"
                            alignItems="start"
                            className="mt-6"
                        >
                            <Summary
                                title="Discovery jobs"
                                className="mr-3"
                                summaries={jobs?.summaries?.filter(
                                    (v) =>
                                        v.type ===
                                        GithubComKaytuIoKaytuEnginePkgDescribeApiJobType.JobTypeDiscovery
                                )}
                            />
                            <Summary
                                title="Metrics jobs"
                                className="ml-3"
                                summaries={jobs?.summaries?.filter(
                                    (v) =>
                                        v.type ===
                                        GithubComKaytuIoKaytuEnginePkgDescribeApiJobType.JobTypeAnalytics
                                )}
                            />
                        </Flex>
                        <Flex
                            flexDirection="row"
                            justifyContent="between"
                            alignItems="start"
                            className="mt-6"
                        >
                            <Summary
                                title="Insight jobs"
                                className="mr-3"
                                summaries={jobs?.summaries?.filter(
                                    (v) =>
                                        v.type ===
                                        GithubComKaytuIoKaytuEnginePkgDescribeApiJobType.JobTypeInsight
                                )}
                            />
                            <Summary
                                title="Compliance jobs"
                                className="ml-3"
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
