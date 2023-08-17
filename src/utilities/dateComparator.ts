import dayjs, { Dayjs } from 'dayjs'

export const agGridDateComparator = (
    filterLocalDateAtMidnight: Date,
    cellValue: string
) => {
    const dateAsString = cellValue

    if (dateAsString == null) {
        return 0
    }

    const dateValue = new Date(Date.parse(dateAsString))
    const year = dateValue.getFullYear()
    const month = dateValue.getMonth()
    const day = dateValue.getDate()
    const cellDate = new Date(year, month, day)

    if (cellDate < filterLocalDateAtMidnight) {
        return -1
    }
    if (cellDate > filterLocalDateAtMidnight) {
        return 1
    }
    return 0
}

export const checkGranularity = (start: Dayjs, end: Dayjs) => {
    let daily = true
    let monthly = true
    let yearly = true

    if (dayjs(start).diff(dayjs(end), 'month', true) > 2) {
        daily = false
    }
    if (
        dayjs(start).month() === dayjs(end).month() &&
        dayjs(start).diff(dayjs(end), 'month', true) > 11
    ) {
        monthly = false
    }
    if (dayjs(start).year() === dayjs(end).year()) {
        yearly = false
    }

    return {
        daily,
        monthly,
        yearly,
    }
}
