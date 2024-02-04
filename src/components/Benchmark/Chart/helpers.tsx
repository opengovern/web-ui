import { dateDisplay } from '../../../utilities/dateDisplay'
import { StackItem } from '../../Chart/Stacked'

export const trendChart = (trend: any[] | undefined) => {
    const label: string[] = []
    const data: StackItem[][] = []

    if (!trend) {
        return {
            label,
            data,
        }
    }

    for (let i = 0; i < trend?.length; i += 1) {
        label.push(dateDisplay(trend[i]?.timestamp))
        const stackData: StackItem[] = []

        for (let j = 0; j < trend[i].stack.length; j += 1) {
            stackData.push({
                value: Number(trend[i]?.stack[j].count || 0),
                label: String(trend[i]?.stack[j].name),
            })
        }
        data.push(stackData)
    }

    return {
        label,
        data,
    }
}
