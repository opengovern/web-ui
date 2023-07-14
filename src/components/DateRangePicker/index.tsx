import { DateRangePicker as DatePicker } from '@react-spectrum/datepicker'
import { Provider } from '@react-spectrum/provider'
import { theme } from '@react-spectrum/theme-default'
import { today, getLocalTimeZone } from '@internationalized/date'
import { useAtom } from 'jotai'
import { timeAtom, spendTimeAtom } from '../../store'

interface DatePickerProps {
    isSpend?: boolean
}
export default function DateRangePicker({ isSpend = false }: DatePickerProps) {
    const [activeTimeRange, setActiveTimeRange] = useAtom(
        isSpend ? spendTimeAtom : timeAtom
    )
    return (
        <Provider theme={theme} colorScheme="light">
            <DatePicker
                value={activeTimeRange}
                onChange={setActiveTimeRange}
                maxValue={today(getLocalTimeZone())}
            />
        </Provider>
    )
}
