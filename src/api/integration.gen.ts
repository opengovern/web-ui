import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Api,
<<<<<<< HEAD
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection,
=======
>>>>>>> 303468476ee91fd63dedb9f5a8eb64380a0ddb43
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCreateAzureConnectionRequest,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCreateCredentialResponse,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListConnectionsSummaryResponse,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseIntegrationApiV1ConnectionsSummariesListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListConnectionsSummaryResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useIntegrationApiV1ConnectionsSummariesList = (
    query?: {
        filter?: string

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        resourceCollection?: string[]

        connectionGroups?: string[]

        lifecycleState?:
            | 'DISABLED'
            | 'DISCOVERED'
            | 'IN_PROGRESS'
            | 'ONBOARD'
            | 'ARCHIVED'

        healthState?: 'healthy' | 'unhealthy'

        pageSize?: number

        pageNumber?: number

        startTime?: number

        endTime?: number

        needCost?: boolean

        needResourceCount?: boolean

        sortBy?:
            | 'onboard_date'
            | 'resource_count'
            | 'cost'
            | 'growth'
            | 'growth_rate'
            | 'cost_growth'
            | 'cost_growth_rate'
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseIntegrationApiV1ConnectionsSummariesListState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
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
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.integration
                .apiV1ConnectionsSummariesList(query, paramsSignal)
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

    if (JSON.stringify([query, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
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
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

<<<<<<< HEAD
interface IuseIntegrationApiV1ConnectionsAzureHealthcheckDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityConnection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useIntegrationApiV1ConnectionsAzureHealthcheckDetail = (
    connectionId: string,
    query?: {
        updateMetadata?: boolean
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseIntegrationApiV1ConnectionsAzureHealthcheckDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connectionId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
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
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.integration
                .apiV1ConnectionsAzureHealthcheckDetail(
                    connectionId,
                    query,
                    paramsSignal
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
        JSON.stringify([connectionId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([connectionId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
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
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

=======
>>>>>>> 303468476ee91fd63dedb9f5a8eb64380a0ddb43
interface IuseIntegrationApiV1CredentialsAzureCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCreateCredentialResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useIntegrationApiV1CredentialsAzureCreate = (
    request: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCreateAzureConnectionRequest,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseIntegrationApiV1CredentialsAzureCreateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
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
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.integration
                .apiV1CredentialsAzureCreate(request, paramsSignal)
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

    if (JSON.stringify([request, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([request, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
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
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}
