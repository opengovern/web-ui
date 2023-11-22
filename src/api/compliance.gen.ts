import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedEntities,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkRemediation,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgComplianceApiConnectionAssignedBenchmark,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFilters,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetAccountsFindingsSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetServicesFindingsSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsight,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgComplianceApiPolicySummary,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseComplianceApiV1AiPolicyRemediationCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkRemediation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1AiPolicyRemediationCreate = (
    policyId: string,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AiPolicyRemediationCreateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([policyId, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1AiPolicyRemediationCreate(policyId, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (JSON.stringify([policyId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([policyId, params, autoExecute]))
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

interface IuseComplianceApiV1AssignmentsBenchmarkDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedEntities
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1AssignmentsBenchmarkDetail = (
    benchmarkId: string,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AssignmentsBenchmarkDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1AssignmentsBenchmarkDetail(benchmarkId, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (JSON.stringify([benchmarkId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([benchmarkId, params, autoExecute]))
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

interface IuseComplianceApiV1AssignmentsConnectionDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiConnectionAssignedBenchmark[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1AssignmentsConnectionDetail = (
    connectionId: string,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AssignmentsConnectionDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connectionId, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1AssignmentsConnectionDetail(connectionId, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (JSON.stringify([connectionId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([connectionId, params, autoExecute]))
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

interface IuseComplianceApiV1AssignmentsConnectionCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1AssignmentsConnectionCreate = (
    benchmarkId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AssignmentsConnectionCreateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1AssignmentsConnectionCreate(benchmarkId, query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
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

interface IuseComplianceApiV1AssignmentsConnectionDeleteState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1AssignmentsConnectionDelete = (
    benchmarkId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AssignmentsConnectionDeleteState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1AssignmentsConnectionDelete(benchmarkId, query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
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

interface IuseComplianceApiV1BenchmarksSummaryListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1BenchmarksSummaryList = (
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        tag?: string[]

        timeAt?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksSummaryListState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1BenchmarksSummaryList(query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

interface IuseComplianceApiV1BenchmarksPoliciesDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiPolicySummary[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1BenchmarksPoliciesDetail = (
    benchmarkId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksPoliciesDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1BenchmarksPoliciesDetail(benchmarkId, query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
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

interface IuseComplianceApiV1BenchmarksPoliciesDetail2State {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiPolicySummary
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1BenchmarksPoliciesDetail2 = (
    benchmarkId: string,
    policyId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksPoliciesDetail2State>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, policyId, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1BenchmarksPoliciesDetail2(
                    benchmarkId,
                    policyId,
                    query,
                    params
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (
        JSON.stringify([benchmarkId, policyId, query, params, autoExecute]) !==
        lastInput
    ) {
        setLastInput(
            JSON.stringify([benchmarkId, policyId, query, params, autoExecute])
        )
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

interface IuseComplianceApiV1BenchmarksSummaryDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1BenchmarksSummaryDetail = (
    benchmarkId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        timeAt?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksSummaryDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1BenchmarksSummaryDetail(benchmarkId, query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
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

interface IuseComplianceApiV1BenchmarksTrendDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1BenchmarksTrendDetail = (
    benchmarkId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksTrendDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1BenchmarksTrendDetail(benchmarkId, query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
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

interface IuseComplianceApiV1FindingsCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsCreate = (
    request: GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsRequest,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1FindingsCreateState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1FindingsCreate(request, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (JSON.stringify([request, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([request, params, autoExecute]))
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

interface IuseComplianceApiV1FindingsFiltersCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFilters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsFiltersCreate = (
    request: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFilters,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1FindingsFiltersCreateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1FindingsFiltersCreate(request, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (JSON.stringify([request, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([request, params, autoExecute]))
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

interface IuseComplianceApiV1FindingsAccountsDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetAccountsFindingsSummaryResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsAccountsDetail = (
    benchmarkId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1FindingsAccountsDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1FindingsAccountsDetail(benchmarkId, query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
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

interface IuseComplianceApiV1FindingsServicesDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetServicesFindingsSummaryResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsServicesDetail = (
    benchmarkId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1FindingsServicesDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1FindingsServicesDetail(benchmarkId, query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
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

interface IuseComplianceApiV1FindingsCountDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsCountDetail = (
    benchmarkId: string,
    field: 'resourceType' | 'connectionID' | 'resourceID' | 'service',
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        severities?: (
            | 'none'
            | 'passed'
            | 'low'
            | 'medium'
            | 'high'
            | 'critical'
        )[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1FindingsCountDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, field, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1FindingsCountDetail(benchmarkId, field, query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (
        JSON.stringify([benchmarkId, field, query, params, autoExecute]) !==
        lastInput
    ) {
        setLastInput(
            JSON.stringify([benchmarkId, field, query, params, autoExecute])
        )
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

interface IuseComplianceApiV1FindingsTopDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsTopDetail = (
    benchmarkId: string,
    field: 'resourceType' | 'connectionID' | 'resourceID' | 'service',
    count: number,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        severities?: (
            | 'none'
            | 'passed'
            | 'low'
            | 'medium'
            | 'high'
            | 'critical'
        )[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1FindingsTopDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, field, count, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1FindingsTopDetail(
                    benchmarkId,
                    field,
                    count,
                    query,
                    params
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (
        JSON.stringify([
            benchmarkId,
            field,
            count,
            query,
            params,
            autoExecute,
        ]) !== lastInput
    ) {
        setLastInput(
            JSON.stringify([
                benchmarkId,
                field,
                count,
                query,
                params,
                autoExecute,
            ])
        )
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

interface IuseComplianceApiV1InsightListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1InsightList = (
    query?: {
        tag?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1InsightListState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1InsightList(query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

interface IuseComplianceApiV1InsightGroupListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1InsightGroupList = (
    query?: {
        tag?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1InsightGroupListState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1InsightGroupList(query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

interface IuseComplianceApiV1InsightGroupDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1InsightGroupDetail = (
    insightGroupId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1InsightGroupDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightGroupId, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1InsightGroupDetail(insightGroupId, query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (
        JSON.stringify([insightGroupId, query, params, autoExecute]) !==
        lastInput
    ) {
        setLastInput(
            JSON.stringify([insightGroupId, query, params, autoExecute])
        )
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

interface IuseComplianceApiV1InsightGroupTrendDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1InsightGroupTrendDetail = (
    insightGroupId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        startTime?: number

        endTime?: number

        datapointCount?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1InsightGroupTrendDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightGroupId, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1InsightGroupTrendDetail(insightGroupId, query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (
        JSON.stringify([insightGroupId, query, params, autoExecute]) !==
        lastInput
    ) {
        setLastInput(
            JSON.stringify([insightGroupId, query, params, autoExecute])
        )
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

interface IuseComplianceApiV1InsightDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1InsightDetail = (
    insightId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1InsightDetailState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1InsightDetail(insightId, query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (JSON.stringify([insightId, query, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([insightId, query, params, autoExecute]))
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

interface IuseComplianceApiV1InsightTrendDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1InsightTrendDetail = (
    insightId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        startTime?: number

        endTime?: number

        datapointCount?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1InsightTrendDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, query, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1InsightTrendDetail(insightId, query, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (JSON.stringify([insightId, query, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([insightId, query, params, autoExecute]))
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

interface IuseComplianceApiV1MetadataInsightDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1MetadataInsightDetail = (
    insightId: string,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1MetadataInsightDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1MetadataInsightDetail(insightId, params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (JSON.stringify([insightId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([insightId, params, autoExecute]))
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

interface IuseComplianceApiV1MetadataTagComplianceListState {
    isLoading: boolean
    isExecuted: boolean
    response?: Record<string, string[]>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1MetadataTagComplianceList = (
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1MetadataTagComplianceListState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1MetadataTagComplianceList(params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (JSON.stringify([params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([params, autoExecute]))
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

interface IuseComplianceApiV1MetadataTagInsightListState {
    isLoading: boolean
    isExecuted: boolean
    response?: Record<string, string[]>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1MetadataTagInsightList = (
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1MetadataTagInsightListState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1MetadataTagInsightList(params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (JSON.stringify([params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([params, autoExecute]))
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

interface IuseComplianceApiV1QueriesSyncListState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1QueriesSyncList = (
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1QueriesSyncListState>(
        {
            isLoading: true,
            isExecuted: false,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([params, autoExecute])
    )

    const sendRequest = () => {
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

            api.compliance
                .apiV1QueriesSyncList(params)
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
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
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

    if (JSON.stringify([params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([params, autoExecute]))
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
