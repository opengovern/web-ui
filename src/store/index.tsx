import { atom } from 'jotai'
import { DateRangePickerValue } from '@tremor/react'
import dayjs from 'dayjs'

export const timeAtom = atom<DateRangePickerValue>({
    from: dayjs().subtract(1, 'week').toDate(),
    to: new Date(),
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
