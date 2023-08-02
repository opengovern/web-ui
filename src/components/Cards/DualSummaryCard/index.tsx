import { Card, Flex, Metric, Text } from '@tremor/react'
import Spinner from '../../Spinner'

type IProps = {
    title1: string
    title2: string
    metric1: string | number
    metric2: string | number
    loading?: boolean
}
export default function DualSummaryCard({
    title1,
    metric1,
    title2,
    metric2,
    loading = false,
}: IProps) {
    return (
        <Card key={title1 + title2} className="h-full">
            {loading ? (
                <div className="flex justify-center items-center h-14">
                    <Spinner />
                </div>
            ) : (
                <Flex className="gap-2 h-full">
                    <Flex flexDirection="col" alignItems="start">
                        <Text>{title1}</Text>
                        <Metric>{metric1}</Metric>
                    </Flex>
                    <div className="h-full w-0.5 border-l border-gray-200" />
                    <Flex flexDirection="col" alignItems="start">
                        <Text>{title2}</Text>
                        <Metric>{metric2}</Metric>
                    </Flex>
                </Flex>
            )}
        </Card>
    )
}
