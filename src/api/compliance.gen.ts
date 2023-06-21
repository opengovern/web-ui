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

interface IuseComplianceApiV1AlarmsTopCreateState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiGetTopFieldResponse
    error?: any
}

export const useComplianceApiV1AlarmsTopCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgComplianceApiGetTopFieldRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1AlarmsTopCreateState>(
        {
            isLoading: true,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1AlarmsTopCreate(request, params)
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

interface IuseComplianceApiV1AssignmentsListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkAssignment[]
    error?: any
}

export const useComplianceApiV1AssignmentsList = (
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1AssignmentsListState>(
        {
            isLoading: true,
        }
    )
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1AssignmentsList(params)
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

interface IuseComplianceApiV1AssignmentsConnectionDeleteState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useComplianceApiV1AssignmentsConnectionDelete = (
    benchmarkId: string,
    connectionId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AssignmentsConnectionDeleteState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, connectionId, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1AssignmentsConnectionDelete(
                    benchmarkId,
                    connectionId,
                    params
                )
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

    if (JSON.stringify([benchmarkId, connectionId, params]) !== lastInput) {
        setLastInput(JSON.stringify([benchmarkId, connectionId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1AssignmentsConnectionCreateState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkAssignment
    error?: any
}

export const useComplianceApiV1AssignmentsConnectionCreate = (
    benchmarkId: string,
    connectionId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AssignmentsConnectionCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, connectionId, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1AssignmentsConnectionCreate(
                    benchmarkId,
                    connectionId,
                    params
                )
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

    if (JSON.stringify([benchmarkId, connectionId, params]) !== lastInput) {
        setLastInput(JSON.stringify([benchmarkId, connectionId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1AssignmentsBenchmarkDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkAssignedSource[]
    error?: any
}

export const useComplianceApiV1AssignmentsBenchmarkDetail = (
    benchmarkId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AssignmentsBenchmarkDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1AssignmentsBenchmarkDetail(benchmarkId, params)
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

    if (JSON.stringify([benchmarkId, params]) !== lastInput) {
        setLastInput(JSON.stringify([benchmarkId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1AssignmentsConnectionDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkAssignment[]
    error?: any
}

export const useComplianceApiV1AssignmentsConnectionDetail = (
    connectionId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AssignmentsConnectionDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connectionId, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1AssignmentsConnectionDetail(connectionId, params)
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

    if (JSON.stringify([connectionId, params]) !== lastInput) {
        setLastInput(JSON.stringify([connectionId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1BenchmarkSummaryDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkSummary
    error?: any
}

export const useComplianceApiV1BenchmarkSummaryDetail = (
    benchmarkId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarkSummaryDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1BenchmarkSummaryDetail(benchmarkId, params)
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

    if (JSON.stringify([benchmarkId, params]) !== lastInput) {
        setLastInput(JSON.stringify([benchmarkId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1BenchmarkSummaryResultTrendDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkResultTrend
    error?: any
}

export const useComplianceApiV1BenchmarkSummaryResultTrendDetail = (
    benchmarkId: string,
    query: {
        start: number

        end: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarkSummaryResultTrendDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1BenchmarkSummaryResultTrendDetail(
                    benchmarkId,
                    query,
                    params
                )
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

    if (JSON.stringify([benchmarkId, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([benchmarkId, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1BenchmarkTreeDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkTree
    error?: any
}

export const useComplianceApiV1BenchmarkTreeDetail = (
    benchmarkId: string,
    query: {
        status: ('passed' | 'failed' | 'unknown')[]
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarkTreeDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1BenchmarkTreeDetail(benchmarkId, query, params)
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

    if (JSON.stringify([benchmarkId, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([benchmarkId, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1BenchmarksListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmark[]
    error?: any
}

export const useComplianceApiV1BenchmarksList = (
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1BenchmarksListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1BenchmarksList(params)
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

interface IuseComplianceApiV1BenchmarksDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmark
    error?: any
}

export const useComplianceApiV1BenchmarksDetail = (
    benchmarkId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1BenchmarksDetail(benchmarkId, params)
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

    if (JSON.stringify([benchmarkId, params]) !== lastInput) {
        setLastInput(JSON.stringify([benchmarkId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1BenchmarksPoliciesDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiPolicy[]
    error?: any
}

export const useComplianceApiV1BenchmarksPoliciesDetail = (
    benchmarkId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksPoliciesDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1BenchmarksPoliciesDetail(benchmarkId, params)
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

    if (JSON.stringify([benchmarkId, params]) !== lastInput) {
        setLastInput(JSON.stringify([benchmarkId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1BenchmarksPoliciesDetail2State {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiPolicy
    error?: any
}

export const useComplianceApiV1BenchmarksPoliciesDetail2 = (
    policyId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksPoliciesDetail2State>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([policyId, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1BenchmarksPoliciesDetail2(policyId, params)
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

    if (JSON.stringify([policyId, params]) !== lastInput) {
        setLastInput(JSON.stringify([policyId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1BenchmarksSummaryListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiGetBenchmarksSummaryResponse
    error?: any
}

export const useComplianceApiV1BenchmarksSummaryList = (
    query: {
        start: number

        end: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksSummaryListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1BenchmarksSummaryList(query, params)
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

interface IuseComplianceApiV1FindingsCreateState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiGetFindingsResponse
    error?: any
}

export const useComplianceApiV1FindingsCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgComplianceApiGetFindingsRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1FindingsCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1FindingsCreate(request, params)
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

interface IuseComplianceApiV1FindingsTopDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiGetTopFieldResponse
    error?: any
}

export const useComplianceApiV1FindingsTopDetail = (
    benchmarkId: string,
    field: 'resourceType' | 'serviceName' | 'sourceID' | 'resourceID',
    count: number,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1FindingsTopDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, field, count, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1FindingsTopDetail(benchmarkId, field, count, params)
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

    if (JSON.stringify([benchmarkId, field, count, params]) !== lastInput) {
        setLastInput(JSON.stringify([benchmarkId, field, count, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1FindingsMetricsListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiGetFindingsMetricsResponse
    error?: any
}

export const useComplianceApiV1FindingsMetricsList = (
    query?: {
        start?: number

        end?: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1FindingsMetricsListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1FindingsMetricsList(query, params)
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

interface IuseComplianceApiV1InsightListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiInsight[]
    error?: any
}

export const useComplianceApiV1InsightList = (
    query?: {
        tag?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1InsightListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1InsightList(query, params)
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

interface IuseComplianceApiV1InsightDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiInsight
    error?: any
}

export const useComplianceApiV1InsightDetail = (
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

    const [state, setState] = useState<IuseComplianceApiV1InsightDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, query, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1InsightDetail(insightId, query, params)
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

interface IuseComplianceApiV1InsightTrendDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiInsightTrendDatapoint[]
    error?: any
}

export const useComplianceApiV1InsightTrendDetail = (
    insightId: string,
    query?: {
        connectionId?: string[]

        startTime?: number

        endTime?: number

        datapointCount?: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1InsightTrendDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, query, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1InsightTrendDetail(insightId, query, params)
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

interface IuseComplianceApiV1InsightGroupListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiInsightGroup[]
    error?: any
}

export const useComplianceApiV1InsightGroupList = (
    query?: {
        tag?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1InsightGroupListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1InsightGroupList(query, params)
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

interface IuseComplianceApiV1InsightGroupDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiInsightGroup
    error?: any
}

export const useComplianceApiV1InsightGroupDetail = (
    insightGroupId: string,
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
        useState<IuseComplianceApiV1InsightGroupDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightGroupId, query, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1InsightGroupDetail(insightGroupId, query, params)
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

    if (JSON.stringify([insightGroupId, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([insightGroupId, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1InsightGroupTrendDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiInsightGroupTrendResponse
    error?: any
}

export const useComplianceApiV1InsightGroupTrendDetail = (
    insightGroupId: string,
    query?: {
        connectionId?: string[]

        startTime?: number

        endTime?: number

        datapointCount?: number
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1InsightGroupTrendDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightGroupId, query, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1InsightGroupTrendDetail(insightGroupId, query, params)
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

    if (JSON.stringify([insightGroupId, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([insightGroupId, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1MetadataInsightListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiInsight[]
    error?: any
}

export const useComplianceApiV1MetadataInsightList = (
    query?: {
        connector?: ('' | 'AWS' | 'Azure')[]
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1MetadataInsightListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1MetadataInsightList(query, params)
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

interface IuseComplianceApiV1MetadataInsightDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiInsight
    error?: any
}

export const useComplianceApiV1MetadataInsightDetail = (
    insightId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1MetadataInsightDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1MetadataInsightDetail(insightId, params)
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

    if (JSON.stringify([insightId, params]) !== lastInput) {
        setLastInput(JSON.stringify([insightId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseComplianceApiV1MetadataTagInsightListState {
    isLoading: boolean
    response?: Record<string, string[]>
    error?: any
}

export const useComplianceApiV1MetadataTagInsightList = (
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1MetadataTagInsightListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1MetadataTagInsightList(params)
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

interface IuseComplianceApiV1MetadataTagInsightDetailState {
    isLoading: boolean
    response?: string[]
    error?: any
}

export const useComplianceApiV1MetadataTagInsightDetail = (
    key: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1MetadataTagInsightDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([key, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1MetadataTagInsightDetail(key, params)
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

interface IuseComplianceApiV1QueriesDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgComplianceApiQuery
    error?: any
}

export const useComplianceApiV1QueriesDetail = (
    queryId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1QueriesDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([queryId, params])
    )

    const sendRequest = () => {
        try {
            api.compliance
                .apiV1QueriesDetail(queryId, params)
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

    if (JSON.stringify([queryId, params]) !== lastInput) {
        setLastInput(JSON.stringify([queryId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}
