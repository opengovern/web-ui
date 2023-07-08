import { DeltaType } from '@tremor/react'
import { floatDisplay } from './numericDisplay'

export const badgeTypeByDelta = (
    oldValue?: number,
    newValue?: number
): DeltaType => {
    const changes = (newValue || 0) - (oldValue || 0)
    let deltaType: DeltaType = 'unchanged'
    if (changes === 0) {
        return deltaType
    }
    if (changes > 0) {
        deltaType = 'moderateIncrease'
        return deltaType
    }
    deltaType = 'moderateDecrease'
    return deltaType
}

export const percentageByChange = (oldValue?: number, newValue?: number) => {
    const changes =
        (((newValue || 0) - (oldValue || 0)) / (oldValue || 0)) * 100.0
    return Math.abs(changes).toFixed(1)
}
