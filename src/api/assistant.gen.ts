import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Api,
    GithubComKaytuIoKaytuEngineServicesAssistantApiEntitySendMessageRequest,
    GithubComKaytuIoKaytuEngineServicesAssistantApiEntitySendMessageResponse,
    GithubComKaytuIoKaytuEngineServicesAssistantApiEntityListMessagesResponse,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseAssistantApiV1ThreadCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEngineServicesAssistantApiEntitySendMessageResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useAssistantApiV1ThreadCreate = (
    assistantName:
        | 'kaytu-r-assistant'
        | 'kaytu-assets-assistant'
        | 'kaytu-score-assistant'
        | 'kaytu-compliance-assistant',
    request: GithubComKaytuIoKaytuEngineServicesAssistantApiEntitySendMessageRequest,
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAssistantApiV1ThreadCreateState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([assistantName, request, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqassistantName:
            | 'kaytu-r-assistant'
            | 'kaytu-assets-assistant'
            | 'kaytu-score-assistant'
            | 'kaytu-compliance-assistant',
        reqrequest: GithubComKaytuIoKaytuEngineServicesAssistantApiEntitySendMessageRequest,
        reqparams: RequestParams
    ) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (overwriteWorkspace) {
                setWorkspace(overwriteWorkspace)
            } else if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const reqparamsSignal = { ...reqparams, signal: abortCtrl.signal }
            api.assistant
                .apiV1ThreadCreate(
                    reqassistantName,
                    reqrequest,
                    reqparamsSignal
                )
                .then((resp) => {
                    setState({
                        ...state,
                        error: undefined,
                        response: resp.data,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
                })
        } catch (err) {
            setState({
                ...state,
                error: err,
                isLoading: false,
                isExecuted: true,
            })
        }
    }

    if (
        JSON.stringify([assistantName, request, params, autoExecute]) !==
        lastInput
    ) {
        setLastInput(
            JSON.stringify([assistantName, request, params, autoExecute])
        )
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, assistantName, request, params)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, assistantName, request, params)
    }

    const sendNowWithParams = (
        reqassistantName:
            | 'kaytu-r-assistant'
            | 'kaytu-assets-assistant'
            | 'kaytu-score-assistant'
            | 'kaytu-compliance-assistant',
        reqrequest: GithubComKaytuIoKaytuEngineServicesAssistantApiEntitySendMessageRequest,
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqassistantName, reqrequest, reqparams)
    }

    return {
        response,
        isLoading,
        isExecuted,
        error,
        sendNow,
        sendNowWithParams,
    }
}

interface IuseAssistantApiV1ThreadDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEngineServicesAssistantApiEntityListMessagesResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useAssistantApiV1ThreadDetail = (
    threadId: string,
    assistantName:
        | 'kaytu-r-assistant'
        | 'kaytu-assets-assistant'
        | 'kaytu-score-assistant'
        | 'kaytu-compliance-assistant',
    query?: {
        run_id?: string
    },
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAssistantApiV1ThreadDetailState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([threadId, assistantName, query, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqthreadId: string,
        reqassistantName:
            | 'kaytu-r-assistant'
            | 'kaytu-assets-assistant'
            | 'kaytu-score-assistant'
            | 'kaytu-compliance-assistant',
        reqquery:
            | {
                  run_id?: string
              }
            | undefined,
        reqparams: RequestParams
    ) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (overwriteWorkspace) {
                setWorkspace(overwriteWorkspace)
            } else if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const reqparamsSignal = { ...reqparams, signal: abortCtrl.signal }
            api.assistant
                .apiV1ThreadDetail(
                    reqthreadId,
                    reqassistantName,
                    reqquery,
                    reqparamsSignal
                )
                .then((resp) => {
                    setState({
                        ...state,
                        error: undefined,
                        response: resp.data,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
                })
        } catch (err) {
            setState({
                ...state,
                error: err,
                isLoading: false,
                isExecuted: true,
            })
        }
    }

    if (
        JSON.stringify([
            threadId,
            assistantName,
            query,
            params,
            autoExecute,
        ]) !== lastInput
    ) {
        setLastInput(
            JSON.stringify([
                threadId,
                assistantName,
                query,
                params,
                autoExecute,
            ])
        )
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, threadId, assistantName, query, params)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, threadId, assistantName, query, params)
    }

    const sendNowWithParams = (
        reqthreadId: string,
        reqassistantName:
            | 'kaytu-r-assistant'
            | 'kaytu-assets-assistant'
            | 'kaytu-score-assistant'
            | 'kaytu-compliance-assistant',
        reqquery:
            | {
                  run_id?: string
              }
            | undefined,
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(
            newController,
            reqthreadId,
            reqassistantName,
            reqquery,
            reqparams
        )
    }

    return {
        response,
        isLoading,
        isExecuted,
        error,
        sendNow,
        sendNowWithParams,
    }
}
