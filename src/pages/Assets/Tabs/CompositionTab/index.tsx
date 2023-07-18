import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import { useInventoryApiV2ResourcesCompositionDetail } from '../../../../api/inventory.gen'
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
            time: dayjs(activeTimeRange.end.toString()).unix(),
        }),
    }
    const { response: composition, isLoading } =
        useInventoryApiV2ResourcesCompositionDetail('category', query)

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
        v.chart.push({
            name: 'Others',
            value:
                (old === 0
                    ? compositionData?.others?.count
                    : compositionData?.others?.old_count) || 0,
        })
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
        let v
        if (old === 1) {
            v = Object.keys(record).map((key) => {
                return {
                    name: key,
                    value: record[key].old_count || 0,
                    val: Math.round(
                        ((record[key].old_count || 0) /
                            (compositionData?.total_count || 1)) *
                            100
                    ),
                }
            })
        }
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
        v.push({
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
        })
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
