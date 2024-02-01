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
        return (date as Dayjs).subtract(s, 'day').format('MMM DD, YYYY')
    }
    if (date) {
        return dayjs.utc(date).subtract(s, 'day').format('MMM DD, YYYY')
    }
    return 'Not available'
}

export const monthDisplay = (
    date: Dayjs | Date | number | string | undefined,
    subtract?: number
) => {
    const s = subtract || 0
    if ((typeof date).toString() === 'Dayjs') {
        return (date as Dayjs).subtract(s, 'day').format('MMM, YYYY')
    }
    if (date) {
        return dayjs.utc(date).subtract(s, 'day').format('MMM, YYYY')
    }
    return 'Not available'
}

export const dateTimeDisplay = (
    date: Dayjs | Date | number | string | undefined
) => {
    // tz(dayjs.tz.guess())
    if ((typeof date).toString() === 'Dayjs') {
        return (date as Dayjs).format('MMM DD, YYYY kk:mm z')
    }
    if (date) {
        return dayjs.utc(date).format('MMM DD, YYYY kk:mm z')
    }
    return 'Not available'
}

export const shortDateTimeDisplay = (
    date: Dayjs | Date | number | string | undefined
) => {
    // tz(dayjs.tz.guess())
    if ((typeof date).toString() === 'Dayjs') {
        return (date as Dayjs).format('MM-DD-YYYY HH:mm')
    }
    if (date) {
        return dayjs.utc(date).format('MM-DD-YYYY HH:mm')
    }
    return 'Not available'
}
