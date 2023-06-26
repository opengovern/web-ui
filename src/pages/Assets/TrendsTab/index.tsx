import React from 'react'
import { Card, Grid } from '@tremor/react'
import GrowthTrend from './GrowthTrend'
import Region from '../../../components/Blocks/Region'

type IProps = {
    categories: any
    timeRange: any
    connections: any
    count: any
}
export default function TrendsTab({
    categories,
    timeRange,
    connections,
    count,
}: IProps) {
    return (
        <div className="mt-5">
            {/* <div className="h-96" /> */}
            <GrowthTrend categories={categories} timeRange={timeRange} />
            <Grid numItemsMd={2} className="mt-10 gap-6 flex justify-between">
                <div className="w-full">
                    {/* Placeholder to set height */}
                    {/* <Card className="h-40" /> */}
                    <Region
                        // provider={selectedConnections.provider}
                        connections={connections}
                        count={count}
                    />
                </div>
                <div className="w-full">
                    {/* Placeholder to set height */}
                    <Card className="h-[49vh]" />
                </div>
            </Grid>
        </div>
    )
}
