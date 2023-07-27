import dayjs, { Dayjs } from 'dayjs'

export const dateDisplay = (
    date: Dayjs | Date | number | string | undefined
) => {
    if ((typeof date).toString() === 'Dayjs') {
        return (date as Dayjs).format('DD MMM, YYYY')
    }

    if (date !== undefined) {
        return dayjs(date).format('DD MMM, YYYY')
    }
    return ''
}

export const dateTimeDisplay = (date: Date) => {
    return dayjs(date).format('DD MMM, YYYY HH:mm:ss Z')
}
