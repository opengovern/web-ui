import { atom } from 'jotai'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const timeAtom = atom<{
    start: dayjs.Dayjs
    end: dayjs.Dayjs
}>({
    start: dayjs.utc().subtract(1, 'week').startOf('day'),
    end: dayjs.utc().endOf('day'),
})

export const spendTimeAtom = atom<{
    start: dayjs.Dayjs
    end: dayjs.Dayjs
}>({
    start: dayjs.utc().subtract(1, 'month').startOf('day'),
    end: dayjs.utc().subtract(2, 'day').endOf('day'),
})

export interface IFilter {
    provider: '' | 'AWS' | 'Azure'
    connections: string[]
}

export const filterAtom = atom<IFilter>({
    provider: '',
    connections: [],
})

export const selectedResourceCategoryAtom = atom('All Categories')
export const sideBarCollapsedAtom = atom(false)
export const assetOpenAtom = atom(false)
export const administrationOpenAtom = atom(false)
