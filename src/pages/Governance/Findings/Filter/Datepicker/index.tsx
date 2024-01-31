import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import dayjs from 'dayjs'
import { AriaDateRangePickerProps, DateValue } from '@react-aria/datepicker'
import { useDateRangePickerState } from 'react-stately'
import { useRef, useState } from 'react'
import { useDateRangePicker } from 'react-aria'
import { Checkbox } from 'pretty-checkbox-react'
import { ClockIcon } from '@heroicons/react/24/outline'
import { Flex, Select, SelectItem, Text, Title } from '@tremor/react'
import {
    defaultFindingsTime,
    useUrlDateRangeState,
} from '../../../../../utilities/urlstate'
import { RangeCalendar } from '../../../../../components/Layout/Header/DateRangePicker/Calendar/RangeCalendar'

function CustomDatePicker(props: AriaDateRangePickerProps<DateValue>) {
    const state = useDateRangePickerState(props)
    const ref = useRef(null)

    const { calendarProps } = useDateRangePicker(props, state, ref)

    return <RangeCalendar {...calendarProps} />
}

export default function Datepicker() {
    const [checked, setChecked] = useState(false)
    const [startH, setStartH] = useState(0)
    const [startM, setStartM] = useState(0)
    const [endH, setEndH] = useState(0)
    const [endM, setEndM] = useState(0)

    const { value: activeTimeRange, setValue: setActiveTimeRange } =
        useUrlDateRangeState(defaultFindingsTime)

    const currentValue = () => {
        return {
            start: checked
                ? parseDate(activeTimeRange.start.format('YYYY-MM-DD'))
                : parseDate(
                      activeTimeRange.start.startOf('day').format('YYYY-MM-DD')
                  ),
            end: checked
                ? parseDate(activeTimeRange.end.format('YYYY-MM-DD'))
                : parseDate(
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
        <>
            <CustomDatePicker
                value={currentValue()}
                onChange={(value) => {
                    setActiveTimeRange({
                        start: checked
                            ? dayjs
                                  .utc(value.start.toString())
                                  .add(startH, 'hour')
                                  .add(startM, 'minute')
                            : dayjs.utc(value.start.toString()).startOf('day'),
                        end: checked
                            ? dayjs
                                  .utc(value.end.toString())
                                  .add(endH, 'hour')
                                  .add(endM, 'minute')
                            : dayjs.utc(value.end.toString()).endOf('day'),
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
                                value={startM.toString()}
                                onChange={(x) => setStartM(Number(x))}
                            >
                                {[...Array(59)].map((x, i) => (
                                    <SelectItem value={`${i + 1}`}>
                                        {i + 1}
                                    </SelectItem>
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
