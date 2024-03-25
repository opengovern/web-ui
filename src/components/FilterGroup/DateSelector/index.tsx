import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import dayjs from 'dayjs'
import { Checkbox } from 'pretty-checkbox-react'
import { AriaDateRangePickerProps, DateValue } from '@react-aria/datepicker'
import { useDateRangePickerState } from 'react-stately'
import { useEffect, useRef, useState } from 'react'
import { useDateRangePicker } from 'react-aria'
import {
    Button,
    Card,
    Flex,
    Icon,
    Select,
    Text,
    SelectItem,
    Title,
} from '@tremor/react'
import { ClockIcon } from '@heroicons/react/24/outline'
import DateConditionSelector, {
    DateSelectorOptions,
} from '../ConditionSelector/DateConditionSelector'
import { DateRange, useUrlDateRangeState } from '../../../utilities/urlstate'
import { RangeCalendar } from '../../Layout/Header/DatePicker/Calendar/RangePicker/RangeCalendar'

export interface IDateSelector {
    title: string
    defaultDate: DateRange
    supportedConditions: DateSelectorOptions[]
    selectedCondition: DateSelectorOptions
    onValueChanged: (value: DateRange) => void
    onConditionChange: (condition: DateSelectorOptions) => void
}

export interface IDate {
    start: dayjs.Dayjs
    end: dayjs.Dayjs
}

function CustomDatePicker(props: AriaDateRangePickerProps<DateValue>) {
    const state = useDateRangePickerState(props)
    const ref = useRef(null)

    const { calendarProps } = useDateRangePicker(props, state, ref)

    return <RangeCalendar {...calendarProps} />
}

