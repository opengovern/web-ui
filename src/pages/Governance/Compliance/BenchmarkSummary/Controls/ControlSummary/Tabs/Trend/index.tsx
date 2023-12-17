import { useAtomValue } from 'jotai/index'
import { useState } from 'react'
import { useComplianceApiV1ControlsTrendDetail } from '../../../../../../../../api/compliance.gen'
import { timeAtom } from '../../../../../../../../store'
import { checkGranularity } from '../../../../../../../../utilities/dateComparator'
import SummaryCard from '../../../../../../../../components/Cards/SummaryCard'
import Trends from '../../../../../../../../components/Trends'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiControlTrendDatapoint } from '../../../../../../../../api/api'
import {
    dateDisplay,
    dateTimeDisplay,
    monthDisplay,
} from '../../../../../../../../utilities/dateDisplay'

interface ITrend {
    controlId: string | undefined
}

const resourceTrendChart = (
    trend:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiControlTrendDatapoint[]
        | undefined,
    granularity: 'monthly' | 'daily' | 'yearly'
) => {
    const label = []
    const data: any = []
    const flag = []
    if (trend) {
        for (let i = 0; i < trend?.length; i += 1) {
            label.push(
                granularity === 'monthly'
                    ? monthDisplay((trend[i]?.timestamp || 0) * 1000)
                    : dateDisplay((trend[i]?.timestamp || 0) * 1000)
            )
            data.push(trend[i]?.totalConnectionCount)
            if (
                trend[i].totalConnectionCount !== trend[i].failedConnectionCount
            ) {
                flag.push(true)
            } else flag.push(false)
        }
    }
    return {
        label,
        data,
        flag,
    }
}

export default function Trend({ controlId }: ITrend) {
    const activeTimeRange = useAtomValue(timeAtom)
    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'yearly'
    >(
        checkGranularity(activeTimeRange.start, activeTimeRange.end).daily
            ? 'daily'
            : 'monthly'
    )

    const query = {
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
    }
    const { response, isLoading } = useComplianceApiV1ControlsTrendDetail(
        String(controlId),
        {
            ...query,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            granularity: selectedGranularity,
        }
    )

    return (
        <Trends
            activeTimeRange={activeTimeRange}
            trend={response}
            trendName="Accounts"
            firstKPI={
                <SummaryCard
                    title="Resources"
                    metric={
                        response
                            ? response[response.length - 1].totalResourcesCount
                            : 0
                    }
                    metricPrev={response ? response[0].totalResourcesCount : 0}
                    loading={isLoading}
                    border={false}
                />
            }
            secondKPI={
                <SummaryCard
                    title="Cloud Accounts"
                    metric={
                        response
                            ? response[response.length - 1].totalConnectionCount
                            : 0
                    }
                    metricPrev={response ? response[0].totalConnectionCount : 0}
                    loading={isLoading}
                    border={false}
                />
            }
            labels={resourceTrendChart(response, selectedGranularity).label}
            chartData={resourceTrendChart(response, selectedGranularity).data}
            loading={isLoading}
            onGranularityChange={(gra) => setSelectedGranularity(gra)}
        />
    )
}
