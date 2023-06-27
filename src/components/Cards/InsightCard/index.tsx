import {
    BadgeDelta,
    Card,
    Flex,
    Icon,
    Metric,
    Subtitle,
    Text,
    Title,
} from '@tremor/react'
import { numericDisplay } from '../../../utilities/numericDisplay'
import { ReactComponent as AWSIcon } from '../../../assets/icons/elements-supplemental-provider-logo-aws-original.svg'
import { ReactComponent as CloudIcon } from '../../../assets/icons/icon-cloud.svg'

interface IInsightsCard {
    metric: any
    onClick?: () => void
    showTitle?: boolean
    showDetails?: boolean
    showRefresh?: boolean
    showIcon?: boolean
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
    try {
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
    } catch (error) {
        return null
    }
}

const getProviderIcon = (provider: string) => {
    switch (true) {
        case provider === 'AWS':
            return <Icon icon={AWSIcon} size="xl" />
        case provider === 'Azure':
            return <Icon icon={AWSIcon} size="xl" />

        default:
            return <Icon icon={CloudIcon} size="xl" />
    }
}

export default function InsightCard({
    metric,
    showTitle = false,
    showDetails = false,
    showRefresh = false,
    showIcon = false,
    onClick,
}: IInsightsCard) {
    return (
        <Card key={metric}>
            <Flex>
                <Flex flexDirection="row" justifyContent="between">
                    <Flex>
                        <Flex flexDirection="row" alignItems="end">
                            <Metric>
                                {numericDisplay(metric?.totalResultValue || 0)}
                            </Metric>
                            <Subtitle className="truncate">
                                from{' '}
                                {numericDisplay(
                                    metric?.oldTotalResultValue || 0
                                )}
                            </Subtitle>
                        </Flex>
                        <BadgeDelta
                            deltaType={
                                calculatePercent(metric) > 0
                                    ? 'moderateIncrease'
                                    : 'moderateDecrease'
                            }
                        >
                            {calculatePercent(metric) > 0
                                ? Math.ceil(calculatePercent(metric))
                                : -1 * Math.floor(calculatePercent(metric))}
                        </BadgeDelta>
                    </Flex>
                    {showIcon && getProviderIcon(metric?.connector)}
                </Flex>
                {showTitle && <Title>{metric?.shortTitle}</Title>}
                {showDetails && <Text>{metric?.description}</Text>}
                <Subtitle>{calculateTime(metric?.query.updatedAt)}</Subtitle>
            </Flex>
        </Card>
    )
}
