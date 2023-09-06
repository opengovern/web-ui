import { IToolPanelParams } from 'ag-grid-community'
import { useEffect, useState } from 'react'
import { Flex, Text } from '@tremor/react'
import { snakeCaseToLabel } from '../../../../utilities/labelMaker'

interface UniqueCount {
    name: string
    value: number
}

export default function InsightTablePanel(props: IToolPanelParams) {
    const [lastState, setLastState] = useState<UniqueCount[]>([])

    const updateTotals = () => {
        const uniqCount = new Map<string, number>()
        const keyValue = new Map<string, Set<string>>()

        const { api } = props
        api.forEachNode((rowNode: any) => {
            const { data } = rowNode
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
                return undefined
            })
        })

        const array = Array.from(uniqCount, ([name, value]) => {
            const v: UniqueCount = { name, value }
            return v
        })
        setLastState(array)
    }

    useEffect(() => {
        const { api } = props
        api.addEventListener('modelUpdated', updateTotals)
        return () => api.removeEventListener('modelUpdated', updateTotals)
    }, [])

    return (
        <Flex flexDirection="col" className="w-56 p-3">
            {lastState.map(({ name, value }) => {
                return (
                    <Flex flexDirection="row">
                        <Text>{snakeCaseToLabel(name)}</Text>
                        <Text>{value}</Text>
                    </Flex>
                )
            })}
        </Flex>
    )
}
