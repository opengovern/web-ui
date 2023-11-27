import dayjs, { Dayjs } from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(LocalizedFormat)
dayjs.extend(timezone)

export const dateDisplay = (
    date: Dayjs | Date | number | string | undefined,
    subtract?: number
) => {
    const s = subtract || 0
    if ((typeof date).toString() === 'Dayjs') {
        return (date as Dayjs)
            .tz(dayjs.tz.guess())
            .subtract(s, 'day')
            .format('ll')
    }
    if (date !== undefined) {
        return dayjs
            .utc(date)
            .tz(dayjs.tz.guess())
            .subtract(s, 'day')
            .format('ll')
    }
    return ''
}

export const monthDisplay = (
    date: Dayjs | Date | number | string | undefined,
    subtract?: number
) => {
    const s = subtract || 0
    if ((typeof date).toString() === 'Dayjs') {
        return (date as Dayjs)
            .tz(dayjs.tz.guess())
            .subtract(s, 'day')
            .format('MMM, YYYY')
    }
    if (date !== undefined) {
        return dayjs
            .utc(date)
            .tz(dayjs.tz.guess())
            .subtract(s, 'day')
            .format('MMM, YYYY')
    }
    return ''
}

export const dateTimeDisplay = (
    date: Dayjs | Date | number | string | undefined
) => {
    if ((typeof date).toString() === 'Dayjs') {
        return (date as Dayjs).tz(dayjs.tz.guess()).format('lll')
    }
    return dayjs.utc(date).tz(dayjs.tz.guess()).format('lll')
}
