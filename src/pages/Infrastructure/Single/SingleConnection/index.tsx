import {
    Button,
    Callout,
    Card,
    Col,
    Flex,
    Grid,
    List,
    ListItem,
    Select,
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
import { useEffect, useState } from 'react'
import { useSetAtom } from 'jotai'
import clipboardCopy from 'clipboard-copy'
import { Dayjs } from 'dayjs'
import { useNavigate } from 'react-router-dom'
import Breakdown from '../../../../components/Breakdown'
import {
    useInventoryApiV2AnalyticsCompositionDetail,
    useInventoryApiV2AnalyticsMetricList,
    useInventoryApiV2AnalyticsTrendList,
} from '../../../../api/inventory.gen'
import { notificationAtom } from '../../../../store'
import Table from '../../../../components/Table'
import { resourceTableColumns, rowGenerator } from '../../Details'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../api/onboard.gen'
import { dateDisplay, dateTimeDisplay } from '../../../../utilities/dateDisplay'
import Spinner from '../../../../components/Spinner'
import DrawerPanel from '../../../../components/DrawerPanel'
import { RenderObject } from '../../../../components/RenderObject'
import { generateVisualMap, pieData, resourceTrendChart } from '../../index'
import Header from '../../../../components/Header'
import {
    checkGranularity,
    generateItems,
} from '../../../../utilities/dateComparator'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import {
    numberDisplay,
    numericDisplay,
} from '../../../../utilities/numericDisplay'
import { capitalizeFirstLetter } from '../../../../utilities/labelMaker'
import { BarChartIcon, LineChartIcon } from '../../../../icons/icons'
import Chart from '../../../../components/Chart'

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
}

