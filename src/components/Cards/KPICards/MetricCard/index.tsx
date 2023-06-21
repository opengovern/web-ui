import { Card, Metric, Text, Flex, BadgeDelta, DeltaType } from "@tremor/react"


type IProps = {
    title: string
    metric: string
    metricPrev: string
    deltaType: DeltaType
    delta: string
}
export default function CMBCard ({
    title,
    metric,
    deltaType,
    metricPrev,
    delta,
    ...props
}: IProps) {
    return(
        <Card key={title} {...props}>
            <Flex alignItems="start">
                <Text>{title}</Text>
                <BadgeDelta deltaType={deltaType}>{delta}</BadgeDelta>
            </Flex>
            <Flex justifyContent="start" alignItems="baseline" className="truncate space-x-3">
                <Metric>{metric}</Metric>
                <Text className="truncate">from {metricPrev}</Text>
            </Flex>
        </Card>
    )
}