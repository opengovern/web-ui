import {
    BadgeDelta,
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
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'
import Spinner from '../../Spinner'
import { timeAtom } from '../../../store'

interface listProps {
    percent?: number
    name: string
    value: string
    delta?: string
    deltaType?: DeltaType
}

interface chartProps {
    name: string
    value: number
}

interface dataProps {
    total: string
    totalValueCount: string
    chart: chartProps[]
}

type IProps = {
    isCost?: boolean
    newData?: dataProps
    oldData?: dataProps
    isLoading?: boolean
    newList?: listProps[]
    oldList?: listProps[]
}

export default function Composition({
    newData,
    oldData,
    isLoading,
    newList,
    oldList,
    isCost = false,
}: IProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const param = window.location.pathname.split('/')[2]

    const compositionData = (
        newObject: dataProps | undefined,
        oldObject: dataProps | undefined,
        isOldData: number
    ) => {
        if (isOldData === 0) {
            if (!newObject) {
                return [
                    {
                        name: 'No data',
                        value: 0,
                    },
                ]
            }
            return newObject.chart
        }
        if (!oldObject) {
            return [
                {
                    name: 'No data',
                    value: 0,
                },
            ]
        }
        return oldObject.chart
    }

    return isLoading ? (
        <Flex justifyContent="center" className="mt-56">
            <Spinner />
        </Flex>
    ) : (
        <Card>
            <Flex flexDirection="row">
                <Title>Overview</Title>
                {param !== 'spend' && (
                    <TabGroup
                        index={selectedIndex}
                        onIndexChange={setSelectedIndex}
                        className="w-fit"
                    >
                        <TabList variant="solid">
                            <Tab>
                                {dayjs(activeTimeRange.to).format('MMM DD')}
                            </Tab>
                            <Tab>
                                {dayjs(activeTimeRange.from).format('MMM DD')}
                            </Tab>
                        </TabList>
                    </TabGroup>
                )}
            </Flex>
            <Text className="mt-3">Total</Text>
            <Metric>
                {selectedIndex === 0 ? newData?.total : oldData?.total}
            </Metric>
            <Divider />
            <Flex flexDirection="row" alignItems="start">
                <Flex flexDirection="col" alignItems="start" className="w-1/7">
                    <Title>Allocation</Title>
                    <Text>
                        {selectedIndex === 0
                            ? newData?.totalValueCount
                            : oldData?.totalValueCount}{' '}
                        Asset
                    </Text>
                </Flex>
                <DonutChart
                    data={compositionData(newData, oldData, selectedIndex)}
                    category="value"
                    index="name"
                    className="w-64 h-64"
                    valueFormatter={
                        isCost
                            ? exactPriceDisplay
                            : (v) => v.toLocaleString('en-US')
                    }
                />
                <List className="w-2/5">
                    {selectedIndex === 0
                        ? newList?.map((item) => (
                              <ListItem key={item.name}>
                                  {/* {item.percent && ( */}
                                  {/*    <Text>%{item.percent.toFixed(2)}</Text> */}
                                  {/* )} */}
                                  <Text>{item.name}</Text>
                                  <Flex
                                      justifyContent="end"
                                      className="space-x-2"
                                  >
                                      <Text>{item.value}</Text>
                                      {item.delta && (
                                          <BadgeDelta
                                              deltaType={item.deltaType}
                                              size="xs"
                                          >
                                              {item.delta}
                                          </BadgeDelta>
                                      )}
                                  </Flex>
                              </ListItem>
                          ))
                        : oldList?.map((item) => (
                              <ListItem key={item.name} className="my-2">
                                  {/* {item.percent && ( */}
                                  {/*    <Text>%{item.percent.toFixed(2)}</Text> */}
                                  {/* )} */}
                                  <Text>{item.name}</Text>
                                  <Flex
                                      justifyContent="end"
                                      className="space-x-2"
                                  >
                                      <Text>{item.value}</Text>
                                  </Flex>
                              </ListItem>
                          ))}
                </List>
            </Flex>
        </Card>
    )
}
