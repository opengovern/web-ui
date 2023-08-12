import { Grid } from '@tremor/react'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import SummaryCard from '../../../components/Cards/SummaryCard'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse } from '../../../api/api'
import { filterAtom, timeAtom } from '../../../store'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../api/onboard.gen'
import { numericDisplay } from '../../../utilities/numericDisplay'

interface ISummary {
    benchmark:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse
        | undefined
    loading: boolean
}

export default function Summary({ benchmark, loading }: ISummary) {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const { response: accounts, isLoading: accountLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            ...(selectedConnections.provider !== '' && {
                connector: [selectedConnections.provider],
            }),
            connectionId: selectedConnections.connections,
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            pageSize: 10000,
            pageNumber: 1,
            needCost: false,
            needResourceCount: false,
        })

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
            <SummaryCard
                title="Accounts"
                metric={numericDisplay(accounts?.connectionCount)}
                loading={accountLoading}
            />
            <SummaryCard
                title="Coverage"
                metric={`${((passed / total) * 100).toFixed(2)}%`}
                loading={loading}
            />
        </Grid>
    )
}
