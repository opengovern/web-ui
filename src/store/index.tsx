import { atom } from 'jotai'
import { parseDate, DateValue } from '@internationalized/date'
import dayjs from 'dayjs'

export const timeAtom = atom<{
    start: DateValue
    end: DateValue
}>({
    start: parseDate(dayjs().subtract(1, 'week').format('YYYY-MM-DD')),
    end: parseDate(dayjs().format('YYYY-MM-DD')),
})

export const spendTimeAtom = atom<{
    start: DateValue
    end: DateValue
}>({
    start: parseDate(dayjs().subtract(1, 'month').format('YYYY-MM-DD')),
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
