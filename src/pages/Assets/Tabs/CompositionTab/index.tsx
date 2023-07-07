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
import { numericDisplay } from '../../../../utilities/numericDisplay'
import Composition from '../../../../components/Cards/Composition'

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

const newCompositionDataAtom = atom<dataProps>({
    total: '0',
    totalValueCount: '0',
    chart: [],
})
const oldCompositionDataAtom = atom<dataProps>({
    total: '0',
    totalValueCount: '0',
    chart: [],
})
const newCompositionListAtom = atom<listProps[]>([])
const oldCompositionListAtom = atom<listProps[]>([])

export default function CompositionTab({
    top,
    connector,
    connectionId,
    time,
}: IProps) {
    const [newComposition, setNewComposition] = useAtom(newCompositionDataAtom)
    const [oldComposition, setOldComposition] = useAtom(oldCompositionDataAtom)
    const [newCompositionList, setNewCompositionList] = useAtom(
        newCompositionListAtom
    )
    const [oldCompositionList, setOldCompositionList] = useAtom(
        oldCompositionListAtom
    )
    const query = {
        top,
        ...(connector && { connector }),
        ...(connectionId && { connectionId }),
        ...(time.to && { time: dayjs(time.to).unix() }),
    }
    const { response: composition, isLoading } =
        useInventoryApiV2ResourcesCompositionDetail('category', query)

    function compositionData(inputObject: any, oldData: number) {
        const output: dataProps = {
            total: '0',
            totalValueCount: '0',
            chart: [],
        }
        const outputArray = []

        if (!inputObject) {
            return output
        }
        // iterate over top_values
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const key in inputObject.top_values) {
            outputArray.push({
                name: key,
                value:
                    oldData === 1
                        ? inputObject.top_values[key].old_count
                        : inputObject.top_values[key].count,
            })
        }

        outputArray.push({
            name: 'others',
            value: oldData
                ? inputObject.others.old_count
                : inputObject.others.count,
        })
        output.chart = outputArray
        output.total = String(numericDisplay(inputObject.total_count))
        output.totalValueCount = String(
            numericDisplay(inputObject.total_value_count)
        )
        return output
    }

    function nowCompositionList(inputObject: any) {
        const outputArray = []
        let deltaType: DeltaType = 'unchanged'
        if (!inputObject) {
            return [
                {
                    name: 'No data',
                    value: '0',
                    delta: '0',
                    deltaType,
                },
            ]
        }
        // iterate over top_values
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const key in inputObject.top_values) {
            let delta
            try {
                delta =
                    ((inputObject.top_values[key].count -
                        inputObject.top_values[key].old_count) /
                        inputObject.top_values[key].old_count) *
                    100
            } catch (e) {
                delta = 0
            }

            if (delta < 0) {
                deltaType = 'moderateDecrease'
            } else if (delta > 0) {
                deltaType = 'moderateIncrease'
            } else {
                deltaType = 'unchanged'
            }
            outputArray.push({
                name: key,
                value: String(
                    numericDisplay(inputObject.top_values[key].count)
                ),
                delta: Math.abs(delta).toFixed(2),
                deltaType,
            })
        }
        let delta
        try {
            delta =
                ((inputObject.others.count - inputObject.others.old_count) /
                    inputObject.others.old_count) *
                100
        } catch (e) {
            delta = 0
        }

        if (delta < 0) {
            deltaType = 'moderateDecrease'
        } else if (delta > 0) {
            deltaType = 'moderateIncrease'
        } else {
            deltaType = 'unchanged'
        }
        outputArray.push({
            name: 'Others',
            value: String(numericDisplay(inputObject.others.count)),
            delta: Math.abs(delta).toFixed(2),
            deltaType,
        })
        return outputArray
    }

    function prevCompositionList(inputObject: any) {
        const outputArray = []
        if (!inputObject) {
            return [
                {
                    name: 'No data',
                    value: '0',
                },
            ]
        }
        // iterate over top_values
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const key in inputObject.top_values) {
            outputArray.push({
                name: key,
                value: String(
                    numericDisplay(inputObject.top_values[key].old_count)
                ),
            })
        }
        outputArray.push({
            name: 'Others',
            value: String(numericDisplay(inputObject.others.old_count)),
        })
        return outputArray
    }

    useEffect(() => {
        const nowDataList = nowCompositionList(composition)
        const prevDataList = prevCompositionList(composition)
        setNewComposition(compositionData(composition, 0))
        setOldComposition(compositionData(composition, 1))
        setNewCompositionList(nowDataList)
        setOldCompositionList(prevDataList)
    }, [composition])

    return (
        <Grid numItemsMd={2} className="mt-5 gap-6 flex justify-between">
            <div className="w-full">
                {/* Placeholder to set height */}
                {/* <div className="h-28" /> */}
                {/* <Composition newData oldData isLoading newList oldList isCost /> */}
                <Composition
                    newData={newComposition}
                    oldData={oldComposition}
                    isLoading={isLoading}
                    newList={newCompositionList}
                    oldList={oldCompositionList}
                />
                {/* Composition */}
            </div>
        </Grid>
    )
}
