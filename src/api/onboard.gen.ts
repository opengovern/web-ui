import useSWR from 'swr'
import React, { useState, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { useParams } from 'react-router-dom'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgAuthApiRoleDetailsResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiGetStackFindings,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedSource,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetadataResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAzureRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListQueryRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItem,
    GithubComKaytuIoKaytuEnginePkgOnboardApiChangeConnectionLifecycleStateRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiUpdateCredentialRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOwnershipRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeStackRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceSummariesResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiResourceTypeDetail,
    GithubComKaytuIoKaytuEnginePkgComplianceApiComplianceReport,
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetadataResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionCountRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmark,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnector,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateSourceResponse,
    GithubComKaytuIoKaytuEnginePkgInsightEsInsightResource,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStack,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOrganizationRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStackInsightRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimitsUsage,
    GithubComKaytuIoKaytuEnginePkgAuthApiUpdateKeyRoleRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiRoleUser,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiQuery,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics,
    GithubComKaytuIoKaytuEnginePkgDescribeApiInsightJob,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetAzureResourceResponse,
    GithubComKaytuIoKaytuEnginePkgMetadataModelsConfigMetadata,
    DescribeDescribeSourceJob,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimits,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetricsResponse,
    DescribeDescribeResourceJob,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiLocationResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiListBenchmarkEvaluationsRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAwsRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnectorCount,
    AwsResources,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStackBenchmarkRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkResultTrend,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiService,
    GithubComKaytuIoKaytuEnginePkgAuthApiRolesListResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiInviteRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiPutRoleBindingRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroupTrendResponse,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspace,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourceRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiTriggerInsightEvaluationRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiTriggerBenchmarkEvaluationRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiConnectionData,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUserResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiServiceSummary,
    GithubComKaytuIoKaytuEnginePkgAuthApiMembership,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialResponse,
    DescribeComplianceReportJob,
    GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSingleResourceRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgDescribeApiSource,
    GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetRoleBindingsResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiPolicy,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsight,
    GithubComKaytuIoKaytuEnginePkgMetadataApiSetConfigMetadataRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceTierRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiAzureCredential,
    DescribeInsightJob,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetAWSResourceResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType,
    GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiGetSourcesRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSource,
    DescribeSummarizerJob,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceNameRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkSummary,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTree,
    GithubComKaytuIoKaytuEnginePkgInventoryApiLocationByProviderResponse,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseOnboardApiV1CatalogMetricsListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics
    error?: any
}

