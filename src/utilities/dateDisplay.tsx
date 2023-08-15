import dayjs, { Dayjs } from 'dayjs'

export const dateDisplay = (
    date: Dayjs | Date | number | string | undefined,
    subtract?: number
) => {
    const s = subtract || 0
    if ((typeof date).toString() === 'Dayjs') {
        return (date as Dayjs).subtract(s, 'day').format('MMM DD, YYYY')
    }

    if (date !== undefined) {
        return dayjs(date).subtract(s, 'day').format('MMM DD, YYYY')
    }
    return ''
}

export const dateTimeDisplay = (date: Date) => {
    return dayjs(date).format('DD MMM, YYYY HH:mm:ss Z')
}
