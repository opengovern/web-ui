import { JSXElementConstructor, Key, ReactElement, ReactNode } from 'react'
import { Button, Card, Flex, List, ListItem, Text, Title } from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import {
    exactPriceDisplay,
    numericDisplay,
} from '../../../utilities/numericDisplay'
import Spinner from '../../Spinner'

interface ITopListCard {
    title: string
    loading: boolean
    isPercentage?: boolean
    isPrice?: boolean
    data: any
    title2?: string
    loading2?: boolean
    isPercentage2?: boolean
    isPrice2?: boolean
    data2?: any
    count?: number
    url?: string
    url2?: string
    columns?: number
}

interface Item {
    name:
        | boolean
        | Key
        | ReactElement<any, string | JSXElementConstructor<any>>
        | Iterable<ReactNode>
        | null
        | undefined
    value: string | number | undefined
}

export default function TopListCard({
    title,
    data,
    loading,
    isPercentage = false,
    isPrice = false,
    title2,
    data2,
    loading2,
    isPercentage2 = false,
    isPrice2 = false,
    count = 5,
    url,
    url2,
    columns = 1,
}: ITopListCard) {
    const navigate = useNavigate()
    const value = (item: Item) => {
        if (isPercentage) {
            return item.value
        }
        if (isPrice) {
            return exactPriceDisplay(item.value)
        }
        return numericDisplay(item.value)
    }

    const value2 = (item: Item) => {
        if (isPercentage2) {
            return item.value
        }
        if (isPrice2) {
            return exactPriceDisplay(item.value)
        }
        return numericDisplay(item.value)
    }

    return (
        <Card className="h-full">
            <Flex className="h-full gap-8">
                <Flex flexDirection="col" alignItems="start" className="h-full">
                    <Flex flexDirection="col" alignItems="start">
                        <Title className="font-semibold mb-2">{title}</Title>
                        {loading ? (
                            <Flex className="h-56">
                                <Spinner />
                            </Flex>
                        ) : (
                            <List>
                                {data?.map(
                                    (item: Item, i: number) =>
                                        i < count && (
                                            <ListItem className="py-3">
                                                <Text className="w-4/5 truncate">
                                                    {item.name}
                                                </Text>
                                                {item.value && (
                                                    <Text>{value(item)}</Text>
                                                )}
                                            </ListItem>
                                        )
                                )}
                            </List>
                        )}
                    </Flex>
                    <Flex
                        justifyContent="end"
                        className="cursor-pointer"
                        onClick={() => (url ? navigate(url) : null)}
                    >
                        <Button
                            variant="light"
                            icon={ChevronRightIcon}
                            iconPosition="right"
                        >
                            See more
                        </Button>
                    </Flex>
                </Flex>
                {columns > 1 && (
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="h-full"
                    >
                        <Flex flexDirection="col" alignItems="start">
                            <Title className="font-semibold mb-2">
                                {title2}
                            </Title>
                            {loading2 ? (
                                <Flex className="h-56">
                                    <Spinner />
                                </Flex>
                            ) : (
                                <List>
                                    {data2?.map(
                                        (item: Item, i: number) =>
                                            i < count && (
                                                <ListItem className="py-3">
                                                    <Text className="w-4/5 truncate">
                                                        {item.name}
                                                    </Text>
                                                    {item.value && (
                                                        <Text>
                                                            {value2(item)}
                                                        </Text>
                                                    )}
                                                </ListItem>
                                            )
                                    )}
                                </List>
                            )}
                        </Flex>
                        <Flex
                            justifyContent="end"
                            className="cursor-pointer"
                            onClick={() => (url2 ? navigate(url2) : null)}
                        >
                            <Button
                                variant="light"
                                icon={ChevronRightIcon}
                                iconPosition="right"
                            >
                                See more
                            </Button>
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </Card>
    )
}
