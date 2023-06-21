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

interface IuseAuthApiV1KeyDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiWorkspaceApiKey
    error?: any
}

export const useAuthApiV1KeyDetail = (
    id: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1KeyDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([id, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1KeyDetail(id, params)
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

    if (JSON.stringify([id, params]) !== lastInput) {
        setLastInput(JSON.stringify([id, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1KeyActivateCreateState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiWorkspaceApiKey
    error?: any
}

export const useAuthApiV1KeyActivateCreate = (
    id: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1KeyActivateCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([id, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1KeyActivateCreate(id, params)
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

    if (JSON.stringify([id, params]) !== lastInput) {
        setLastInput(JSON.stringify([id, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1KeyDeleteDeleteState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useAuthApiV1KeyDeleteDelete = (
    id: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1KeyDeleteDeleteState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([id, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1KeyDeleteDelete(id, params)
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

    if (JSON.stringify([id, params]) !== lastInput) {
        setLastInput(JSON.stringify([id, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1KeySuspendCreateState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiWorkspaceApiKey
    error?: any
}

export const useAuthApiV1KeySuspendCreate = (
    id: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1KeySuspendCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([id, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1KeySuspendCreate(id, params)
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

    if (JSON.stringify([id, params]) !== lastInput) {
        setLastInput(JSON.stringify([id, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1KeyCreateCreateState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiCreateAPIKeyResponse
    error?: any
}

export const useAuthApiV1KeyCreateCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgAuthApiCreateAPIKeyRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1KeyCreateCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1KeyCreateCreate(request, params)
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

interface IuseAuthApiV1KeyRoleCreateState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiWorkspaceApiKey
    error?: any
}

export const useAuthApiV1KeyRoleCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgAuthApiUpdateKeyRoleRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1KeyRoleCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1KeyRoleCreate(request, params)
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

interface IuseAuthApiV1KeysListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiWorkspaceApiKey[]
    error?: any
}

export const useAuthApiV1KeysList = (params: RequestParams = {}) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1KeysListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        try {
            api.auth
                .apiV1KeysList(params)
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

interface IuseAuthApiV1RoleKeysDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiWorkspaceApiKey[]
    error?: any
}

export const useAuthApiV1RoleKeysDetail = (
    roleName: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1RoleKeysDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([roleName, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1RoleKeysDetail(roleName, params)
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

    if (JSON.stringify([roleName, params]) !== lastInput) {
        setLastInput(JSON.stringify([roleName, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1RoleUsersDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiRoleUser[]
    error?: any
}

export const useAuthApiV1RoleUsersDetail = (
    roleName: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1RoleUsersDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([roleName, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1RoleUsersDetail(roleName, params)
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

    if (JSON.stringify([roleName, params]) !== lastInput) {
        setLastInput(JSON.stringify([roleName, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1RolesListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiRolesListResponse[]
    error?: any
}

export const useAuthApiV1RolesList = (params: RequestParams = {}) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1RolesListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        try {
            api.auth
                .apiV1RolesList(params)
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

interface IuseAuthApiV1RolesDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiRoleDetailsResponse
    error?: any
}

export const useAuthApiV1RolesDetail = (
    roleName: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1RolesDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([roleName, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1RolesDetail(roleName, params)
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

    if (JSON.stringify([roleName, params]) !== lastInput) {
        setLastInput(JSON.stringify([roleName, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1UserDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiGetUserResponse
    error?: any
}

export const useAuthApiV1UserDetail = (
    userId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1UserDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([userId, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1UserDetail(userId, params)
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

    if (JSON.stringify([userId, params]) !== lastInput) {
        setLastInput(JSON.stringify([userId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1UserWorkspaceMembershipDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiMembership[]
    error?: any
}

export const useAuthApiV1UserWorkspaceMembershipDetail = (
    userId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseAuthApiV1UserWorkspaceMembershipDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([userId, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1UserWorkspaceMembershipDetail(userId, params)
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

    if (JSON.stringify([userId, params]) !== lastInput) {
        setLastInput(JSON.stringify([userId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1UserInviteDeleteState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useAuthApiV1UserInviteDelete = (
    query: {
        userId: string
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1UserInviteDeleteState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1UserInviteDelete(query, params)
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

    if (JSON.stringify([query, params]) !== lastInput) {
        setLastInput(JSON.stringify([query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1UserInviteCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useAuthApiV1UserInviteCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgAuthApiInviteRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1UserInviteCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1UserInviteCreate(request, params)
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

interface IuseAuthApiV1UserRoleBindingDeleteState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useAuthApiV1UserRoleBindingDelete = (
    query: {
        userId: string
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1UserRoleBindingDeleteState>(
        {
            isLoading: true,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1UserRoleBindingDelete(query, params)
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

    if (JSON.stringify([query, params]) !== lastInput) {
        setLastInput(JSON.stringify([query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1UserRoleBindingUpdateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useAuthApiV1UserRoleBindingUpdate = (
    request: GitlabComKeibiengineKeibiEnginePkgAuthApiPutRoleBindingRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1UserRoleBindingUpdateState>(
        {
            isLoading: true,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1UserRoleBindingUpdate(request, params)
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

interface IuseAuthApiV1UserRoleBindingsListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiGetRoleBindingsResponse
    error?: any
}

export const useAuthApiV1UserRoleBindingsList = (
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1UserRoleBindingsListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        try {
            api.auth
                .apiV1UserRoleBindingsList(params)
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

interface IuseAuthApiV1UsersListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiGetUsersResponse[]
    error?: any
}

export const useAuthApiV1UsersList = (
    request: GitlabComKeibiengineKeibiEnginePkgAuthApiGetUsersRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseAuthApiV1UsersListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        try {
            api.auth
                .apiV1UsersList(request, params)
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

interface IuseAuthApiV1WorkspaceRoleBindingsListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgAuthApiWorkspaceRoleBinding[]
    error?: any
}

export const useAuthApiV1WorkspaceRoleBindingsList = (
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseAuthApiV1WorkspaceRoleBindingsListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        try {
            api.auth
                .apiV1WorkspaceRoleBindingsList(params)
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
