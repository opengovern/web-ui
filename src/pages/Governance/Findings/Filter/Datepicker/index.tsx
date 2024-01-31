import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import dayjs from 'dayjs'
import { AriaDateRangePickerProps, DateValue } from '@react-aria/datepicker'
import { useDateRangePickerState } from 'react-stately'
import { useRef } from 'react'
import { useDateRangePicker } from 'react-aria'
import {
    defaultTime,
    useUrlDateRangeState,
} from '../../../../../utilities/urlstate'
import { RangeCalendar } from '../../../../../components/Layout/Header/DateRangePicker/Calendar/RangeCalendar'

function CustomDatePicker(props: AriaDateRangePickerProps<DateValue>) {
    const state = useDateRangePickerState(props)
    const ref = useRef(null)

    const { groupProps, labelProps, buttonProps, dialogProps, calendarProps } =
        useDateRangePicker(props, state, ref)

    return <RangeCalendar {...calendarProps} />
}

export default function Datepicker() {
    const { value: activeTimeRange, setValue: setActiveTimeRange } =
        useUrlDateRangeState(defaultTime)

    const currentValue = () => {
        return {
            start: parseDate(
                activeTimeRange.start.startOf('day').format('YYYY-MM-DD')
            ),
            end: parseDate(
                activeTimeRange.end.endOf('day').format('YYYY-MM-DD')
            ),
        }
    }

    const minValue = () => {
        return parseDate('2022-12-01')
    }
    const maxValue = () => {
        return today(getLocalTimeZone())
    }

    return (
        <CustomDatePicker
            value={currentValue()}
            onChange={(value) => {
                setActiveTimeRange({
                    start: dayjs.utc(value.start.toString()).startOf('day'),
                    end: dayjs.utc(value.end.toString()).endOf('day'),
                })
            }}
            minValue={minValue()}
            maxValue={maxValue()}
        />
    )
}
