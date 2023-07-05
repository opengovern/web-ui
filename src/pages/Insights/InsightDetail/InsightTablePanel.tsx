import { IToolPanelParams } from 'ag-grid-community'
import { useEffect } from 'react'
import { Flex, Text } from '@tremor/react'
import { snakeCaseToLabel } from '../../../utilities/labelMaker'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function InsightTablePanel(props: IToolPanelParams) {
    const updateTotals = () => {
        const uniqCount = new Map<string, number>()
        const keyValue = new Map<string, Set<string>>()

        // const uniqueCount: {} = {}
        // eslint-disable-next-line react/destructuring-assignment
        props.api.forEachNode((rowNode: any) => {
            const { data } = rowNode
            console.log(data)
            // eslint-disable-next-line array-callback-return
            Object.entries(data).map(([name, value]) => {
                const valueStr = value as string
                const valueSet = keyValue.get(name)
                const repetitive = valueSet && valueSet.has(valueStr)

                if (!repetitive) {
                    uniqCount.set(name, (uniqCount.get(name) || 0) + 1)
                }

                const currentSet = keyValue.get(name) || new Set<string>()
                currentSet.add(valueStr)
                keyValue.set(name, currentSet)
            })
        })
        console.log(uniqCount)
        return Object.fromEntries(uniqCount)
    }

    useEffect(() => {
        // eslint-disable-next-line react/destructuring-assignment
        props.api.addEventListener('modelUpdated', updateTotals)
        // eslint-disable-next-line react/destructuring-assignment
        return () => props.api.removeEventListener('modelUpdated', updateTotals)
    }, [])

    console.log('test')
    return (
        <Flex flexDirection="col" className="w-56 p-3">
            {Object.entries(updateTotals()).map(([name, value]) => (
                <Flex flexDirection="row">
                    <Text>{snakeCaseToLabel(name)}</Text>
                    <Text>{value}</Text>
                </Flex>
            ))}
        </Flex>
    )
}
