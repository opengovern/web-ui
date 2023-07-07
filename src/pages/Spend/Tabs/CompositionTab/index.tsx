import { DeltaType, Grid } from '@tremor/react'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { atom, useAtom } from 'jotai'
import Composition from '../../../../components/Cards/Composition'
import { useInventoryApiV2CostCompositionList } from '../../../../api/inventory.gen'
import { exactPriceDisplay } from '../../../../utilities/numericDisplay'

type IProps = {
    connector: any
    connectionId: any
    time: any
    top: any
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
    connector,
    time,
    top,
    connectionId,
}: IProps) {
    const [newComposition, setNewComposition] = useAtom(newCompositionDataAtom)
    const [oldComposition, setOldComposition] = useAtom(oldCompositionDataAtom)
    const [newCompositionList, setNewCompositionList] = useAtom(
        newCompositionListAtom
    )
    const [oldCompositionList, setOldCompositionList] = useAtom(
        oldCompositionListAtom
    )
    const { response: compositionOld, isLoading: oldIsLoading } =
        useInventoryApiV2CostCompositionList({
            top,
            ...(connector && { connector }),
            ...(connectionId && { connectionId }),
            ...(time.from && { endTime: dayjs(time.from).unix() }),
            ...(time.from && {
                startTime: dayjs(time.from).subtract(1, 'day').unix(),
            }),
        })
    const { response: compositionNew, isLoading: newIsLoading } =
        useInventoryApiV2CostCompositionList({
            top,
            ...(connector && { connector }),
            ...(connectionId && { connectionId }),
            ...(time.to && { endTime: dayjs(time.to).unix() }),
            ...(time.to && {
                startTime: dayjs(time.to).subtract(1, 'day').unix(),
            }),
        })
    const { response: compositionAgrigation, isLoading: agrigationIsLoading } =
        useInventoryApiV2CostCompositionList({
            top,
            ...(connector && { connector }),
            ...(connectionId && { connectionId }),
            ...(time.to && { endTime: dayjs(time.to).unix() }),
            ...(time.from && {
                startTime: dayjs(time.from).unix(),
            }),
        })

    function compositionData(
        newInputObject: any,
        oldInputObject: any,
        aggrigationObject: any,
        oldData: number
    ) {
        const output: dataProps = {
            total: '0',
            totalValueCount: '0',
            chart: [],
        }
        const outputArray = []
        try {
            if (!newInputObject && !oldInputObject && !aggrigationObject) {
                return output
            }
            // iterate over top_values
            if (oldData === 1) {
                // eslint-disable-next-line guard-for-in,no-restricted-syntax
                for (const key in oldInputObject.top_values) {
                    outputArray.push({
                        name: key,
                        value: oldInputObject.top_values[key],
                    })
                }
            } else {
                // eslint-disable-next-line guard-for-in,no-restricted-syntax
                for (const key in newInputObject.top_values) {
                    outputArray.push({
                        name: key,
                        value: newInputObject.top_values[key],
                    })
                }
            }
            output.total = exactPriceDisplay(aggrigationObject.total_cost_value)
            output.totalValueCount = aggrigationObject.total_count
            // add others key-value pair
            // eslint-disable-next-line no-unused-expressions
            oldData
                ? outputArray.push({
                      name: 'others',
                      value: oldInputObject.others,
                  })
                : outputArray.push({
                      name: 'others',
                      value: newInputObject.others,
                  })
            output.chart = outputArray
            return output
        } catch (e) {
            console.log(e)
        } finally {
            // eslint-disable-next-line no-unsafe-finally
            return output
        }
    }

    function compositionList(newInputObject: any) {
        const outputArray = []
        // let deltaType: DeltaType = 'unchanged'
        try {
            if (!newInputObject) {
                return [
                    {
                        name: 'No data',
                        value: '0',
                    },
                ]
            }
            // iterate over top_values
            // eslint-disable-next-line guard-for-in,no-restricted-syntax
            for (const key in newInputObject.top_values) {
                outputArray.push({
                    name: key,
                    value: exactPriceDisplay(newInputObject.top_values[key]),
                })
            }
            outputArray.push({
                name: 'others',
                value: exactPriceDisplay(newInputObject.others),
            })
            return outputArray
        } catch (error) {
            console.log(error)
        } finally {
            // eslint-disable-next-line no-unsafe-finally
            return outputArray
        }
    }
    useEffect(() => {
        setOldComposition(
            compositionData(
                compositionNew,
                compositionOld,
                compositionAgrigation,
                1
            )
        )
        setNewComposition(
            compositionData(
                compositionNew,
                compositionOld,
                compositionAgrigation,
                0
            )
        )
        const nowDataList = compositionList(compositionOld)
        const prevDataList = compositionList(compositionNew)
        setOldCompositionList(prevDataList)
        setNewCompositionList(nowDataList)
    }, [oldIsLoading, newIsLoading, agrigationIsLoading])
    return (
        <Grid numItemsMd={2} className="mt-5 gap-6 flex justify-between">
            <div className="w-full">
                {/* Placeholder to set height */}
                {/* <div className="h-28" /> */}
                {/* <Composition newData oldData isLoading newList oldList isCost /> */}
                <Composition
                    newData={newComposition}
                    oldData={oldComposition}
                    isLoading={
                        oldIsLoading || newIsLoading || agrigationIsLoading
                    }
                    newList={newCompositionList}
                    oldList={oldCompositionList}
                    isCost
                />
                {/* Composition */}
            </div>
        </Grid>
    )
}
