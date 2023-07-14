import dayjs from 'dayjs'

export const dateDisplay = (date: Date | number) => {
    return dayjs(date).format('DD MMM, YYYY')
}

export const dateTimeDisplay = (date: Date) => {
    return dayjs(date).format('DD MMM, YYYY HH:mm:ss Z')
}
