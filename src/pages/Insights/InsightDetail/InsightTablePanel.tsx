import { IToolPanelParams } from 'ag-grid-community'
import { useEffect } from 'react'
import { Flex, Text } from '@tremor/react'
import { snakeCaseToLabel } from '../../../utilities/labelMaker'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function InsightTablePanel(props: IToolPanelParams) {
    const updateTotals = () => {
        const map = new Map<string, number>()
        // const uniqueCount: {} = {}
        // eslint-disable-next-line react/destructuring-assignment
        props.api.forEachNode((rowNode: any) => {
            const { data } = rowNode
            // eslint-disable-next-line array-callback-return
            Object.entries(data).map(([name, value]) => {
                map.set(name, (map.get(name) || 0) + 1)
            })
        })
        return Object.fromEntries(map)
    }

    useEffect(() => {
        // eslint-disable-next-line react/destructuring-assignment
        props.api.addEventListener('modelUpdated', updateTotals)
        // eslint-disable-next-line react/destructuring-assignment
        return () => props.api.removeEventListener('modelUpdated', updateTotals)
    }, [])

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
