import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgDescribeApiListJobsResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStack,
    GithubComKaytuIoKaytuEnginePkgDescribeApiGetStackFindings,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsight,
    GithubComKaytuIoKaytuEnginePkgDescribeApiJobSeqCheckResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiListDiscoveryResourceTypes,
    GithubComKaytuIoKaytuEnginePkgDescribeApiListJobsRequest,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseScheduleApiV1ComplianceReEvaluateDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgDescribeApiJobSeqCheckResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1ComplianceReEvaluateDetail = (
    benchmarkId: string,
    query: {
        connection_id: string[]

        control_id?: string[]
    },
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1ComplianceReEvaluateDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqbenchmarkId: string,
        reqquery: {
            connection_id: string[]

            control_id?: string[]
        },
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
            api.schedule
                .apiV1ComplianceReEvaluateDetail(
                    reqbenchmarkId,
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
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, benchmarkId, query, params)
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
        sendRequest(newController, benchmarkId, query, params)
    }

    const sendNowWithParams = (
        reqbenchmarkId: string,
        reqquery: {
            connection_id: string[]

            control_id?: string[]
        },
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqbenchmarkId, reqquery, reqparams)
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

interface IuseScheduleApiV1ComplianceReEvaluateUpdateState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1ComplianceReEvaluateUpdate = (
    benchmarkId: string,
    query: {
        connection_id: string[]

        control_id?: string[]
    },
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1ComplianceReEvaluateUpdateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqbenchmarkId: string,
        reqquery: {
            connection_id: string[]

            control_id?: string[]
        },
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
            api.schedule
                .apiV1ComplianceReEvaluateUpdate(
                    reqbenchmarkId,
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
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, benchmarkId, query, params)
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
        sendRequest(newController, benchmarkId, query, params)
    }

    const sendNowWithParams = (
        reqbenchmarkId: string,
        reqquery: {
            connection_id: string[]

            control_id?: string[]
        },
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqbenchmarkId, reqquery, reqparams)
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

interface IuseScheduleApiV1ComplianceTriggerUpdateState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1ComplianceTriggerUpdate = (
    query: {
        benchmark_id: string[]

        connection_id?: string[]
    },
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1ComplianceTriggerUpdateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqquery: {
            benchmark_id: string[]

            connection_id?: string[]
        },
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
            api.schedule
                .apiV1ComplianceTriggerUpdate(reqquery, reqparamsSignal)
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
            sendRequest(newController, query, params)
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
        sendRequest(newController, query, params)
    }

    const sendNowWithParams = (
        reqquery: {
            benchmark_id: string[]

            connection_id?: string[]
        },
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqquery, reqparams)
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

