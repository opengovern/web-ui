import { useNavigate, useParams } from 'react-router-dom'
import {
    BarList,
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
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import Layout from '../../../components/Layout'
import {
    useInventoryApiV2AnalyticsTrendList,
    useInventoryApiV2MetadataResourceCollectionDetail,
    useInventoryApiV2ResourceCollectionLandscapeDetail,
} from '../../../api/inventory.gen'
import Header from '../../../components/Header'
import Spinner from '../../../components/Spinner'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../api/compliance.gen'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
} from '../../../api/api'
import Chart from '../../../components/Chart'
import {
    camelCaseToLabel,
    capitalizeFirstLetter,
} from '../../../utilities/labelMaker'
import { dateDisplay, dateTimeDisplay } from '../../../utilities/dateDisplay'
import Table, { IColumn } from '../../../components/Table'
import { activeColumns, benchmarkList } from '../../Governance/Compliance'
import { timeAtom } from '../../../store'
import {
    checkGranularity,
    generateItems,
} from '../../../utilities/dateComparator'
import SummaryCard from '../../../components/Cards/SummaryCard'
import {
    numberDisplay,
    numericDisplay,
} from '../../../utilities/numericDisplay'
import { BarChartIcon, LineChartIcon } from '../../../icons/icons'
import { generateVisualMap, resourceTrendChart } from '../../Infrastructure'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../api/onboard.gen'
import Landscape from '../../../components/Landscape'
import Tag from '../../../components/Tag'
import { RenderObject } from '../../../components/RenderObject'
import DrawerPanel from '../../../components/DrawerPanel'

const pieData = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse
        | undefined
) => {
    const data: any[] = []
    if (input && input.totalChecks) {
        // eslint-disable-next-line array-callback-return
        Object.entries(input.totalChecks).map(([key, value]) => {
            data.push({ name: camelCaseToLabel(key), value })
        })
    }
    return data.reverse()
}

const barData = (
    input:
        | GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse
        | undefined
) => {
    const data: any[] = []
    if (input && input.connections) {
        // eslint-disable-next-line array-callback-return
        input.connections.map((c, i) => {
            if (i < 5) {
                data.push({
                    name: c.providerConnectionName,
                    value: c.resourceCount || 0,
                })
            }
        })
    }
    return data
}

const complianceColumns: IColumn<any, any>[] = [
    ...activeColumns,
    {
        width: 120,
        field: 'isAssigned',
        headerName: 'Assignment status',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        rowGroup: true,
        type: 'string',
    },
]

