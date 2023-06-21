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

interface IuseInventoryApiV1LocationsDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiLocationByProviderResponse[]
    error?: any
}

export const useInventoryApiV1LocationsDetail = (
    connector: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseInventoryApiV1LocationsDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connector, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([connector, params]) !== lastInput) {
        setLastInput(JSON.stringify([connector, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1QueryListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiSmartQueryItem[]
    error?: any
}

export const useInventoryApiV1QueryList = (
    request: GitlabComKeibiengineKeibiEnginePkgInventoryApiListQueryRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseInventoryApiV1QueryListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV1QueryCreateState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiRunQueryResponse
    error?: any
}

export const useInventoryApiV1QueryCreate = (
    queryId: string,
    request: GitlabComKeibiengineKeibiEnginePkgInventoryApiRunQueryRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseInventoryApiV1QueryCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([queryId, request, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([queryId, request, params]) !== lastInput) {
        setLastInput(JSON.stringify([queryId, request, params]))
    }

    useEffect(() => {
        sendRequest()
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
    request: GitlabComKeibiengineKeibiEnginePkgInventoryApiListQueryRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseInventoryApiV1QueryCountListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV1ResourceCreateState {
    isLoading: boolean
    response?: Record<string, string>
    error?: any
}

export const useInventoryApiV1ResourceCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgInventoryApiGetResourceRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseInventoryApiV1ResourceCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV1ResourcesCreateState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiGetResourcesResponse
    error?: any
}

export const useInventoryApiV1ResourcesCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgInventoryApiGetResourcesRequest,
    query?: {
        common?: 'true' | 'false' | 'all'
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseInventoryApiV1ResourcesCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, query, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([request, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([request, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1ResourcesAwsCreateState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiGetAWSResourceResponse
    error?: any
}

export const useInventoryApiV1ResourcesAwsCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgInventoryApiGetResourcesRequest,
    query?: {
        common?: 'true' | 'false' | 'all'
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV1ResourcesAwsCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, query, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([request, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([request, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1ResourcesAzureCreateState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiGetAzureResourceResponse
    error?: any
}

export const useInventoryApiV1ResourcesAzureCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgInventoryApiGetResourcesRequest,
    query?: {
        common?: 'true' | 'false' | 'all'
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV1ResourcesAzureCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, query, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([request, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([request, query, params]))
    }

    useEffect(() => {
        sendRequest()
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
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV1ResourcesCountListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
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

interface IuseInventoryApiV1ResourcesFiltersCreateState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiGetFiltersResponse
    error?: any
}

export const useInventoryApiV1ResourcesFiltersCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgInventoryApiGetFiltersRequest,
    query?: {
        common?: 'true' | 'false' | 'all'
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV1ResourcesFiltersCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, query, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([request, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([request, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV1ResourcesRegionsListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiLocationResponse[]
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
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV1ResourcesRegionsListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV1ResourcesTopRegionsListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiLocationResponse[]
    error?: any
}

export const useInventoryApiV1ResourcesTopRegionsList = (
    query: {
        count: number

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV1ResourcesTopRegionsListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV2ConnectionsDataListState {
    isLoading: boolean
    response?: Record<
        string,
        GitlabComKeibiengineKeibiEnginePkgInventoryApiConnectionData
    >
    error?: any
}

export const useInventoryApiV2ConnectionsDataList = (
    query: {
        connectionId: string[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2ConnectionsDataListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV2ConnectionsDataDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiConnectionData
    error?: any
}

export const useInventoryApiV2ConnectionsDataDetail = (
    connectionId: string,
    query?: {
        startTime?: number

        endTime?: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2ConnectionsDataDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connectionId, query, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([connectionId, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([connectionId, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2CostCompositionListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiListCostCompositionResponse
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
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2CostCompositionListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV2CostMetricListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiListCostMetricsResponse
    error?: any
}

export const useInventoryApiV2CostMetricList = (
    query?: {
        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        startTime?: string

        endTime?: string

        sortBy?: 'dimension' | 'cost'

        pageSize?: number

        pageNumber?: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseInventoryApiV2CostMetricListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV2CostTrendListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiCostTrendDatapoint[]
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
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseInventoryApiV2CostTrendListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV2InsightsListState {
    isLoading: boolean
    response?: Record<
        string,
        GitlabComKeibiengineKeibiEnginePkgInsightEsInsightResource[]
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
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseInventoryApiV2InsightsListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV2InsightsDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInsightEsInsightResource[]
    error?: any
}

export const useInventoryApiV2InsightsDetail = (
    insightId: string,
    query?: {
        connectionId?: string[]

        time?: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseInventoryApiV2InsightsDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, query, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([insightId, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([insightId, query, params]))
    }

    useEffect(() => {
        sendRequest()
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
        GitlabComKeibiengineKeibiEnginePkgInsightEsInsightResource[]
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
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2InsightsTrendDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, query, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([insightId, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([insightId, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2InsightsJobDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInsightEsInsightResource
    error?: any
}

export const useInventoryApiV2InsightsJobDetail = (
    jobId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2InsightsJobDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([jobId, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([jobId, params]) !== lastInput) {
        setLastInput(JSON.stringify([jobId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2MetadataResourcetypeListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiListResourceTypeMetadataResponse
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
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2MetadataResourcetypeListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV2MetadataResourcetypeDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiResourceType
    error?: any
}

export const useInventoryApiV2MetadataResourcetypeDetail = (
    resourceType: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2MetadataResourcetypeDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([resourceType, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([resourceType, params]) !== lastInput) {
        setLastInput(JSON.stringify([resourceType, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2MetadataServicesListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiListServiceMetadataResponse
    error?: any
}

export const useInventoryApiV2MetadataServicesList = (
    query?: {
        connector?: ('' | 'AWS' | 'Azure')[]

        tag?: string[]

        pageSize?: number

        pageNumber?: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2MetadataServicesListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV2MetadataServicesDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiService
    error?: any
}

export const useInventoryApiV2MetadataServicesDetail = (
    serviceName: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2MetadataServicesDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([serviceName, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([serviceName, params]) !== lastInput) {
        setLastInput(JSON.stringify([serviceName, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ResourcesCompositionDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiListResourceTypeCompositionResponse
    error?: any
}

export const useInventoryApiV2ResourcesCompositionDetail = (
    key: string,
    query: {
        top: number

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        time?: string
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2ResourcesCompositionDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([key, query, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([key, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([key, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ResourcesMetricListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiListResourceTypeMetricsResponse
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

        sortBy?: 'name' | 'count'

        pageSize?: number

        pageNumber?: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2ResourcesMetricListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV2ResourcesMetricDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiResourceType
    error?: any
}

export const useInventoryApiV2ResourcesMetricDetail = (
    resourceType: string,
    query?: {
        connectionId?: string[]

        endTime?: string

        startTime?: string
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2ResourcesMetricDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([resourceType, query, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([resourceType, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([resourceType, query, params]))
    }

    useEffect(() => {
        sendRequest()
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
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseInventoryApiV2ResourcesTagListState>(
        {
            isLoading: true,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2ResourcesTagDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([key, query, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([key, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([key, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ResourcesTrendListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiResourceTypeTrendDatapoint[]
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
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2ResourcesTrendListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV2ServicesMetricListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiListServiceMetricsResponse
    error?: any
}

export const useInventoryApiV2ServicesMetricList = (
    query?: {
        tag?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        startTime?: string

        endTime?: string

        sortBy?: 'name' | 'count'

        pageSize?: number

        pageNumber?: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2ServicesMetricListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV2ServicesMetricDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiService
    error?: any
}

export const useInventoryApiV2ServicesMetricDetail = (
    serviceName: string,
    query?: {
        connectionId?: string[]

        startTime?: string

        endTime?: string
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2ServicesMetricDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([serviceName, query, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([serviceName, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([serviceName, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseInventoryApiV2ServicesSummaryListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiListServiceSummariesResponse
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
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2ServicesSummaryListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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

interface IuseInventoryApiV2ServicesSummaryDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgInventoryApiServiceSummary
    error?: any
}

export const useInventoryApiV2ServicesSummaryDetail = (
    serviceName: string,
    query: {
        connectorId?: string[]

        connector?: string[]

        endTime: string
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2ServicesSummaryDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([serviceName, query, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([serviceName, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([serviceName, query, params]))
    }

    useEffect(() => {
        sendRequest()
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
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseInventoryApiV2ServicesTagListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
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

interface IuseInventoryApiV2ServicesTagDetailState {
    isLoading: boolean
    response?: string[]
    error?: any
}

export const useInventoryApiV2ServicesTagDetail = (
    key: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseInventoryApiV2ServicesTagDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([key, params])
    )

    const sendRequest = () => {
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

    if (JSON.stringify([key, params]) !== lastInput) {
        setLastInput(JSON.stringify([key, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}
