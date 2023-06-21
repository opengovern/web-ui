import {
    Card,
    Metric,
    Text,
    AreaChart,
    BadgeDelta,
    Flex,
    DeltaType
} from '@tremor/react'

type IProps = {
    title: string
    metric: string
    metricPrev?: string
    delta?: string
    deltaType?: DeltaType
    areaChartData?: any
    className?: string
}
export default function SummaryCard ({
    title,
    metric,
    metricPrev,
    delta,
    deltaType,
    areaChartData,
    className,
}: IProps) {
    return (
        <Card key={title} className={className}>
            <Flex alignItems="start">
                <Text>{title}</Text>
                {delta && <BadgeDelta deltaType={deltaType}>{delta}</BadgeDelta>}
            </Flex>
            <Flex className="space-x-3 truncate" justifyContent="start" alignItems="baseline">
                <Metric>{metric}</Metric>
                {metricPrev && <Text>from {metricPrev}</Text>}
            </Flex>
            <AreaChart
                className="mt-6 h-28"
                data={areaChartData}
                index="Month"
                categories={[title]}
                colors={["blue"]}
                showXAxis={true}
                showGridLines={false}
                startEndOnly={true}
                showYAxis={false}
                showLegend={false}
            />
        </Card>
    )
}