export const renderDateText = (st: dayjs.Dayjs, en: dayjs.Dayjs) => {
    const s = st
    const e = en
    const startYear = s.year()
    const endYear = e.year()
    const startMonth = s.month()
    const endMonth = e.month()
    const startDay = s.date()
    const endDay = e.date()

    if (startYear === endYear && startYear === dayjs().utc().year()) {
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

export default function DateSelector({
    title,
    defaultDate,
    supportedConditions,
    selectedCondition,
    onValueChanged,
    onConditionChange,
}: IDateSelector) {
    const { value: activeTimeRange, setValue: setActiveTimeRange } =
        useUrlDateRangeState(defaultDate)
    const [startH, setStartH] = useState(activeTimeRange.start.hour())
    const [startM, setStartM] = useState(activeTimeRange.start.minute())
    const [endH, setEndH] = useState(activeTimeRange.end.hour())
    const [endM, setEndM] = useState(activeTimeRange.end.minute())
    const [checked, setChecked] = useState(
        startH !== 0 || startM !== 0 || endH !== 23 || endM !== 59
    )
    const [val, setVal] = useState({
        start: activeTimeRange.start,
        end: activeTimeRange.end,
    })

    const [condition, setCondition] = useState(selectedCondition)

    useEffect(() => {
        if (checked) {
            setActiveTimeRange({
                start: dayjs(val.start)
                    .startOf('day')
                    .add(startH, 'hours')
                    .add(startM, 'minutes'),
                end: dayjs(val.end)
                    .startOf('day')
                    .add(endH, 'hours')
                    .add(endM, 'minutes'),
            })
        } else {
            setActiveTimeRange({
                start: dayjs(val.start).startOf('day'),
                end: dayjs(val.end).endOf('day'),
            })
        }
    }, [val, checked, startH, startM, endH, endM])

    const minValue = () => {
        return parseDate('2022-12-01')
    }
    const maxValue = () => {
        return today(getLocalTimeZone())
    }

    const last7Days = () => {
        return {
            start: dayjs().utc().subtract(1, 'week').startOf('day'),
            end: dayjs().utc().endOf('day'),
        }
    }

    const last30Days = () => {
        return {
            start: dayjs().utc().subtract(1, 'month').startOf('day'),
            end: dayjs().utc().endOf('day'),
        }
    }

    const thisMonth = () => {
        return {
            start: dayjs().utc().startOf('month').startOf('day'),
            end: dayjs().utc().endOf('day'),
        }
    }

    const lastMonth = () => {
        return {
            start: dayjs()
                .utc()
                .subtract(1, 'month')
                .startOf('month')
                .startOf('day'),
            end: dayjs().utc().subtract(1, 'month').endOf('month').endOf('day'),
        }
    }

    const thisQuarter = () => {
        return {
            start: dayjs().utc().startOf('quarter').startOf('day'),
            end: dayjs().utc().endOf('day'),
        }
    }

    const lastQuarter = () => {
        return {
            start: dayjs()
                .utc()
                .subtract(1, 'quarter')
                .startOf('quarter')
                .startOf('day'),
            end: dayjs()
                .utc()
                .subtract(1, 'quarter')
                .endOf('quarter')
                .endOf('day'),
        }
    }

    const thisYear = () => {
        return {
            start: dayjs().utc().startOf('year').startOf('day'),
            end: dayjs().utc().endOf('day'),
        }
    }

    return (
        <Card className="mt-2 py-4 px-6 w-fit rounded-xl">
            <Flex>
                <Flex
                    justifyContent="start"
                    alignItems="baseline"
                    className="gap-2"
                >
                    <Text>{title}</Text>
                    <DateConditionSelector
                        supportedConditions={supportedConditions}
                        selectedCondition={condition}
                        onConditionChange={(i) => setCondition(i)}
                    />
                </Flex>
            </Flex>

            <Flex
                flexDirection="col"
                alignItems="start"
                className="gap-2 my-4 overflow-auto"
            >
                {condition === 'isRelative' ? (
                    <>
                        <Flex
                            onClick={() => setActiveTimeRange(last7Days())}
                            className="mt-4 px-4 space-x-4 py-2 cursor-pointer rounded-md hover:bg-kaytu-50 dark:hover:bg-kaytu-700"
                        >
                            <Text className="text-gray-800 whitespace-nowrap">
                                Last 7 days
                            </Text>
                            <Text className="whitespace-nowrap">
                                {renderDateText(
                                    last7Days().start,
                                    last7Days().end
                                )}
                            </Text>
                        </Flex>
                        <Flex
                            onClick={() => setActiveTimeRange(last30Days())}
                            className="px-4 space-x-4 py-2 cursor-pointer rounded-md hover:bg-kaytu-50 dark:hover:bg-kaytu-700"
                        >
                            <Text className="text-gray-800 whitespace-nowrap">
                                Last 30 days
                            </Text>
                            <Text className="whitespace-nowrap">
                                {renderDateText(
                                    last30Days().start,
                                    last30Days().end
                                )}
                            </Text>
                        </Flex>
                        <Title className="mt-3">Calender months</Title>
                        <Flex
                            onClick={() => setActiveTimeRange(thisMonth())}
                            className="px-4 space-x-4 py-2 cursor-pointer rounded-md hover:bg-kaytu-50 dark:hover:bg-kaytu-700"
                        >
                            <Text className="text-gray-800 whitespace-nowrap">
                                This month
                            </Text>
                            <Text className="whitespace-nowrap">
                                {renderDateText(
                                    thisMonth().start,
                                    thisMonth().end
                                )}
                            </Text>
                        </Flex>
                        <Flex
                            onClick={() => setActiveTimeRange(lastMonth())}
                            className="px-4 space-x-4 py-2 cursor-pointer rounded-md hover:bg-kaytu-50 dark:hover:bg-kaytu-700"
                        >
                            <Text className="text-gray-800 whitespace-nowrap">
                                Last month
                            </Text>
                            <Text className="whitespace-nowrap">
                                {renderDateText(
                                    lastMonth().start,
                                    lastMonth().end
                                )}
                            </Text>
                        </Flex>
                        <Flex
                            onClick={() => setActiveTimeRange(thisQuarter())}
                            className="px-4 space-x-4 py-2 cursor-pointer rounded-md hover:bg-kaytu-50 dark:hover:bg-kaytu-700"
                        >
                            <Text className="text-gray-800 whitespace-nowrap">
                                This quarter
                            </Text>
                            <Text className="whitespace-nowrap">
                                {renderDateText(
                                    thisQuarter().start,
                                    thisQuarter().end
                                )}
                            </Text>
                        </Flex>
                        <Flex
                            onClick={() => setActiveTimeRange(lastQuarter())}
                            className="px-4 space-x-4 py-2 cursor-pointer rounded-md hover:bg-kaytu-50 dark:hover:bg-kaytu-700"
                        >
                            <Text className="text-gray-800 whitespace-nowrap">
                                Last quarter
                            </Text>
                            <Text className="whitespace-nowrap">
                                {renderDateText(
                                    lastQuarter().start,
                                    lastQuarter().end
                                )}
                            </Text>
                        </Flex>
                        <Flex
                            onClick={() => setActiveTimeRange(thisYear())}
                            className="px-4 space-x-4 py-2 cursor-pointer rounded-md hover:bg-kaytu-50 dark:hover:bg-kaytu-700"
                        >
                            <Text className="text-gray-800 whitespace-nowrap">
                                This year
                            </Text>
                            <Text className="whitespace-nowrap">
                                {renderDateText(
                                    thisYear().start,
                                    thisYear().end
                                )}
                            </Text>
                        </Flex>
                    </>
                ) : (
                    <>
                        <CustomDatePicker
                            value={{
                                start: parseDate(
                                    val.start.format('YYYY-MM-DD')
                                ),
                                end: parseDate(val.end.format('YYYY-MM-DD')),
                            }}
                            onChange={(value) => {
                                setVal({
                                    start: dayjs(value.start.toString()),
                                    end: dayjs(value.end.toString()),
                                })
                            }}
                            minValue={minValue()}
                            maxValue={maxValue()}
                        />
                        <Checkbox
                            checked={checked}
                            onChange={(e) => {
                                setChecked(e.target.checked)
                            }}
                            className="my-3"
                        >
                            <Flex className="gap-1">
                                <ClockIcon className="w-4" />
                                <Text>Time</Text>
                            </Flex>
                        </Checkbox>
                        {checked && (
                            <Flex flexDirection="col" className="gap-2 w-full">
                                <Flex className="gap-3" justifyContent="start">
                                    <Text className="w-16 whitespace-nowrap">
                                        Start time
                                    </Text>
                                    <Flex className="gap-2 w-full">
                                        <Select
                                            placeholder="HH"
                                            enableClear={false}
                                            className="w-full"
                                            value={startH.toString()}
                                            onChange={(x) =>
                                                setStartH(Number(x))
                                            }
                                        >
                                            {[...Array(24)].map((x, i) => (
                                                <SelectItem value={`${i}`}>
                                                    {`0${i}`.slice(-2)}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                        <Title>:</Title>
                                        <Select
                                            placeholder="mm"
                                            enableClear={false}
                                            className="w-full"
                                            value={startM.toString()}
                                            onChange={(x) =>
                                                setStartM(Number(x))
                                            }
                                        >
                                            {[...Array(60)].map((x, i) => (
                                                <SelectItem value={`${i}`}>
                                                    {`0${i}`.slice(-2)}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </Flex>
                                </Flex>
                                <Flex className="gap-3">
                                    <Text className="w-16 whitespace-nowrap">
                                        End time
                                    </Text>
                                    <Flex className="w-full gap-2">
                                        <Select
                                            placeholder="HH"
                                            enableClear={false}
                                            className="w-full"
                                            value={endH.toString()}
                                            onChange={(x) => setEndH(Number(x))}
                                        >
                                            {[...Array(24)].map((x, i) => (
                                                <SelectItem value={`${i}`}>
                                                    {`0${i}`.slice(-2)}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                        <Title>:</Title>
                                        <Select
                                            placeholder="mm"
                                            enableClear={false}
                                            className="w-full"
                                            value={endM.toString()}
                                            onChange={(x) => setEndM(Number(x))}
                                        >
                                            {[...Array(60)].map((x, i) => (
                                                <SelectItem value={`${i}`}>
                                                    {`0${i}`.slice(-2)}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </Flex>
                                </Flex>
                            </Flex>
                        )}
                    </>
                )}
            </Flex>
        </Card>
    )
}
