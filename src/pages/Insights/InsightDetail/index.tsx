import { Col, DateRangePicker, Flex, Grid, Title } from '@tremor/react'
import { useParams } from 'react-router-dom'
import { useAtom } from 'jotai/index'
import dayjs from 'dayjs'
import { useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { GridOptions } from 'ag-grid-community'
import LoggedInLayout from '../../../components/LoggedInLayout'
import {
    useComplianceApiV1InsightDetail,
    useComplianceApiV1InsightTrendDetail,
} from '../../../api/compliance.gen'
import { timeAtom } from '../../../store'
import InsightCard from '../../../components/Cards/InsightCard'
import InsightDescriptionCard from '../../../components/Cards/InsightDescriptionCard'
import MultipleAreaCharts from '../../../components/Charts/AreaCharts/MultipleAreaCharts'

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
                    String(array[index]),
                ])
            )
            return { id: i, ...object }
        }) || []
    )
}

const gridOptions: GridOptions = {
    pagination: true,
    // rowSelection: 'multiple',
    animateRows: true,
    getRowHeight: (params: any) => 50,
}

export default function InsightDetail() {
    const gridRef = useRef<AgGridReact>(null)
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
    const { response: insightDetail } = useComplianceApiV1InsightDetail(
        String(id),
        query
    )

    const columns = insightsHeadersToColumns(
        insightDetail?.result && insightDetail?.result[0]?.details
            ? insightDetail?.result[0].details.headers
            : []
    )
    const rows = insightsResultToRows(
        insightDetail?.result ? insightDetail?.result[0].details : []
    )

    return (
        <LoggedInLayout currentPage="insight">
            <Flex flexDirection="col">
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    alignItems="center"
                    className="mb-6"
                >
                    <Title>{insightDetail?.shortTitle}</Title>
                    <DateRangePicker
                        className="max-w-md"
                        value={activeTimeRange}
                        onValueChange={setActiveTimeRange}
                        selectPlaceholder="Selection"
                    />
                </Flex>
                <Grid
                    numItems={1}
                    numItemsSm={2}
                    numItemsLg={3}
                    className="w-full gap-3 mb-6"
                >
                    <Col numColSpan={1}>
                        <InsightCard metric={insightDetail || {}} />
                    </Col>
                    <Col numColSpan={2}>
                        <InsightDescriptionCard metric={insightDetail || {}} />
                    </Col>
                </Grid>
                <MultipleAreaCharts
                    className="mt-4 h-80"
                    index="date"
                    yAxisWidth={60}
                    categories={['count']}
                    data={chartData(insightTrend)}
                    colors={['indigo']}
                />
                <div className="w-full mt-6 ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                        columnDefs={columns}
                        rowData={rows}
                    />
                </div>
            </Flex>
        </LoggedInLayout>
    )
}
