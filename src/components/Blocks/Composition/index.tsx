import {
    BadgeDelta,
    Bold,
    Button,
    Card,
    DeltaType,
    Divider,
    DonutChart,
    Flex,
    List,
    ListItem,
    Metric,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { useState } from 'react'
import { ChartPieIcon } from '@heroicons/react/24/outline'
import { ArrowLongRightIcon } from '@heroicons/react/24/solid'
import dayjs from 'dayjs'
import { useInventoryApiV2ResourcesCompositionDetail } from '../../../api/inventory.gen'
import { numericDisplay } from '../../../utilities/numericDisplay'

interface StockData {
    name: string
    value: number
    performance: string
    deltaType: DeltaType
}

const stocks: StockData[] = [
    {
        name: 'Off Running AG',
        value: 10456,
        performance: '6.1%',
        deltaType: 'increase',
    },
    {
        name: 'Not Normal Inc.',
        value: 5789,
        performance: '1.2%',
        deltaType: 'moderateDecrease',
    },
    {
        name: 'Logibling Inc.',
        value: 4367,
        performance: '2.3%',
        deltaType: 'moderateIncrease',
    },
    {
        name: 'Raindrop Inc.',
        value: 3421,
        performance: '0.5%',
        deltaType: 'moderateDecrease',
    },
    {
        name: 'Mwatch Group',
        value: 1432,
        performance: '3.4%',
        deltaType: 'decrease',
    },
]

type IProps = {
    // key: string,
    top: number
    connector?: string
    connectionId?: string[]
    time?: any
}
export default function Composition({
    // key,
    top,
    connector,
    connectionId,
    time,
}: IProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const query = {
        top,
        ...(connector && { connector }),
        ...(connectionId && { connectionId }),
        ...(time.to && { time: dayjs(time.to).unix() }),
    }
    const { response: composition } =
        useInventoryApiV2ResourcesCompositionDetail('category', query)

    function compositionData(inputObject: any) {
        const outputArray = []

        if (!inputObject) {
            return [
                {
                    name: 'No data',
                    value: 0,
                },
            ]
        }
        // iterate over top_values
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const key in inputObject.top_values) {
            outputArray.push({
                name: key,
                value: inputObject.top_values[key],
            })
        }

        // add others key-value pair
        outputArray.push({
            name: 'others',
            value: inputObject.others,
        })

        return outputArray
    }

    return (
        <Card>
            <Flex
                className="space-x-8"
                justifyContent="between"
                alignItems="center"
            >
                <Title>Overview</Title>
                <span>
                    <TabGroup
                        index={selectedIndex}
                        onIndexChange={setSelectedIndex}
                    >
                        <TabList variant="solid">
                            <Tab icon={ChartPieIcon}>Chart</Tab>
                            {/* <Tab icon={Bars4Icon}>List</Tab> */}
                        </TabList>
                    </TabGroup>
                </span>
            </Flex>
            <Text className="mt-8">Total count</Text>
            <Metric>{numericDisplay(composition?.total_count)}</Metric>
            <Divider />
            <Text className="mt-8">
                <Bold>Resource Allocation</Bold>
            </Text>
            <Text>{composition?.total_value_count} Asset</Text>
            {selectedIndex === 0 ? (
                <DonutChart
                    data={compositionData(composition)}
                    showAnimation={false}
                    category="value"
                    index="name"
                    // valueFormatter={valueFormatter}
                    className="mt-6"
                />
            ) : (
                <>
                    <Flex className="mt-8" justifyContent="between">
                        <Text className="truncate">
                            <Bold>Stocks</Bold>
                        </Text>
                        <Text>Since transaction</Text>
                    </Flex>
                    <List className="mt-4">
                        {stocks.map((stock) => (
                            <ListItem key={stock.name}>
                                <Text>{stock.name}</Text>
                                <Flex
                                    justifyContent="end"
                                    className="space-x-2"
                                >
                                    <Text>
                                        ${' '}
                                        {Intl.NumberFormat('us')
                                            .format(stock.value)
                                            .toString()}
                                    </Text>
                                    <BadgeDelta
                                        deltaType={stock.deltaType}
                                        size="xs"
                                    >
                                        {stock.performance}
                                    </BadgeDelta>
                                </Flex>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
            <Flex className="mt-6 pt-4 border-t">
                <Button
                    size="xs"
                    variant="light"
                    icon={ArrowLongRightIcon}
                    iconPosition="right"
                >
                    View more
                </Button>
            </Flex>
        </Card>
    )
}
