import { DateRangePicker as DatePicker } from '@react-spectrum/datepicker'
import { Provider } from '@react-spectrum/provider'
import { theme } from '@react-spectrum/theme-default'
import { today, getLocalTimeZone } from '@internationalized/date'
import { useAtom } from 'jotai'
import { timeAtom } from '../../store'

export default function DateRangePicker() {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    return (
        <Provider theme={theme}>
            <DatePicker
                value={activeTimeRange}
                onChange={setActiveTimeRange}
                maxValue={today(getLocalTimeZone())}
            />
        </Provider>
    )
}
