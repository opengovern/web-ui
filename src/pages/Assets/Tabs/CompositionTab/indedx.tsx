import { Grid } from '@tremor/react'
import React from 'react'
import dayjs from 'dayjs'
import Composition from '../../../../components/Blocks/Composition'
import { useInventoryApiV2ResourcesCompositionDetail } from '../../../api/inventory.gen'

type IProps = {
    connector: any
    time: any
    top: any
    connections: any
}
export default function CompositionTab({
    connector,
    time,
    top,
    connections,
}: IProps) {
    const query = {
        top,
        ...(connector && { connector }),
        ...(connections && { connectionId: connections }),
        ...(time.to && { time: dayjs(time.to).unix() }),
    }
    const { response: composition } =
        useInventoryApiV2ResourcesCompositionDetail('category', query)

    function nowCompositionList(inputObject: any) {
        const outputArray = []
        if (!inputObject) {
            return [
                {
                    name: 'No data',
                    value: 0,
                    delta: 0,
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
            outputArray.push({
                name: key,
                value: inputObject.top_values[key].count,
                delta: Math.abs(delta).toFixed(2),
            })
        }
        return outputArray
    }
    function prevCompositionList(inputObject: any) {
        const outputArray = []
        if (!inputObject) {
            return [
                {
                    name: 'No data',
                    value: 0,
                },
            ]
        }
        // iterate over top_values
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const key in inputObject.top_values) {
            outputArray.push({
                name: key,
                value: inputObject.top_values[key].old_count,
            })
        }
        return outputArray
    }

    return (
        <Grid numItemsMd={2} className="mt-5 gap-6 flex justify-between">
            <div className="w-full">
                {/* Placeholder to set height */}
                {/* <div className="h-28" /> */}
                <Composition connector={connector} top={top} time={time} />
                {/* Composition */}
            </div>
        </Grid>
    )
}
