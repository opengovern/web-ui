import dayjs, { Dayjs } from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(LocalizedFormat)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)

export const dateDisplay = (
    date: Dayjs | Date | number | string | undefined,
    subtract?: number
) => {
    const s = subtract || 0
    if ((typeof date).toString() === 'Dayjs') {
        return (date as Dayjs).subtract(s, 'day').format('MMM Do, YYYY')
    }
    if (date !== undefined) {
        return dayjs(date).subtract(s, 'day').format('MMM Do, YYYY')
    }
    return ''
}

export const monthDisplay = (
    date: Dayjs | Date | number | string | undefined,
    subtract?: number
) => {
    const s = subtract || 0
    if ((typeof date).toString() === 'Dayjs') {
        return (date as Dayjs).subtract(s, 'day').format('MMM, YYYY')
    }
    if (date !== undefined) {
        return dayjs(date).subtract(s, 'day').format('MMM, YYYY')
    }
    return ''
}

export const dateTimeDisplay = (
    date: Dayjs | Date | number | string | undefined
) => {
    // tz(dayjs.tz.guess())
    if ((typeof date).toString() === 'Dayjs') {
        return (date as Dayjs).format('MMM Do, YYYY - kk:mm z')
    }
    return dayjs(date).format('MMM Do, YYYY - kk:mm z')
}
