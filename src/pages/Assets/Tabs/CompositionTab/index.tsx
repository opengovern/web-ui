import { Flex, Grid } from '@tremor/react'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
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
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)
    const query = {
        top,
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(activeTimeRange.to && { time: dayjs(activeTimeRange.to).unix() }),
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
                )}`,
                deltaType: badgeTypeByDelta(
                    record[key].old_count,
                    record[key].count
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
            )}`,
            deltaType: badgeTypeByDelta(
                compositionData?.others?.old_count,
                compositionData?.others?.count
            ),
        })
        return v
    }

    return (
        <Flex justifyContent="between" className="mt-5 w-full">
            <Composition
                newData={compositionCart(composition, 0)}
                oldData={compositionCart(composition, 1)}
                isLoading={isLoading}
                newList={compositionList(composition, 0)}
                oldList={compositionList(composition, 1)}
            />
        </Flex>
    )
}
