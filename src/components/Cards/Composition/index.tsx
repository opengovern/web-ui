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
import {
    numericDisplay,
    exactPriceDisplay,
} from '../../../utilities/numericDisplay'
import Spinner from '../../Spinner'

interface listProps {
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
                <TabGroup
                    index={selectedIndex}
                    onIndexChange={setSelectedIndex}
                    className="w-fit"
                >
                    <TabList variant="solid">
                        <Tab>Now</Tab>
                        <Tab>Before</Tab>
                    </TabList>
                </TabGroup>
            </Flex>
            <Text className="mt-3">Total</Text>
            <Metric>
                {selectedIndex === 0 ? newData?.total : oldData?.total}
            </Metric>
            <Divider />
            <Flex flexDirection="row">
                <div>
                    <Title>Allocation</Title>
                    <Text>
                        {selectedIndex === 0
                            ? newData?.totalValueCount
                            : oldData?.totalValueCount}{' '}
                        Asset
                    </Text>
                    <DonutChart
                        data={compositionData(newData, oldData, selectedIndex)}
                        category="value"
                        index="name"
                        className="w-64 h-64 mt-6"
                        valueFormatter={
                            isCost
                                ? exactPriceDisplay
                                : (v) => v.toLocaleString('en-US')
                        }
                    />
                </div>
                <List className="w-2/5">
                    {selectedIndex === 0
                        ? newList?.map((item) => (
                              <ListItem key={item.name}>
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
                              <ListItem key={item.name}>
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
