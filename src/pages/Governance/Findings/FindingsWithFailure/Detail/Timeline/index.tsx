import { Flex, Icon, Text, Title } from '@tremor/react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { severityBadge } from '../../../../Controls'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiGetSingleResourceFindingResponse } from '../../../../../../api/api'
import Spinner from '../../../../../../components/Spinner'
import {
    dateDisplay,
    dateTimeDisplay,
} from '../../../../../../utilities/dateDisplay'

dayjs.extend(relativeTime)

interface ITimeline {
    data:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetSingleResourceFindingResponse
        | undefined
    isLoading: boolean
}

export default function Timeline({ data, isLoading }: ITimeline) {
    return isLoading ? (
        <Spinner />
    ) : (
        <Flex
            flexDirection="col"
            justifyContent="start"
            alignItems="start"
            className="gap-10 relative"
        >
            <div
                className="absolute w-0.5 h-full bg-gray-200 z-10 top-1"
                style={{ left: 'calc(27% + 52px)' }}
            />
            {data?.findingEvents?.map((tl) => (
                <Flex alignItems="start" className="gap-6 z-20">
                    <Flex
                        flexDirection="col"
                        alignItems="end"
                        className="w-1/2"
                    >
                        <Title className="text-end line-clamp-1">
                            {dateTimeDisplay(tl.evaluatedAt)}
                        </Title>
                        <Text>about {dayjs(tl?.evaluatedAt).fromNow()}</Text>
                    </Flex>
                    <Icon
                        icon={
                            tl.conformanceStatus === 'failed'
                                ? XCircleIcon
                                : CheckCircleIcon
                        }
                        color={
                            tl.conformanceStatus === 'failed'
                                ? 'rose'
                                : 'emerald'
                        }
                        size="xl"
                        className="p-0"
                    />
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="gap-1"
                    >
                        <Title>{tl.controlID}</Title>
                        <Flex className="w-fit gap-4">
                            {severityBadge(tl.severity)}
                            <Text className="pl-4 border-l border-l-gray-200">
                                Section:
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
            ))}
        </Flex>
    )
}
