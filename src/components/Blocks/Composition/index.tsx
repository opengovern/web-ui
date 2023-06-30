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
import { useEffect, useState } from 'react'
import { ChartPieIcon } from '@heroicons/react/24/outline'
import { ArrowLongRightIcon } from '@heroicons/react/24/solid'
import dayjs from 'dayjs'
import { useInventoryApiV2ResourcesCompositionDetail } from '../../../api/inventory.gen'
import { numericDisplay } from '../../../utilities/numericDisplay'
import Spinner from '../../Spinner'

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
    const { response: composition, isLoading } =
        useInventoryApiV2ResourcesCompositionDetail('category', query)

    function compositionData(inputObject: any, oldData: number) {
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
                value:
                    oldData === 1
                        ? inputObject.top_values[key].old_count
                        : inputObject.top_values[key].count,
            })
        }

        // add others key-value pair
        outputArray.push({
            name: 'others',
            value: oldData
                ? inputObject.others.old_count
                : inputObject.others.count,
        })
        return outputArray
    }

    function nowCompositionList(inputObject: any) {
        const outputArray = []
        let deltaType: DeltaType = 'unchanged'
        if (!inputObject) {
            return [
                {
                    name: 'No data',
                    value: 0,
                    delta: '0',
                    deltaType,
                },
            ]
        }
        // iterate over top_values
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const key in inputObject.top_values) {
            let delta
            try {
                delta =
                    ((inputObject.top_values[key].count -
                        inputObject.top_values[key].old_count) /
                        inputObject.top_values[key].old_count) *
                    100
            } catch (e) {
                delta = 0
            }

            if (delta < 0) {
                deltaType = 'moderateDecrease'
            } else if (delta > 0) {
                deltaType = 'moderateIncrease'
            } else {
                deltaType = 'unchanged'
            }
            outputArray.push({
                name: key,
                value: inputObject.top_values[key].count,
                delta: Math.abs(delta).toFixed(2),
                deltaType,
            })
        }
        return outputArray
    }
    function prevCompositionList(inputObject: any) {
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
                value: inputObject.top_values[key].old_count,
            })
        }
        return outputArray
    }

    const nowDataList = nowCompositionList(composition)
    const prevDataList = prevCompositionList(composition)

    if (isLoading) {
        return (
            <Flex justifyContent="center" className="mt-56">
                <Spinner />
            </Flex>
        )
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
                            <Tab>Now</Tab>
                            <Tab>Before</Tab>
                        </TabList>
                    </TabGroup>
                </span>
            </Flex>
            <Text className="mt-8">Total count</Text>
            <Metric>{numericDisplay(composition?.total_count)}</Metric>
            <Divider />
            <div className="flex flex-row justify-between items-center">
                <div>
                    <Text className="mt-8">
                        <Bold>Resource Allocation</Bold>
                    </Text>
                    <Text>{composition?.total_value_count} Asset</Text>
                    <div className="mt-6">
                        <DonutChart
                            data={compositionData(composition, selectedIndex)}
                            showAnimation={false}
                            category="value"
                            index="name"
                            className="w-64 h-64"
                            // valueFormatter={valueFormatter}
                        />
                    </div>
                </div>

                <div>
                    <List className="mt-4 w-[30vw]">
                        {selectedIndex === 0
                            ? nowDataList.map((item) => (
                                  <ListItem key={item.name}>
                                      <Text>{item.name}</Text>
                                      <Flex
                                          justifyContent="end"
                                          className="space-x-2"
                                      >
                                          <Text>
                                              {numericDisplay(item.value)}
                                          </Text>
                                          {item.delta && (
                                              <BadgeDelta
                                                  deltaType={item.deltaType}
                                                  size="xs"
                                              >
                                                  {item.delta} %
                                              </BadgeDelta>
                                          )}
                                      </Flex>
                                  </ListItem>
                              ))
                            : prevDataList.map((item) => (
                                  <ListItem key={item.name}>
                                      <Text>{item.name}</Text>
                                      <Flex
                                          justifyContent="end"
                                          className="space-x-2"
                                      >
                                          <Text>
                                              {numericDisplay(item.value)}
                                          </Text>
                                      </Flex>
                                  </ListItem>
                              ))}
                    </List>
                </div>
            </div>
        </Card>
    )
}
