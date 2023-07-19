import { BarChart, Card, Flex, Grid, Title } from '@tremor/react'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import CardWithList from '../../../../../components/Cards/CardWithList'
import Chart from '../../../../../components/Charts'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../../../api/api'
import { filterAtom } from '../../../../../store'
import {
    useComplianceApiV1BenchmarksTrendDetail,
    useComplianceApiV1FindingsTopDetail,
} from '../../../../../api/compliance.gen'

interface ISummary {
    detail:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
        | undefined
    id: string | undefined
}

const generateBarData = (input: any) => {
    const list = []
    if (input) {
        for (let i = 0; i < input.length; i += 1) {
            list.push({
                date: dayjs(input[i].timestamp * 1000).format('MMM DD, YYYY'),
                Critical: input[i].checks.criticalCount,
                High: input[i].checks.highCount,
                Medium: input[i].checks.mediumCount,
                Low: input[i].checks.lowCount,
                Passed: input[i].checks.passedCount,
                Unknown: input[i].checks.unknownCount,
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
                date: dayjs(input[i].timestamp * 1000).format('MMM DD, YYYY'),
                Score: (
                    (input[i].checks.passedCount /
                        (input[i].checks.criticalCount +
                            input[i].checks.highCount +
                            input[i].checks.mediumCount +
                            input[i].checks.lowCount +
                            input[i].checks.passedCount +
                            input[i].checks.unknownCount)) *
                        100 || 0
                ).toFixed(2),
            })
        }
    }
    return list
}

export default function Summary({ detail, id }: ISummary) {
    const selectedConnections = useAtomValue(filterAtom)

    const { response: benchmarkTrend } =
        useComplianceApiV1BenchmarksTrendDetail(String(id))
    const { response: resources } = useComplianceApiV1FindingsTopDetail(
        String(id),
        'resourceID',
        7
    )
    const { response: resourceTypes } = useComplianceApiV1FindingsTopDetail(
        String(id),
        'resourceType',
        7
    )
    const { response: services } = useComplianceApiV1FindingsTopDetail(
        String(id),
        'connectionID',
        7
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
        return {
            Resources: resourceData,
            'Resource Type': resourceTypeData,
            Services: serviceData,
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
                <SummaryCard title="Resources with alarms" metric={10} />
                <SummaryCard title="Resources with alarms" metric={10} />
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
                    title="Top Services"
                    tabs={['Resources', 'Resource Type', 'Services']}
                    data={generateTopDetail()}
                />
                <Card>
                    <Title>Summary</Title>
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
                            'amber',
                            'yellow',
                            'emerald',
                            'slate',
                        ]}
                    />
                </Card>
            </Grid>
            <Card>
                <Title>Compliance Score Trend</Title>
                <Chart
                    className="mt-4"
                    index="date"
                    type="line"
                    categories={['Score']}
                    data={generateLineData(benchmarkTrend)}
                />
            </Card>
        </Flex>
    )
}
