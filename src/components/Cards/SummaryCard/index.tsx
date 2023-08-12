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
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../Spinner'

type IProps = {
    title: string
    metric: string | number
    metricPrev?: string
    delta?: string
    deltaType?: DeltaType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    areaChartData?: any[]
    url?: string
    loading?: boolean
    border?: boolean
}

export default function SummaryCard({
    title,
    metric,
    metricPrev,
    delta,
    deltaType,
    areaChartData,
    url,
    loading = false,
    border = true,
}: IProps) {
    const navigate = useNavigate()

    return (
        <Card
            key={title}
            onClick={() => (url ? navigate(url) : null)}
            className={`${border ? '' : 'ring-0 shadow-transparent p-0'} ${
                url ? 'cursor-pointer' : ''
            }`}
        >
            {loading ? (
                <div className="flex justify-center items-center h-14">
                    <Spinner />
                </div>
            ) : (
                <>
                    <Flex alignItems="start">
                        <Text className="mb-1.5">{title}</Text>
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
                            {url && (
                                <Button
                                    size="xs"
                                    variant="light"
                                    icon={ChevronRightIcon}
                                    iconPosition="right"
                                >
                                    See more
                                </Button>
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
