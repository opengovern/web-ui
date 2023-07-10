import React, { Dispatch } from 'react'
import SummaryMetrics from './SummaryMetrics'
import CostMetrics from './CostMetrics'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
    pageSize: number
}
export default function SummaryTab({ categories, pageSize }: IProps) {
    return (
        <>
            <SummaryMetrics pageSize={pageSize} />
            <CostMetrics categories={categories} pageSize={pageSize} />
        </>
    )
}
