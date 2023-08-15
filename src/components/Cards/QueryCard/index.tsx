import { Button, Card, Flex, Subtitle, Text, Title } from '@tremor/react'
import { PlayCircleIcon } from '@heroicons/react/24/outline'

interface IQueryCard {
    title: string | undefined
    description: string | undefined
    onClick: () => void
}

export default function QueryCard({ title, description, onClick }: IQueryCard) {
    return (
        <Card onClick={onClick} className="cursor-pointer">
            <Flex flexDirection="col" alignItems="start" className="h-full">
                <Flex flexDirection="col">
                    <Subtitle className="line-clamp-1 text-gray-600">
                        {title}
                    </Subtitle>
                    <Text className="line-clamp-3 mt-2 mb-3">
                        {description}
                    </Text>
                </Flex>
                <Button variant="light" icon={PlayCircleIcon} size="sm">
                    Use Query
                </Button>
            </Flex>
        </Card>
    )
}
