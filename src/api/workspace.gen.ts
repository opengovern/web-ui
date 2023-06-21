import useSWR from 'swr'
import React, { useState, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import {
    Api,
    GitlabComKeibiengineKeibiEnginePkgAuthApiRolesListResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListServiceMetricsResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiConnectionCountRequest,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiChangeWorkspaceOwnershipRequest,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkResultTrend,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiGetFindingsRequest,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiTriggerInsightEvaluationRequest,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiWorkspaceResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiResourceType,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiGetSourcesRequest,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiStack,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiGetStackFindings,
    GitlabComKeibiengineKeibiEnginePkgAuthApiWorkspaceApiKey,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiRunQueryRequest,
    GitlabComKeibiengineKeibiEnginePkgMetadataApiSetConfigMetadataRequest,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiWorkspace,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiCatalogMetrics,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiResourceTypeDetail,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiComplianceReport,
    GitlabComKeibiengineKeibiEnginePkgAuthApiUpdateKeyRoleRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiSmartQueryItem,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiSourceAwsRequest,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiUpdateCredentialRequest,
    DescribeInsightJob,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiWorkspaceLimits,
    GitlabComKeibiengineKeibiEnginePkgAuthApiGetUsersResponse,
    GitlabComKeibiengineKeibiEnginePkgAuthApiGetUsersRequest,
    GitlabComKeibiengineKeibiEnginePkgInsightEsInsightResource,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListServiceMetadataResponse,
    DescribeDescribeResourceJob,
    GitlabComKeibiengineKeibiEnginePkgAuthApiCreateAPIKeyResponse,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiChangeWorkspaceOrganizationRequest,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiSourceAzureRequest,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiTriggerBenchmarkEvaluationRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListResourceTypeMetadataResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListServiceSummariesResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiCatalogConnector,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiCreateCredentialResponse,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiDescribeSingleResourceRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetAzureResourceResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiListConnectionSummaryResponse,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiListBenchmarkEvaluationsRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetFiltersResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetFiltersRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListCostMetricsResponse,
    GitlabComKeibiengineKeibiEnginePkgAuthApiGetUserResponse,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiInsight,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListResourceTypeMetricsResponse,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiSource,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiChangeWorkspaceTierRequest,
    GitlabComKeibiengineKeibiEnginePkgAuthApiGetRoleBindingsResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetResourcesRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiCostTrendDatapoint,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiResourceTypeTrendDatapoint,
    DescribeSummarizerJob,
    GitlabComKeibiengineKeibiEnginePkgAuthApiRoleDetailsResponse,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiGetTopFieldRequest,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkSummary,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiServiceSummary,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiChangeConnectionLifecycleStateRequest,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiStackInsightRequest,
    GitlabComKeibiengineKeibiEnginePkgAuthApiWorkspaceRoleBinding,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmark,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiLocationByProviderResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListCostCompositionResponse,
    GitlabComKeibiengineKeibiEnginePkgAuthApiPutRoleBindingRequest,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiGetFindingsMetricsResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListResourceTypeCompositionResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiCredential,
    GitlabComKeibiengineKeibiEnginePkgAuthApiCreateAPIKeyRequest,
    GitlabComKeibiengineKeibiEnginePkgAuthApiInviteRequest,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkAssignment,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiGetFindingsResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiLocationResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiConnectorCount,
    DescribeDescribeSourceJob,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiInsightGroup,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiConnection,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiAzureCredential,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiCreateWorkspaceResponse,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiQuery,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiRunQueryResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetResourceRequest,
    DescribeComplianceReportJob,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiStackBenchmarkRequest,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiChangeWorkspaceNameRequest,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkTree,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiService,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiDescribeSource,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiGetTopFieldResponse,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiInsightTrendDatapoint,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiCreateSourceResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetResourcesResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiConnector,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiWorkspaceLimitsUsage,
    GitlabComKeibiengineKeibiEnginePkgAuthApiMembership,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiInsightGroupTrendResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListQueryRequest,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiCreateCredentialRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetAWSResourceResponse,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkAssignedSource,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiGetBenchmarksSummaryResponse,
    GitlabComKeibiengineKeibiEnginePkgMetadataModelsConfigMetadata,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiCreateWorkspaceRequest,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiInsightJob,
    GitlabComKeibiengineKeibiEnginePkgAuthApiRoleUser,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiPolicy,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiConnectionData,
    AwsResources,
    RequestParams,
} from './api'

import AxiosAPI from './ApiConfig'

interface IuseWorkspaceApiV1WorkspaceCreateState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgWorkspaceApiCreateWorkspaceResponse
    error?: any
}

