import { BadgeDelta, Card, Flex, Subtitle, Text, Title } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { numericDisplay } from '../../../utilities/numericDisplay'

interface IInsightsCard {
    metric: any
}

const calculatePercent = (inputData: any) => {
    if (
        Number(inputData.oldTotalResultValue) &&
        Number(inputData.totalResultValue)
    ) {
        return (
            ((inputData.totalResultValue - inputData.oldTotalResultValue) /
                inputData.oldTotalResultValue) *
                100 || 0
        )
    }
    return 0
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

export default function InsightCard({ metric }: IInsightsCard) {
    const navigate = useNavigate()
    const navigateToAssetsInsightsDetails = (id: any) => {
        navigate(`${id}`)
    }
    return (
        <Card
            key={metric.id}
            className="cursor-pointer h-full"
            onClick={() => navigateToAssetsInsightsDetails(metric.id)}
        >
            <Flex
                flexDirection="col"
                alignItems="start"
                justifyContent="between"
                className="h-full"
            >
                <Flex flexDirection="col" alignItems="start">
                    <Title
                        color={metric?.connector === 'AWS' ? 'orange' : 'blue'}
                    >
                        {metric?.connector}
                    </Title>
                    <Title className="my-2">{metric?.shortTitle}</Title>
                    <Flex flexDirection="row" className="mb-2">
                        <Flex
                            flexDirection="row"
                            alignItems="end"
                            className="w-fit"
                        >
                            <Title className="mr-1">
                                {metric?.totalResultValue
                                    ? numericDisplay(
                                          metric?.totalResultValue || 0
                                      )
                                    : 'N/A'}
                            </Title>
                            <Subtitle>
                                {`from ${
                                    metric?.oldTotalResultValue
                                        ? numericDisplay(
                                              metric?.oldTotalResultValue || 0
                                          )
                                        : 'N/A'
                                }`}
                            </Subtitle>
                        </Flex>
                        <BadgeDelta
                            deltaType={
                                calculatePercent(metric) > 0
                                    ? 'moderateIncrease'
                                    : 'moderateDecrease'
                            }
                            className={`opacity-${
                                calculatePercent(metric) !== 0 ? 1 : 0
                            } cursor-pointer`}
                        >
                            {`${
                                calculatePercent(metric) > 0
                                    ? Math.ceil(calculatePercent(metric))
                                    : -1 * Math.floor(calculatePercent(metric))
                            }%`}
                        </BadgeDelta>
                    </Flex>
                    <Text>{metric?.description}</Text>
                </Flex>
                <Text className="mt-2">
                    {calculateTime(metric?.query?.updatedAt)}
                </Text>
            </Flex>
        </Card>
    )
}
