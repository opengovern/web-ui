import useSWR from 'swr'
import React, { useState, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { useParams } from 'react-router-dom'
import {
    Api,
    AwsResources,
    DescribeComplianceReportJob,
    DescribeDescribeResourceJob,
    DescribeDescribeSourceJob,
    DescribeInsightJob,
    DescribeSummarizerJob,
    GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetRoleBindingsResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUserResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiInviteRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiMembership,
    GithubComKaytuIoKaytuEnginePkgAuthApiPutRoleBindingRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiRoleDetailsResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiRoleUser,
    GithubComKaytuIoKaytuEnginePkgAuthApiRolesListResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiUpdateKeyRoleRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey,
    GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmark,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedSource,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkResultTrend,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkSummary,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTree,
    GithubComKaytuIoKaytuEnginePkgComplianceApiComplianceReport,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsight,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroupTrendResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgComplianceApiPolicy,
    GithubComKaytuIoKaytuEnginePkgComplianceApiQuery,
    GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSingleResourceRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSource,
    GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeStackRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiGetStackFindings,
    GithubComKaytuIoKaytuEnginePkgDescribeApiInsightJob,
    GithubComKaytuIoKaytuEnginePkgDescribeApiListBenchmarkEvaluationsRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiResourceTypeDetail,
    GithubComKaytuIoKaytuEnginePkgDescribeApiSource,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStack,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStackBenchmarkRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStackInsightRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiTriggerBenchmarkEvaluationRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiTriggerInsightEvaluationRequest,
    GithubComKaytuIoKaytuEnginePkgInsightEsInsightResource,
    GithubComKaytuIoKaytuEnginePkgInventoryApiConnectionData,
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetAWSResourceResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetAzureResourceResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourceRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListQueryRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetadataResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetadataResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceSummariesResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiLocationByProviderResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiLocationResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiService,
    GithubComKaytuIoKaytuEnginePkgInventoryApiServiceSummary,
    GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItem,
    GithubComKaytuIoKaytuEnginePkgMetadataApiSetConfigMetadataRequest,
    GithubComKaytuIoKaytuEnginePkgMetadataModelsConfigMetadata,
    GithubComKaytuIoKaytuEnginePkgOnboardApiAzureCredential,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics,
    GithubComKaytuIoKaytuEnginePkgOnboardApiChangeConnectionLifecycleStateRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionCountRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnector,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnectorCount,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateSourceResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEnginePkgOnboardApiGetSourcesRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAwsRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAzureRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiUpdateCredentialRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceNameRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOrganizationRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOwnershipRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceTierRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceResponse,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspace,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimits,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimitsUsage,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseInventoryApiV1LocationsDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiLocationByProviderResponse[]
    error?: any
}

export const useInventoryApiV1LocationsDetail = (
    connector: string,
    params: RequestParams = {},
    wait = false
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseInventoryApiV1LocationsDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connector, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV1LocationsDetail(connector, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([connector, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([connector, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1QueryListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItem[]
    error?: any
}

export const useInventoryApiV1QueryList = (
    request: GithubComKaytuIoKaytuEnginePkgInventoryApiListQueryRequest,
    params: RequestParams = {},
    wait = false
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseInventoryApiV1QueryListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV1QueryList(request, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([request, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([request, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1QueryCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryResponse
    error?: any
}

export const useInventoryApiV1QueryCreate = (
    queryId: string,
    request: GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryRequest,
    params: RequestParams = {},
    wait = false
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseInventoryApiV1QueryCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([queryId, request, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV1QueryCreate(queryId, request, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([queryId, request, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([queryId, request, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1QueryCountListState {
    isLoading: boolean
    response?: number
    error?: any
}

export const useInventoryApiV1QueryCountList = (
    request: GithubComKaytuIoKaytuEnginePkgInventoryApiListQueryRequest,
    params: RequestParams = {},
    wait = false
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseInventoryApiV1QueryCountListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV1QueryCountList(request, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([request, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([request, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1ResourceCreateState {
    isLoading: boolean
    response?: Record<string, string>
    error?: any
}

export const useInventoryApiV1ResourceCreate = (
    request: GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourceRequest,
    params: RequestParams = {},
    wait = false
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseInventoryApiV1ResourceCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV1ResourceCreate(request, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([request, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([request, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1ResourcesCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesResponse
    error?: any
}

export const useInventoryApiV1ResourcesCreate = (
    request: GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesRequest,
    query?: {
        common?: 'true' | 'false' | 'all'
    },
    params: RequestParams = {},
    wait = false
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseInventoryApiV1ResourcesCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV1ResourcesCreate(request, query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([request, query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([request, query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1ResourcesAwsCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiGetAWSResourceResponse
    error?: any
}

export const useInventoryApiV1ResourcesAwsCreate = (
    request: GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesRequest,
    query?: {
        common?: 'true' | 'false' | 'all'
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV1ResourcesAwsCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV1ResourcesAwsCreate(request, query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([request, query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([request, query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1ResourcesAzureCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiGetAzureResourceResponse
    error?: any
}

export const useInventoryApiV1ResourcesAzureCreate = (
    request: GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesRequest,
    query?: {
        common?: 'true' | 'false' | 'all'
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV1ResourcesAzureCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV1ResourcesAzureCreate(request, query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([request, query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([request, query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1ResourcesCountListState {
    isLoading: boolean
    response?: number
    error?: any
}

export const useInventoryApiV1ResourcesCountList = (
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV1ResourcesCountListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV1ResourcesCountList(params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1ResourcesFiltersCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersResponse
    error?: any
}

export const useInventoryApiV1ResourcesFiltersCreate = (
    request: GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersRequest,
    query?: {
        common?: 'true' | 'false' | 'all'
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV1ResourcesFiltersCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV1ResourcesFiltersCreate(request, query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([request, query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([request, query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1ResourcesRegionsListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiLocationResponse[]
    error?: any
}

export const useInventoryApiV1ResourcesRegionsList = (
    query?: {
        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        endTime?: string

        startTime?: string

        pageSize?: number

        pageNumber?: number
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV1ResourcesRegionsListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV1ResourcesRegionsList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1ResourcesTopRegionsListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiLocationResponse[]
    error?: any
}

export const useInventoryApiV1ResourcesTopRegionsList = (
    query: {
        count: number

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV1ResourcesTopRegionsListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV1ResourcesTopRegionsList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ConnectionsDataListState {
    isLoading: boolean
    response?: Record<
        string,
        GithubComKaytuIoKaytuEnginePkgInventoryApiConnectionData
    >
    error?: any
}

export const useInventoryApiV2ConnectionsDataList = (
    query: {
        connectionId: string[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2ConnectionsDataListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ConnectionsDataList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ConnectionsDataDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiConnectionData
    error?: any
}

export const useInventoryApiV2ConnectionsDataDetail = (
    connectionId: string,
    query?: {
        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2ConnectionsDataDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connectionId, query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ConnectionsDataDetail(connectionId, query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([connectionId, query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([connectionId, query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2CostCompositionListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse
    error?: any
}

export const useInventoryApiV2CostCompositionList = (
    query?: {
        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        top?: number

        startTime?: string

        endTime?: string
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2CostCompositionListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2CostCompositionList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2CostMetricListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse
    error?: any
}

export const useInventoryApiV2CostMetricList = (
    query?: {
        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        startTime?: string

        endTime?: string

        sortBy?: 'dimension' | 'cost' | 'growth' | 'growth_rate'

        pageSize?: number

        pageNumber?: number
    },
    params: RequestParams = {},
    wait = false
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseInventoryApiV2CostMetricListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2CostMetricList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2CostTrendListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint[]
    error?: any
}

export const useInventoryApiV2CostTrendList = (
    query?: {
        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        startTime?: string

        endTime?: string

        datapointCount?: string
    },
    params: RequestParams = {},
    wait = false
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseInventoryApiV2CostTrendListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2CostTrendList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2InsightsListState {
    isLoading: boolean
    response?: Record<
        string,
        GithubComKaytuIoKaytuEnginePkgInsightEsInsightResource[]
    >
    error?: any
}

export const useInventoryApiV2InsightsList = (
    query: {
        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        insightId: string[]

        time?: number
    },
    params: RequestParams = {},
    wait = false
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseInventoryApiV2InsightsListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2InsightsList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2InsightsDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInsightEsInsightResource[]
    error?: any
}

export const useInventoryApiV2InsightsDetail = (
    insightId: string,
    query?: {
        connectionId?: string[]

        time?: number
    },
    params: RequestParams = {},
    wait = false
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseInventoryApiV2InsightsDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2InsightsDetail(insightId, query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([insightId, query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([insightId, query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2InsightsTrendDetailState {
    isLoading: boolean
    response?: Record<
        string,
        GithubComKaytuIoKaytuEnginePkgInsightEsInsightResource[]
    >
    error?: any
}

export const useInventoryApiV2InsightsTrendDetail = (
    insightId: string,
    query?: {
        connectionId?: string[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2InsightsTrendDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2InsightsTrendDetail(insightId, query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([insightId, query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([insightId, query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2InsightsJobDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInsightEsInsightResource
    error?: any
}

export const useInventoryApiV2InsightsJobDetail = (
    jobId: string,
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2InsightsJobDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([jobId, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2InsightsJobDetail(jobId, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([jobId, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([jobId, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2MetadataResourcetypeListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetadataResponse
    error?: any
}

export const useInventoryApiV2MetadataResourcetypeList = (
    query: {
        connector: ('' | 'AWS' | 'Azure')[]

        service?: string[]

        tag?: string[]

        pageSize?: number

        pageNumber?: number
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2MetadataResourcetypeListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2MetadataResourcetypeList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2MetadataResourcetypeDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType
    error?: any
}

export const useInventoryApiV2MetadataResourcetypeDetail = (
    resourceType: string,
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2MetadataResourcetypeDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([resourceType, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2MetadataResourcetypeDetail(resourceType, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([resourceType, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([resourceType, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2MetadataServicesListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetadataResponse
    error?: any
}

export const useInventoryApiV2MetadataServicesList = (
    query?: {
        connector?: ('' | 'AWS' | 'Azure')[]

        tag?: string[]

        pageSize?: number

        pageNumber?: number
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2MetadataServicesListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2MetadataServicesList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2MetadataServicesDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiService
    error?: any
}

export const useInventoryApiV2MetadataServicesDetail = (
    serviceName: string,
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2MetadataServicesDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([serviceName, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2MetadataServicesDetail(serviceName, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([serviceName, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([serviceName, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ResourcesCompositionDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse
    error?: any
}

export const useInventoryApiV2ResourcesCompositionDetail = (
    key: string,
    query: {
        top: number

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        endTime?: string

        startTime?: string
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2ResourcesCompositionDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([key, query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ResourcesCompositionDetail(key, query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([key, query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([key, query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ResourcesMetricListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetricsResponse
    error?: any
}

export const useInventoryApiV2ResourcesMetricList = (
    query?: {
        tag?: string[]

        servicename?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        endTime?: string

        startTime?: string

        minCount?: number

        sortBy?: 'name' | 'count' | 'growth' | 'growth_rate'

        pageSize?: number

        pageNumber?: number
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2ResourcesMetricListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ResourcesMetricList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ResourcesMetricDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType
    error?: any
}

export const useInventoryApiV2ResourcesMetricDetail = (
    resourceType: string,
    query?: {
        connectionId?: string[]

        endTime?: string

        startTime?: string
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2ResourcesMetricDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([resourceType, query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ResourcesMetricDetail(resourceType, query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([resourceType, query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([resourceType, query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ResourcesTagListState {
    isLoading: boolean
    response?: Record<string, string[]>
    error?: any
}

export const useInventoryApiV2ResourcesTagList = (
    query?: {
        connector?: string[]

        connectionId?: string[]

        minCount?: number

        endTime?: number
    },
    params: RequestParams = {},
    wait = false
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseInventoryApiV2ResourcesTagListState>(
        {
            isLoading: true,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ResourcesTagList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ResourcesTagDetailState {
    isLoading: boolean
    response?: string[]
    error?: any
}

export const useInventoryApiV2ResourcesTagDetail = (
    key: string,
    query?: {
        connector?: string[]

        connectionId?: string[]

        minCount?: number

        endTime?: number
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2ResourcesTagDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([key, query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ResourcesTagDetail(key, query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([key, query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([key, query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ResourcesTrendListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint[]
    error?: any
}

export const useInventoryApiV2ResourcesTrendList = (
    query?: {
        tag?: string[]

        servicename?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        startTime?: string

        endTime?: string

        datapointCount?: string
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2ResourcesTrendListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ResourcesTrendList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ServicesMetricListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetricsResponse
    error?: any
}

export const useInventoryApiV2ServicesMetricList = (
    query?: {
        tag?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        startTime?: string

        endTime?: string

        sortBy?: 'name' | 'count' | 'growth' | 'growth_rate'

        pageSize?: number

        pageNumber?: number
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2ServicesMetricListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ServicesMetricList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ServicesMetricDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiService
    error?: any
}

export const useInventoryApiV2ServicesMetricDetail = (
    serviceName: string,
    query?: {
        connectionId?: string[]

        startTime?: string

        endTime?: string
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2ServicesMetricDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([serviceName, query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ServicesMetricDetail(serviceName, query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([serviceName, query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([serviceName, query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ServicesSummaryListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceSummariesResponse
    error?: any
}

export const useInventoryApiV2ServicesSummaryList = (
    query?: {
        connectionId?: string[]

        connector?: string[]

        tag?: string[]

        endTime?: string

        pageSize?: number

        pageNumber?: number

        sortBy?: 'servicecode' | 'resourcecount'
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2ServicesSummaryListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ServicesSummaryList(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ServicesSummaryDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgInventoryApiServiceSummary
    error?: any
}

export const useInventoryApiV2ServicesSummaryDetail = (
    serviceName: string,
    query: {
        connectorId?: string[]

        connector?: string[]

        endTime: string
    },
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2ServicesSummaryDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([serviceName, query, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ServicesSummaryDetail(serviceName, query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([serviceName, query, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([serviceName, query, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ServicesTagListState {
    isLoading: boolean
    response?: Record<string, string[]>
    error?: any
}

export const useInventoryApiV2ServicesTagList = (
    params: RequestParams = {},
    wait = false
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseInventoryApiV2ServicesTagListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ServicesTagList(params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ServicesTagDetailState {
    isLoading: boolean
    response?: string[]
    error?: any
}

export const useInventoryApiV2ServicesTagDetail = (
    key: string,
    params: RequestParams = {},
    wait = false
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
        useState<IuseInventoryApiV2ServicesTagDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([key, params, wait])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.inventory
                .apiV2ServicesTagDetail(key, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([key, params, wait]) !== lastInput) {
        setLastInput(JSON.stringify([key, params, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}
