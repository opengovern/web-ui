import { Badge, Card, Flex, Icon, Text, Title } from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as AWSIcon } from '../../../icons/elements-supplemental-provider-logo-aws-original.svg'
import { ReactComponent as AzureIcon } from '../../../icons/elements-supplemental-provider-logo-azure-new.svg'
import { numericDisplay } from '../../../utilities/numericDisplay'

interface IConnectorCard {
    connector: string | undefined
    title: string | undefined
    status: any
    count: number | string | undefined
    description: string | undefined
}

const getConnectorIcon = (connector: any) => {
    if (connector === 'AWS')
        return <Icon icon={AWSIcon} size="md" variant="shadow" color="orange" />
    return <Icon icon={AzureIcon} size="md" variant="shadow" color="blue" />
}

const getBadgeColor = (status: any) => {
    if (status === 'enabled') {
        return 'green'
    }
    return 'rose'
}

export default function ConnectorCard({
    connector,
    title,
    status,
    count,
    description,
}: IConnectorCard) {
    const navigate = useNavigate()

    return (
        <Card
            key={connector}
            className="cursor-pointer"
            onClick={() => navigate(`connector/${connector}`)}
        >
            <Flex flexDirection="row" className="mb-3">
                {getConnectorIcon(connector)}
                <Badge color={getBadgeColor(status)}>{status}</Badge>
            </Flex>
            <Flex flexDirection="row" className="mb-1">
                <Title>{title}</Title>
                <Title>{numericDisplay(count)}</Title>
            </Flex>
            <Text>{description}</Text>
            <Flex flexDirection="row" justifyContent="end">
                <Icon icon={ChevronRightIcon} />
            </Flex>
        </Card>
    )
}
