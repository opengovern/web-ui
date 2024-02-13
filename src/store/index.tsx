import { atom } from 'jotai'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse } from '../api/api'

dayjs.extend(utc)

interface INotification {
    text: string | undefined
    type: 'success' | 'warning' | 'error' | 'info' | undefined
    position?: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'
}

export const notificationAtom = atom<INotification>({
    text: undefined,
    type: undefined,
    position: undefined,
})

export const sideBarCollapsedAtom = atom(localStorage.collapse === 'true')
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
export const previewAtom = atom(
    localStorage.preview === 'true' ? 'true' : 'false'
)
export const runQueryAtom = atom('')

export const tokenAtom = atom<string>('')
export const colorBlindModeAtom = atom<boolean>(false)
