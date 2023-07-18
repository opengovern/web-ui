import dayjs from 'dayjs'

export const dateDisplay = (date: Date | number | string | undefined) => {
    if (date !== undefined) {
        return dayjs(date).format('DD MMM, YYYY')
    }
    return ''
}

export const dateTimeDisplay = (date: Date) => {
    return dayjs(date).format('DD MMM, YYYY HH:mm:ss Z')
}
