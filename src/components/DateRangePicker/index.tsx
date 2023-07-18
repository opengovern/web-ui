import { getLocalTimeZone, today } from '@internationalized/date'
import { useAtom } from 'jotai'
import { useRef } from 'react'
import { useDateRangePickerState } from 'react-stately'
import { useDateRangePicker } from 'react-aria'
import {
    CalendarIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { AriaDateRangePickerProps, DateValue } from '@react-aria/datepicker'
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
                <div className="flex bg-white border border-gray-300 group-hover:border-gray-400 transition-colors rounded-l-md pr-10 group-focus-within:border-blue-600 group-focus-within:group-hover:border-blue-600 p-1 relative">
                    <DateField {...startFieldProps} />
                    <span aria-hidden="true" className="px-2">
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
                    <CalendarIcon className="w-5 h-5 text-gray-700 group-focus-within:text-blue-700" />
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
    return (
        <CustomDatePicker
            value={activeTimeRange}
            onChange={(value) => {
                setActiveTimeRange({
                    start: value.start,
                    end: value.end,
                })
            }}
            maxValue={today(getLocalTimeZone())}
        />
    )
}
