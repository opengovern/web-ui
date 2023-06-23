import useSWR from 'swr'
import React, { useState, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { useParams } from 'react-router-dom'
import {
    Api,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiListConnectionSummaryResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiConnection,
    GitlabComKeibiengineKeibiEnginePkgAuthApiPutRoleBindingRequest,
    GitlabComKeibiengineKeibiEnginePkgAuthApiGetRoleBindingsResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiCatalogConnector,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetResourceRequest,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiGetStackFindings,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiWorkspaceLimits,
    GitlabComKeibiengineKeibiEnginePkgAuthApiCreateAPIKeyResponse,
    GitlabComKeibiengineKeibiEnginePkgAuthApiUpdateKeyRoleRequest,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiInsight,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiServiceSummary,
    DescribeComplianceReportJob,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiDescribeSingleResourceRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListServiceSummariesResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiCreateCredentialRequest,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiGetSourcesRequest,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiChangeWorkspaceOwnershipRequest,
    GitlabComKeibiengineKeibiEnginePkgInsightEsInsightResource,
    GitlabComKeibiengineKeibiEnginePkgAuthApiInviteRequest,
    GitlabComKeibiengineKeibiEnginePkgAuthApiGetUsersResponse,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiChangeWorkspaceOrganizationRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListResourceTypeMetadataResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiUpdateCredentialRequest,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiStackBenchmarkRequest,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmark,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiChangeWorkspaceNameRequest,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiWorkspace,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListResourceTypeCompositionResponse,
    AwsResources,
    DescribeInsightJob,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiCreateWorkspaceRequest,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiChangeWorkspaceTierRequest,
    GitlabComKeibiengineKeibiEnginePkgMetadataModelsConfigMetadata,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiCreateCredentialResponse,
    DescribeSummarizerJob,
    GitlabComKeibiengineKeibiEnginePkgAuthApiWorkspaceRoleBinding,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiCostTrendDatapoint,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiWorkspaceResponse,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiResourceTypeDetail,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiDescribeSource,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiGetFindingsResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiService,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkAssignedSource,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiSource,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiWorkspaceLimitsUsage,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListCostMetricsResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiSourceAzureRequest,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiInsightGroupTrendResponse,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiQuery,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiRunQueryResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetResourcesResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetResourcesRequest,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiGetTopFieldResponse,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkResultTrend,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkTree,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiConnectionData,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiCreateSourceResponse,
    DescribeDescribeResourceJob,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiStack,
    GitlabComKeibiengineKeibiEnginePkgAuthApiRoleDetailsResponse,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkSummary,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiTriggerBenchmarkEvaluationRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiResourceType,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiAzureCredential,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiGetTopFieldRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetAWSResourceResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetFiltersResponse,
    GitlabComKeibiengineKeibiEnginePkgAuthApiGetUsersRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiSmartQueryItem,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiResourceTypeTrendDatapoint,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetAzureResourceResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListServiceMetadataResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiConnectionCountRequest,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiConnectorCount,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiRunQueryRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiGetFiltersRequest,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiTriggerInsightEvaluationRequest,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiGetBenchmarksSummaryResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListQueryRequest,
    GitlabComKeibiengineKeibiEnginePkgMetadataApiSetConfigMetadataRequest,
    GitlabComKeibiengineKeibiEnginePkgAuthApiCreateAPIKeyRequest,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiBenchmarkAssignment,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListCostCompositionResponse,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiGetFindingsRequest,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiLocationResponse,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListServiceMetricsResponse,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiComplianceReport,
    GitlabComKeibiengineKeibiEnginePkgAuthApiWorkspaceApiKey,
    GitlabComKeibiengineKeibiEnginePkgAuthApiRoleUser,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiInsightTrendDatapoint,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiInsightJob,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiCredential,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiGetFindingsMetricsResponse,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiListBenchmarkEvaluationsRequest,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiInsightGroup,
    DescribeDescribeSourceJob,
    GitlabComKeibiengineKeibiEnginePkgAuthApiMembership,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiLocationByProviderResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiConnector,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiChangeConnectionLifecycleStateRequest,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiSourceAwsRequest,
    GitlabComKeibiengineKeibiEnginePkgAuthApiGetUserResponse,
    GitlabComKeibiengineKeibiEnginePkgComplianceApiPolicy,
    GitlabComKeibiengineKeibiEnginePkgInventoryApiListResourceTypeMetricsResponse,
    GitlabComKeibiengineKeibiEnginePkgWorkspaceApiCreateWorkspaceResponse,
    GitlabComKeibiengineKeibiEnginePkgAuthApiRolesListResponse,
    GitlabComKeibiengineKeibiEnginePkgOnboardApiCatalogMetrics,
    GitlabComKeibiengineKeibiEnginePkgDescribeApiStackInsightRequest,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseMetadataApiV1MetadataCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useMetadataApiV1MetadataCreate = (
    req: GitlabComKeibiengineKeibiEnginePkgMetadataApiSetConfigMetadataRequest,
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

    const [state, setState] = useState<IuseMetadataApiV1MetadataCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([req, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.metadata
                .apiV1MetadataCreate(req, params)
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

    if (JSON.stringify([req, params]) !== lastInput) {
        setLastInput(JSON.stringify([req, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseMetadataApiV1MetadataDetailState {
    isLoading: boolean
    response?: GitlabComKeibiengineKeibiEnginePkgMetadataModelsConfigMetadata
    error?: any
}

export const useMetadataApiV1MetadataDetail = (
    key: string,
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

    const [state, setState] = useState<IuseMetadataApiV1MetadataDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([key, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.metadata
                .apiV1MetadataDetail(key, params)
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