export default function SingleConnection({ activeTimeRange, id }: ISingle) {
    const [openDrawer, setOpenDrawer] = useState(false)
    const setNotification = useSetAtom(notificationAtom)
    const navigate = useNavigate()

    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
    )
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'yearly'
    >(
        checkGranularity(activeTimeRange.start, activeTimeRange.end).daily
            ? 'daily'
            : 'monthly'
    )
    const [selectedDatapoint, setSelectedDatapoint] = useState<any>(undefined)

    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('line')
        if (selectedIndex === 1) setSelectedChart('bar')
    }, [selectedIndex])

    const query = {
        ...(id && {
            connectionId: [id],
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
        useOnboardApiV1ConnectionsSummaryList({
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
            {!!window.location.pathname.split('/')[3] && (
                <Header
                    breadCrumb={[
                        connection
                            ? connection?.providerConnectionName
                            : 'Single account detail',
                    ]}
                    datePicker
                />
            )}
            <Grid numItems={2} className="w-full gap-4">
                <Card className="w-full">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="h-full"
                    >
                        <Flex flexDirection="col" alignItems="start">
                            <Title className="font-semibold">
                                Connection details
                            </Title>
                            {accountInfoLoading ? (
                                <Spinner className="mt-28" />
                            ) : (
                                <List className="mt-2">
                                    <ListItem>
                                        <Text>Account ID</Text>
                                        <Flex className="w-fit">
                                            <Button
                                                variant="light"
                                                onClick={() =>
                                                    clipboardCopy(
                                                        `Account ID: ${connection?.providerConnectionID}`
                                                    ).then(() =>
                                                        setNotification({
                                                            text: 'Account ID copied to clipboard',
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
                                        <Text>Account name</Text>
                                        <Flex className="w-fit">
                                            <Button
                                                variant="light"
                                                onClick={() =>
                                                    clipboardCopy(
                                                        `Account name: ${connection?.providerConnectionName}`
                                                    ).then(() =>
                                                        setNotification({
                                                            text: 'Account name copied to clipboard',
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
                                        <Text>Health state</Text>
                                        <Text className="text-gray-800">
                                            {connection?.healthState}
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Connector</Text>
                                        <Text className="text-gray-800">
                                            {connection?.connector}
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
                                see more
                            </Button>
                        </Flex>
                        <DrawerPanel
                            title="Connection details"
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
                <TabList>
                    <Tab>Trend</Tab>
                    <Tab>Table</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Card>
                            <Grid numItems={6} className="gap-4">
                                <SummaryCard
                                    title={
                                        connection?.providerConnectionName || ''
                                    }
                                    metric={numericDisplay(
                                        connection?.resourceCount
                                    )}
                                    metricPrev={numericDisplay(
                                        connection?.oldResourceCount
                                    )}
                                    loading={resourceTrendLoading}
                                    border={false}
                                />
                                <Col numColSpan={3} />
                                <Col numColSpan={2}>
                                    <Flex
                                        justifyContent="end"
                                        className="gap-4"
                                    >
                                        <Select
                                            value={selectedGranularity}
                                            placeholder={capitalizeFirstLetter(
                                                selectedGranularity
                                            )}
                                            onValueChange={(v) => {
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                setSelectedGranularity(v)
                                            }}
                                            className="w-10"
                                        >
                                            {generateItems(
                                                activeTimeRange.start,
                                                activeTimeRange.end
                                            )}
                                        </Select>
                                        <TabGroup
                                            index={selectedIndex}
                                            onIndexChange={setSelectedIndex}
                                            className="w-fit rounded-lg"
                                        >
                                            <TabList variant="solid">
                                                <Tab value="line">
                                                    <LineChartIcon className="h-5" />
                                                </Tab>
                                                <Tab value="bar">
                                                    <BarChartIcon className="h-5" />
                                                </Tab>
                                            </TabList>
                                        </TabGroup>
                                    </Flex>
                                </Col>
                            </Grid>
                            {resourceTrend
                                ?.filter(
                                    (t) =>
                                        selectedDatapoint?.color ===
                                            '#E01D48' &&
                                        dateDisplay(t.date) ===
                                            selectedDatapoint?.name
                                )
                                .map((t) => (
                                    <Callout
                                        color="rose"
                                        title="Incomplete data"
                                        className="w-fit mt-4"
                                    >
                                        Checked{' '}
                                        {numberDisplay(
                                            t.totalSuccessfulDescribedConnectionCount,
                                            0
                                        )}{' '}
                                        accounts out of{' '}
                                        {numberDisplay(
                                            t.totalConnectionCount,
                                            0
                                        )}{' '}
                                        on {dateDisplay(t.date)}
                                    </Callout>
                                ))}
                            <Flex justifyContent="end" className="mt-2 gap-2.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-kaytu-800" />
                                <Text>Resources</Text>
                            </Flex>
                            <Chart
                                labels={resourceTrendChart(resourceTrend).label}
                                chartData={
                                    resourceTrendChart(resourceTrend).data
                                }
                                chartType={selectedChart}
                                loading={resourceTrendLoading}
                                visualMap={
                                    generateVisualMap(
                                        resourceTrendChart(resourceTrend).flag,
                                        resourceTrendChart(resourceTrend).label
                                    ).visualMap
                                }
                                markArea={
                                    generateVisualMap(
                                        resourceTrendChart(resourceTrend).flag,
                                        resourceTrendChart(resourceTrend).label
                                    ).markArea
                                }
                                onClick={(p) => setSelectedDatapoint(p)}
                            />
                        </Card>
                    </TabPanel>
                    <TabPanel>
                        <Card>
                            <Table
                                options={options}
                                title="Resources"
                                downloadable
                                id="asset_resource_metrics"
                                rowData={rowGenerator(metrics?.metrics)}
                                columns={resourceTableColumns}
                                onGridReady={(params) => {
                                    if (metricsLoading) {
                                        params.api.showLoadingOverlay()
                                    }
                                }}
                                onRowClicked={(e) => {
                                    if (e.data) {
                                        navigate(`metric_${e.data.id}`)
                                    }
                                }}
                            />
                        </Card>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </>
    )
}
