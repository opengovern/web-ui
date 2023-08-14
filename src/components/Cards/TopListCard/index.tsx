import { JSXElementConstructor, Key, ReactElement, ReactNode } from 'react'
import { Button, Card, Flex, List, ListItem, Text, Title } from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
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
    count?: number
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
    count = 5,
}: ITopListCard) {
    const value = (item: Item) => {
        if (isPercentage) {
            return item.value
        }
        if (isPrice) {
            return exactPriceDisplay(item.value)
        }
        return numericDisplay(item.value)
    }

    return loading ? (
        <Card>
            <Flex className="h-56">
                <Spinner />
            </Flex>
        </Card>
    ) : (
        <Card className="h-full">
            <Flex flexDirection="col" alignItems="start" className="h-full">
                <Flex flexDirection="col" alignItems="start">
                    <Title className="font-semibold">{title}</Title>
                    <List>
                        {data?.map(
                            (item: Item, i: number) =>
                                i < count && (
                                    <ListItem
                                        className={`${i === 0 && 'pt-4'}`}
                                    >
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
                </Flex>
                <Flex justifyContent="end">
                    <Button
                        variant="light"
                        icon={ChevronRightIcon}
                        iconPosition="right"
                    >
                        See more
                    </Button>
                </Flex>
            </Flex>
        </Card>
    )
}
