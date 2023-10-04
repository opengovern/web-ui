import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgAlertingApiApiAction,
    GithubComKaytuIoKaytuEnginePkgAlertingApiApiRule,
    GithubComKaytuIoKaytuEnginePkgAlertingApiUpdateActionRequest,
    GithubComKaytuIoKaytuEnginePkgAlertingApiUpdateRuleRequest,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseAlertingApiActionCreateCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useAlertingApiActionCreateCreate = (
    request: GithubComKaytuIoKaytuEnginePkgAlertingApiApiAction,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('kaytu')
    }

    const [state, setState] = useState<IuseAlertingApiActionCreateCreateState>({
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
            api.alerting
                .apiActionCreateCreate(request, params)
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

interface IuseAlertingApiActionDeleteDeleteState {
    isLoading: boolean
    isExecuted: boolean
    response?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useAlertingApiActionDeleteDelete = (
    actionId: string,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('kaytu')
    }

    const [state, setState] = useState<IuseAlertingApiActionDeleteDeleteState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([actionId, params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.alerting
                .apiActionDeleteDelete(actionId, params)
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

    if (JSON.stringify([actionId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([actionId, params, autoExecute]))
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

interface IuseAlertingApiActionListListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAlertingApiApiAction[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useAlertingApiActionListList = (
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('kaytu')
    }

    const [state, setState] = useState<IuseAlertingApiActionListListState>({
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
            api.alerting
                .apiActionListList(params)
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

interface IuseAlertingApiActionUpdateListState {
    isLoading: boolean
    isExecuted: boolean
    response?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useAlertingApiActionUpdateList = (
    request: GithubComKaytuIoKaytuEnginePkgAlertingApiUpdateActionRequest,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('kaytu')
    }

    const [state, setState] = useState<IuseAlertingApiActionUpdateListState>({
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
            api.alerting
                .apiActionUpdateList(request, params)
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

interface IuseAlertingApiRuleDeleteDeleteState {
    isLoading: boolean
    isExecuted: boolean
    response?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useAlertingApiRuleDeleteDelete = (
    ruleId: string,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('kaytu')
    }

    const [state, setState] = useState<IuseAlertingApiRuleDeleteDeleteState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([ruleId, params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.alerting
                .apiRuleDeleteDelete(ruleId, params)
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

    if (JSON.stringify([ruleId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([ruleId, params, autoExecute]))
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

interface IuseAlertingApiRuleCreateCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useAlertingApiRuleCreateCreate = (
    request: GithubComKaytuIoKaytuEnginePkgAlertingApiApiRule,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('kaytu')
    }

    const [state, setState] = useState<IuseAlertingApiRuleCreateCreateState>({
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
            api.alerting
                .apiRuleCreateCreate(request, params)
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

interface IuseAlertingApiRuleListListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAlertingApiApiRule[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useAlertingApiRuleListList = (
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('kaytu')
    }

    const [state, setState] = useState<IuseAlertingApiRuleListListState>({
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
            api.alerting
                .apiRuleListList(params)
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

interface IuseAlertingApiRuleUpdateListState {
    isLoading: boolean
    isExecuted: boolean
    response?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useAlertingApiRuleUpdateList = (
    request: GithubComKaytuIoKaytuEnginePkgAlertingApiUpdateRuleRequest,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('kaytu')
    }

    const [state, setState] = useState<IuseAlertingApiRuleUpdateListState>({
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
            api.alerting
                .apiRuleUpdateList(request, params)
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
