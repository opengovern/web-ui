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
            time: activeTimeRange.end.unix(),
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
            newData={compositionCart(composition, 0)}
            oldData={compositionCart(composition, 1)}
            isLoading={isLoading}
            newList={compositionList(composition, 0)}
            oldList={compositionList(composition, 1)}
        />
    )
}
