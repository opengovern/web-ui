// eslint-disable-next-line import/no-extraneous-dependencies
import { useCalendarGrid, useLocale } from 'react-aria'
import { getWeeksInMonth } from '@internationalized/date'
import { AriaCalendarCellProps } from '@react-aria/calendar'
import { CalendarCell } from '../CalendarCell'

export function CalendarGrid({ state, ...props }: { state: any }) {
    const { locale } = useLocale()
    const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state)

    // Get the number of weeks in the month so we can render the proper number of rows.
    const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

    return (
        <table {...gridProps} cellPadding="0" className="flex-1">
            <thead {...headerProps} className="text-gray-600">
                <tr>
                    {weekDays.map((day) => (
                        <th className="text-center">{day}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    [...new Array(weeksInMonth).keys()].map((weekIndex) => (
                        <tr key={weekIndex}>
                            {state
                                .getDatesInWeek(weekIndex)
                                .map((date: AriaCalendarCellProps['date']) =>
                                    date ? (
                                        <CalendarCell
                                            state={state}
                                            date={date}
                                        />
                                    ) : (
                                        // eslint-disable-next-line jsx-a11y/control-has-associated-label
                                        <td />
                                    )
                                )}
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
