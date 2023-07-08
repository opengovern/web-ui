import {
    BadgeDelta,
    Card,
    DeltaType,
    Divider,
    DonutChart,
    Flex,
    Grid,
    List,
    ListItem,
    Metric,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { atom, useAtom } from 'jotai'
import { useInventoryApiV2ResourcesCompositionDetail } from '../../../../api/inventory.gen'
import {
    exactPriceDisplay,
    numericDisplay,
} from '../../../../utilities/numericDisplay'
import Composition from '../../../../components/Cards/Composition'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiCountPair,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse,
} from '../../../../api/api'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../../utilities/deltaType'

type IProps = {
    top: number
    connector?: string
    connectionId?: string[]
    time?: any
}

interface listProps {
    name: string
    value: string
    delta?: string
    deltaType?: DeltaType
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

export default function CompositionTab({
    top,
    connector,
    connectionId,
    time,
}: IProps) {
    const query = {
        top,
        ...(connector && { connector }),
        ...(connectionId && { connectionId }),
        ...(time.to && { time: dayjs(time.to).unix() }),
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
        // eslint-disable-next-line @typescript-eslint/no-shadow
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
            name: 'others',
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
            name: 'others',
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
        <Grid numItemsMd={2} className="mt-5 gap-6 flex justify-between">
            <div className="w-full">
                {/* Placeholder to set height */}
                {/* <div className="h-28" /> */}
                {/* <Composition newData oldData isLoading newList oldList isCost /> */}
                <Composition
                    newData={compositionCart(composition, 0)}
                    oldData={compositionCart(composition, 1)}
                    isLoading={isLoading}
                    newList={compositionList(composition, 0)}
                    oldList={compositionList(composition, 1)}
                />
                {/* Composition */}
            </div>
        </Grid>
    )
}
