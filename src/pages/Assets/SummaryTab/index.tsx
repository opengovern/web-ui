import React from 'react'
import SummaryMetrics from '../SummaryMetrics'
import ResourceMetrics from '../ResourceMetrics'

type IProps = {
    provider: any
    connections: any
    categories: any
    timeRange: any
    pageSize: any
}
export default function SummaryTab({
    provider,
    connections,
    categories,
    timeRange,
    pageSize,
}: IProps) {
    return (
        <>
            <SummaryMetrics
                provider={provider}
                connections={connections}
                timeRange={timeRange}
            />
            <div className="mt-10">
                <ResourceMetrics
                    provider={provider}
                    connection={connections}
                    categories={categories}
                    timeRange={timeRange}
                    pageSize={pageSize}
                />
            </div>
        </>
    )
}