interface IuseScheduleApiV1ComplianceTriggerUpdate2State {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1ComplianceTriggerUpdate2 = (
    benchmarkId: string,
    query?: {
        connection_id?: string[]
    },
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1ComplianceTriggerUpdate2State>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqbenchmarkId: string,
        reqquery:
            | {
                  connection_id?: string[]
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
            api.schedule
                .apiV1ComplianceTriggerUpdate2(
                    reqbenchmarkId,
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
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, benchmarkId, query, params)
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
        sendRequest(newController, benchmarkId, query, params)
    }

    const sendNowWithParams = (
        reqbenchmarkId: string,
        reqquery:
            | {
                  connection_id?: string[]
              }
            | undefined,
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqbenchmarkId, reqquery, reqparams)
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

interface IuseScheduleApiV1ComplianceTriggerSummaryUpdateState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1ComplianceTriggerSummaryUpdate = (
    benchmarkId: string,
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1ComplianceTriggerSummaryUpdateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqbenchmarkId: string,
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
            api.schedule
                .apiV1ComplianceTriggerSummaryUpdate(
                    reqbenchmarkId,
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

    if (JSON.stringify([benchmarkId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([benchmarkId, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, benchmarkId, params)
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
        sendRequest(newController, benchmarkId, params)
    }

    const sendNowWithParams = (
        reqbenchmarkId: string,
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqbenchmarkId, reqparams)
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

interface IuseScheduleApiV1DescribeConnectionStatusUpdateState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1DescribeConnectionStatusUpdate = (
    query: {
        connection_id: string
    },
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1DescribeConnectionStatusUpdateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqquery: {
            connection_id: string
        },
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
            api.schedule
                .apiV1DescribeConnectionStatusUpdate(reqquery, reqparamsSignal)
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
            sendRequest(newController, query, params)
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
        sendRequest(newController, query, params)
    }

    const sendNowWithParams = (
        reqquery: {
            connection_id: string
        },
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqquery, reqparams)
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

interface IuseScheduleApiV1DescribeTriggerUpdateState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1DescribeTriggerUpdate = (
    connectionId: string,
    query?: {
        resource_type?: string[]
    },
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1DescribeTriggerUpdateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connectionId, query, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqconnectionId: string,
        reqquery:
            | {
                  resource_type?: string[]
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
            api.schedule
                .apiV1DescribeTriggerUpdate(
                    reqconnectionId,
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
        JSON.stringify([connectionId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([connectionId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, connectionId, query, params)
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
        sendRequest(newController, connectionId, query, params)
    }

    const sendNowWithParams = (
        reqconnectionId: string,
        reqquery:
            | {
                  resource_type?: string[]
              }
            | undefined,
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqconnectionId, reqquery, reqparams)
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

interface IuseScheduleApiV1DiscoveryResourcetypesListListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgDescribeApiListDiscoveryResourceTypes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1DiscoveryResourcetypesListList = (
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1DiscoveryResourcetypesListListState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
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
            api.schedule
                .apiV1DiscoveryResourcetypesListList(reqparamsSignal)
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

    if (JSON.stringify([params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, params)
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
        sendRequest(newController, params)
    }

    const sendNowWithParams = (reqparams: RequestParams) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqparams)
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

interface IuseScheduleApiV1InsightTriggerUpdateState {
    isLoading: boolean
    isExecuted: boolean
    response?: number[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1InsightTriggerUpdate = (
    insightId: number,
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1InsightTriggerUpdateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqinsightId: number,
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
            api.schedule
                .apiV1InsightTriggerUpdate(reqinsightId, reqparamsSignal)
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

    if (JSON.stringify([insightId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([insightId, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, insightId, params)
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
        sendRequest(newController, insightId, params)
    }

    const sendNowWithParams = (
        reqinsightId: number,
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqinsightId, reqparams)
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

interface IuseScheduleApiV1JobsCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgDescribeApiListJobsResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1JobsCreate = (
    request: GithubComKaytuIoKaytuEnginePkgDescribeApiListJobsRequest,
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseScheduleApiV1JobsCreateState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqrequest: GithubComKaytuIoKaytuEnginePkgDescribeApiListJobsRequest,
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
            api.schedule
                .apiV1JobsCreate(reqrequest, reqparamsSignal)
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
            sendRequest(newController, request, params)
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
        sendRequest(newController, request, params)
    }

    const sendNowWithParams = (
        reqrequest: GithubComKaytuIoKaytuEnginePkgDescribeApiListJobsRequest,
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqrequest, reqparams)
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

interface IuseScheduleApiV1StacksListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgDescribeApiStack[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1StacksList = (
    query?: {
        tag?: string[]

        accountIds?: string[]
    },
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseScheduleApiV1StacksListState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqquery:
            | {
                  tag?: string[]

                  accountIds?: string[]
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
            api.schedule
                .apiV1StacksList(reqquery, reqparamsSignal)
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
            sendRequest(newController, query, params)
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
        sendRequest(newController, query, params)
    }

    const sendNowWithParams = (
        reqquery:
            | {
                  tag?: string[]

                  accountIds?: string[]
              }
            | undefined,
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqquery, reqparams)
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

interface IuseScheduleApiV1StacksCreateCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgDescribeApiStack
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1StacksCreateCreate = (
    data: {
        stateFile?: File

        tag?: string

        config: string

        remoteStateConfig?: string
    },
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1StacksCreateCreateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([data, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqdata: {
            stateFile?: File

            tag?: string

            config: string

            remoteStateConfig?: string
        },
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
            api.schedule
                .apiV1StacksCreateCreate(reqdata, reqparamsSignal)
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

    if (JSON.stringify([data, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([data, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, data, params)
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
        sendRequest(newController, data, params)
    }

    const sendNowWithParams = (
        reqdata: {
            stateFile?: File

            tag?: string

            config: string

            remoteStateConfig?: string
        },
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqdata, reqparams)
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

interface IuseScheduleApiV1StacksResourceListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgDescribeApiStack[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1StacksResourceList = (
    query: {
        resourceId: string
    },
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1StacksResourceListState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqquery: {
            resourceId: string
        },
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
            api.schedule
                .apiV1StacksResourceList(reqquery, reqparamsSignal)
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
            sendRequest(newController, query, params)
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
        sendRequest(newController, query, params)
    }

    const sendNowWithParams = (
        reqquery: {
            resourceId: string
        },
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqquery, reqparams)
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

interface IuseScheduleApiV1StacksDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgDescribeApiStack
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1StacksDetail = (
    stackId: string,
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseScheduleApiV1StacksDetailState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([stackId, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqstackId: string,
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
            api.schedule
                .apiV1StacksDetail(reqstackId, reqparamsSignal)
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

    if (JSON.stringify([stackId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([stackId, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, stackId, params)
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
        sendRequest(newController, stackId, params)
    }

    const sendNowWithParams = (
        reqstackId: string,
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqstackId, reqparams)
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

interface IuseScheduleApiV1StacksDeleteState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1StacksDelete = (
    stackId: string,
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseScheduleApiV1StacksDeleteState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([stackId, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqstackId: string,
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
            api.schedule
                .apiV1StacksDelete(reqstackId, reqparamsSignal)
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

    if (JSON.stringify([stackId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([stackId, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, stackId, params)
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
        sendRequest(newController, stackId, params)
    }

    const sendNowWithParams = (
        reqstackId: string,
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqstackId, reqparams)
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

interface IuseScheduleApiV1StacksFindingsCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1StacksFindingsCreate = (
    stackId: string,
    request: GithubComKaytuIoKaytuEnginePkgDescribeApiGetStackFindings,
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1StacksFindingsCreateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([stackId, request, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqstackId: string,
        reqrequest: GithubComKaytuIoKaytuEnginePkgDescribeApiGetStackFindings,
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
            api.schedule
                .apiV1StacksFindingsCreate(
                    reqstackId,
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

    if (JSON.stringify([stackId, request, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([stackId, request, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, stackId, request, params)
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
        sendRequest(newController, stackId, request, params)
    }

    const sendNowWithParams = (
        reqstackId: string,
        reqrequest: GithubComKaytuIoKaytuEnginePkgDescribeApiGetStackFindings,
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqstackId, reqrequest, reqparams)
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

interface IuseScheduleApiV1StacksInsightDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1StacksInsightDetail = (
    stackId: string,
    query: {
        insightId: number

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1StacksInsightDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([stackId, query, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqstackId: string,
        reqquery: {
            insightId: number

            startTime?: number

            endTime?: number
        },
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
            api.schedule
                .apiV1StacksInsightDetail(reqstackId, reqquery, reqparamsSignal)
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

    if (JSON.stringify([stackId, query, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([stackId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, stackId, query, params)
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
        sendRequest(newController, stackId, query, params)
    }

    const sendNowWithParams = (
        reqstackId: string,
        reqquery: {
            insightId: number

            startTime?: number

            endTime?: number
        },
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqstackId, reqquery, reqparams)
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

interface IuseScheduleApiV1StacksInsightsDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

/**
 * URL:
 */
export const useScheduleApiV1StacksInsightsDetail = (
    stackId: string,
    query?: {
        insightIds?: number[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    autoExecute = true,
    overwriteWorkspace: string | undefined = undefined
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseScheduleApiV1StacksInsightsDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([stackId, query, params, autoExecute])
    )

    const sendRequest = (
        abortCtrl: AbortController,
        reqstackId: string,
        reqquery:
            | {
                  insightIds?: number[]

                  startTime?: number

                  endTime?: number
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
            api.schedule
                .apiV1StacksInsightsDetail(
                    reqstackId,
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

    if (JSON.stringify([stackId, query, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([stackId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController, stackId, query, params)
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
        sendRequest(newController, stackId, query, params)
    }

    const sendNowWithParams = (
        reqstackId: string,
        reqquery:
            | {
                  insightIds?: number[]

                  startTime?: number

                  endTime?: number
              }
            | undefined,
        reqparams: RequestParams
    ) => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController, reqstackId, reqquery, reqparams)
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
