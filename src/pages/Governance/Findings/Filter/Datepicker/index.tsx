import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import dayjs from 'dayjs'
import { AriaDateRangePickerProps, DateValue } from '@react-aria/datepicker'
import { useDateRangePickerState } from 'react-stately'
import { useEffect, useRef, useState } from 'react'
import { useDateRangePicker } from 'react-aria'
import { Checkbox } from 'pretty-checkbox-react'
import { ClockIcon } from '@heroicons/react/24/outline'
import { Flex, Select, SelectItem, Text, Title } from '@tremor/react'
import {
    defaultFindingsTime,
    useURLParam,
} from '../../../../../utilities/urlstate'
import { RangeCalendar } from '../../../../../components/Layout/Header/DateRangePicker/Calendar/RangeCalendar'

function CustomDatePicker(props: AriaDateRangePickerProps<DateValue>) {
    const state = useDateRangePickerState(props)
    const ref = useRef(null)

    const { calendarProps } = useDateRangePicker(props, state, ref)

    return <RangeCalendar {...calendarProps} />
}

export interface IDate {
    start: dayjs.Dayjs
    end: dayjs.Dayjs
}

export default function Datepicker() {
    const [activeTimeRange, setActiveTimeRange] = useURLParam<IDate>(
        'dateRange',
        defaultFindingsTime,
        (v) => {
            return `${v.start.format('YYYY-MM-DD HH:mm')} - ${v.end.format(
                'YYYY-MM-DD HH:mm'
            )}`
        },
        (v) => {
            const arr = v
                .replaceAll('+', ' ')
                .split(' - ')
                .map((m) => dayjs(m))
            return {
                start: arr[0],
                end: arr[1],
            }
        }
    )
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

    return (
        <>
            <CustomDatePicker
                value={{
                    start: parseDate(val.start.format('YYYY-MM-DD')),
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
                <Flex flexDirection="col" className="gap-2">
                    <Flex>
                        <Text>Start time</Text>
                        <Flex className="w-fit gap-2">
                            <Select
                                placeholder="HH"
                                enableClear={false}
                                className="w-20 min-w-[80px]"
                                value={startH.toString()}
                                onChange={(x) => setStartH(Number(x))}
                            >
                                {[...Array(24)].map((x, i) => (
                                    <SelectItem value={`${i}`}>{i}</SelectItem>
                                ))}
                            </Select>
                            <Title>:</Title>
                            <Select
                                placeholder="mm"
                                enableClear={false}
                                className="w-20 min-w-[80px]"
                                value={startM.toString()}
                                onChange={(x) => setStartM(Number(x))}
                            >
                                {[...Array(60)].map((x, i) => (
                                    <SelectItem value={`${i}`}>{i}</SelectItem>
                                ))}
                            </Select>
                        </Flex>
                    </Flex>
                    <Flex>
                        <Text>End time</Text>
                        <Flex className="w-fit gap-2">
                            <Select
                                placeholder="HH"
                                enableClear={false}
                                className="w-20 min-w-[80px]"
                                value={endH.toString()}
                                onChange={(x) => setEndH(Number(x))}
                            >
                                {[...Array(23)].map((x, i) => (
                                    <SelectItem value={`${i + 1}`}>
                                        {i + 1}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Title>:</Title>
                            <Select
                                placeholder="mm"
                                enableClear={false}
                                className="w-20 min-w-[80px]"
                                value={endM.toString()}
                                onChange={(x) => setEndM(Number(x))}
                            >
                                {[...Array(59)].map((x, i) => (
                                    <SelectItem value={`${i + 1}`}>
                                        {i + 1}
                                    </SelectItem>
                                ))}
                            </Select>
                        </Flex>
                    </Flex>
                </Flex>
            )}
        </>
    )
}
