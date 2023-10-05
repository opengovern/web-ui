import { Card, Flex, Text, Title } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsight } from '../../../api/api'
import { badgeDelta } from '../../../utilities/deltaType'
import { dateDisplay } from '../../../utilities/dateDisplay'
import { getConnectorIcon } from '../ConnectorCard'
import { numericDisplay } from '../../../utilities/numericDisplay'

interface IInsightsCard {
    metric: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight
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
                className="w-full border-0 text-xs truncate max-w-full"
            >
                (End value is not available)
            </Text>
        )
    }
    if (!met?.oldTotalResultValue) {
        return (
            <Text
                color="orange"
                className="w-full border-0 text-xs truncate max-w-full"
            >
                {`(Data is available after ${dateDisplay(
                    met.firstOldResultDate
                )})`}
            </Text>
        )
    }
    return badgeDelta(met.oldTotalResultValue, met.totalResultValue)
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
            <Flex justifyContent="start">
                {getConnectorIcon(metric?.connector)}
                <Title className="font-semibold mt-2 mb-3 truncate max-w-full">
                    {metric?.shortTitle}
                </Title>
            </Flex>
            <Flex>
                <Flex justifyContent="start" alignItems="end" className="gap-1">
                    <Title>{numericDisplay(metric.totalResultValue)}</Title>
                    <Text className="mb-0.5">
                        from {numericDisplay(metric.oldTotalResultValue)}
                    </Text>
                </Flex>
                {generateBadge(metric)}
            </Flex>
        </Card>
    )
}
