import {
    Button,
    Callout,
    Card,
    Col,
    Flex,
    Grid,
    Select,
    SelectItem,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { GridOptions } from 'ag-grid-community'
import 'ag-grid-enterprise'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { maskPassword } from 'maskdata'
import Menu from '../../../../components/Menu'
import {
    useComplianceApiV1InsightDetail,
    useComplianceApiV1InsightTrendDetail,
} from '../../../../api/compliance.gen'
import { timeAtom } from '../../../../store'
import Spinner from '../../../../components/Spinner'
import InsightTablePanel from './InsightTablePanel'
import { snakeCaseToLabel } from '../../../../utilities/labelMaker'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../../utilities/deltaType'
import { dateDisplay } from '../../../../utilities/dateDisplay'
import Header from '../../../../components/Header'
import Table, { IColumn } from '../../../../components/Table'
import Chart from '../../../../components/Chart'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import { isDemo } from '../../../../utilities/demo'
import { BarChartIcon, LineChartIcon } from '../../../../icons/icons'

const chartData = (inputData: any) => {
    const label = []
    const data = []
    if (inputData && inputData.length) {
        for (let i = 0; i < inputData?.length; i += 1) {
            label.push(dateDisplay((inputData[i]?.timestamp || 0) * 1000))
            data.push(inputData[i]?.value)
        }
    }
    return {
        label,
        data,
    }
}

const getTable = (header: any, details: any) => {
    const columns: IColumn<any, any>[] = []
    const row: any[] = []
    if (header && header.length) {
        for (let i = 0; i < header.length; i += 1) {
            columns.push({
                field: header[i],
                headerName: snakeCaseToLabel(header[i]),
                type: 'string',
                sortable: true,
                resizable: true,
                filter: true,
                flex: 1,
            })
        }
    }
    if (details) {
        const { rows, headers } = details
        if (rows && rows.length) {
            for (let i = 0; i < rows.length; i += 1) {
                const object = Object.fromEntries(
                    isDemo()
                        ? headers.map((key: any, index: any) => [
                              key,
                              typeof rows[i][index] === 'string'
                                  ? maskPassword(rows[i][index])
                                  : maskPassword(
                                        JSON.stringify(rows[i][index])
                                    ),
                          ])
                        : headers.map((key: any, index: any) => [
                              key,
                              typeof rows[i][index] === 'string'
                                  ? rows[i][index]
                                  : JSON.stringify(rows[i][index]),
                          ])
                )
                row.push({ id: i, ...object })
            }
        }
    }
    return {
        columns,
        row,
    }
}

const gridOptions: GridOptions = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sideBar: {
        toolPanels: [
            {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
            },
            {
                id: 'filters',
                labelDefault: 'Filters',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
            },
            {
                id: 'uniqueCount',
                labelDefault: 'Unique Counts',
                labelKey: 'uniqueCount',
                toolPanel: InsightTablePanel,
            },
        ],
        defaultToolPanel: '',
    },
}

export default function InsightDetail() {
    const { id } = useParams()
    const activeTimeRange = useAtomValue(timeAtom)
    const [detailsDate, setDetailsDate] = useState<string>('')
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
    )
    const [selectedIndex, setSelectedIndex] = useState(0)
    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('line')
        if (selectedIndex === 1) setSelectedChart('bar')
    }, [selectedIndex])

    const start = () => {
        if (detailsDate === '') {
            return activeTimeRange.start
        }
        const d = new Date(0)
        d.setUTCSeconds(parseInt(detailsDate, 10) - 1)
        return dayjs(d)
    }
    const end = () => {
        if (detailsDate === '') {
            return activeTimeRange.end || activeTimeRange.start
        }
        const d = new Date(0)
        d.setUTCSeconds(parseInt(detailsDate, 10) + 1)
        return dayjs(d)
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
    const detailsQuery = {
        ...(activeTimeRange.start && {
            startTime: start().unix(),
            endTime: end().unix(),
        }),
    }

    const { response: insightTrend, isLoading: trendLoading } =
        useComplianceApiV1InsightTrendDetail(String(id), query)
    const { response: insightDetail, isLoading: detailLoading } =
        useComplianceApiV1InsightDetail(String(id), detailsQuery)

    const columns =
        insightDetail?.result && insightDetail?.result[0]?.details
            ? insightDetail?.result[0].details.headers
            : []
    const rows = insightDetail?.result
        ? insightDetail?.result[0].details
        : undefined

    const trendDates = () => {
        return (
            insightTrend?.map((item) => {
                const dt = item.timestamp || 0
                const d = new Date(0)
                d.setUTCSeconds(dt)
                return (
                    <SelectItem value={dt.toString()}>
                        {d.toLocaleString()}
                    </SelectItem>
                )
            }) || []
        )
    }

    return (
        <Menu currentPage="all-insights">
            {trendLoading || detailLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : (
                <Flex flexDirection="col">
                    <Header breadCrumb={['Insight detail']} datePicker />
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
                            <Flex className="pl-4 border-l border-l-gray-200">
                                <SummaryCard
                                    border={false}
                                    title="Evaluated"
                                    metric={10}
                                />
                            </Flex>
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
                    {detailsDate !== '' && (
                        <Flex
                            flexDirection="row"
                            className="bg-kaytu-50 my-2 rounded-md pr-6"
                        >
                            <Callout
                                title={`The available data for the result is exclusively limited to ${end().format(
                                    'MMM DD, YYYY'
                                )}.`}
                                color="blue"
                                icon={ExclamationCircleIcon}
                                className="w-full text-xs leading-5 truncate max-w-full"
                            >
                                <Flex flexDirection="row">
                                    <Text className="text-kaytu-800">
                                        The following results present you with a
                                        partial result based on the filter you
                                        have selected.
                                    </Text>
                                </Flex>
                            </Callout>
                            <Button
                                variant="secondary"
                                onClick={() => setDetailsDate('')}
                            >
                                Show All
                            </Button>
                        </Flex>
                    )}
                    <Table
                        title="Results"
                        id="insight_detail"
                        columns={getTable(columns, rows).columns}
                        rowData={getTable(columns, rows).row}
                        downloadable
                        options={gridOptions}
                        onGridReady={(e) => {
                            if (detailLoading) {
                                e.api.showLoadingOverlay()
                            }
                        }}
                    >
                        <Select
                            className="h-full"
                            onValueChange={setDetailsDate}
                            placeholder={
                                detailsDate === ''
                                    ? 'Latest'
                                    : end().format('MMM DD, YYYY')
                            }
                        >
                            {trendDates()}
                        </Select>
                    </Table>
                </Flex>
            )}
        </Menu>
    )
}
