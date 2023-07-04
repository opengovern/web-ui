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