export const useOnboardApiV1CatalogMetricsList = (
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1CatalogMetricsListState>(
        {
            isLoading: true,
        }
    )
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1CatalogMetricsList(params)
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

interface IuseOnboardApiV1ConnectionsStateCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useOnboardApiV1ConnectionsStateCreate = (
    connectionId: number,
    request: GithubComKaytuIoKaytuEnginePkgOnboardApiChangeConnectionLifecycleStateRequest,
    params: RequestParams = {}
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
        useState<IuseOnboardApiV1ConnectionsStateCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connectionId, request, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1ConnectionsStateCreate(connectionId, request, params)
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

    if (JSON.stringify([connectionId, request, params]) !== lastInput) {
        setLastInput(JSON.stringify([connectionId, request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1ConnectionsCountListState {
    isLoading: boolean
    response?: number
    error?: any
}

export const useOnboardApiV1ConnectionsCountList = (
    type: GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionCountRequest,
    params: RequestParams = {}
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
        useState<IuseOnboardApiV1ConnectionsCountListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([type, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1ConnectionsCountList(type, params)
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

    if (JSON.stringify([type, params]) !== lastInput) {
        setLastInput(JSON.stringify([type, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1ConnectionsSummaryListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse
    error?: any
}

export const useOnboardApiV1ConnectionsSummaryList = (
    query: {
        connector: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        healthState?: 'healthy' | 'unhealthy'

        lifecycleState?: string

        pageSize?: number

        pageNumber?: number

        startTime?: number

        endTime?: number

        sortBy?: 'onboard_date' | 'resource_count' | 'cost'
    },
    params: RequestParams = {}
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
        useState<IuseOnboardApiV1ConnectionsSummaryListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1ConnectionsSummaryList(query, params)
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

interface IuseOnboardApiV1ConnectionsSummaryDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection
    error?: any
}

export const useOnboardApiV1ConnectionsSummaryDetail = (
    connectionId: string,
    query?: {
        startTime?: number

        endTime?: number
    },
    params: RequestParams = {}
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
        useState<IuseOnboardApiV1ConnectionsSummaryDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connectionId, query, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1ConnectionsSummaryDetail(connectionId, query, params)
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

interface IuseOnboardApiV1ConnectorListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnectorCount[]
    error?: any
}

export const useOnboardApiV1ConnectorList = (params: RequestParams = {}) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1ConnectorListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1ConnectorList(params)
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

interface IuseOnboardApiV1ConnectorDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnector
    error?: any
}

export const useOnboardApiV1ConnectorDetail = (
    connectorName: string,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1ConnectorDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connectorName, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1ConnectorDetail(connectorName, params)
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

    if (JSON.stringify([connectorName, params]) !== lastInput) {
        setLastInput(JSON.stringify([connectorName, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1CredentialListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
    error?: any
}

export const useOnboardApiV1CredentialList = (
    query?: {
        connector?: '' | 'AWS' | 'Azure'

        health?: 'healthy' | 'unhealthy' | 'initial_discovery'

        pageSize?: number

        pageNumber?: number
    },
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1CredentialListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1CredentialList(query, params)
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

interface IuseOnboardApiV1CredentialCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialResponse
    error?: any
}

export const useOnboardApiV1CredentialCreate = (
    config: GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialRequest,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1CredentialCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([config, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1CredentialCreate(config, params)
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

    if (JSON.stringify([config, params]) !== lastInput) {
        setLastInput(JSON.stringify([config, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1CredentialDeleteState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useOnboardApiV1CredentialDelete = (
    credentialId: string,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1CredentialDeleteState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1CredentialDelete(credentialId, params)
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

    if (JSON.stringify([credentialId, params]) !== lastInput) {
        setLastInput(JSON.stringify([credentialId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1CredentialDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential
    error?: any
}

export const useOnboardApiV1CredentialDetail = (
    credentialId: string,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1CredentialDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1CredentialDetail(credentialId, params)
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

    if (JSON.stringify([credentialId, params]) !== lastInput) {
        setLastInput(JSON.stringify([credentialId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1CredentialUpdateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useOnboardApiV1CredentialUpdate = (
    credentialId: string,
    config: GithubComKaytuIoKaytuEnginePkgOnboardApiUpdateCredentialRequest,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1CredentialUpdateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, config, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1CredentialUpdate(credentialId, config, params)
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

    if (JSON.stringify([credentialId, config, params]) !== lastInput) {
        setLastInput(JSON.stringify([credentialId, config, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1CredentialAutoonboardCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    error?: any
}

export const useOnboardApiV1CredentialAutoonboardCreate = (
    credentialId: string,
    params: RequestParams = {}
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
        useState<IuseOnboardApiV1CredentialAutoonboardCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1CredentialAutoonboardCreate(credentialId, params)
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

    if (JSON.stringify([credentialId, params]) !== lastInput) {
        setLastInput(JSON.stringify([credentialId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1CredentialDisableCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useOnboardApiV1CredentialDisableCreate = (
    credentialId: string,
    params: RequestParams = {}
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
        useState<IuseOnboardApiV1CredentialDisableCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1CredentialDisableCreate(credentialId, params)
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

    if (JSON.stringify([credentialId, params]) !== lastInput) {
        setLastInput(JSON.stringify([credentialId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1CredentialEnableCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useOnboardApiV1CredentialEnableCreate = (
    credentialId: string,
    params: RequestParams = {}
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
        useState<IuseOnboardApiV1CredentialEnableCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1CredentialEnableCreate(credentialId, params)
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

    if (JSON.stringify([credentialId, params]) !== lastInput) {
        setLastInput(JSON.stringify([credentialId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1CredentialHealthcheckDetailState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useOnboardApiV1CredentialHealthcheckDetail = (
    credentialId: string,
    params: RequestParams = {}
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
        useState<IuseOnboardApiV1CredentialHealthcheckDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1CredentialHealthcheckDetail(credentialId, params)
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

    if (JSON.stringify([credentialId, params]) !== lastInput) {
        setLastInput(JSON.stringify([credentialId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1CredentialSourcesListListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
    error?: any
}

export const useOnboardApiV1CredentialSourcesListList = (
    query?: {
        connector?: '' | 'AWS' | 'Azure'

        pageSize?: number

        pageNumber?: number
    },
    params: RequestParams = {}
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
        useState<IuseOnboardApiV1CredentialSourcesListListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1CredentialSourcesListList(query, params)
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

interface IuseOnboardApiV1SourceDeleteState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useOnboardApiV1SourceDelete = (
    sourceId: number,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1SourceDeleteState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([sourceId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1SourceDelete(sourceId, params)
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

    if (JSON.stringify([sourceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([sourceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1SourceDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection
    error?: any
}

export const useOnboardApiV1SourceDetail = (
    sourceId: number,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1SourceDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([sourceId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1SourceDetail(sourceId, params)
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

    if (JSON.stringify([sourceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([sourceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1SourceCredentialsDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiAzureCredential
    error?: any
}

export const useOnboardApiV1SourceCredentialsDetail = (
    sourceId: string,
    params: RequestParams = {}
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
        useState<IuseOnboardApiV1SourceCredentialsDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([sourceId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1SourceCredentialsDetail(sourceId, params)
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

    if (JSON.stringify([sourceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([sourceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1SourceCredentialsUpdateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useOnboardApiV1SourceCredentialsUpdate = (
    sourceId: string,
    params: RequestParams = {}
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
        useState<IuseOnboardApiV1SourceCredentialsUpdateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([sourceId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1SourceCredentialsUpdate(sourceId, params)
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

    if (JSON.stringify([sourceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([sourceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1SourceHealthcheckCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection
    error?: any
}

export const useOnboardApiV1SourceHealthcheckCreate = (
    sourceId: string,
    params: RequestParams = {}
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
        useState<IuseOnboardApiV1SourceHealthcheckCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([sourceId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1SourceHealthcheckCreate(sourceId, params)
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

    if (JSON.stringify([sourceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([sourceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1SourceAccountDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection
    error?: any
}

export const useOnboardApiV1SourceAccountDetail = (
    accountId: number,
    params: RequestParams = {}
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
        useState<IuseOnboardApiV1SourceAccountDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([accountId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1SourceAccountDetail(accountId, params)
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

    if (JSON.stringify([accountId, params]) !== lastInput) {
        setLastInput(JSON.stringify([accountId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseOnboardApiV1SourceAwsCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiCreateSourceResponse
    error?: any
}

export const useOnboardApiV1SourceAwsCreate = (
    request: GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAwsRequest,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1SourceAwsCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1SourceAwsCreate(request, params)
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

interface IuseOnboardApiV1SourceAzureCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiCreateSourceResponse
    error?: any
}

export const useOnboardApiV1SourceAzureCreate = (
    request: GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAzureRequest,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1SourceAzureCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1SourceAzureCreate(request, params)
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

interface IuseOnboardApiV1SourcesListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    error?: any
}

export const useOnboardApiV1SourcesList = (
    query?: {
        connector?: ('' | 'AWS' | 'Azure')[]
    },
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1SourcesListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1SourcesList(query, params)
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

interface IuseOnboardApiV1SourcesCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    error?: any
}

export const useOnboardApiV1SourcesCreate = (
    request: GithubComKaytuIoKaytuEnginePkgOnboardApiGetSourcesRequest,
    query?: {
        type?: 'aws' | 'azure'
    },
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1SourcesCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, query, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1SourcesCreate(request, query, params)
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

interface IuseOnboardApiV1SourcesCountListState {
    isLoading: boolean
    response?: number
    error?: any
}

export const useOnboardApiV1SourcesCountList = (
    query?: {
        connector?: '' | 'AWS' | 'Azure'
    },
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseOnboardApiV1SourcesCountListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.onboard
                .apiV1SourcesCountList(query, params)
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
