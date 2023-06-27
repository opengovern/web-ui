import {
    AreaChart,
    BadgeDelta,
    Button,
    Card,
    DeltaType,
    Flex,
    Metric,
    Text,
} from '@tremor/react'
import { ArrowLongRightIcon } from '@heroicons/react/24/solid'

type IProps = {
    title: string
    metric: string
    metricPrev?: string
    delta?: string
    deltaType?: DeltaType
    areaChartData?: any
    className?: string
    viewMore?: boolean
    onClick?: () => void
}
export default function SummaryCard({
    title,
    metric,
    metricPrev,
    delta,
    deltaType,
    areaChartData,
    className,
    viewMore,
    onClick,
}: IProps) {
    return (
        <Card key={title} className={className}>
            <Flex alignItems="start">
                <Text>{title}</Text>
                {delta && (
                    <BadgeDelta deltaType={deltaType}>{delta}</BadgeDelta>
                )}
            </Flex>
            <Flex
                className="space-x-3 truncate"
                justifyContent="start"
                alignItems="baseline"
            >
                <Metric>{metric}</Metric>
                {metricPrev && <Text>from {metricPrev}</Text>}
            </Flex>
            {areaChartData && (
                <AreaChart
                    className="mt-6 h-28"
                    data={areaChartData}
                    index="Month"
                    categories={[title]}
                    colors={['blue']}
                    showXAxis
                    showGridLines={false}
                    startEndOnly
                    showYAxis={false}
                    showLegend={false}
                />
            )}
            {viewMore && (
                <Flex className="mt-6 pt-4 border-t">
                    {onClick ? (
                        <Button
                            size="xs"
                            variant="light"
                            icon={ArrowLongRightIcon}
                            iconPosition="right"
                            onClick={onClick}
                        >
                            View more
                        </Button>
                    ) : (
                        <div className="text-sm text-blue-500 mt-4" />
                    )}
                    <Button
                        size="xs"
                        variant="light"
                        icon={ArrowLongRightIcon}
                        iconPosition="right"
                        onClick={onClick}
                    >
                        View more
                    </Button>
                </Flex>
            )}
        </Card>
    )
}