export default function ResourceCollectionDetail() {
    const { resourceId } = useParams()
    const activeTimeRange = useAtomValue(timeAtom)
    const navigate = useNavigate()
    const [openDrawer, setOpenDrawer] = useState(false)

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
    useEffect(() => {
        setSelectedGranularity(
            checkGranularity(activeTimeRange.start, activeTimeRange.end).monthly
                ? 'monthly'
                : 'daily'
        )
    }, [activeTimeRange])
    const [selectedDatapoint, setSelectedDatapoint] = useState<any>(undefined)

    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('line')
        if (selectedIndex === 1) setSelectedChart('bar')
    }, [selectedIndex])

    const query = {
        resourceCollection: [resourceId || ''],
        startTime: activeTimeRange.start.unix(),
        endTime: activeTimeRange.end.unix(),
    }

    const { response: detail, isLoading: detailsLoading } =
        useInventoryApiV2MetadataResourceCollectionDetail(resourceId || '')
    const { response: complianceKPI, isLoading: complianceKPILoading } =
        useComplianceApiV1BenchmarksSummaryList({
            resourceCollection: [resourceId || ''],
        })
    const { response: accountInfo, isLoading: accountInfoLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ...query,
            needCost: false,
            sortBy: 'resource_count',
        })
    const { response: resourceTrend, isLoading: resourceTrendLoading } =
        useInventoryApiV2AnalyticsTrendList({
            ...query,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            granularity: selectedGranularity,
        })
    const { response: landscape, isLoading: landscapeLoading } =
        useInventoryApiV2ResourceCollectionLandscapeDetail(resourceId || '')

    return (
        <Layout currentPage="resource-collection">
            <Header
                breadCrumb={[
                    detail ? detail.name : 'Resource collection detail',
                ]}
                datePicker
            />
            <Flex flexDirection="col" alignItems="start" className="mb-4">
                <Title className="font-semibold">{detail?.name}</Title>
                <Text>{detail?.description}</Text>
            </Flex>
            <Grid numItems={2} className="w-full gap-4 mb-4">
                <Card>
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="h-full"
                    >
                        <>
                            <Title className="font-semibold mb-2">
                                Summary
                            </Title>
                            {detailsLoading ? (
                                <Spinner />
                            ) : (
                                <List>
                                    <ListItem>
                                        <Text>Type</Text>
                                        <Text className="text-gray-800">?</Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Resources</Text>
                                        <Text className="text-gray-800">?</Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Providers</Text>
                                        <Text className="text-gray-800">?</Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Services used</Text>
                                        <Text className="text-gray-800">?</Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Status</Text>
                                        <Text className="text-gray-800">
                                            {detail?.status}
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Last evaluation</Text>
                                        <Text className="text-gray-800">
                                            {dateTimeDisplay(
                                                detail?.created_at
                                            )}
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Tags</Text>
                                        <Flex
                                            justifyContent="end"
                                            className="w-2/3 flex-wrap gap-1"
                                        >
                                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                            {/* @ts-ignore */}
                                            {Object.entries(detail?.tags).map(
                                                ([name, value]) => (
                                                    <Tag
                                                        text={`${name}: ${value}`}
                                                    />
                                                )
                                            )}
                                        </Flex>
                                    </ListItem>
                                </List>
                            )}
                        </>
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
                            title="Resource collection detail"
                            open={openDrawer}
                            onClose={() => setOpenDrawer(false)}
                        >
                            <RenderObject obj={detail} />
                        </DrawerPanel>
                    </Flex>
                </Card>
                <Card className="h-full">
                    <Title className="font-semibold mb-2">
                        Key performance indicator
                    </Title>
                    <TabGroup className="h-[300px]">
                        <TabList>
                            <Tab>Compliance</Tab>
                            <Tab>Infrastructure</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel className="mt-0">
                                <Chart
                                    labels={[]}
                                    chartType="doughnut"
                                    chartData={pieData(complianceKPI)}
                                    loading={complianceKPILoading}
                                    colorful
                                />
                            </TabPanel>
                            <TabPanel>
                                <Title className="font-semibold mb-3">
                                    Top accounts
                                </Title>
                                <BarList
                                    data={barData(accountInfo)}
                                    color="slate"
                                />
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </Card>
            </Grid>
            <TabGroup>
                <TabList className="mb-3">
                    <Tab>Landscape</Tab>
                    <Tab>Compliance</Tab>
                    <Tab>Infrastructure</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Landscape
                            data={landscape}
                            isLoading={landscapeLoading}
                        />
                    </TabPanel>
                    <TabPanel>
                        <Table
                            title={`${detail?.name} benchmarks`}
                            downloadable
                            id="connected_compliance"
                            rowData={benchmarkList(
                                complianceKPI?.benchmarkSummary
                            ).all?.sort(
                                (a, b) =>
                                    (b?.checks?.passedCount || 0) -
                                    (a?.checks?.passedCount || 0)
                            )}
                            columns={complianceColumns}
                            onRowClicked={(event) => {
                                if (event.data) {
                                    if (event.data.isAssigned === 'Assigned') {
                                        navigate(`${event.data.id}`)
                                    } else {
                                        navigate(
                                            `${event.data.id}/details#assignments`
                                        )
                                    }
                                }
                            }}
                        />
                    </TabPanel>
                    <TabPanel>
                        <Card>
                            <Grid numItems={6} className="gap-4">
                                <Col numColSpan={1}>
                                    <SummaryCard
                                        title="Resources"
                                        metric={numericDisplay(
                                            accountInfo?.totalResourceCount
                                        )}
                                        url="infrastructure-details#cloud-accounts"
                                        loading={accountInfoLoading}
                                        border={false}
                                    />
                                </Col>
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
                </TabPanels>
            </TabGroup>
        </Layout>
    )
}
