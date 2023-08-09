import { BadgeDelta, Card, DeltaType, Flex, Metric, Text } from '@tremor/react'

type IProps = {
    title?: string
    metric?: string
    metricPrev?: string
    deltaType?: DeltaType
    delta?: string
    onClick?: () => void
}

export default function CMBCard({
    title,
    metric,
    deltaType,
    metricPrev,
    delta,
    onClick,
    ...props
}: IProps) {
    return (
        <Card
            key={title}
            {...props}
            onClick={onClick}
            className={onClick ? 'cursor-pointer' : ''}
        >
            <Flex alignItems="start">
                {title && <Text className="truncate">{title}</Text>}
                {delta ? (
                    <BadgeDelta deltaType={deltaType}>{delta}%</BadgeDelta>
                ) : null}
            </Flex>
            <Flex
                justifyContent="start"
                alignItems="baseline"
                className="truncate space-x-3"
            >
                {metric && <Metric>{metric}</Metric>}
                {metricPrev && (
                    <Text className="truncate">from {metricPrev}</Text>
                )}
            </Flex>
        </Card>
    )
}
