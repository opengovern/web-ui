import {
    Badge,
    BadgeDelta,
    Card,
    Color,
    Flex,
    Icon,
    Subtitle,
    Title,
} from '@tremor/react'
import {
    ChevronRightIcon,
    CloudIcon,
    ExclamationTriangleIcon,
    ListBulletIcon,
    ServerStackIcon,
    TagIcon,
} from '@heroicons/react/24/outline'
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
    personas: string[]
}

const iconGenerator = (t: string) => {
    let color: Color = 'slate'
    let icon = TagIcon
    if (t.includes('Issues') || t.includes('Risky')) {
        color = 'rose'
        icon = ExclamationTriangleIcon
    } else if (t.includes('Cloud')) {
        color = 'sky'
        icon = CloudIcon
    } else if (t.includes('Disks')) {
        color = 'indigo'
        icon = ServerStackIcon
    } else if (t.includes('Logging')) {
        color = 'amber'
        icon = ListBulletIcon
    }
    return { color, icon }
}

export default function InsightGroupCard({
    title,
    prevCount,
    count,
    description,
    personas,
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
                        <Icon
                            icon={iconGenerator(String(title)).icon}
                            color={iconGenerator(String(title)).color}
                            variant="light"
                            size="lg"
                        />
                        <BadgeDelta
                            deltaType={badgeTypeByDelta(prevCount, count)}
                        >
                            {`${percentageByChange(prevCount, count)} %`}
                        </BadgeDelta>
                    </Flex>
                    <Flex alignItems="start" className="mb-1">
                        <Title className="font-semibold truncate">
                            {title}
                        </Title>
                        <Title className="font-semibold">
                            {numericDisplay(count)}
                        </Title>
                    </Flex>
                    <Subtitle className="mb-2 line-clamp-2 h-12">
                        {description}
                    </Subtitle>
                    <Flex justifyContent="start" className="gap-3 flex-wrap">
                        {personas.map((p) => (
                            <Badge size="sm" color="sky">
                                {p}
                            </Badge>
                        ))}
                    </Flex>
                </Flex>
                <Flex justifyContent="end">
                    <Icon color="blue" icon={ChevronRightIcon} />
                </Flex>
            </Flex>
        </Card>
    )
}
