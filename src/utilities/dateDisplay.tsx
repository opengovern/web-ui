import dayjs, { Dayjs } from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(LocalizedFormat)

export const dateDisplay = (
    date: Dayjs | Date | number | string | undefined,
    subtract?: number
) => {
    const s = subtract || 0
    if ((typeof date).toString() === 'Dayjs') {
        return (date as Dayjs).subtract(s, 'day').format('ll')
    }
    if (date !== undefined) {
        return dayjs.utc(date).subtract(s, 'day').format('ll')
    }
    return ''
}

export const dateTimeDisplay = (
    date: Dayjs | Date | number | string | undefined
) => {
    if ((typeof date).toString() === 'Dayjs') {
        return (date as Dayjs).format('lll')
    }
    return dayjs.utc(date).format('lll')
}