export const useWorkspaceApiV1WorkspaceCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgWorkspaceApiCreateWorkspaceRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseWorkspaceApiV1WorkspaceCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspaceCreate(request, params)
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

    if (JSON.stringify([request, params]) !== lastInput) {
        setLastInput(JSON.stringify([request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceDeleteState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceDelete = (
    workspaceId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseWorkspaceApiV1WorkspaceDeleteState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, params])
    )

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspaceDelete(workspaceId, params)
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

    if (JSON.stringify([workspaceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceNameCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceNameCreate = (
    workspaceId: string,
    request: GitlabComKeibiengineKeibiEnginePkgWorkspaceApiChangeWorkspaceNameRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseWorkspaceApiV1WorkspaceNameCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, request, params])
    )

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspaceNameCreate(workspaceId, request, params)
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

    if (JSON.stringify([workspaceId, request, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceOrganizationCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceOrganizationCreate = (
    workspaceId: string,
    request: GitlabComKeibiengineKeibiEnginePkgWorkspaceApiChangeWorkspaceOrganizationRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseWorkspaceApiV1WorkspaceOrganizationCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, request, params])
    )

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspaceOrganizationCreate(workspaceId, request, params)
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

    if (JSON.stringify([workspaceId, request, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceOwnerCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceOwnerCreate = (
    workspaceId: string,
    request: GitlabComKeibiengineKeibiEnginePkgWorkspaceApiChangeWorkspaceOwnershipRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseWorkspaceApiV1WorkspaceOwnerCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, request, params])
    )

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspaceOwnerCreate(workspaceId, request, params)
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

    if (JSON.stringify([workspaceId, request, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceResumeCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceResumeCreate = (
    workspaceId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseWorkspaceApiV1WorkspaceResumeCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, params])
    )

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspaceResumeCreate(workspaceId, params)
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

    if (JSON.stringify([workspaceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceSuspendCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceSuspendCreate = (
    workspaceId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseWorkspaceApiV1WorkspaceSuspendCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, params])
    )

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspaceSuspendCreate(workspaceId, params)
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

    if (JSON.stringify([workspaceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceTierCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceTierCreate = (
    workspaceId: string,
    request: GitlabComKeibiengineKeibiEnginePkgWorkspaceApiChangeWorkspaceTierRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseWorkspaceApiV1WorkspaceTierCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, request, params])
    )

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspaceTierCreate(workspaceId, request, params)
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

    if (JSON.stringify([workspaceId, request, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceCurrentListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgWorkspaceApiWorkspaceResponse
    error?: any
}

export const useWorkspaceApiV1WorkspaceCurrentList = (
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseWorkspaceApiV1WorkspaceCurrentListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspaceCurrentList(params)
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

    if (JSON.stringify([params]) !== lastInput) {
        setLastInput(JSON.stringify([params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspacesListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgWorkspaceApiWorkspaceResponse[]
    error?: any
}

export const useWorkspaceApiV1WorkspacesList = (params: RequestParams = {}) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseWorkspaceApiV1WorkspacesListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspacesList(params)
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

    if (JSON.stringify([params]) !== lastInput) {
        setLastInput(JSON.stringify([params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspacesDetailState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspacesDetail = (
    workspaceId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseWorkspaceApiV1WorkspacesDetailState>(
        {
            isLoading: true,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, params])
    )

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspacesDetail(workspaceId, params)
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

    if (JSON.stringify([workspaceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspacesByidDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgWorkspaceApiWorkspace
    error?: any
}

export const useWorkspaceApiV1WorkspacesByidDetail = (
    workspaceId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseWorkspaceApiV1WorkspacesByidDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, params])
    )

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspacesByidDetail(workspaceId, params)
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

    if (JSON.stringify([workspaceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspacesLimitsDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgWorkspaceApiWorkspaceLimitsUsage
    error?: any
}

export const useWorkspaceApiV1WorkspacesLimitsDetail = (
    workspaceName: string,
    query?: {
        ignore_usage?: boolean
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseWorkspaceApiV1WorkspacesLimitsDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceName, query, params])
    )

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspacesLimitsDetail(workspaceName, query, params)
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

    if (JSON.stringify([workspaceName, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceName, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspacesLimitsByidDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgWorkspaceApiWorkspaceLimits
    error?: any
}

export const useWorkspaceApiV1WorkspacesLimitsByidDetail = (
    workspaceId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseWorkspaceApiV1WorkspacesLimitsByidDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, params])
    )

    const sendRequest = () => {
        try {
            api.workspace
                .apiV1WorkspacesLimitsByidDetail(workspaceId, params)
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

    if (JSON.stringify([workspaceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}
