import {
    ChevronRightIcon,
    ChevronUpIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline'
import {
    Flex,
    Button,
    ProgressCircle,
    Badge,
    Text,
    Title,
    Metric,
    Icon,
    Subtitle,
} from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import BadgeDeltaSimple from '../../ChangeDeltaSimple'

interface IScoreCategoryCard {
    title: string
    value: number
    change: number
    category: string
}

export default function ScoreCategoryCard({
    title,
    value,
    change,
    category,
}: IScoreCategoryCard) {
    const navigate = useNavigate()
    const workspace = useParams<{ ws: string }>().ws

    let color = 'blue'
    if (value >= 75) {
        color = 'emerald'
    } else if (value >= 50 && value < 75) {
        color = 'lime'
    } else if (value >= 25 && value < 50) {
        color = 'yellow'
    } else if (value >= 0 && value < 25) {
        color = 'red'
    }

    return (
        <Flex
            onClick={() =>
                navigate(`/${workspace}/insights?category=${category}`)
            }
            className="gap-6 px-8 py-8 bg-white rounded-xl shadow-sm hover:shadow-md hover:cursor-pointer"
        >
            <Flex className="relative w-fit">
                <ProgressCircle color={color} value={value} size="md">
                    <Subtitle>{value}%</Subtitle>
                </ProgressCircle>
            </Flex>

            <Flex alignItems="start" flexDirection="col" className="gap-1">
                <Title className="text-xl">{title}</Title>
                <BadgeDeltaSimple change={change}>
                    from previous time period
                </BadgeDeltaSimple>
            </Flex>
            <Icon size="md" icon={ChevronRightIcon} />
        </Flex>
    )
}
