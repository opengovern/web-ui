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

interface IuseCostEstimatorApiV1CostAwsDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useCostEstimatorApiV1CostAwsDetail = (
    resourceId: string,
    resourceType: string,
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

    const [state, setState] =
        useState<IuseCostEstimatorApiV1CostAwsDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([resourceId, resourceType, params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.costEstimator
                .apiV1CostAwsDetail(resourceId, resourceType, params)
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
        JSON.stringify([resourceId, resourceType, params, autoExecute]) !==
        lastInput
    ) {
        setLastInput(
            JSON.stringify([resourceId, resourceType, params, autoExecute])
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

interface IuseCostEstimatorApiV1CostAzureDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useCostEstimatorApiV1CostAzureDetail = (
    resourceId: string,
    resourceType: string,
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

    const [state, setState] =
        useState<IuseCostEstimatorApiV1CostAzureDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([resourceId, resourceType, params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.costEstimator
                .apiV1CostAzureDetail(resourceId, resourceType, params)
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
        JSON.stringify([resourceId, resourceType, params, autoExecute]) !==
        lastInput
    ) {
        setLastInput(
            JSON.stringify([resourceId, resourceType, params, autoExecute])
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
