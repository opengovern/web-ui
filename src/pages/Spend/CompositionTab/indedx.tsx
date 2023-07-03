import { Grid } from '@tremor/react'
import React from 'react'
import Composition from './Composition'

type IProps = {
    connector: any
    time: any
    top: any
}
export default function CompositionTab({ connector, time, top }: IProps) {
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
