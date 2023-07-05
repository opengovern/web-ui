import {
    BadgeDelta,
    Callout,
    Card,
    DateRangePicker,
    Flex,
    Subtitle,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtom } from 'jotai/index'
import dayjs from 'dayjs'
import React, { useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { GridOptions } from 'ag-grid-community'
import 'ag-grid-enterprise'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import LoggedInLayout from '../../../components/LoggedInLayout'
import {
    useComplianceApiV1InsightDetail,
    useComplianceApiV1InsightTrendDetail,
} from '../../../api/compliance.gen'
import { timeAtom } from '../../../store'
import AreaCharts from '../../../components/Charts/AreaCharts'
import Downloader from './Downloader'
import { numericDisplay } from '../../../utilities/numericDisplay'
import Breadcrumbs from '../../../components/Breadcrumbs'
import Spinner from '../../../components/Spinner'
import InsightTablePanel from './InsightTablePanel'
import { snakeCaseToLabel } from '../../../utilities/labelMaker'

const chartData = (inputData: any) => {
    const data = []
    if (inputData) {
        for (let i = 0; i < inputData.length; i += 1) {
            data.push({
                count: inputData[i].value,
                date: dayjs
                    .unix(inputData[i].timestamp)
                    .format('MMM DD - HH:mm'),
            })
        }
    }
    return data
}

const insightsHeadersToColumns = (headers: any) => {
    if (headers && headers.length) {
        return headers.map((header: any) => ({
            field: header,
            headerName: snakeCaseToLabel(header),
            sortable: true,
            resizable: true,
            filter: true,
            flex: 1,
        }))
    }
    return []
}

const insightsResultToRows = (details: any) => {
    if (!details) {
        return []
    }
    const { rows, headers } = details
    return (
        rows?.map((array: any, i: any) => {
            const object = Object.fromEntries(
                headers.map((key: any, index: any) => [
                    key,
                    typeof array[index] === 'string'
                        ? array[index]
                        : JSON.stringify(array[index]),
                ])
            )
            return { id: i, ...object }
        }) || []
    )
}

const calculatePercent = (inputData: any) => {
    if (
        Number(inputData?.oldTotalResultValue) &&
        Number(inputData?.totalResultValue)
    ) {
        return (
            ((inputData.totalResultValue - inputData.oldTotalResultValue) /
                inputData.oldTotalResultValue) *
                100 || 0
        )
    }
    return 0
}

const gridOptions: GridOptions = {
    pagination: true,
    animateRows: true,
    getRowHeight: (params: any) => 50,
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

const generateBadge = (met: any) => {
    if (!met?.totalResultValue && !met?.oldTotalResultValue) {
        return (
            <Callout
                title="Time period is not covered by insight"
                color="rose"
                icon={ExclamationCircleIcon}
                className="ml-3 border-0 text-xs leading-5 w-96 drop-shadow-sm"
            />
        )
    }
    if (!met?.totalResultValue) {
        return (
            <Callout
                title="End value is not available"
                color="rose"
                icon={ExclamationCircleIcon}
                className="ml-3 border-0 text-xs leading-5 w-96 drop-shadow-sm"
            />
        )
    }
    if (!met?.oldTotalResultValue) {
        return (
            <Callout
                title="Prior value is not available"
                color="rose"
                icon={ExclamationCircleIcon}
                className="ml-3 border-0 text-xs leading-5 w-96 drop-shadow-sm"
            />
        )
    }
    return (
        <BadgeDelta
            deltaType={
                calculatePercent(met) > 0
                    ? 'moderateIncrease'
                    : 'moderateDecrease'
            }
            className={`opacity-${
                calculatePercent(met) !== 0 ? 1 : 0
            } cursor-pointer my-2`}
        >
            {`${
                calculatePercent(met) > 0
                    ? Math.ceil(calculatePercent(met))
                    : -1 * Math.floor(calculatePercent(met))
            }%`}
        </BadgeDelta>
    )
}

export default function InsightDetail() {
    const gridRef = useRef<AgGridReact>(null)
    const navigate = useNavigate()
    const { id } = useParams()
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const query = {
        ...(activeTimeRange.from && {
            startTime: dayjs(activeTimeRange.from).unix(),
        }),
        ...(activeTimeRange.to
            ? {
                  endTime: dayjs(activeTimeRange.to).unix(),
              }
            : {
                  endTime: dayjs(activeTimeRange.from).unix(),
              }),
    }
    const { response: insightTrend } = useComplianceApiV1InsightTrendDetail(
        String(id),
        query
    )
    const { response: insightDetail, isLoading: detailLoading } =
        useComplianceApiV1InsightDetail(String(id), query)

    const columns =
        insightDetail?.result && insightDetail?.result[0]?.details
            ? insightDetail?.result[0].details.headers
            : []

    const rows = insightDetail?.result
        ? insightDetail?.result[0].details
        : undefined

    const breadcrumbsPages = [
        {
            name: 'Insights',
            path: () => {
                navigate(-1)
            },
            current: false,
        },
        { name: insightDetail?.shortTitle, path: '', current: true },
    ]

    return (
        <LoggedInLayout currentPage="insight">
            {detailLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : (
                <Flex flexDirection="col">
                    <Flex
                        flexDirection="row"
                        justifyContent="between"
                        alignItems="center"
                        className="mb-6"
                    >
                        <Breadcrumbs pages={breadcrumbsPages} />
                        <DateRangePicker
                            className="max-w-md"
                            value={activeTimeRange}
                            onValueChange={setActiveTimeRange}
                            enableClear={false}
                            maxDate={new Date()}
                        />
                    </Flex>
                    <Flex flexDirection="col">
                        <Flex flexDirection="row">
                            <Title className="whitespace-nowrap">
                                {insightDetail?.shortTitle}
                            </Title>
                            <Flex
                                flexDirection="row"
                                alignItems="end"
                                justifyContent="end"
                            >
                                {!!insightDetail?.totalResultValue && (
                                    <Title className="mr-1">
                                        {numericDisplay(
                                            insightDetail?.totalResultValue || 0
                                        )}
                                    </Title>
                                )}
                                {!!insightDetail?.oldTotalResultValue && (
                                    <Subtitle className="text-sm mb-0.5">
                                        {`Prior value: ${numericDisplay(
                                            insightDetail?.oldTotalResultValue ||
                                                0
                                        )}`}
                                    </Subtitle>
                                )}
                            </Flex>
                            {generateBadge(insightDetail)}
                        </Flex>
                        <Text className="flex self-start mt-2 mb-6">
                            {insightDetail?.description}
                        </Text>
                    </Flex>
                    <Card>
                        <Title>Insight count</Title>
                        <AreaCharts
                            className="mt-4 h-80"
                            index="date"
                            yAxisWidth={60}
                            categories={['count']}
                            data={chartData(insightTrend)}
                            colors={['indigo']}
                            // curveType="natural"
                        />
                    </Card>
                    <Flex flexDirection="row" className="mt-6">
                        <Title>Results</Title>
                        <Downloader
                            Headers={columns}
                            Rows={rows?.rows ? rows.rows : []}
                            Name={insightDetail?.shortTitle}
                        />
                    </Flex>
                    <div className="w-full mt-3 ag-theme-alpine">
                        <AgGridReact
                            ref={gridRef}
                            domLayout="autoHeight"
                            gridOptions={gridOptions}
                            columnDefs={insightsHeadersToColumns(columns)}
                            rowData={insightsResultToRows(rows)}
                        />
                    </div>
                </Flex>
            )}
        </LoggedInLayout>
    )
}
