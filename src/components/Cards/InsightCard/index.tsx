import { BadgeDelta, Card, Flex, Subtitle, Text, Title } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { numericDisplay } from '../../../utilities/numericDisplay'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsight } from '../../../api/api'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../utilities/deltaType'
import { dateDisplay } from '../../../utilities/dateDisplay'
import { getConnectorIcon } from '../ConnectorCard'

interface IInsightsCard {
    metric: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight
}

const calculateTime = (inputData: string) => {
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
            <Text
                color="orange"
                className="w-full border-0 text-xs truncate max-w-full mb-1"
            >
                (Time period is not covered by insight)
            </Text>
        )
    }
    if (!met?.totalResultValue) {
        return (
            <Text
                color="orange"
                className="w-full border-0 text-xs truncate max-w-full mb-1"
            >
                (End value is not available)
            </Text>
        )
    }
    if (!met?.oldTotalResultValue) {
        return (
            <Text
                color="orange"
                className="w-full border-0 text-xs truncate max-w-full mb-1"
            >
                {`Data is available after ${dateDisplay(
                    met.firstOldResultDate
                )}`}
            </Text>
        )
    }
    return (
        <BadgeDelta
            deltaType={badgeTypeByDelta(
                met.oldTotalResultValue,
                met.totalResultValue
            )}
            className="cursor-pointer"
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
    const navigateToAssetsInsightsDetails = (id: number | undefined) => {
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
            <Flex flexDirection="col" alignItems="start" className="h-full">
                <Flex flexDirection="col" alignItems="start">
                    <Title className="font-semibold mb-2 truncate max-w-full">
                        {metric?.shortTitle}
                    </Title>
                    <Flex alignItems="end" className="mb-2">
                        <Flex alignItems="end" className="w-fit">
                            <Title className="font-semibold mr-1">
                                {metric?.totalResultValue
                                    ? numericDisplay(
                                          metric?.totalResultValue || 0
                                      )
                                    : 'N/A'}
                            </Title>
                            <Subtitle className="text-sm whitespace-nowrap mb-0.5 mr-1">
                                {`from ${
                                    metric?.oldTotalResultValue
                                        ? numericDisplay(
                                              metric?.oldTotalResultValue || 0
                                          )
                                        : 'N/A'
                                }`}
                            </Subtitle>
                        </Flex>
                        {generateBadge(metric)}
                    </Flex>
                </Flex>
                <Flex className="mt-3">
                    {getConnectorIcon(metric?.connector)}
                    <Text>
                        {calculateTime(
                            metric?.result?.at(0)?.executedAt || '0'
                        )}
                    </Text>
                </Flex>
            </Flex>
        </Card>
    )
}
