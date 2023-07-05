import {
    AreaChart,
    Color,
    LineChart,
    LineChartProps,
    Text,
    Title,
} from '@tremor/react'

type IProps = {
    title?: string
    description?: string
    type: 'area' | 'line'
}

export default function Chart({
    title,
    description,
    type,
    ...props
}: LineChartProps & IProps) {
    const colors: Color[] = ['indigo', 'green', 'yellow', 'rose', 'blue']
    const buildChart = () => {
        switch (type) {
            case 'area':
                return <AreaChart colors={colors} {...props} />
            case 'line':
                return <LineChart colors={colors} {...props} />
            default:
                return null
        }
    }

    return (
        <>
            <Title>{title}</Title>
            <Text>{description}</Text>
            {buildChart()}
        </>
    )
}
