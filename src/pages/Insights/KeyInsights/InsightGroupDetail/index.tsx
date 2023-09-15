import {
    Card,
    Col,
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import 'ag-grid-enterprise'
import { ICellRendererParams } from 'ag-grid-community'
import Menu from '../../../../components/Menu'
import {
    useComplianceApiV1InsightGroupDetail,
    useComplianceApiV1InsightGroupTrendDetail,
} from '../../../../api/compliance.gen'
import { timeAtom } from '../../../../store'
import Spinner from '../../../../components/Spinner'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../../utilities/deltaType'
import Header from '../../../../components/Header'
import Chart from '../../../../components/Chart'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import { BarChartIcon, LineChartIcon } from '../../../../icons/icons'
import Table, { IColumn } from '../../../../components/Table'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsight } from '../../../../api/api'
import { chartData } from '../../InsightList/InsightDetail'

const columns: IColumn<any, any>[] = [
    {
        headerName: 'Connector',
        field: 'connector',
        type: 'string',
        width: 120,
        enableRowGroup: true,
    },
    {
        headerName: 'Insight',
        type: 'string',
        sortable: false,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiInsight>
        ) =>
            params.data?.connector && (
                <Flex flexDirection="col" alignItems="start">
                    <Text className="text-gray-800 mb-0.5">
                        {params.data?.shortTitle}
                    </Text>
                    <Text>{params.data?.longTitle}</Text>
                </Flex>
            ),
    },
]

export default function InsightGroupDetail() {
    const navigate = useNavigate()
    const { id } = useParams()
    const activeTimeRange = useAtomValue(timeAtom)
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
    )
    const [selectedIndex, setSelectedIndex] = useState(0)
    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('line')
        if (selectedIndex === 1) setSelectedChart('bar')
    }, [selectedIndex])
    const navigateToInsightsDetails = (idd: number | undefined) => {
        navigate(`${idd}`)
    }

    const query = {
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end
            ? {
                  endTime: activeTimeRange.end.unix(),
              }
            : {
                  endTime: activeTimeRange.start.unix(),
              }),
    }

    const { response: insightTrend, isLoading: trendLoading } =
        useComplianceApiV1InsightGroupTrendDetail(String(id), query)
    const { response: insightDetail, isLoading: detailLoading } =
        useComplianceApiV1InsightGroupDetail(String(id), query)

    return (
        <Menu currentPage="key-insights">
            {trendLoading || detailLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : (
                <Flex flexDirection="col">
                    <Header
                        breadCrumb={[
                            insightDetail
                                ? insightDetail?.shortTitle
                                : 'Key insight detail',
                        ]}
                        datePicker
                    />
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        justifyContent="start"
                        className="mb-6"
                    >
                        <Title className="font-semibold whitespace-nowrap">
                            {insightDetail?.shortTitle}
                        </Title>
                        <Text>{insightDetail?.description}</Text>
                    </Flex>
                    <Card className="mb-4 gap-4">
                        <Grid numItems={4} className="w-full gap-4 mb-4">
                            <SummaryCard
                                border={false}
                                title="Total result"
                                metric={insightDetail?.totalResultValue}
                                metricPrev={insightDetail?.oldTotalResultValue}
                                loading={detailLoading}
                                deltaType={badgeTypeByDelta(
                                    insightDetail?.oldTotalResultValue,
                                    insightDetail?.totalResultValue
                                )}
                                delta={`${percentageByChange(
                                    insightDetail?.oldTotalResultValue,
                                    insightDetail?.totalResultValue
                                )}%`}
                            />
                            <Col />
                            <Col numColSpan={2}>
                                <Flex justifyContent="end" alignItems="start">
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
                        <Flex justifyContent="end" className="gap-2.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-kaytu-950" />
                            <Text>Insight count</Text>
                        </Flex>
                        <Chart
                            labels={chartData(insightTrend).label}
                            chartData={chartData(insightTrend).data}
                            chartType={selectedChart}
                        />
                    </Card>
                    <Table
                        id="insight_group_list"
                        columns={columns}
                        rowData={insightDetail?.insights}
                        onRowClicked={(e) => {
                            navigateToInsightsDetails(e.data?.id)
                        }}
                    />
                </Flex>
            )}
        </Menu>
    )
}
