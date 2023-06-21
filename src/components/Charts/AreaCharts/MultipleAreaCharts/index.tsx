import { AreaChart, Title, Text, AreaChartProps } from '@tremor/react'

type IProps = {
    title?: string
    description?: string
}
export default function MultipleAreaCharts({
    title,
    description,
    ...props
}: AreaChartProps & IProps) {
    return (
        <>
            <Title>{title}</Title>
            <Text>{description}</Text>
            <AreaChart
                {...props}
            />
        </>
    );
}