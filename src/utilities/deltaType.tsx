import { DeltaType, BadgeDelta } from '@tremor/react'

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
    } else {
        deltaType = 'moderateDecrease'
    }
    return deltaType
}

export const percentageByChange = (oldValue?: number, newValue?: number) => {
    const changes =
        (((newValue || 0) - (oldValue || 0)) / (oldValue || 0)) * 100.0
    return Math.abs(changes).toFixed(1)
}

export const badgeDelta = (oldValue?: number, newValue?: number) => {
    return (
        <BadgeDelta deltaType={badgeTypeByDelta(oldValue, newValue)}>
            {percentageByChange(oldValue, newValue)}%
        </BadgeDelta>
    )
}
