import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Api,
    GithubComKaytuIoKaytuEngineServicesSubscriptionApiEntitiesGetMetersRequest,
    GithubComKaytuIoKaytuEngineServicesSubscriptionApiEntitiesGetMetersResponse,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseSubscriptionApiV1MeteringListCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEngineServicesSubscriptionApiEntitiesGetMetersResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useSubscriptionApiV1MeteringListCreate = (
    request: GithubComKaytuIoKaytuEngineServicesSubscriptionApiEntitiesGetMetersRequest,
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseSubscriptionApiV1MeteringListCreateState>({
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
            if (overwriteWorkspace) {
                setWorkspace(overwriteWorkspace)
            } else if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.subscription
                .apiV1MeteringListCreate(request, paramsSignal)
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
