import { BadgeDelta, Card, Flex, Icon, Subtitle, Title } from '@tremor/react'
import { ChevronRightIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../utilities/deltaType'
import { numericDisplay } from '../../../utilities/numericDisplay'

interface IConnectorCard {
    title: string | undefined
    description: string | undefined
    prevCount: number | undefined
    count: number | undefined
    id: string | number | undefined
}

export default function InsightGroupCard({
    title,
    prevCount,
    count,
    description,
    id,
}: IConnectorCard) {
    const navigate = useNavigate()

    return (
        <Card
            key={title}
            className="cursor-pointer"
            onClick={() => navigate(`${id}`)}
        >
            <Flex flexDirection="col" alignItems="start" className="h-full">
                <Flex flexDirection="col" alignItems="start" className="h-fit">
                    <Flex className="mb-3">
                        <Flex className="bg-kaytu-200 rounded-full h-10 w-10 p-2">
                            <ListBulletIcon className="text-kaytu-500" />
                        </Flex>
                        <BadgeDelta
                            deltaType={badgeTypeByDelta(prevCount, count)}
                        >
                            {`${percentageByChange(prevCount, count)} %`}
                        </BadgeDelta>
                    </Flex>
                    <Flex alignItems="start" className="mb-1">
                        <Title className="font-semibold">{title}</Title>
                        <Title className="font-semibold">
                            {numericDisplay(count)}
                        </Title>
                    </Flex>
                    <Subtitle>{description}</Subtitle>
                </Flex>
                <Flex justifyContent="end">
                    <Icon color="blue" icon={ChevronRightIcon} />
                </Flex>
            </Flex>
        </Card>
    )
}
