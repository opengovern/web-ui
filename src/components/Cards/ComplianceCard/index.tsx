import { Card, Flex } from '@tremor/react'

interface IComplianceCard {
    benchmark: any
}

export default function ComplianceCard({ benchmark }: IComplianceCard) {
    return (
        <Card>
            <Flex flexDirection="col" alignItems="center">
                hi
            </Flex>
        </Card>
    )
}
