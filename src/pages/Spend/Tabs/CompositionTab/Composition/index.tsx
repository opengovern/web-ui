import {
    Bold,
    Card,
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
import dayjs from 'dayjs'
import { useInventoryApiV2CostCompositionList } from '../../../../../api/inventory.gen'
import Spinner from '../../../../../components/Spinner'
import { numericDisplay } from '../../../../../utilities/numericDisplay'

type IProps = {
    // key: string,
    top: number
    connector?: string
    connectionId?: string[]
    time?: any
    data?: any
    prevData?: any
}
export default function Composition({
    // key,
    top,
    connector,
    connectionId,
    time,
    data,
    prevData,
}: IProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [composition, setComposition] = useState<any>([])
    const { response: compositionOld, isLoading: oldIsLoading } =
        useInventoryApiV2CostCompositionList({
            top,
            ...(connector && { connector }),
            ...(connectionId && { connectionId }),
            ...(time.from && { endTime: dayjs(time.from).unix() }),
            ...(time.from && {
                startTime: dayjs(time.from).subtract(1, 'day').unix(),
            }),
        })
    const { response: compositionNew, isLoading: newIsLoading } =
        useInventoryApiV2CostCompositionList({
            top,
            ...(connector && { connector }),
            ...(connectionId && { connectionId }),
            ...(time.to && { endTime: dayjs(time.to).unix() }),
            ...(time.to && {
                startTime: dayjs(time.to).subtract(1, 'day').unix(),
            }),
        })
    const { response: compositionAgrigation, isLoading: agrigationIsLoading } =
        useInventoryApiV2CostCompositionList({
            top,
            ...(connector && { connector }),
            ...(connectionId && { connectionId }),
            ...(time.to && { endTime: dayjs(time.to).unix() }),
            ...(time.from && {
                startTime: dayjs(time.from).unix(),
            }),
        })

    function compositionData(
        newInputObject: any,
        oldInputObject: any,
        oldData: number
    ) {
        const outputArray = []
        try {
            if (!newInputObject && !oldInputObject) {
                return [
                    {
                        name: 'No data',
                        value: 0,
                    },
                ]
            }
            // iterate over top_values
            if (oldData === 1) {
                // eslint-disable-next-line guard-for-in,no-restricted-syntax
                for (const key in oldInputObject.top_values) {
                    outputArray.push({
                        name: key,
                        value: oldInputObject.top_values[key],
                    })
                }
            } else {
                // eslint-disable-next-line guard-for-in,no-restricted-syntax
                for (const key in newInputObject.top_values) {
                    outputArray.push({
                        name: key,
                        value: newInputObject.top_values[key],
                    })
                }
            }

            // add others key-value pair
            // eslint-disable-next-line no-unused-expressions
            oldData
                ? outputArray.push({
                      name: 'others',
                      value: oldInputObject.others,
                  })
                : outputArray.push({
                      name: 'others',
                      value: newInputObject.others,
                  })

            return outputArray
        } catch (e) {
            console.log(e)
        } finally {
            // eslint-disable-next-line no-unsafe-finally
            return outputArray
        }
    }

    function compositionList(newInputObject: any) {
        const outputArray = []
        // let deltaType: DeltaType = 'unchanged'
        try {
            if (!newInputObject) {
                return [
                    {
                        name: 'No data',
                        value: 0,
                    },
                ]
            }
            // iterate over top_values
            // eslint-disable-next-line guard-for-in,no-restricted-syntax
            for (const key in newInputObject.top_values) {
                outputArray.push({
                    name: key,
                    value: newInputObject.top_values[key],
                })
            }
            outputArray.push({
                name: 'others',
                value: newInputObject.others,
            })
            return outputArray
        } catch (error) {
            console.log(error)
        } finally {
            // eslint-disable-next-line no-unsafe-finally
            return outputArray
        }
    }

    const nowDataList = compositionList(compositionOld)
    const prevDataList = compositionList(compositionNew)
    useEffect(() => {
        setComposition(
            compositionData(compositionNew, compositionOld, selectedIndex)
        )
    }, [oldIsLoading, newIsLoading, selectedIndex])

    if (oldIsLoading || newIsLoading) {
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
            <Text className="mt-8">Total Spend</Text>
            <Metric>
                {numericDisplay(compositionAgrigation?.total_cost_value)}
            </Metric>
            <Divider />
            <div className="flex flex-row justify-between items-center">
                <div>
                    <Text className="mt-8">
                        <Bold>Spend Allocation</Bold>
                    </Text>
                    <Text>{compositionOld?.total_count} Asset</Text>
                    <div className="mt-6">
                        {composition.lengths !== 0 ? (
                            <DonutChart
                                data={composition}
                                showAnimation
                                category="value"
                                index="name"
                                className="w-64 h-64"
                                // valueFormatter={valueFormatter}
                            />
                        ) : (
                            <Flex justifyContent="center" className="mt-56">
                                <Spinner />
                            </Flex>
                        )}
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
                                          <Bold>
                                              {numericDisplay(item.value)}
                                          </Bold>
                                          {/* {item.delta && ( */}
                                          {/*    <BadgeDelta */}
                                          {/*        deltaType={item.deltaType} */}
                                          {/*        size="xs" */}
                                          {/*    > */}
                                          {/*        {item.delta} % */}
                                          {/*    </BadgeDelta> */}
                                          {/* )} */}
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
