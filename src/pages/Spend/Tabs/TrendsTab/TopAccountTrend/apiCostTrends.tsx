import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint,
    RequestParams,
} from '../../../../../api/api'
import AxiosAPI, { setWorkspace } from '../../../../../api/ApiConfig'

interface ConnectionTrend {
    connectionId: string
    trend: GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint[]
}

const apiV2CostTrendConnections = (
    api: Api<any>,
    connectionIDs?: string[],
    query?: {
        connector?: ('' | 'AWS' | 'Azure')[]
        startTime?: string
        endTime?: string
        datapointCount?: string
    },
    params: RequestParams = {}
) => {
    if (connectionIDs === undefined) {
        return Promise.resolve(undefined)
    }
    return Promise.all(
        connectionIDs.map((connectionId) => {
            return api.inventory
                .apiV2CostTrendList(
                    { ...query, connectionId: [connectionId] },
                    params
                )
                .then((item) => {
                    const v: ConnectionTrend = {
                        connectionId,
                        trend: item.data,
                    }
                    return v
                })
        })
    )
}

interface IuseInventoryApiV2CostTrendConnectionsState {
    isLoading: boolean
    isExecuted: boolean
    response?: ConnectionTrend[]
    error?: any
}

export const useInventoryApiV2CostTrendConnections = (
    connectionIDs?: string[],
    query?: {
        connector?: ('' | 'AWS' | 'Azure')[]
        startTime?: string
        endTime?: string
        datapointCount?: string
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] =
        useState<IuseInventoryApiV2CostTrendConnectionsState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
            isExecuted: true,
        })
        try {
            apiV2CostTrendConnections(api, connectionIDs, query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp || [],
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    setState({
                        ...state,
                        error: err,
                        isLoading: false,
                        isExecuted: true,
                    })
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
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        sendRequest()
    }
    return { response, isLoading, isExecuted, error, sendNow }
}
