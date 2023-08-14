import { useAtomValue } from 'jotai'
import { DeltaType } from '@tremor/react'
import { useInventoryApiV2AnalyticsCompositionDetail } from '../../../../api/inventory.gen'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import Composition from '../../../../components/Cards/Composition'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiCountPair,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse,
} from '../../../../api/api'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../../utilities/deltaType'
import { filterAtom, timeAtom } from '../../../../store'
import { isDemo } from '../../../../utilities/demo'

type IProps = {
    top: number
}

interface chartProps {
    name: string
    value: number
}

interface dataProps {
    total: string
    totalValueCount: string
    chart: chartProps[]
}

interface compositeItem {
    name: string
    value: string
    delta?: string
    deltaType?: DeltaType
    val: number
}

const composition2 = {
    total_count: 542152,
    total_value_count: 16,
    top_values: {
        Compute: {
            old_count: 176303,
            count: 162918,
        },
        Governance: {
            old_count: 60884,
            count: 59284,
        },
        Monitoring: {
            old_count: 35199,
            count: 39135,
        },
        Network: {
            old_count: 60562,
            count: 100794,
        },
        Storage: {
            old_count: 57854,
            count: 57971,
        },
    },
    others: {
        old_count: 111960,
        count: 122050,
    },
}

export default function CompositionTab({ top }: IProps) {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const query = {
        top,
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(activeTimeRange.end && {
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
        }),
    }
    const { response: composition, isLoading } =
        useInventoryApiV2AnalyticsCompositionDetail('category', query)

    const recordToArray = (
        record?: Record<
            string,
            GithubComKaytuIoKaytuEnginePkgInventoryApiCountPair
        >,
        old = 0
    ) => {
        if (record === undefined) {
            return []
        }

        return Object.keys(record).map((key) => {
            return {
                name: key,
                value:
                    old === 1
                        ? record[key].old_count || 0
                        : record[key].count || 0,
            }
        })
    }

    const compositionCart = (
        compositionData:
            | GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse
            | undefined,
        old = 0
    ) => {
        const v: dataProps = {
            total: numericDisplay(compositionData?.total_count),
            totalValueCount: numericDisplay(compositionData?.total_value_count),
            chart: recordToArray(compositionData?.top_values, old),
        }
        const others = {
            name: 'Others',
            value:
                (old === 0
                    ? compositionData?.others?.count
                    : compositionData?.others?.old_count) || 0,
        }
        if (others.value !== 0) {
            v.chart.push(others)
        }
        return v
    }

    const compositionList = (
        compositionData:
            | GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse
            | undefined,
        old = 0
    ) => {
        if (compositionData?.top_values === undefined) {
            return []
        }
        const record = compositionData?.top_values
        let v: compositeItem[]
        if (old === 1) {
            v = Object.keys(record).map((key) => {
                return {
                    name: key,
                    value: numericDisplay(record[key].old_count || 0),
                    val: Math.round(
                        ((record[key].old_count || 0) /
                            (compositionData?.total_count || 1)) *
                            100
                    ),
                }
            })
        } else {
            v = Object.keys(record).map((key) => {
                return {
                    name: key,
                    value: numericDisplay(record[key].count || 0),
                    delta: `${percentageByChange(
                        record[key].old_count,
                        record[key].count
                    )}%`,
                    deltaType: badgeTypeByDelta(
                        record[key].old_count,
                        record[key].count
                    ),
                    val: Math.round(
                        ((record[key].count || 0) /
                            (compositionData?.total_count || 1)) *
                            100
                    ),
                }
            })
        }
        const others = {
            name: 'Others',
            value: numericDisplay(
                old === 0
                    ? compositionData?.others?.count
                    : compositionData?.others?.old_count
            ),
            delta: `${percentageByChange(
                compositionData?.others?.old_count,
                compositionData?.others?.count
            )}&`,
            deltaType: badgeTypeByDelta(
                compositionData?.others?.old_count,
                compositionData?.others?.count
            ),
            val: Math.round(
                ((compositionData?.others?.count || 0) /
                    (compositionData?.total_count || 1)) *
                    100
            ),
        }
        if (others.value !== '0') {
            v.push(others)
        }
        return v
    }

    return (
        <Composition
            newData={
                isDemo()
                    ? compositionCart(composition2, 0)
                    : compositionCart(composition, 0)
            }
            oldData={
                isDemo()
                    ? compositionCart(composition2, 1)
                    : compositionCart(composition, 1)
            }
            isLoading={isDemo() ? false : isLoading}
            newList={
                isDemo()
                    ? compositionList(composition2, 0)
                    : compositionList(composition, 0)
            }
            oldList={
                isDemo()
                    ? compositionList(composition2, 1)
                    : compositionList(composition, 1)
            }
        />
    )
}
