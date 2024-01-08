import dayjs, { Dayjs } from 'dayjs'
import { SelectItem, Text } from '@tremor/react'

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
    const daily = true
    let monthly = true
    let yearly = true
    let monthlyByDefault = true

    if (dayjs.utc(end).diff(dayjs.utc(start), 'month', true) < 2) {
        monthlyByDefault = false
    }
    if (dayjs.utc(end).diff(dayjs.utc(start), 'month', true) < 1) {
        monthly = false
    }
    if (dayjs.utc(end).diff(dayjs.utc(start), 'year', true) < 1) {
        yearly = false
    }

    return {
        daily,
        monthly,
        monthlyByDefault,
        yearly,
    }
}

export const generateItems = (s: Dayjs, e: Dayjs) => {
    return (
        <>
            {checkGranularity(s, e).daily && (
                <SelectItem value="daily">
                    <Text>Daily</Text>
                </SelectItem>
            )}
            {checkGranularity(s, e).monthly && (
                <SelectItem value="monthly">
                    <Text>Monthly</Text>
                </SelectItem>
            )}
            {checkGranularity(s, e).yearly && (
                <SelectItem value="yearly">
                    <Text>Yearly</Text>
                </SelectItem>
            )}
        </>
    )
}
