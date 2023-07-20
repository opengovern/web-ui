import { Grid } from '@tremor/react'
import SummaryCard from '../../../components/Cards/SummaryCard'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse } from '../../../api/api'

interface ISummary {
    benchmark:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse
        | undefined
    loading: boolean
}

export default function Summary({ benchmark, loading }: ISummary) {
    const critical = benchmark?.totalChecks?.criticalCount || 0
    const high = benchmark?.totalChecks?.highCount || 0
    const medium = benchmark?.totalChecks?.mediumCount || 0
    const low = benchmark?.totalChecks?.lowCount || 0
    const passed = benchmark?.totalChecks?.passedCount || 0
    const unknown = benchmark?.totalChecks?.unknownCount || 0

    const total = critical + high + medium + low + passed + unknown

    return (
        <Grid
            numItems={1}
            numItemsMd={2}
            numItemsLg={3}
            className="w-full gap-4 mt-6 mb-10"
        >
            <SummaryCard
                title="Number of active alarms"
                metric={benchmark?.totalResult?.alarmCount || 0}
                loading={loading}
            />
            <SummaryCard title="Accounts" metric="450" loading={loading} />
            <SummaryCard
                title="Coverage"
                metric={`${((passed / total) * 100).toFixed(2)}%`}
                loading={loading}
            />
        </Grid>
    )
}
