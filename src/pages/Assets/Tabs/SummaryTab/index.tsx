import ResourceMetrics from './ResourceMetrics'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
    pageSize: number
}
export default function SummaryTab({ categories, pageSize }: IProps) {
    return <ResourceMetrics categories={categories} pageSize={pageSize} />
}
