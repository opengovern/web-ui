import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { useAtom } from 'jotai'
import { useRef, useState } from 'react'
import { useDateRangePickerState } from 'react-stately'
import { useDateRangePicker } from 'react-aria'
import { CalendarIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { AriaDateRangePickerProps, DateValue } from '@react-aria/datepicker'
import dayjs from 'dayjs'
import { Flex, Text, Title } from '@tremor/react'
import { spendTimeAtom, timeAtom } from '../../store'
import { FieldButton } from './Button'
import { RangeCalendar } from './Calendar/RangeCalendar'
import { Popover } from './Popover'
import { Dialog } from './Dialog'

interface DatePickerProps {
    isSpend?: boolean
}

const renderText = (st: dayjs.Dayjs, en: dayjs.Dayjs) => {
    const s = st
    const e = en
    const startYear = s.year()
    const endYear = e.year()
    const startMonth = s.month()
    const endMonth = e.month()
    const startDay = s.date()
    const endDay = e.date()

    if (startYear === endYear && startYear === dayjs().year()) {
        if (startMonth === endMonth) {
            if (startDay === endDay) {
                return `${s.format('MMM')} ${startDay}`
            }
            return `${s.format('MMM')} ${startDay} - ${endDay}`
        }
        return `${s.format('MMM')} ${startDay} - ${e.format('MMM')} ${endDay}`
    }
    return `${s.format('MMM')} ${startDay}, ${startYear} - ${e.format(
        'MMM'
    )} ${endDay}, ${endYear}`
}

function CustomDatePicker(props: AriaDateRangePickerProps<DateValue>) {
    const state = useDateRangePickerState(props)
    const ref = useRef(null)
    const [activeTimeRange, setActiveTimeRange] = useAtom(
        window.location.pathname.split('/')[2] === 'spend'
            ? spendTimeAtom
            : timeAtom
    )
    const [showList, setShowList] = useState(false)
    const listState = {
        isOpen: showList,
        close: () => setShowList(false),
        setOpen: () => setShowList(true),
    }

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
    const { value } = props
    const start = () => {
        const day = value?.start.day || 1
        const month = value?.start.month || 1
        const year = value?.start.year || 1

        return dayjs(new Date(year, month - 1, day))
    }
    const end = () => {
        const day = value?.end.day || 1
        const month = value?.end.month || 1
        const year = value?.end.year || 1

        return dayjs(new Date(year, month - 1, day))
    }

    return (
        <div className="relative inline-flex flex-col text-left">
            <span {...labelProps} className="text-sm text-gray-800">
                {label}
            </span>
            <div
                {...groupProps}
                ref={ref}
                className="flex group h-[38px] rounded-r-lg overflow-hidden"
            >
                <div className="flex items-center bg-white dark:bg-gray-900 dark:text-gray-50 border border-gray-300 group-hover:border-gray-400 transition-colors rounded-l-lg px-5 group-focus-within:border-kaytu-600 group-focus-within:group-hover:border-kaytu-600 p-1 relative">
                    {/* <DateField {...startFieldProps} />
                    <span aria-hidden="true" className="px-1">
                        –
                    </span>
                    <DateField {...endFieldProps} />
                    {state.validationState === 'invalid' && (
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-500 absolute right-1" />
                    )} */}
                    <Text className="text-gray-800">
                        {renderText(start(), end())}
                    </Text>
                    <button
                        type="button"
                        className="absolute w-full h-full left-0 opacity-0"
                        // onClick={() => state.setOpen(true)}
                        onClick={() => listState.setOpen()}
                    >
                        open datepicker
                    </button>
                </div>
                <FieldButton {...buttonProps} isPressed={state.isOpen}>
                    <CalendarIcon className="w-5 h-5 text-gray-700 dark:text-gray-50 group-focus-within:text-kaytu-700" />
                </FieldButton>
            </div>
            {state.isOpen && (
                <Popover triggerRef={ref} state={state} placement="bottom end">
                    <Dialog {...dialogProps}>
                        <RangeCalendar {...calendarProps} />
                    </Dialog>
                </Popover>
            )}
            {listState.isOpen && (
                <Popover
                    triggerRef={ref}
                    state={listState}
                    placement="bottom end"
                >
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="gap-1 w-64"
                    >
                        <Title>Relative dates</Title>
                        <Flex
                            onClick={() =>
                                setActiveTimeRange({
                                    start: dayjs().utc().subtract(1, 'week'),
                                    end: dayjs().utc().endOf('day'),
                                })
                            }
                            className="px-4 py-2 cursor-pointer rounded-md hover:bg-kaytu-50"
                        >
                            <Text className="text-gray-800">Last 7 days</Text>
                            <Text>
                                {renderText(
                                    dayjs().subtract(1, 'week'),
                                    dayjs()
                                )}
                            </Text>
                        </Flex>
                        <Flex
                            onClick={() =>
                                setActiveTimeRange({
                                    start: dayjs().utc().subtract(1, 'month'),
                                    end: dayjs().utc().endOf('day'),
                                })
                            }
                            className="px-4 py-2 cursor-pointer rounded-md hover:bg-kaytu-50"
                        >
                            <Text className="text-gray-800">Last 30 days</Text>
                            <Text>
                                {renderText(
                                    dayjs().subtract(1, 'month'),
                                    dayjs()
                                )}
                            </Text>
                        </Flex>
                        <Title className="mt-3">Calender months</Title>
                        <Flex
                            onClick={() =>
                                setActiveTimeRange({
                                    start: dayjs().utc().startOf('month'),
                                    end: dayjs().utc().endOf('day'),
                                })
                            }
                            className="px-4 py-2 cursor-pointer rounded-md hover:bg-kaytu-50"
                        >
                            <Text className="text-gray-800">This month</Text>
                            <Text>
                                {renderText(dayjs().startOf('month'), dayjs())}
                            </Text>
                        </Flex>
                        <Flex className="px-4 py-2 cursor-pointer rounded-md hover:bg-kaytu-50">
                            <Text className="text-gray-800">This quarter</Text>
                            <Text>?</Text>
                        </Flex>
                        <Flex
                            onClick={() =>
                                setActiveTimeRange({
                                    start: dayjs().utc().startOf('year'),
                                    end: dayjs().utc().endOf('day'),
                                })
                            }
                            className="px-4 py-2 cursor-pointer rounded-md hover:bg-kaytu-50"
                        >
                            <Text className="text-gray-800">This year</Text>
                            <Text>
                                {renderText(dayjs().startOf('year'), dayjs())}
                            </Text>
                        </Flex>
                        <Flex
                            className="mt-5 px-4 py-2 cursor-pointer rounded-md hover:bg-kaytu-50"
                            onClick={() => {
                                listState.close()
                                state.setOpen(true)
                            }}
                        >
                            <Text className="text-gray-800">
                                Custom date range
                            </Text>
                            <ChevronRightIcon className="h-5" />
                        </Flex>
                    </Flex>
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
                    start: dayjs.utc(value.start.toString()).startOf('day'),
                    end: dayjs.utc(value.end.toString()).endOf('day'),
                })
            }}
            minValue={minValue()}
            maxValue={maxValue()}
        />
    )
}
