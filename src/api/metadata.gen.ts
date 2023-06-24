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

interface IuseMetadataApiV1MetadataCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useMetadataApiV1MetadataCreate = (
    req: GithubComKaytuIoKaytuEnginePkgMetadataApiSetConfigMetadataRequest,
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
    response?: GithubComKaytuIoKaytuEnginePkgMetadataModelsConfigMetadata
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
