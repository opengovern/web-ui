import { AreaChart, AreaChartProps, Text, Title } from '@tremor/react'

type IProps = {
    title?: string
    description?: string
}
export default function AreaCharts({
    title,
    description,
    ...props
}: AreaChartProps & IProps) {
    return (
        <>
            <Title>{title}</Title>
            <Text>{description}</Text>
            <AreaChart {...props} />
        </>
    )
}
