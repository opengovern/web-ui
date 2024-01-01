import { atom } from 'jotai'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse } from '../api/api'

dayjs.extend(utc)

export const timeAtom = atom<{
    start: dayjs.Dayjs
    end: dayjs.Dayjs
}>({
    start: dayjs().subtract(1, 'week').startOf('day'),
    end: dayjs().endOf('day'),
})

export const spendTimeAtom = atom<{
    start: dayjs.Dayjs
    end: dayjs.Dayjs
}>({
    start: dayjs().subtract(1, 'month').startOf('day'),
    end: dayjs().subtract(2, 'day').endOf('day'),
})

export interface IFilter {
    provider: '' | 'AWS' | 'Azure'
    connections: string[]
    connectionGroup: string[]
}

export const filterAtom = atom<IFilter>({
    provider: '',
    connections: [],
    connectionGroup: [],
})

interface INotification {
    text: string | undefined
    type: 'success' | 'warning' | 'error' | 'info' | undefined
}

export const notificationAtom = atom<INotification>({
    text: undefined,
    type: undefined,
})

export const sideBarCollapsedAtom = atom(false)
export const complianceOpenAtom = atom(false)
export const automationOpenAtom = atom(false)
export const queryAtom = atom('')
export const isDemoAtom = atom(localStorage.demoMode === 'true')
export const workspaceAtom = atom<{
    list: GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse[]
    current:
        | GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse
        | undefined
}>({ list: [], current: undefined })
export const previewAtom = atom(localStorage.preview)
export const runQueryAtom = atom('')
