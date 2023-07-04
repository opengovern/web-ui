import { floatDisplay } from './numericDisplay'

export const badgeTypeByDelta = (oldValue?: number, newValue?: number) => {
    const changes = (newValue || 0) - (oldValue || 0)
    if (changes === 0) {
        return 'unchanged'
    }
    if (changes > 0) {
        return 'moderateIncrease'
    }
    return 'moderateDecrease'
}

export const percentageByChange = (oldValue?: number, newValue?: number) => {
    const changes =
        (((newValue || 0) - (oldValue || 0)) / (oldValue || 0)) * 100.0
    return floatDisplay(Math.abs(changes))
}
