import {
    AreaChart,
    Color,
    Flex,
    Legend,
    LineChart,
    LineChartProps,
    Text,
    Title,
} from '@tremor/react'

type IProps = {
    title?: string
    description?: string
    lines?: string[] | JSX.Element[]
    type: 'area' | 'line'
}

export default function Chart({
    title,
    description,
    type,
    lines,
    ...props
}: LineChartProps & IProps) {
    const colors: Color[] = ['blue', 'emerald', 'rose', 'amber', 'fuchsia']
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
            <Flex flexDirection="row" alignItems="start">
                {buildChart()}
                {lines &&
                    (typeof lines === 'string' ? (
                        <Legend
                            categories={lines}
                            colors={colors}
                            className="w-1/4"
                        />
                    ) : (
                        <Flex flexDirection="col" className="w-1/4">
                            {lines.map((item, index) => {
                                return (
                                    <Flex
                                        flexDirection="row"
                                        alignItems="start"
                                        justifyContent="start"
                                    >
                                        <span
                                            className={`h-2 w-2 mt-2 bg-${colors[index]}-500 rounded-full`}
                                        />
                                        {item}
                                    </Flex>
                                )
                            })}
                        </Flex>
                    ))}
            </Flex>
        </>
    )
}
