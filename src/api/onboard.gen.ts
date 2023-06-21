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

interface IuseOnboardApiV1CatalogConnectorsListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiCatalogConnector[]
    error?: any
}

export const useOnboardApiV1CatalogConnectorsList = (
    query?: {
        category?: string

        state?: string

        minConnection?: string

        id?: string
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1CatalogConnectorsListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        try {
            api.onboard
                .apiV1CatalogConnectorsList(query, params)
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

interface IuseOnboardApiV1CatalogMetricsListState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiCatalogMetrics
    error?: any
}

export const useOnboardApiV1CatalogMetricsList = (
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1CatalogMetricsListState>(
        {
            isLoading: true,
        }
    )
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
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
    request: GitlabComKeibiengineKeibiEnginePkgOnboardApiChangeConnectionLifecycleStateRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1ConnectionsStateCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connectionId, request, params])
    )

    const sendRequest = () => {
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
    type: GitlabComKeibiengineKeibiEnginePkgOnboardApiConnectionCountRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1ConnectionsCountListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([type, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiListConnectionSummaryResponse
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
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1ConnectionsSummaryListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiConnection
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
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1ConnectionsSummaryDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connectionId, query, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiConnectorCount[]
    error?: any
}

export const useOnboardApiV1ConnectorList = (params: RequestParams = {}) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1ConnectorListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiConnector
    error?: any
}

export const useOnboardApiV1ConnectorDetail = (
    connectorName: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1ConnectorDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connectorName, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiCredential[]
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
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1CredentialListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiCreateCredentialResponse
    error?: any
}

export const useOnboardApiV1CredentialCreate = (
    config: GitlabComKeibiengineKeibiEnginePkgOnboardApiCreateCredentialRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1CredentialCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([config, params])
    )

    const sendRequest = () => {
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
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1CredentialDeleteState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiCredential
    error?: any
}

export const useOnboardApiV1CredentialDetail = (
    credentialId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1CredentialDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, params])
    )

    const sendRequest = () => {
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
    config: GitlabComKeibiengineKeibiEnginePkgOnboardApiUpdateCredentialRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1CredentialUpdateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, config, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiConnection[]
    error?: any
}

export const useOnboardApiV1CredentialAutoonboardCreate = (
    credentialId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1CredentialAutoonboardCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, params])
    )

    const sendRequest = () => {
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
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1CredentialDisableCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, params])
    )

    const sendRequest = () => {
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
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1CredentialEnableCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, params])
    )

    const sendRequest = () => {
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
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1CredentialHealthcheckDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([credentialId, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiCredential[]
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
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1CredentialSourcesListListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1SourceDeleteState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([sourceId, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiConnection
    error?: any
}

export const useOnboardApiV1SourceDetail = (
    sourceId: number,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1SourceDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([sourceId, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiAzureCredential
    error?: any
}

export const useOnboardApiV1SourceCredentialsDetail = (
    sourceId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1SourceCredentialsDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([sourceId, params])
    )

    const sendRequest = () => {
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
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1SourceCredentialsUpdateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([sourceId, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiConnection
    error?: any
}

export const useOnboardApiV1SourceHealthcheckCreate = (
    sourceId: string,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1SourceHealthcheckCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([sourceId, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiConnection
    error?: any
}

export const useOnboardApiV1SourceAccountDetail = (
    accountId: number,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseOnboardApiV1SourceAccountDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([accountId, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiCreateSourceResponse
    error?: any
}

export const useOnboardApiV1SourceAwsCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgOnboardApiSourceAwsRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1SourceAwsCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiCreateSourceResponse
    error?: any
}

export const useOnboardApiV1SourceAzureCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgOnboardApiSourceAzureRequest,
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1SourceAzureCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiConnection[]
    error?: any
}

export const useOnboardApiV1SourcesList = (
    query?: {
        connector?: ('' | 'AWS' | 'Azure')[]
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1SourcesListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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
    response?: GitlabComKeibiengineKeibiEnginePkgOnboardApiConnection[]
    error?: any
}

export const useOnboardApiV1SourcesCreate = (
    request: GitlabComKeibiengineKeibiEnginePkgOnboardApiGetSourcesRequest,
    query?: {
        type?: 'aws' | 'azure'
    },
    params: RequestParams = {}
) => {
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1SourcesCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, query, params])
    )

    const sendRequest = () => {
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
    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseOnboardApiV1SourcesCountListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
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
