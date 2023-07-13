import { atom } from 'jotai'
import { DateRangePickerValue } from '@tremor/react'
import { parseDate, CalendarDate } from '@internationalized/date'
import dayjs from 'dayjs'

export const timeAtom = atom<{
    start: CalendarDate
    end: CalendarDate
}>({
    start: parseDate(dayjs().subtract(1, 'week').format('YYYY-MM-DD')),
    end: parseDate(dayjs().format('YYYY-MM-DD')),
})

interface IFilter {
    provider: '' | 'AWS' | 'Azure'
    connections: string[]
}
export const filterAtom = atom<IFilter>({
    provider: '',
    connections: [],
})

export const selectedResourceCategoryAtom = atom('All Categories')
export const sideBarCollapsedAtom = atom(false)
