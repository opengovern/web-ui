import {
    BadgeDelta,
    Card,
    Color,
    DeltaType,
    Divider,
    DonutChart,
    Flex,
    List,
    ListItem,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { useState } from 'react'
import { useAtomValue } from 'jotai/index'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'
import Spinner from '../../Spinner'
import { spendTimeAtom, timeAtom } from '../../../store'
import { dateDisplay } from '../../../utilities/dateDisplay'

interface listProps {
    val?: number
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

const colors: Color[] = ['blue', 'sky', 'cyan', 'teal', 'emerald', 'slate']

export default function Composition({
    newData,
    oldData,
    isLoading,
    newList,
    oldList,
    isCost = false,
}: IProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const activeTimeRange = useAtomValue(isCost ? spendTimeAtom : timeAtom)
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
                        className="w-fit rounded-lg"
                    >
                        <TabList variant="solid">
                            <Tab className="pt-0.5 pb-1">
                                <Text>
                                    {dateDisplay(
                                        activeTimeRange.end.toString()
                                    )}
                                </Text>
                            </Tab>
                            <Tab className="pt-0.5 pb-1">
                                <Text>
                                    {dateDisplay(
                                        activeTimeRange.start.toString()
                                    )}
                                </Text>
                            </Tab>
                        </TabList>
                    </TabGroup>
                )}
            </Flex>
            <Divider />
            <Flex justifyContent="center">
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
                    colors={colors}
                />
                <List className="w-2/5 ml-12">
                    {selectedIndex === 0
                        ? newList?.map((item, i) => (
                              <ListItem key={item.name}>
                                  <Flex>
                                      <Flex
                                          justifyContent="start"
                                          className="w-36"
                                      >
                                          <div
                                              className={`h-3 w-3 mr-4 rounded-sm bg-${colors[i]}-500`}
                                          />
                                          <Text>{item.name}</Text>
                                      </Flex>
                                      <Text>{item.val}%</Text>
                                      <Flex className="w-32">
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
                                  </Flex>
                              </ListItem>
                          ))
                        : oldList?.map((item, i) => (
                              <ListItem key={item.name}>
                                  <Flex>
                                      <Flex
                                          justifyContent="start"
                                          className="w-36"
                                      >
                                          <div
                                              className={`h-3 w-3 mr-4 rounded-sm bg-${colors[i]}-500`}
                                          />
                                          <Text>{item.name}</Text>
                                      </Flex>
                                      <Text>{item.val}%</Text>
                                      <Flex className="w-32">
                                          <BadgeDelta
                                              deltaType="moderateIncrease"
                                              size="xs"
                                              className="opacity-0"
                                          >
                                              0
                                          </BadgeDelta>
                                          <Text>{item.value}</Text>
                                      </Flex>
                                  </Flex>
                              </ListItem>
                          ))}
                </List>
            </Flex>
        </Card>
    )
}
