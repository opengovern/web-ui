import { Card, Flex, Icon, Title } from '@tremor/react'
import { BanknotesIcon } from '@heroicons/react/24/outline'

export default function Spend() {
    return (
        <Card className="h-full">
            <Flex justifyContent="start" className="mb-2">
                <Icon
                    icon={BanknotesIcon}
                    className="bg-gray-50 rounded mr-2"
                />
                <Title>Spend</Title>
            </Flex>
        </Card>
    )
}
