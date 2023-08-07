import { BarChart, Card, Flex, Grid, Title } from '@tremor/react'
import dayjs from 'dayjs'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import CardWithList from '../../../../../components/Cards/CardWithList'
import Chart from '../../../../../components/Charts'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../../../api/api'
import {
    useComplianceApiV1BenchmarksTrendDetail,
    useComplianceApiV1FindingsTopDetail,
} from '../../../../../api/compliance.gen'
import { dateDisplay } from '../../../../../utilities/dateDisplay'

interface ISummary {
    detail:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
        | undefined
    id: string | undefined
    connections: any
    timeRange: { start: dayjs.Dayjs; end: dayjs.Dayjs }
}

const generateBarData = (input: any) => {
    const list = []
    if (input) {
        for (let i = 0; i < input.length; i += 1) {
            list.push({
                date: dateDisplay(input[i].timestamp * 1000),
                Critical: input[i].checks?.criticalCount || 0,
                High: input[i].checks?.highCount || 0,
                Medium: input[i].checks?.mediumCount || 0,
                Low: input[i].checks?.lowCount || 0,
                Passed: input[i].checks?.passedCount || 0,
                Unknown: input[i].checks?.unknownCount || 0,
            })
        }
    }
    return list
}

const generateLineData = (input: any) => {
    const list = []
    if (input) {
        for (let i = 0; i < input.length; i += 1) {
            list.push({
                date: dateDisplay(input[i].timestamp * 1000),
                Score: (
                    ((input[i].checks?.passedCount || 0) /
                        ((input[i].checks?.criticalCount || 0) +
                            (input[i].checks?.highCount || 0) +
                            (input[i].checks?.mediumCount || 0) +
                            (input[i].checks?.lowCount || 0) +
                            (input[i].checks?.passedCount || 0) +
                            (input[i].checks?.unknownCount || 0))) *
                        100 || 0
                ).toFixed(2),
            })
        }
    }
    return list
}

export default function Summary({
    detail,
    id,
    connections,
    timeRange,
}: ISummary) {
    const query = {
        ...(connections.provider && {
            connector: [connections.provider],
        }),
        ...(connections.connections && {
            connectionId: connections.connections,
        }),
        ...(timeRange.start && {
            startTime: timeRange.start.unix().toString(),
        }),
        ...(timeRange.end && {
            endTime: timeRange.end.unix().toString(),
        }),
    }

    const { response: benchmarkTrend } =
        useComplianceApiV1BenchmarksTrendDetail(String(id), query)
    const { response: resources, isLoading } =
        useComplianceApiV1FindingsTopDetail(String(id), 'resourceID', 7, query)
    const { response: resourceTypes } = useComplianceApiV1FindingsTopDetail(
        String(id),
        'resourceType',
        7,
        query
    )
    const { response: services } = useComplianceApiV1FindingsTopDetail(
        String(id),
        'service',
        7,
        query
    )
    const { response: connection } = useComplianceApiV1FindingsTopDetail(
        String(id),
        'connectionID',
        7,
        query
    )

    const generateTopDetail = () => {
        const resourceData =
            resources?.records?.map((rec) => {
                return {
                    name: rec.value,
                    value: rec.count,
                }
            }) || []
        const resourceTypeData =
            resourceTypes?.records?.map((rec) => {
                return {
                    name: rec.value,
                    value: rec.count,
                }
            }) || []
        const serviceData =
            services?.records?.map((rec) => {
                return {
                    name: rec.value,
                    value: rec.count,
                }
            }) || []
        const connectionData =
            connection?.records?.map((rec) => {
                return {
                    name: rec.value,
                    value: rec.count,
                }
            }) || []
        return {
            Resources: resourceData,
            'Resource Type': resourceTypeData,
            Services: serviceData,
            Connections: connectionData,
        }
    }

    const ok = detail?.result?.okCount || 0
    const info = detail?.result?.infoCount || 0
    const error = detail?.result?.errorCount || 0
    const alarm = detail?.result?.alarmCount || 0
    const skip = detail?.result?.skipCount || 0

    return (
        <Flex flexDirection="col">
            <Grid numItems={2} numItemsMd={4} className="w-full gap-4 mb-4">
                <SummaryCard title="Number of active alarms" metric={alarm} />
                <SummaryCard
                    title="Resources with alarms"
                    metric={resources?.totalCount || 0}
                    loading={isLoading}
                />
                <SummaryCard
                    title="Security score"
                    metric={`${(
                        (alarm / (ok + info + error + alarm + skip)) *
                        100
                    ).toFixed(2)}%`}
                />
                <SummaryCard
                    title="Coverage"
                    metric={`${(
                        (ok / (ok + info + error + skip + alarm)) *
                        100
                    ).toFixed(2)}%`}
                />
            </Grid>
            <Grid numItems={1} numItemsMd={2} className="w-full gap-4 mb-4">
                <CardWithList
                    title="Top Findings"
                    tabs={[
                        'Resources',
                        'Resource Type',
                        'Services',
                        'Connections',
                    ]}
                    data={generateTopDetail()}
                />
                <Card>
                    <Title className="font-semibold">Summary</Title>
                    <BarChart
                        className="mt-4"
                        data={generateBarData(benchmarkTrend)}
                        categories={[
                            'Critical',
                            'High',
                            'Medium',
                            'Low',
                            'Passed',
                            'Unknown',
                        ]}
                        index="date"
                        stack
                        colors={[
                            'rose',
                            'orange',
                            'yellow',
                            'blue',
                            'emerald',
                            'slate',
                        ]}
                        showAnimation={false}
                    />
                </Card>
            </Grid>
            <Card>
                <Title className="font-semibold">
                    Compliance Security Score Trend
                </Title>
                <Chart
                    className="mt-4"
                    index="date"
                    type="line"
                    categories={['Score']}
                    valueFormatter={(value) => `${value}%`}
                    data={generateLineData(benchmarkTrend)}
                />
            </Card>
        </Flex>
    )
}
