import { Button, Card, Flex, List, ListItem, Text, Title } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import {
    exactPriceDisplay,
    numericDisplay,
} from '../../../utilities/numericDisplay'
import Spinner from '../../Spinner'
import { getConnectorIcon } from '../ConnectorCard'
import { SourceType } from '../../../api/api'

interface ITopListCard {
    accountsTitle: string
    accountsLoading: boolean
    accountsIsPercentage?: boolean
    accountsIsPrice?: boolean
    accounts: {
        data: {
            name: string | undefined
            value: number | undefined
            connector: SourceType | undefined
        }[]
        total: number | undefined
    }
    accountsUrl?: string
    servicesTitle: string
    servicesLoading: boolean
    servicesIsPercentage?: boolean
    servicesIsPrice?: boolean
    services: {
        data: {
            name: string | undefined
            value: number | undefined
            connector: SourceType[] | undefined
        }[]
        total: number | undefined
    }
    servicesUrl?: string
}

interface Item {
    name: string | undefined
    value: number | undefined
    connector?: SourceType[] | SourceType | undefined
}

export default function TopListCard({
    accountsTitle,
    accounts,
    accountsLoading,
    accountsIsPercentage = false,
    accountsIsPrice = false,
    servicesTitle,
    services,
    servicesLoading,
    servicesIsPercentage = false,
    servicesIsPrice = false,
    accountsUrl,
    servicesUrl,
}: ITopListCard) {
    const navigate = useNavigate()
    const value = (item: Item) => {
        if (accountsIsPercentage) {
            return item.value
        }
        if (accountsIsPrice) {
            return exactPriceDisplay(item.value)
        }
        return numericDisplay(item.value)
    }

    const value2 = (item: Item) => {
        if (servicesIsPercentage) {
            return item.value
        }
        if (servicesIsPrice) {
            return exactPriceDisplay(item.value)
        }
        return numericDisplay(item.value)
    }

    return (
        <Card className="h-full">
            <Flex className="h-full gap-8">
                <Flex flexDirection="col" alignItems="start" className="h-full">
                    <Flex flexDirection="col" alignItems="start">
                        <Title className="font-semibold mb-2">
                            {accountsTitle}
                        </Title>
                        {accountsLoading ? (
                            <Flex className="h-56">
                                <Spinner />
                            </Flex>
                        ) : (
                            <List>
                                {accounts?.data.map((item: Item) => (
                                    <ListItem>
                                        <Flex justifyContent="start">
                                            {item.connector &&
                                                item.connector[0] &&
                                                getConnectorIcon(
                                                    item.connector[0]
                                                )}
                                            <Text className="w-4/5 truncate">
                                                {item.name}
                                            </Text>
                                        </Flex>
                                        {item.value && (
                                            <Text>{value(item)}</Text>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Flex>
                    <Flex
                        justifyContent="end"
                        className="cursor-pointer"
                        onClick={() =>
                            accountsUrl ? navigate(accountsUrl) : null
                        }
                    >
                        {accounts && (
                            <Button
                                variant="light"
                                icon={ChevronRightIcon}
                                iconPosition="right"
                            >
                                {`+ ${numericDisplay(
                                    (accounts.total || 0) - 5
                                )} more`}
                            </Button>
                        )}
                    </Flex>
                </Flex>
                <Flex flexDirection="col" alignItems="start" className="h-full">
                    <Flex flexDirection="col" alignItems="start">
                        <Title className="font-semibold mb-2">
                            {servicesTitle}
                        </Title>
                        {servicesLoading ? (
                            <Flex className="h-56">
                                <Spinner />
                            </Flex>
                        ) : (
                            <List>
                                {services.data.map((item: Item) => (
                                    <ListItem>
                                        <Flex justifyContent="start">
                                            {item.connector &&
                                                getConnectorIcon(
                                                    String(item.connector)
                                                )}
                                            <Text className="w-4/5 truncate">
                                                {item.name}
                                            </Text>
                                        </Flex>
                                        {item.value && (
                                            <Text>{value2(item)}</Text>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Flex>
                    <Flex
                        justifyContent="end"
                        className="cursor-pointer"
                        onClick={() =>
                            servicesUrl ? navigate(servicesUrl) : null
                        }
                    >
                        {services && (
                            <Button
                                variant="light"
                                icon={ChevronRightIcon}
                                iconPosition="right"
                            >
                                {`+ ${numericDisplay(
                                    (services.total || 0) - 5
                                )} more`}
                            </Button>
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    )
}
