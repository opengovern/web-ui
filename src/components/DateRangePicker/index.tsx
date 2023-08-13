import {
    getLocalTimeZone,
    parseDate,
    parseDateTime,
    toCalendarDate,
    today,
} from '@internationalized/date'
import { useAtom } from 'jotai'
import { useRef } from 'react'
import { useDateRangePickerState } from 'react-stately'
import { useDateRangePicker } from 'react-aria'
import {
    CalendarIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { AriaDateRangePickerProps, DateValue } from '@react-aria/datepicker'
import dayjs from 'dayjs'
import { spendTimeAtom, timeAtom } from '../../store'
import { FieldButton } from './Button'
import { RangeCalendar } from './Calendar/RangeCalendar'
import { DateField } from './DateField'
import { Popover } from './Popover'
import { Dialog } from './Dialog'

interface DatePickerProps {
    isSpend?: boolean
}

function CustomDatePicker(props: AriaDateRangePickerProps<DateValue>) {
    const state = useDateRangePickerState(props)
    const ref = useRef(null)
    const {
        groupProps,
        labelProps,
        startFieldProps,
        endFieldProps,
        buttonProps,
        dialogProps,
        calendarProps,
    } = useDateRangePicker(props, state, ref)
    const { label } = props
    return (
        <div className="relative inline-flex flex-col text-left">
            <span {...labelProps} className="text-sm text-gray-800">
                {label}
            </span>
            <div {...groupProps} ref={ref} className="flex group h-9">
                <div className="flex bg-white dark:bg-gray-900 dark:text-gray-50 border border-gray-300 group-hover:border-gray-400 transition-colors rounded-l-md pr-5 group-focus-within:border-blue-600 group-focus-within:group-hover:border-blue-600 p-1 relative">
                    <DateField {...startFieldProps} />
                    <span aria-hidden="true" className="px-1">
                        –
                    </span>
                    <DateField {...endFieldProps} />
                    {state.validationState === 'invalid' && (
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-500 absolute right-1" />
                    )}
                    <button
                        type="button"
                        className="absolute w-full h-full left-0 opacity-0"
                        onClick={() => state.setOpen(true)}
                    >
                        open datepicker
                    </button>
                </div>
                <FieldButton {...buttonProps} isPressed={state.isOpen}>
                    <CalendarIcon className="w-5 h-5 text-gray-700 dark:text-gray-50 group-focus-within:text-blue-700" />
                </FieldButton>
            </div>
            {state.isOpen && (
                <Popover
                    triggerRef={ref}
                    state={state}
                    placement="bottom start"
                >
                    <Dialog {...dialogProps}>
                        <RangeCalendar {...calendarProps} />
                    </Dialog>
                </Popover>
            )}
        </div>
    )
}

export default function DateRangePicker({ isSpend = false }: DatePickerProps) {
    const [activeTimeRange, setActiveTimeRange] = useAtom(
        isSpend ? spendTimeAtom : timeAtom
    )
    const currentValue = () => {
        return {
            start: parseDate(
                activeTimeRange.start.local().format('YYYY-MM-DD')
            ),
            end: parseDate(
                activeTimeRange.end.startOf('day').local().format('YYYY-MM-DD')
            ),
        }
    }

    const minValue = () => {
        return parseDate('2022-12-01')
    }
    const maxValue = () => {
        if (isSpend) {
            return today(getLocalTimeZone()).subtract({ days: 2 })
        }
        return today(getLocalTimeZone())
    }
    return (
        <CustomDatePicker
            value={currentValue()}
            onChange={(value) => {
                setActiveTimeRange({
                    start: dayjs.utc(value.start.toString()),
                    end: dayjs.utc(value.end.toString()).endOf('day'),
                })
            }}
            minValue={minValue()}
            maxValue={maxValue()}
        />
    )
}
