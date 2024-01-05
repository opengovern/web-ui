import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Api,

 RequestParams } from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'


interface IuseCostEstimatorApiV1CostAwsListState {
    isLoading: boolean
    isExecuted: boolean
    response?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useCostEstimatorApiV1CostAwsList = (query: {
                
                resourceId: string
                
                resourceType: string
            },
            params: RequestParams = {}, autoExecute = true) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
    useState<IuseCostEstimatorApiV1CostAwsListState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query,params, autoExecute])
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
            api
                .costEstimator
                .apiV1CostAwsList(query,paramsSignal)
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

    if (JSON.stringify([query,params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([query,params, autoExecute]))
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

interface IuseCostEstimatorApiV1CostAzureListState {
    isLoading: boolean
    isExecuted: boolean
    response?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useCostEstimatorApiV1CostAzureList = (query: {
                
                resourceId: string
                
                resourceType: string
            },
            params: RequestParams = {}, autoExecute = true) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
    useState<IuseCostEstimatorApiV1CostAzureListState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query,params, autoExecute])
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
            api
                .costEstimator
                .apiV1CostAzureList(query,paramsSignal)
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

    if (JSON.stringify([query,params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([query,params, autoExecute]))
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

