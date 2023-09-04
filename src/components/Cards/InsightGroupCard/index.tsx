import { BadgeDelta, Card, Flex, Icon, Subtitle, Title } from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../utilities/deltaType'

interface IConnectorCard {
    title: string | undefined
    description: string | undefined
    prevCount: number | undefined
    count: number | undefined
}

export default function InsightGroupCard({
    title,
    prevCount,
    count,
    description,
}: IConnectorCard) {
    const navigate = useNavigate()

    return (
        <Card
            key={title}
            className="cursor-pointer"
            // onClick={() => navigate(`${connector}`)}
        >
            <Flex flexDirection="col" alignItems="start" className="h-full">
                <Flex flexDirection="col" alignItems="start" className="h-fit">
                    <Flex className="mb-3">
                        <div className="bg-gray-300 rounded-full h-10 w-10">
                            .
                        </div>
                        <BadgeDelta
                            deltaType={badgeTypeByDelta(prevCount, count)}
                        >
                            {`${percentageByChange(prevCount, count)} %`}
                        </BadgeDelta>
                    </Flex>
                    <Title className="font-semibold mb-1">{title}</Title>
                    <Subtitle>{description}</Subtitle>
                </Flex>
                <Flex justifyContent="end">
                    <Icon color="blue" icon={ChevronRightIcon} />
                </Flex>
            </Flex>
        </Card>
    )
}
