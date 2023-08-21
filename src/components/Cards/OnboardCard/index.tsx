import { Card, CategoryBar, Flex, Metric, Text } from '@tremor/react'
import Spinner from '../../Spinner'
import { numericDisplay } from '../../../utilities/numericDisplay'

interface IOnBoardCard {
    title: string
    healthy: number | undefined
    unhealthy: number | undefined
    loading: boolean
    allCount: number | undefined
}

export default function OnboardCard({
    title,
    healthy,
    unhealthy,
    allCount,
    loading,
}: IOnBoardCard) {
    const onBoarded = (healthy || 0) + (unhealthy || 0)
    return (
        <Card className="overflow-hidden">
            <Flex flexDirection="col" alignItems="start" className="w-fit">
                <Text className="mb-1.5 whitespace-nowrap">{title}</Text>
                {loading ? (
                    <div className="w-fit">
                        <Spinner />
                    </div>
                ) : (
                    <Metric>{numericDisplay(allCount || 0)}</Metric>
                )}
            </Flex>
            <CategoryBar
                className="w-full mt-4 mb-2"
                values={[
                    (((allCount || 0) - onBoarded) / (allCount || 1)) * 100 ||
                        0,
                    ((unhealthy || 0) / (allCount || 1)) * 100 || 0,
                    ((healthy || 0) / (allCount || 1)) * 100 || 0,
                ]}
                markerValue={101 - ((healthy || 0) / (allCount || 1)) * 100}
                showLabels={false}
                colors={['slate', 'amber', 'emerald']}
            />
            <Flex justifyContent="start" className="gap-4">
                <Flex className="gap-2.5 w-fit">
                    <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: '#64748b' }}
                    />
                    <Text>In progress</Text>
                </Flex>
                <Flex className="gap-2.5 w-fit">
                    <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: '#f59e0b' }}
                    />
                    <Text>Unhealthy</Text>
                </Flex>
                <Flex className="gap-2.5 w-fit">
                    <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: '#10b981' }}
                    />
                    <Text>Healthy</Text>
                </Flex>
            </Flex>
        </Card>
    )
}
