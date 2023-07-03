import React, { Dispatch } from 'react'
import SummaryMetrics from './SummaryMetrics'
import ResourceMetrics from './ResourceMetrics'

type IProps = {
    provider: any
    connections: any
    categories: any
    timeRange: any
    pageSize: any
    setActiveSubPage: Dispatch<any>
}
export default function SummaryTab({
    provider,
    connections,
    categories,
    timeRange,
    pageSize,
    setActiveSubPage,
}: IProps) {
    return (
        <>
            <SummaryMetrics
                provider={provider}
                connections={connections}
                timeRange={timeRange}
                setActiveSubPage={setActiveSubPage}
            />
            <ResourceMetrics
                provider={provider}
                connection={connections}
                categories={categories}
                timeRange={timeRange}
                pageSize={pageSize}
                setActiveSubPage={setActiveSubPage}
            />
        </>
    )
}
