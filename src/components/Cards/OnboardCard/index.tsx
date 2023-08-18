import { Card, Flex, Metric, Text } from '@tremor/react'
import Spinner from '../../Spinner'
import { numericDisplay } from '../../../utilities/numericDisplay'
import Chart from '../../Chart'

interface IOnBoardCard {
    title: string
    healthy: number | undefined
    unhealthy: number | undefined
    loading: boolean
}

const chartData = (h: number | undefined, u: number | undefined) => {
    const data = []
    if (Number(h) && Number(u)) {
        data.push({ name: 'Healthy', value: h })
        data.push({ name: 'Unhealthy', value: u })
        data.push({
            value: Number(u) + Number(h),
            name: '',
            itemStyle: {
                color: 'none',
                decal: {
                    symbol: 'none',
                },
            },
            label: {
                show: false,
            },
        })
    }
    return data
}

export default function OnboardCard({
    title,
    healthy,
    unhealthy,
    loading,
}: IOnBoardCard) {
    return (
        <Card className="overflow-hidden">
            <Flex className="h-full">
                <Flex flexDirection="col" alignItems="start" className="w-fit">
                    <Text className="mb-1.5 whitespace-nowrap">{title}</Text>
                    {loading ? (
                        <div className="w-fit">
                            <Spinner />
                        </div>
                    ) : (
                        <Metric>
                            {numericDisplay((healthy || 0) + (unhealthy || 0))}
                        </Metric>
                    )}
                </Flex>
                <Flex
                    className={`max-h-[50px] relative ${
                        loading ? 'opacity-0' : ''
                    }`}
                >
                    <Chart
                        labels={[]}
                        chartData={chartData(healthy, unhealthy)}
                        chartType="half-doughnut"
                    />
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="absolute right-10 h-full w-fit"
                    >
                        <Flex justifyContent="start" className="gap-2.5 w-fit">
                            <div
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: '#C0D8F1' }}
                            />
                            <Text>Healthy</Text>
                        </Flex>
                        <Flex justifyContent="start" className="gap-2.5 w-fit">
                            <div
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: '#0D2239' }}
                            />
                            <Text>Unhealthy</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    )
}
