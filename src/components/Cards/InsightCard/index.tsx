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

const generateBadge = (met: any) => {
    if (!met?.totalResultValue && !met?.oldTotalResultValue) {
        return (
            <Callout
                title="Time period is not covered by insight"
                color="red"
                icon={ExclamationCircleIcon}
                className="w-full border-0 text-xs leading-5 truncate max-w-full"
            />
        )
    }
    if (!met?.totalResultValue) {
        return (
            <Callout
                title="End value is not available"
                color="red"
                icon={ExclamationCircleIcon}
                className="border-0 text-xs leading-5 truncate max-w-full"
            />
        )
    }
    if (!met?.oldTotalResultValue) {
        return (
            <Callout
                title="Prior value is not available"
                color="red"
                icon={ExclamationCircleIcon}
                className="border-0 text-xs leading-5 truncate max-w-full"
            />
        )
    }
    return (
        <BadgeDelta
            deltaType={
                calculatePercent(met) > 0
                    ? 'moderateIncrease'
                    : 'moderateDecrease'
            }
            className={`opacity-${
                calculatePercent(met) !== 0 ? 1 : 0
            } cursor-pointer my-2`}
        >
            {`${
                calculatePercent(met) > 0
                    ? Math.ceil(calculatePercent(met))
                    : -1 * Math.floor(calculatePercent(met))
            }%`}
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
                    <Title
                        color={metric?.connector === 'AWS' ? 'orange' : 'blue'}
                    >
                        {metric?.connector}
                    </Title>
                    <Title className="my-2 truncate max-w-full">
                        {metric?.shortTitle}
                    </Title>
                    <Flex flexDirection="row" className="mb-2">
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
                                    {`Prior value: ${numericDisplay(
                                        metric?.oldTotalResultValue || 0
                                    )}`}
                                </Subtitle>
                            )}
                        </Flex>
                        {generateBadge(metric)}
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
