import {
    BadgeDelta,
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
import LoggedInLayout from '../../../components/LoggedInLayout'
import {
    useComplianceApiV1InsightDetail,
    useComplianceApiV1InsightTrendDetail,
} from '../../../api/compliance.gen'
import { timeAtom } from '../../../store'
import MultipleAreaCharts from '../../../components/Charts/AreaCharts/MultipleAreaCharts'
import Downloader from './Downloader'
import { numericDisplay } from '../../../utilities/numericDisplay'
import Breadcrumbs from '../../../components/Breadcrumbs'
import Spinner from '../../../components/Spinner'

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

const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1)

const snakeCaseToLabel = (string: string) =>
    capitalizeFirstLetter(
        string
            .toLowerCase()
            .replace(/([-_][a-z])/g, (group) => group.replace('_', ' '))
    )

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
    // rowSelection: 'multiple',
    animateRows: true,
    getRowHeight: (params: any) => 50,
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
        ...(activeTimeRange.to && {
            endTime: dayjs(activeTimeRange.to).unix(),
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

    const breadcrubmsPages = [
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
                        <Breadcrumbs pages={breadcrubmsPages} />
                        <DateRangePicker
                            className="max-w-md"
                            value={activeTimeRange}
                            onValueChange={setActiveTimeRange}
                            selectPlaceholder="Selection"
                            enableClear={false}
                            maxDate={new Date()}
                        />
                    </Flex>
                    <Card>
                        <Flex flexDirection="col">
                            <Flex flexDirection="row">
                                <Title>{insightDetail?.shortTitle}</Title>
                                <Flex
                                    flexDirection="row"
                                    alignItems="end"
                                    className="w-fit"
                                >
                                    <Title>
                                        {insightDetail?.totalResultValue
                                            ? numericDisplay(
                                                  insightDetail?.totalResultValue ||
                                                      0
                                              )
                                            : 'N/A'}
                                    </Title>
                                    <Subtitle className="ml-1 mr-2">
                                        {`from ${
                                            insightDetail?.oldTotalResultValue
                                                ? numericDisplay(
                                                      insightDetail?.oldTotalResultValue ||
                                                          0
                                                  )
                                                : 'N/A'
                                        }`}
                                    </Subtitle>
                                    <BadgeDelta
                                        deltaType={
                                            calculatePercent(insightDetail) > 0
                                                ? 'moderateIncrease'
                                                : 'moderateDecrease'
                                        }
                                        className={`opacity-${
                                            calculatePercent(insightDetail) !==
                                            0
                                                ? 1
                                                : 0
                                        } cursor-pointer`}
                                    >
                                        {`${
                                            calculatePercent(insightDetail) > 0
                                                ? Math.ceil(
                                                      calculatePercent(
                                                          insightDetail
                                                      )
                                                  )
                                                : -1 *
                                                  Math.floor(
                                                      calculatePercent(
                                                          insightDetail
                                                      )
                                                  )
                                        }%`}
                                    </BadgeDelta>
                                </Flex>
                            </Flex>
                            <Text className="flex self-start mt-2 mb-6">
                                {insightDetail?.description}
                            </Text>
                        </Flex>
                        <MultipleAreaCharts
                            className="mt-4 h-80"
                            index="date"
                            yAxisWidth={60}
                            categories={['count']}
                            data={chartData(insightTrend)}
                            colors={['indigo']}
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
