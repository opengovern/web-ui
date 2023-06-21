import { atom } from 'jotai'
import { DateRangePickerValue } from '@tremor/react'
import dayjs from 'dayjs'

export const timeAtom = atom<DateRangePickerValue>({
    from: dayjs().subtract(1, 'week').toDate(),
    to: new Date(),
})

export const filterAtom = atom({
    provider: '',
    connections: [],
})

export const selectedResourceCategoryAtom = atom('All Categories')