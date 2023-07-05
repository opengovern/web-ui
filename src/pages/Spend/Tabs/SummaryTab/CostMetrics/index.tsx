import React, { useState } from 'react'
import {
    Button,
    Text,
    Grid,
    SearchSelect,
    SearchSelectItem,
    Title,
    TabGroup,
    TabList,
    Tab,
} from '@tremor/react'
import { useAtom } from 'jotai/index'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import Swiper from '../../../../../components/Swiper'
import MetricCard from '../../../../../components/Cards/MetricCard'
import { selectedResourceCategoryAtom } from '../../../../../store'
import { useInventoryApiV2CostMetricList } from '../../../../../api/inventory.gen'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import Spinner from '../../../../../components/Spinner'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'

interface IProps {
    provider: any
    timeRange: any
    connection: any
    categories: {
        label: string
        value: string
    }[]
    pageSize: any
}

export default function CostMetrics({
    provider,
    timeRange,
    pageSize,
    categories,
    connection,
}: IProps) {
    const navigate = useNavigate()
    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )
    const [selectedIndex, setSelectedIndex] = useState(0)
    const activeCategory =
        selectedResourceCategory === 'All Categories'
            ? ''
            : selectedResourceCategory
    const query = {
        ...(provider && { connector: provider }),
        ...(connection && { connectionId: connection }),
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
        ...(timeRange.from && { startTime: dayjs(timeRange.from).unix() }),
        ...(timeRange.to && { endTime: dayjs(timeRange.to).unix() }),
        ...(pageSize && { pageSize }),
    }
    const { response: metrics, isLoading } =
        useInventoryApiV2CostMetricList(query)

    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: provider,
            connectionId: connection,
            startTime: timeRange[0],
            endTime: timeRange[1],
            pageSize: 10000,
            pageNumber: 1,
        })

    const percentage = (a?: number, b?: number): number => {
        return a && b ? ((a - b) / b) * 100 : 0
    }

    return (
        <div>
            {/* <div className="h-80" /> */}
            <div className="flex justify-between gap-x-2">
                <div className="flex flex-row justify-start items-start">
                    <Title>
                        Cost {selectedIndex ? 'Accounts' : 'Services'} Metrics{' '}
                    </Title>
                    <Button
                        variant="light"
                        className="mt-1 ml-2"
                        onClick={() => navigate('spend-metrics')}
                    >
                        <Text color="blue">(see All)</Text>
                    </Button>
                </div>
                <div className="flex flex-row items-start">
                    <SearchSelect
                        onValueChange={(e) => setSelectedResourceCategory(e)}
                        value={selectedResourceCategory}
                        placeholder="Source Selection"
                        className="max-w-xs mb-6"
                    >
                        {categories.map((category) => (
                            <SearchSelectItem
                                key={category.label}
                                value={category.value}
                            >
                                {category.value}
                            </SearchSelectItem>
                        ))}
                    </SearchSelect>
                    <span className="ml-5">
                        <TabGroup
                            index={selectedIndex}
                            onIndexChange={setSelectedIndex}
                        >
                            <TabList variant="solid">
                                <Tab>Services</Tab>
                                <Tab>Accounts</Tab>
                            </TabList>
                        </TabGroup>
                    </span>
                </div>
            </div>
            <Grid>
                {isLoading && (
                    <div className="flex items-center justify-center">
                        <Spinner />
                    </div>
                )}
                <Swiper
                    gridContainerProps={{
                        numItemsSm: 2,
                        numItemsMd: 3,
                        className: 'gap-6',
                    }}
                >
                    {!selectedIndex
                        ? !isLoading &&
                          metrics?.metrics?.map((metric) => (
                              <MetricCard
                                  title={
                                      metric.cost_dimension_name
                                          ? metric.cost_dimension_name
                                          : String(metric.cost_dimension_name)
                                  }
                                  metric={`$ ${String(
                                      numericDisplay(
                                          metric.total_cost
                                              ? metric.total_cost
                                              : 0
                                      )
                                  )}`}
                                  delta={Math.abs(
                                      percentage(
                                          metric.daily_cost_at_end_time,
                                          metric.daily_cost_at_start_time
                                      )
                                  ).toFixed(2)}
                                  deltaType={
                                      percentage(
                                          metric.daily_cost_at_end_time,
                                          metric.daily_cost_at_start_time
                                      ) > 0
                                          ? 'moderateIncrease'
                                          : 'moderateDecrease'
                                  }
                              />
                          ))
                        : !isAccountsLoading &&
                          accounts?.connections?.map((account) => (
                              <MetricCard
                                  title={account.credentialName}
                                  metric={`$ ${String(
                                      numericDisplay(
                                          account.cost ? account.cost : 0
                                      )
                                  )}`}
                                  delta={Math.abs(
                                      percentage(
                                          account.dailyCostAtEndTime,
                                          account.dailyCostAtStartTime
                                      )
                                  )}
                                  deltaType={
                                      percentage(
                                          account.dailyCostAtEndTime,
                                          account.dailyCostAtStartTime
                                      ) > 0
                                          ? 'moderateIncrease'
                                          : 'moderateDecrease'
                                  }
                              />
                          ))}
                </Swiper>
            </Grid>
        </div>
    )
}
