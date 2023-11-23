import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgAlertingApiAction,
    GithubComKaytuIoKaytuEnginePkgAlertingApiCreateActionReq,
    GithubComKaytuIoKaytuEnginePkgAlertingApiCreateRuleRequest,
    GithubComKaytuIoKaytuEnginePkgAlertingApiJiraAndStackResponse,
    GithubComKaytuIoKaytuEnginePkgAlertingApiJiraInputs,
    GithubComKaytuIoKaytuEnginePkgAlertingApiRule,
    GithubComKaytuIoKaytuEnginePkgAlertingApiSlackInputs,
    GithubComKaytuIoKaytuEnginePkgAlertingApiTriggers,
    GithubComKaytuIoKaytuEnginePkgAlertingApiUpdateActionRequest,
    GithubComKaytuIoKaytuEnginePkgAlertingApiUpdateRuleRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetRoleBindingsResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUserResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiInviteRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiPutRoleBindingRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey,
    GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding,
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
    GithubComKaytuIoKaytuEnginePkgDescribeApiGetStackFindings,
    GithubComKaytuIoKaytuEnginePkgDescribeApiJob,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStack,
    GithubComKaytuIoKaytuEnginePkgInventoryApiAnalyticsCategoriesResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiAnalyticsMetric,
    GithubComKaytuIoKaytuEnginePkgInventoryApiAssetTableRow,
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListQueryRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceCollection,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceCollectionLandscape,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryHistory,
    GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItem,
    GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow,
    GithubComKaytuIoKaytuEnginePkgMetadataApiSetConfigMetadataRequest,
    GithubComKaytuIoKaytuEnginePkgMetadataModelsConfigMetadata,
    GithubComKaytuIoKaytuEnginePkgMetadataModelsFilter,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics,
    GithubComKaytuIoKaytuEnginePkgOnboardApiChangeConnectionLifecycleStateRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionGroup,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnectorCount,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateSourceResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListCredentialResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAwsRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAzureRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiUpdateCredentialRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiV2CreateCredentialV2Request,
    GithubComKaytuIoKaytuEnginePkgOnboardApiV2CreateCredentialV2Response,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiAddCredentialRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatusResponse,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceNameRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOrganizationRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOwnershipRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceTierRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceResponse,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiOrganization,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspace,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimits,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimitsUsage,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseCostEstimatorApiV1CostAwsListState {
    isLoading: boolean
    isExecuted: boolean
    response?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useCostEstimatorApiV1CostAwsList = (
    query: {
        resourceId: string

        resourceType: string
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseCostEstimatorApiV1CostAwsListState>({
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

            api.costEstimator
                .apiV1CostAwsList(query, params)
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

interface IuseCostEstimatorApiV1CostAzureListState {
    isLoading: boolean
    isExecuted: boolean
    response?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useCostEstimatorApiV1CostAzureList = (
    query: {
        resourceId: string

        resourceType: string
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseCostEstimatorApiV1CostAzureListState>({
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

            api.costEstimator
                .apiV1CostAzureList(query, params)
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
