import { Card, Flex, Icon, Text, Title } from '@tremor/react'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'

interface IGoalCard {
    title: string
}

export default function GoalCard({ title }: IGoalCard) {
    return (
        <Card className="w-fit">
            <Flex flexDirection="col" className="gap-3">
                <Icon icon={DocumentDuplicateIcon} size="lg" className="p-0" />
                <Text className="!text-lg whitespace-nowrap text-center">
                    {title}
                </Text>
            </Flex>
        </Card>
    )
}
