import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import {
    Button,
    Card,
    Flex,
    List,
    ListItem,
    Metric,
    Subtitle,
    Text,
    Title,
} from '@tremor/react'
import { useAtomValue } from 'jotai'
import { SourceType } from '../../../api/api'
import { numericDisplay } from '../../../utilities/numericDisplay'
import Spinner from '../../Spinner'
import { getConnectorIcon } from '../ConnectorCard'
import { isDemoAtom } from '../../../store'

interface ITopListCard {
    title: string
    keyColumnTitle: string
    valueColumnTitle: string
    loading: boolean
    isPercentage?: boolean
    isPrice?: boolean
    items: {
        data: {
            name: string | undefined
            value: number | undefined
            connector?: SourceType[] | SourceType | undefined
            id?: string | undefined
        }[]
        total: number | undefined
    }
    url?: string
    type: 'service' | 'account'
    isClickable?: boolean
}

interface Item {
    name: string | undefined
    value: number | undefined
    connector?: SourceType[] | SourceType | undefined
    id?: string | undefined
    kaytuId?: string | undefined
}

export default function ListCard({
    title,
    keyColumnTitle,
    valueColumnTitle,
    loading,
    isPrice,
    isPercentage,
    items,
    url,
    type,
    isClickable = true,
}: ITopListCard) {
    const navigate = useNavigate()
    const isDemo = useAtomValue(isDemoAtom)

    const value = (item: Item) => {
        if (isPercentage) {
            return item.value
        }
        if (isPrice) {
            return `$${numericDisplay(item.value)}`
        }
        return numericDisplay(item.value)
    }

    return (
        <Card className="h-full">
            <Flex flexDirection="col" alignItems="start" className="h-full">
                <Flex flexDirection="col" alignItems="start">
                    <Title className="font-semibold mb-4">{title}</Title>
                    <Flex
                        alignItems="baseline"
                        justifyContent="between"
                        className="space-x-0 mb-2"
                    >
                        <Text className="font-medium px-1 text-gray-400 dark:text-gray-500">
                            {keyColumnTitle}
                        </Text>
                        <Text className="font-medium px-1 text-gray-400 dark:text-gray-500">
                            {valueColumnTitle}
                        </Text>
                    </Flex>
                    {loading ? (
                        <Flex className="h-56">
                            <Spinner />
                        </Flex>
                    ) : (
                        <List>
                            {items?.data.map((item: Item) => (
                                <ListItem
                                    key={item.name}
                                    className={`max-w-full p-1  rounded-md ${
                                        isClickable
                                            ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900'
                                            : ''
                                    } ${item.connector ? '' : 'py-3'}`}
                                    onClick={() =>
                                        isClickable
                                            ? navigate(
                                                  `${
                                                      type === 'account'
                                                          ? 'account_'
                                                          : 'metric_'
                                                  }${item.kaytuId}`
                                              )
                                            : undefined
                                    }
                                >
                                    <Flex className="py-1">
                                        <Flex
                                            justifyContent="start"
                                            className="w-4/5"
                                        >
                                            {item.connector &&
                                                (item.connector[0].length > 1
                                                    ? getConnectorIcon(
                                                          item.connector[0]
                                                      )
                                                    : getConnectorIcon(
                                                          String(item.connector)
                                                      ))}
                                            <Text
                                                className={
                                                    type === 'account' && isDemo
                                                        ? 'ml-1 truncate blur-md'
                                                        : 'ml-1 truncate'
                                                }
                                            >
                                                {item.name}
                                            </Text>
                                        </Flex>
                                        {item.value && (
                                            <Text className="ml-2 min-w-fit">
                                                {value(item)}
                                            </Text>
                                        )}
                                    </Flex>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Flex>
                <Flex
                    justifyContent="end"
                    className="cursor-pointer"
                    onClick={() => (url ? navigate(url) : null)}
                >
                    {(items.total || 0) - items.data.length > 0 && (
                        <Button
                            variant="light"
                            icon={ChevronRightIcon}
                            iconPosition="right"
                        >
                            {`+ ${numericDisplay(
                                (items.total || 0) - items.data.length
                            )} more`}
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Card>
    )
}
