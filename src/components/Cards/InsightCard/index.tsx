import {
    BadgeDelta,
    Callout,
    Card,
    Flex,
    Subtitle,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import dayjs from 'dayjs'
import { numericDisplay } from '../../../utilities/numericDisplay'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsight } from '../../../api/api'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../utilities/deltaType'
import { AWSIcon, AzureIcon } from '../../../icons/icons'

interface IInsightsCard {
    metric: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight
}

const calculateTime = (inputData: any) => {
    if (inputData) {
        const date = Date.parse(inputData) / 1000
        const now = Date.now() / 1000
        const exeAt = Math.floor(now - date)
        if (exeAt < 60) {
            return `updated ${exeAt}s ago`
        }
        if (exeAt < 3600) {
            return `updated ${Math.floor(exeAt / 60)}m ago`
        }
        if (exeAt < 86400) {
            return `updated ${Math.floor(exeAt / 3600)}h ago`
        }
        return `updated ${Math.floor(exeAt / 86400)}d ago`
    }
    return ''
}

const generateBadge = (
    met: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight
) => {
    if (!met?.totalResultValue && !met?.oldTotalResultValue) {
        return (
            <Callout
                title="Time period is not covered by insight"
                color="rose"
                icon={ExclamationCircleIcon}
                className="w-full border-0 text-xs leading-5 truncate max-w-full"
            />
        )
    }
    if (!met?.totalResultValue) {
        return (
            <Callout
                title="End value is not available"
                color="rose"
                icon={ExclamationCircleIcon}
                className="border-0 text-xs leading-5 truncate max-w-full"
            />
        )
    }
    if (!met?.oldTotalResultValue) {
        return (
            <Callout
                title={`Data is available after ${dayjs(
                    met.firstOldResultDate
                ).format('MMM DD, YYYY')}`}
                color="rose"
                icon={ExclamationCircleIcon}
                className="border-0 text-xs leading-5 truncate max-w-full"
            />
        )
    }
    return (
        <BadgeDelta
            deltaType={badgeTypeByDelta(
                met.oldTotalResultValue,
                met.totalResultValue
            )}
            className="cursor-pointer my-2"
        >
            {`${percentageByChange(
                met.oldTotalResultValue,
                met.totalResultValue
            )}%`}
        </BadgeDelta>
    )
}

export default function InsightCard({ metric }: IInsightsCard) {
    const navigate = useNavigate()
    const navigateToAssetsInsightsDetails = (id: any) => {
        navigate(`${id}`)
    }
    return (
        <Card
            key={metric.id}
            className={`${
                metric?.totalResultValue || metric?.oldTotalResultValue
                    ? 'cursor-pointer'
                    : ''
            } h-full`}
            onClick={() =>
                (metric?.totalResultValue || metric?.oldTotalResultValue) &&
                navigateToAssetsInsightsDetails(metric.id)
            }
        >
            <Flex
                flexDirection="col"
                alignItems="start"
                justifyContent="between"
                className="h-full"
            >
                <Flex flexDirection="col" alignItems="start">
                    <Title className="mb-2 truncate max-w-full">
                        {metric?.shortTitle}
                    </Title>
                    <Flex className="mb-2">
                        <Flex
                            flexDirection="row"
                            alignItems="end"
                            className="w-fit"
                        >
                            {!!metric?.totalResultValue && (
                                <Title className="mr-1">
                                    {numericDisplay(
                                        metric?.totalResultValue || 0
                                    )}
                                </Title>
                            )}
                            {!!metric?.oldTotalResultValue && (
                                <Subtitle className="text-sm mb-0.5">
                                    {`from ${numericDisplay(
                                        metric?.oldTotalResultValue || 0
                                    )}`}
                                </Subtitle>
                            )}
                        </Flex>
                        {generateBadge(metric)}
                    </Flex>
                    <Text>{metric?.description}</Text>
                </Flex>
                <Flex className="mt-3">
                    {metric?.connector === 'AWS' ? <AWSIcon /> : <AzureIcon />}
                    <Text>
                        {calculateTime(metric?.result?.at(0)?.executedAt || 0)}
                    </Text>
                </Flex>
            </Flex>
        </Card>
    )
}
