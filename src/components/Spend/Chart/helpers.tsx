import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostStackedItem,
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint,
} from '../../../api/api'
import { dateDisplay, monthDisplay } from '../../../utilities/dateDisplay'
import { StackItem } from '../../Chart/Stacked'

const topFiveStackedMetrics = (
    data: GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint[]
) => {
    const uniqueMetricID = data
        .flatMap((v) => v.costStacked?.map((i) => i.metricID || '') || [])
        .filter((l, idx, arr) => arr.indexOf(l) === idx)

    const idCost = uniqueMetricID
        .map((metricID) => {
            const totalCost = data
                .flatMap(
                    (v) =>
                        v.costStacked
                            ?.filter((i) => i.metricID === metricID)
                            .map((j) => j.cost || 0) || []
                )
                .reduce((prev, curr) => prev + curr, 0)

            const metricName =
                data
                    .flatMap(
                        (v) =>
                            v.costStacked
                                ?.filter((i) => i.metricID === metricID)
                                .map((j) => j.metricName || '') || []
                    )
                    .at(0) || ''

            return {
                metricID,
                metricName,
                totalCost,
            }
        })
        .sort((a, b) => {
            if (a.totalCost === b.totalCost) {
                return 0
            }
            return a.totalCost < b.totalCost ? 1 : -1
        })

    return idCost.slice(0, 5)
}

const takeMetricsAndOthers = (
    metricIDs: {
        metricID: string
        metricName: string
        totalCost: number
    }[],
    v: GithubComKaytuIoKaytuEnginePkgInventoryApiCostStackedItem[]
) => {
    const result: GithubComKaytuIoKaytuEnginePkgInventoryApiCostStackedItem[] =
        []
    let others = 0
    v.forEach((item) => {
        if (
            metricIDs.map((i) => i.metricID).indexOf(item.metricID || '') === -1
        ) {
            others += item.cost || 0
        }
    })

    metricIDs.forEach((item) => {
        const p = v.filter((i) => i.metricID === item.metricID).at(0)
        if (p === undefined) {
            result.push({
                metricID: item.metricID,
                metricName: item.metricName,
                cost: 0,
            })
        } else {
            result.push(p)
        }
    })

    result.push({
        metricID: '___others___',
        metricName: 'Others',
        cost: others,
    })

    return result
}

export const costTrendChart = (
    trend:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint[]
        | undefined,
    chart: 'trend' | 'cumulative',
    layout: 'basic' | 'stacked',
    granularity: 'monthly' | 'daily' | 'yearly'
) => {
    const top5 = topFiveStackedMetrics(trend || [])
    const label = []
    const data: any = []
    const flag = []
    if (trend) {
        if (chart === 'trend') {
            for (let i = 0; i < trend?.length; i += 1) {
                const stacked = takeMetricsAndOthers(
                    top5,
                    trend[i].costStacked || []
                )
                label.push(
                    granularity === 'monthly'
                        ? monthDisplay(trend[i]?.date)
                        : dateDisplay(trend[i]?.date)
                )
                if (layout === 'basic') {
                    data.push(trend[i]?.cost)
                } else {
                    data.push(
                        stacked.map((v) => {
                            const j: StackItem = {
                                label: v.metricName || '',
                                value: v.cost || 0,
                            }
                            return j
                        })
                    )
                }
                if (
                    trend[i].totalConnectionCount !==
                    trend[i].totalSuccessfulDescribedConnectionCount
                ) {
                    flag.push(true)
                } else flag.push(false)
            }
        }
        if (chart === 'cumulative') {
            for (let i = 0; i < trend?.length; i += 1) {
                const stacked = takeMetricsAndOthers(
                    top5,
                    trend[i].costStacked || []
                )
                label.push(
                    granularity === 'monthly'
                        ? monthDisplay(trend[i]?.date)
                        : dateDisplay(trend[i]?.date)
                )

                if (i === 0) {
                    if (layout === 'basic') {
                        data.push(trend[i]?.cost)
                    } else {
                        data.push(
                            stacked.map((v) => {
                                const j: StackItem = {
                                    label: v.metricName || '',
                                    value: v.cost || 0,
                                }
                                return j
                            })
                        )
                    }
                } else if (layout === 'basic') {
                    data.push((trend[i]?.cost || 0) + data[i - 1])
                } else {
                    data.push(
                        stacked.map((v) => {
                            const prev = data[i - 1]
                                ?.filter((p: any) => p.label === v.metricName)
                                ?.at(0)

                            const j: StackItem = {
                                label: v.metricName || '',
                                value: (v.cost || 0) + (prev?.value || 0),
                            }
                            return j
                        })
                    )
                }
            }
        }
    }
    return {
        label,
        data,
        flag,
    }
}
