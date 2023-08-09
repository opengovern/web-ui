import { useRef } from 'react'
import { DateFieldState, DateSegment, useDateFieldState } from 'react-stately'
import { useDateField, useDateSegment, useLocale } from 'react-aria'
import { DateValue, createCalendar } from '@internationalized/date'
import { AriaDateFieldOptions } from '@react-aria/datepicker'

function CustomDateSegment({
    segment,
    state,
}: {
    segment: DateSegment
    state: DateFieldState
}) {
    const ref = useRef(null)
    const { segmentProps } = useDateSegment(segment, state, ref)

    return (
        <div
            {...segmentProps}
            ref={ref}
            style={{
                ...segmentProps.style,
                minWidth:
                    segment.maxValue != null
                        ? `${String(segment.maxValue).length}ch`
                        : undefined,
            }}
            className={`px-0.5 box-content tabular-nums text-right outline-none rounded-sm ${
                !segment.isEditable
                    ? 'text-gray-500 dark:text-gray-50'
                    : 'text-gray-800 dark:text-gray-50'
            }`}
        >
            {/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
            <span
                aria-hidden="true"
                className="block w-full text-center italic text-gray-500 dark:text-gray-50 group-focus:text-white"
                style={{
                    visibility: segment.isPlaceholder ? undefined : 'hidden',
                    height: segment.isPlaceholder ? '' : 0,
                    pointerEvents: 'none',
                }}
            >
                {segment.placeholder}
            </span>
            {segment.isPlaceholder ? '' : segment.text}
        </div>
    )
}

export function DateField(props: AriaDateFieldOptions<DateValue>) {
    const { locale } = useLocale()
    const state = useDateFieldState({
        ...props,
        locale,
        createCalendar,
    })

    const ref = useRef(null)
    const { fieldProps } = useDateField(props, state, ref)

    return (
        <div {...fieldProps} ref={ref} className="flex">
            {state.segments.map((segment) => (
                <CustomDateSegment segment={segment} state={state} />
            ))}
        </div>
    )
}
