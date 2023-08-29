import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Flex, List, ListItem, Text, Title } from '@tremor/react'
import { useAtomValue } from 'jotai'
import clipboardCopy from 'clipboard-copy'
import dayjs from 'dayjs'
import { maskPassword } from 'maskdata'
import { SourceType } from '../../../api/api'
import { numericDisplay } from '../../../utilities/numericDisplay'
import Spinner from '../../Spinner'
import { getConnectorIcon } from '../ConnectorCard'
import { spendTimeAtom, timeAtom } from '../../../store'
import { dateDisplay } from '../../../utilities/dateDisplay'
import { isDemo } from '../../../utilities/demo'
import { maskStringConfig } from '../../../utilities/maskConfig'

interface ITopListCard {
    title: string
    loading: boolean
    isPercentage?: boolean
    isPrice?: boolean
    items: {
        data: {
            name: string | undefined
            value: number | undefined
            connector: SourceType[] | SourceType | undefined
            id?: string | undefined
        }[]
        total: number | undefined
    }
    url?: string
    type: 'service' | 'account'
}

interface Item {
    name: string | undefined
    value: number | undefined
    connector?: SourceType[] | SourceType | undefined
    id?: string | undefined
}

export default function ListCard({
    title,
    loading,
    isPrice,
    isPercentage,
    items,
    url,
    type,
}: ITopListCard) {
    const navigate = useNavigate()
    const isSpend = window.location.pathname.split('/')[2] === 'spend'
    const activeTimeRange = useAtomValue(isSpend ? spendTimeAtom : timeAtom)

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
                    <Title className="font-semibold mb-2">{title}</Title>
                    {loading ? (
                        <Flex className="h-56">
                            <Spinner />
                        </Flex>
                    ) : (
                        <List>
                            {items?.data.map((item: Item) => (
                                <div
                                    key={item.name}
                                    className={`group relative ${
                                        type === 'account'
                                            ? 'cursor-pointer'
                                            : ''
                                    }`}
                                >
                                    {type === 'account' && (
                                        <Flex
                                            onClick={() =>
                                                clipboardCopy(
                                                    `{connector: ${
                                                        item.connector
                                                    }\nname: ${
                                                        item.name
                                                    },\nid: ${item.id}\n${
                                                        isSpend
                                                            ? 'cost:'
                                                            : 'resources:'
                                                    } ${value(item)}\n${
                                                        isSpend
                                                            ? 'timePeriod:'
                                                            : 'date:'
                                                    } ${
                                                        isSpend
                                                            ? `${dateDisplay(
                                                                  dayjs(
                                                                      activeTimeRange.start
                                                                  )
                                                              )} - ${dateDisplay(
                                                                  dayjs(
                                                                      activeTimeRange.end
                                                                  )
                                                              )}`
                                                            : dateDisplay(
                                                                  dayjs(
                                                                      activeTimeRange.end
                                                                  )
                                                              )
                                                    }}`
                                                ).then(() => alert('Copied!'))
                                            }
                                            className="absolute invisible bottom-0 left-0 group-hover:visible w-full h-full bg-white text-black"
                                        >
                                            <Flex
                                                flexDirection="col"
                                                alignItems="start"
                                            >
                                                <Text className="text-gray-800">
                                                    {isDemo()
                                                        ? maskPassword(
                                                              item.name
                                                          )
                                                        : item.name}
                                                </Text>
                                                <Text className="truncate">
                                                    id:{' '}
                                                    {isDemo()
                                                        ? maskPassword(item.id)
                                                        : item.id}
                                                </Text>
                                            </Flex>
                                            {item.value && (
                                                <Text>{value(item)}</Text>
                                            )}
                                        </Flex>
                                    )}
                                    <ListItem>
                                        <Flex justifyContent="start">
                                            {item.connector &&
                                                (item.connector[0].length > 1
                                                    ? getConnectorIcon(
                                                          item.connector[0]
                                                      )
                                                    : getConnectorIcon(
                                                          String(item.connector)
                                                      ))}
                                            <Text className="w-4/5 truncate">
                                                {type === 'account' && isDemo()
                                                    ? maskPassword(
                                                          item.name,
                                                          maskStringConfig
                                                      )
                                                    : item.name}
                                            </Text>
                                        </Flex>
                                        {item.value && (
                                            <Text>{value(item)}</Text>
                                        )}
                                    </ListItem>
                                </div>
                            ))}
                        </List>
                    )}
                </Flex>
                <Flex
                    justifyContent="end"
                    className="cursor-pointer"
                    onClick={() => (url ? navigate(url) : null)}
                >
                    {!!items.total && (
                        <Button
                            variant="light"
                            icon={ChevronRightIcon}
                            iconPosition="right"
                        >
                            {`+ ${numericDisplay((items.total || 0) - 5)} more`}
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Card>
    )
}
