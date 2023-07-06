import {
    BadgeDelta,
    Button,
    Callout,
    Card,
    Col,
    DateRangePicker,
    Flex,
    Grid,
    Icon,
    SearchSelect,
    SearchSelectItem,
    Select,
    SelectItem,
    Subtitle,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtom } from 'jotai/index'
import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
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
import Downloader from './Downloader'
import {
    numberGroupedDisplay,
    numericDisplay,
} from '../../../utilities/numericDisplay'
import Breadcrumbs from '../../../components/Breadcrumbs'
import Spinner from '../../../components/Spinner'
import InsightTablePanel from './InsightTablePanel'
import { snakeCaseToLabel } from '../../../utilities/labelMaker'
import Chart from '../../../components/Charts'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../utilities/deltaType'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsight } from '../../../api/api'
import { ReactComponent as AWSIcon } from '../../../icons/elements-supplemental-provider-logo-aws-original.svg'
import { ReactComponent as AzureIcon } from '../../../icons/elements-supplemental-provider-logo-azure-new.svg'

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
    paginationPageSize: 50,
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

const generateBadge = (
    met: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight | undefined
) => {
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
                title={`Data is availabe after ${dayjs(
                    met.firstOldResultDate
                ).format('MMM DD, YYYY')}`}
                color="rose"
                icon={ExclamationCircleIcon}
                className="ml-3 border-0 text-xs leading-5 w-96 drop-shadow-sm"
            />
        )
    }
    return (
        <BadgeDelta
            deltaType={badgeTypeByDelta(
                met.oldTotalResultValue,
                met.totalResultValue
            )}
            className="cursor-pointer my-2"
        >
            {`${percentageByChange(
                met.oldTotalResultValue,
                met.totalResultValue
            )}%`}
        </BadgeDelta>
    )
}

export default function InsightDetail() {
    const gridRef = useRef<AgGridReact>(null)
    const navigate = useNavigate()
    const { id } = useParams()
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [detailsDate, setDetailsDate] = useState<string>('')

    const start = () => {
        if (detailsDate === '') {
            return dayjs(activeTimeRange.from || new Date())
        }
        const d = new Date(0)
        d.setUTCSeconds(parseInt(detailsDate, 10) - 1)
        return dayjs(d)
    }
    const end = () => {
        if (detailsDate === '') {
            return dayjs(
                activeTimeRange.to || activeTimeRange.from || new Date()
            )
        }
        const d = new Date(0)
        d.setUTCSeconds(parseInt(detailsDate, 10) + 1)
        return dayjs(d)
    }
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
    const { response: insightTrend, isLoading: trendLoading } =
        useComplianceApiV1InsightTrendDetail(String(id), query)

    const detailsQuery = {
        ...(activeTimeRange.from && {
            startTime: start().unix(),
            endTime: end().unix(),
        }),
    }
    const { response: insightDetail, isLoading: detailLoading } =
        useComplianceApiV1InsightDetail(String(id), detailsQuery)

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
                navigate('./..')
            },
            current: false,
        },
        { name: insightDetail?.shortTitle, path: '', current: true },
    ]

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

    const getConnectorIcon = (connector: any) => {
        if (connector === 'AWS')
            return (
                <Icon
                    icon={AWSIcon}
                    size="xl"
                    variant="shadow"
                    color="orange"
                />
            )
        return <Icon icon={AzureIcon} size="xl" variant="shadow" color="blue" />
    }

    useEffect(() => {
        if (detailLoading) {
            gridRef.current?.api.showLoadingOverlay()
        }
    }, [detailLoading])

    return (
        <LoggedInLayout currentPage="insight">
            {trendLoading && detailLoading ? (
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
                            {detailLoading ? (
                                <Spinner className="my-6" />
                            ) : (
                                <Flex
                                    flexDirection="row"
                                    justifyContent="between"
                                    alignItems="start"
                                    className="mb-4"
                                >
                                    <Flex
                                        flexDirection="row"
                                        justifyContent="start"
                                        // className="w-2/3"
                                    >
                                        {getConnectorIcon(
                                            insightDetail?.connector
                                        )}
                                        <Flex
                                            flexDirection="col"
                                            alignItems="start"
                                            className="ml-3"
                                        >
                                            <Title className="whitespace-nowrap">
                                                {insightDetail?.shortTitle}
                                            </Title>
                                            <Text>
                                                {insightDetail?.description}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                    <Flex flexDirection="row">
                                        <Flex
                                            flexDirection="row"
                                            alignItems="end"
                                            justifyContent="end"
                                            className="m-3"
                                        >
                                            {!!insightDetail?.totalResultValue && (
                                                <Title className="mr-1">
                                                    {numberGroupedDisplay(
                                                        insightDetail?.totalResultValue ||
                                                            0
                                                    )}
                                                </Title>
                                            )}
                                            {!!insightDetail?.oldTotalResultValue && (
                                                <Subtitle className="text-sm mb-0.5">
                                                    {`From: ${numberGroupedDisplay(
                                                        insightDetail?.oldTotalResultValue ||
                                                            0
                                                    )}`}
                                                </Subtitle>
                                            )}
                                        </Flex>
                                        {generateBadge(insightDetail)}
                                    </Flex>
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                    <Card>
                        <Title>Insight count</Title>
                        <Chart
                            className="mt-4 h-80"
                            index="date"
                            type="line"
                            yAxisWidth={60}
                            categories={['count']}
                            data={chartData(insightTrend)}
                            // curveType="natural"
                        />
                    </Card>
                    <Flex flexDirection="row" className="mt-6">
                        <Title>Results</Title>
                        <Flex className="w-1/3">
                            <Select
                                className="mr-4"
                                onValueChange={setDetailsDate}
                                placeholder={
                                    detailsDate === ''
                                        ? 'Latest'
                                        : end().format('YYYY-MM-DD')
                                }
                            >
                                <>{trendDates()}</>
                            </Select>
                            <Downloader
                                Headers={columns}
                                Rows={rows?.rows ? rows.rows : []}
                                Name={insightDetail?.shortTitle}
                            />
                        </Flex>
                    </Flex>
                    {detailsDate !== '' && (
                        <Flex
                            flexDirection="row"
                            className="bg-blue-50 mt-2 rounded-md pr-6"
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
                                    <Text className="text-blue-800">
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
