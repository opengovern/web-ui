import {
    Button,
    Card,
    Col,
    Flex,
    Grid,
    Icon,
    Metric,
    Text,
    Title,
} from '@tremor/react'
import { BanknotesIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useAtomValue } from 'jotai/index'
import { useNavigate, useParams } from 'react-router-dom'
import { filterAtom, spendTimeAtom, timeAtom } from '../../../store'
import {
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../../api/inventory.gen'
import { toErrorMessage } from '../../../types/apierror'
import { buildTrend } from '../../../components/Spend/Chart/helpers'
import StackedChart from '../../../components/Chart/Stacked'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'
import { renderText } from '../../../components/Layout/Header/DateRangePicker'
import ChangeDelta from '../../../components/ChangeDelta'

const colors = ['#1E7CE0', '#2ECC71', '#FFA500', '#9B59B6', '#D0D4DA']

export default function Spend() {
    const workspace = useParams<{ ws: string }>().ws
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const navigate = useNavigate()

    const query: {
        pageSize: number
        pageNumber: number
        sortBy: 'cost' | undefined
        endTime: number
        startTime: number
        connectionId: string[]
        connector?: ('AWS' | 'Azure')[] | undefined
    } = {
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
        pageSize: 5,
        pageNumber: 1,
        sortBy: 'cost',
    }
    const duration =
        activeTimeRange.end.diff(activeTimeRange.start, 'second') + 1
    const prevTimeRange = {
        start: activeTimeRange.start.add(-duration, 'second'),
        end: activeTimeRange.end.add(-duration, 'second'),
    }
    const prevQuery = {
        ...query,
        ...(activeTimeRange.start && {
            startTime: prevTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: prevTimeRange.end.unix(),
        }),
    }

    const {
        response: costTrend,
        isLoading: costTrendLoading,
        error: costTrendError,
        sendNow: costTrendRefresh,
    } = useInventoryApiV2AnalyticsSpendTrendList({
        ...query,
        granularity: 'daily',
    })
    const {
        response: serviceCostResponse,
        isLoading: serviceCostLoading,
        error: serviceCostErr,
        sendNow: serviceCostRefresh,
    } = useInventoryApiV2AnalyticsSpendMetricList(query)
    const {
        response: servicePrevCostResponse,
        isLoading: servicePrevCostLoading,
        error: servicePrevCostErr,
        sendNow: serviceCostPrevRefresh,
    } = useInventoryApiV2AnalyticsSpendMetricList(prevQuery)
    const trendStacked = buildTrend(costTrend || [], 'trending', 'daily', 4)

    return (
        <Card className="h-full pb-8">
            <Flex className="mb-2">
                <Flex justifyContent="start" className="gap-2">
                    <Icon icon={BanknotesIcon} className="p-0" />
                    <Title className="font-semibold">Cloud Spend</Title>
                </Flex>
                <Button
                    variant="light"
                    icon={ChevronRightIcon}
                    iconPosition="right"
                    onClick={() => navigate(`/${workspace}/spend`)}
                >
                    View details
                </Button>
            </Flex>
            <Grid numItems={3} className="gap-8">
                <Col numColSpan={2} className="mt-2">
                    <StackedChart
                        labels={trendStacked.label}
                        chartData={trendStacked.data}
                        isCost
                        chartType="bar"
                        loading={
                            costTrendLoading ||
                            serviceCostLoading ||
                            servicePrevCostLoading
                        }
                        error={toErrorMessage(
                            costTrendError,
                            serviceCostErr,
                            servicePrevCostErr
                        )}
                    />
                </Col>
                <Col>
                    <Flex
                        flexDirection="col"
                        justifyContent="start"
                        alignItems="start"
                        className="gap-4 mt-4"
                    >
                        <Card className="p-3 border-0 ring-0 !shadow-none">
                            {serviceCostLoading ? (
                                <div className="animate-pulse">
                                    <Text className="font-semibold text-gray-800">
                                        Total spend
                                    </Text>
                                    <div className="h-8 w-28 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                    <div className="h-4 w-48 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                </div>
                            ) : (
                                <>
                                    <Text className="font-semibold text-gray-800">
                                        Total spend
                                    </Text>
                                    <Metric className="!text-2xl my-2">
                                        {exactPriceDisplay(
                                            serviceCostResponse?.total_cost || 0
                                        )}
                                    </Metric>
                                    <Text>
                                        {renderText(
                                            activeTimeRange.start,
                                            activeTimeRange.end.subtract(
                                                1,
                                                'day'
                                            )
                                        )}
                                    </Text>
                                </>
                            )}
                        </Card>
                        <div className="w-full h-[1px] bg-gray-200" />
                        <Card className="p-3 border-0 ring-0 !shadow-none">
                            {servicePrevCostLoading || serviceCostLoading ? (
                                <div className="animate-pulse">
                                    <Text className="font-semibold text-gray-800">
                                        Spend trend
                                    </Text>
                                    <div className="h-8 w-28 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                    <div className="h-4 w-48 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                </div>
                            ) : (
                                <>
                                    <Text className="font-semibold text-gray-800 mb-2">
                                        Spend trend
                                    </Text>
                                    <ChangeDelta
                                        change={
                                            (((serviceCostResponse?.total_cost ||
                                                0) -
                                                (servicePrevCostResponse?.total_cost ||
                                                    0)) /
                                                (servicePrevCostResponse?.total_cost ||
                                                    1)) *
                                            100
                                        }
                                        size="xl"
                                    />
                                    <Text className="mt-2">
                                        {`Compared to ${renderText(
                                            prevTimeRange.start,
                                            prevTimeRange.end
                                        )}`}
                                    </Text>
                                </>
                            )}
                        </Card>
                    </Flex>
                </Col>
            </Grid>
            <Flex justifyContent="start" className="gap-4 w-fit">
                {trendStacked.data[0] ? (
                    trendStacked.data[0].map((t, i) => (
                        <Flex
                            justifyContent="start"
                            className="gap-2 w-fit max-w-[180px]"
                        >
                            <div
                                className="h-2 w-2 min-w-[8px] rounded-full"
                                style={{
                                    backgroundColor: colors[i],
                                }}
                            />
                            <Text className="truncate">{t.label}</Text>
                        </Flex>
                    ))
                ) : (
                    <div className="h-6" />
                )}
            </Flex>
        </Card>
    )
}
