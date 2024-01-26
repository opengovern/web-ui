import {
    Button,
    Card,
    Flex,
    Grid,
    List,
    ListItem,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    Title,
} from '@tremor/react'
import { GridOptions } from 'ag-grid-community'
import { ChevronRightIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import clipboardCopy from 'clipboard-copy'
import { Dayjs } from 'dayjs'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Breakdown from '../../../../components/Breakdown'
import {
    useInventoryApiV2AnalyticsCompositionDetail,
    useInventoryApiV2AnalyticsMetricList,
    useInventoryApiV2AnalyticsTrendList,
} from '../../../../api/inventory.gen'
import { notificationAtom } from '../../../../store'
import Table from '../../../../components/Table'
import { useIntegrationApiV1ConnectionsSummariesList } from '../../../../api/integration.gen'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'
import Spinner from '../../../../components/Spinner'
import DrawerPanel from '../../../../components/DrawerPanel'
import { RenderObject } from '../../../../components/RenderObject'
import { pieData, resourceTrendChart } from '../../index'
import { checkGranularity } from '../../../../utilities/dateComparator'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import Trends from '../../../../components/Trends'
import { defaultColumns, rowGenerator } from '../../Metric/Table'
import { searchAtom } from '../../../../utilities/urlstate'

const options: GridOptions = {
    enableGroupEdit: true,
    columnTypes: {
        dimension: {
            enableRowGroup: true,
            enablePivot: true,
        },
    },
    groupDefaultExpanded: -1,
    rowGroupPanelShow: 'always',
    groupAllowUnbalanced: true,
}

interface ISingle {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    id: string | undefined
    resourceId?: string | undefined
}

export default function SingleConnection({
    activeTimeRange,
    id,
    resourceId,
}: ISingle) {
    const [openDrawer, setOpenDrawer] = useState(false)
    const setNotification = useSetAtom(notificationAtom)
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)

    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'yearly'
    >(
        checkGranularity(activeTimeRange.start, activeTimeRange.end).daily
            ? 'daily'
            : 'monthly'
    )

    const query = {
        ...(id && {
            connectionId: [id],
        }),
        ...(resourceId && {
            resourceCollection: [resourceId],
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
    }

    const { response: composition, isLoading: compositionLoading } =
        useInventoryApiV2AnalyticsCompositionDetail('category', {
            ...query,
            top: 4,
        })
    const { response: metrics, isLoading: metricsLoading } =
        useInventoryApiV2AnalyticsMetricList({ ...query, pageSize: 1000 })
    const { response: accountInfo, isLoading: accountInfoLoading } =
        useIntegrationApiV1ConnectionsSummariesList({
            ...query,
            pageSize: 1,
            needCost: false,
        })
    const { response: resourceTrend, isLoading: resourceTrendLoading } =
        useInventoryApiV2AnalyticsTrendList({
            ...query,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            granularity: selectedGranularity,
        })
    const connection = accountInfo?.connections?.at(0)

    return (
        <>
            <Grid numItems={2} className="w-full gap-4">
                <Card>
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="h-full"
                    >
                        <Flex flexDirection="col" alignItems="start">
                            <Title className="font-semibold mb-2">
                                Cloud account detail
                            </Title>
                            {accountInfoLoading ? (
                                <Spinner className="mt-28" />
                            ) : (
                                <List>
                                    <ListItem>
                                        <Text>Cloud Provider</Text>
                                        <Text className="text-gray-800">
                                            {connection?.connector}
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Discovered name</Text>
                                        <Flex className="gap-1 w-fit">
                                            <Button
                                                variant="light"
                                                onClick={() =>
                                                    clipboardCopy(
                                                        `Discovered name: ${connection?.providerConnectionName}`
                                                    ).then(() =>
                                                        setNotification({
                                                            text: 'Discovered name copied to clipboard',
                                                            type: 'info',
                                                        })
                                                    )
                                                }
                                                icon={Square2StackIcon}
                                            />
                                            <Text className="text-gray-800">
                                                {
                                                    connection?.providerConnectionName
                                                }
                                            </Text>
                                        </Flex>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Discovered ID</Text>
                                        <Flex className="gap-1 w-fit">
                                            <Button
                                                variant="light"
                                                onClick={() =>
                                                    clipboardCopy(
                                                        `Discovered ID: ${connection?.providerConnectionID}`
                                                    ).then(() =>
                                                        setNotification({
                                                            text: 'Discovered ID copied to clipboard',
                                                            type: 'info',
                                                        })
                                                    )
                                                }
                                                icon={Square2StackIcon}
                                            />
                                            <Text className="text-gray-800">
                                                {
                                                    connection?.providerConnectionID
                                                }
                                            </Text>
                                        </Flex>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Lifecycle state</Text>
                                        <Text className="text-gray-800">
                                            {connection?.lifecycleState}
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Onboard date</Text>
                                        <Text className="text-gray-800">
                                            {dateTimeDisplay(
                                                connection?.onboardDate
                                            )}
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Last inventory</Text>
                                        <Text className="text-gray-800">
                                            {dateTimeDisplay(
                                                connection?.lastInventory
                                            )}
                                        </Text>
                                    </ListItem>
                                </List>
                            )}
                        </Flex>
                        <Flex justifyContent="end">
                            <Button
                                variant="light"
                                icon={ChevronRightIcon}
                                iconPosition="right"
                                onClick={() => setOpenDrawer(true)}
                            >
                                See more
                            </Button>
                        </Flex>
                        <DrawerPanel
                            title="Connection detail"
                            open={openDrawer}
                            onClose={() => setOpenDrawer(false)}
                        >
                            <RenderObject obj={connection} />
                        </DrawerPanel>
                    </Flex>
                </Card>
                <Breakdown
                    chartData={pieData(composition).newData}
                    oldChartData={pieData(composition).oldData}
                    activeTime={activeTimeRange}
                    loading={compositionLoading}
                />
            </Grid>
            <TabGroup className="mt-4">
                <TabList className="mb-3">
                    <Tab>Trend</Tab>
                    <Tab>Details</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Trends
                            activeTimeRange={activeTimeRange}
                            trend={resourceTrend}
                            firstKPI={
                                <SummaryCard
                                    title=""
                                    metric={connection?.resourceCount}
                                    metricPrev={connection?.oldResourceCount}
                                    loading={resourceTrendLoading}
                                    border={false}
                                />
                            }
                            trendName="Resources"
                            labels={
                                resourceTrendChart(
                                    resourceTrend,
                                    selectedGranularity
                                ).label
                            }
                            chartData={
                                resourceTrendChart(
                                    resourceTrend,
                                    selectedGranularity
                                ).data
                            }
                            loading={resourceTrendLoading}
                            onGranularityChange={(gra) =>
                                setSelectedGranularity(gra)
                            }
                        />
                    </TabPanel>
                    <TabPanel>
                        <Table
                            options={options}
                            title="Resources"
                            downloadable
                            id="asset_resource_metrics"
                            rowData={rowGenerator(metrics?.metrics)}
                            columns={[
                                ...defaultColumns,
                                {
                                    field: 'category',
                                    enableRowGroup: true,
                                    headerName: 'Category',
                                    resizable: true,
                                    sortable: true,
                                    filter: true,
                                    type: 'string',
                                },
                            ]}
                            loading={metricsLoading}
                            onRowClicked={(e) => {
                                if (e.data) {
                                    navigate(
                                        `metric_${e.data.id}?${searchParams}`
                                    )
                                }
                            }}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </>
    )
}
