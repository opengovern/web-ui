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
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import React from 'react'
import Spinner from '../../Spinner'

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
    loading?: boolean
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
    loading = false,
}: IProps) {
    return (
        <Card key={title} className={className}>
            {loading ? (
                <div className="flex justify-center items-center h-[10vh]">
                    <Spinner />
                </div>
            ) : (
                <>
                    <Flex alignItems="start">
                        <Text>{title}</Text>
                        {delta && (
                            <BadgeDelta deltaType={deltaType}>
                                {delta}
                            </BadgeDelta>
                        )}
                    </Flex>
                    <Flex
                        className="space-x-3 truncate"
                        justifyContent="between"
                        alignItems="baseline"
                    >
                        <div className="flex flex-row items-baseline space-x-3">
                            <Metric>{metric}</Metric>
                            {metricPrev && <Text>from {metricPrev}</Text>}
                        </div>
                        <div className="justify-self-end">
                            {viewMore && (
                                <Flex>
                                    {onClick ? (
                                        <Button
                                            size="xs"
                                            variant="light"
                                            icon={ChevronRightIcon}
                                            iconPosition="right"
                                            onClick={onClick}
                                        >
                                            See more
                                        </Button>
                                    ) : (
                                        <div className="text-sm text-blue-500 mt-4" />
                                    )}
                                </Flex>
                            )}
                        </div>
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
                </>
            )}
        </Card>
    )
}
