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
        return dayjs(date).subtract(s, 'day').format('ll')
    }
    return ''
}

export const dateTimeDisplay = (date: Date | string | undefined) => {
    return dayjs(date).format('lll')
}
