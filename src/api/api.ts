/* eslint-disable */
/* tslint:disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface EchoHTTPError {
    message?: any
}

export enum GithubComKaytuIoKaytuEnginePkgAnalyticsDbMetricType {
    MetricTypeAssets = 'assets',
    MetricTypeSpend = 'spend',
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyRequest {
    /** Name of the key */
    name?: string
    /**
     * Name of the role
     * @example "admin"
     */
    roleName?: 'admin' | 'editor' | 'viewer'
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyResponse {
    /**
     * Activity state of the key
     * @example true
     */
    active?: boolean
    /**
     * Creation timestamp in UTC
     * @example "2023-03-31T09:36:09.855Z"
     */
    createdAt?: string
    /**
     * Unique identifier for the key
     * @example 1
     */
    id?: number
    /**
     * Name of the key
     * @example "example"
     */
    name?: string
    /**
     * Name of the role
     * @example "admin"
     */
    roleName?: 'admin' | 'editor' | 'viewer'
    /** Token of the key */
    token?: string
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiGetRoleBindingsResponse {
    /**
     * Global Access
     * @example "admin"
     */
    globalRoles?: 'admin' | 'editor' | 'viewer'
    /** List of user roles in each workspace */
    roleBindings?: GithubComKaytuIoKaytuEnginePkgAuthApiUserRoleBinding[]
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiGetUserResponse {
    /**
     * Is the user blocked or not
     * @example false
     */
    blocked?: boolean
    /**
     * Creation timestamp in UTC
     * @example "2023-03-31T09:36:09.855Z"
     */
    createdAt?: string
    /**
     * Email address of the user
     * @example "johndoe@example.com"
     */
    email?: string
    /**
     * Is email verified or not
     * @example true
     */
    emailVerified?: boolean
    /**
     * Last activity timestamp in UTC
     * @example "2023-04-21T08:53:09.928Z"
     */
    lastActivity?: string
    /**
     * Name of the role
     * @example "admin"
     */
    roleName?: 'admin' | 'editor' | 'viewer'
    /**
     * Invite status
     * @example "accepted"
     */
    status?: 'accepted' | 'pending'
    /**
     * Unique identifier for the user
     * @example "auth|123456789"
     */
    userId?: string
    /**
     * Username
     * @example "John Doe"
     */
    userName?: string
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersRequest {
    /** @example "johndoe@example.com" */
    email?: string
    /**
     * Filter by
     * @example true
     */
    emailVerified?: boolean
    /**
     * Filter by role name
     * @example "admin"
     */
    roleName?: 'admin' | 'editor' | 'viewer'
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersResponse {
    /**
     * Email address of the user
     * @example "johndoe@example.com"
     */
    email?: string
    /**
     * Is email verified or not
     * @example true
     */
    emailVerified?: boolean
    /**
     * Name of the role
     * @example "admin"
     */
    roleName?: 'admin' | 'editor' | 'viewer'
    /**
     * Unique identifier for the user
     * @example "auth|123456789"
     */
    userId?: string
    /**
     * Username
     * @example "John Doe"
     */
    userName?: string
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiInviteRequest {
    /**
     * User email address
     * @example "johndoe@example.com"
     */
    email: string
    /**
     * Name of the role
     * @example "admin"
     */
    roleName?: 'admin' | 'editor' | 'viewer'
}

export enum GithubComKaytuIoKaytuEnginePkgAuthApiInviteStatus {
    InviteStatusACCEPTED = 'accepted',
    InviteStatusPENDING = 'pending',
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiPutRoleBindingRequest {
    /**
     * Name of the role
     * @example "admin"
     */
    roleName: 'admin' | 'editor' | 'viewer'
    /**
     * Unique identifier for the User
     * @example "auth|123456789"
     */
    userId: string
}

export enum GithubComKaytuIoKaytuEnginePkgAuthApiRole {
    InternalRole = 'internal',
    KaytuAdminRole = 'kaytu-admin',
    AdminRole = 'admin',
    EditorRole = 'editor',
    ViewerRole = 'viewer',
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiUserRoleBinding {
    /**
     * Name of the binding Role
     * @example "admin"
     */
    roleName?: 'admin' | 'editor' | 'viewer'
    /**
     * Unique identifier for the Workspace
     * @example "ws123456789"
     */
    workspaceID?: string
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey {
    /**
     * Activity state of the key
     * @example true
     */
    active?: boolean
    /**
     * Creation timestamp in UTC
     * @example "2023-03-31T09:36:09.855Z"
     */
    createdAt?: string
    /**
     * Unique identifier of the user who created the key
     * @example "auth|123456789"
     */
    creatorUserID?: string
    /**
     * Unique identifier for the key
     * @example 1
     */
    id?: number
    /**
     * Masked key
     * @example "abc...de"
     */
    maskedKey?: string
    /**
     * Name of the key
     * @example "example"
     */
    name?: string
    /**
     * Name of the role
     * @example "admin"
     */
    roleName?: 'admin' | 'editor' | 'viewer'
    /**
     * Last update timestamp in UTC
     * @example "2023-04-21T08:53:09.928Z"
     */
    updatedAt?: string
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding {
    /**
     * Creation timestamp in UTC
     * @example "2023-03-31T09:36:09.855Z"
     */
    createdAt?: string
    /**
     * Email address of the user
     * @example "johndoe@example.com"
     */
    email?: string
    /**
     * Last activity timestamp in UTC
     * @example "2023-04-21T08:53:09.928Z"
     */
    lastActivity?: string
    /**
     * Name of the role
     * @example "admin"
     */
    roleName?: 'admin' | 'editor' | 'viewer'
    /**
     * Invite status
     * @example "accepted"
     */
    status?: 'accepted' | 'pending'
    /**
     * Unique identifier for the user
     * @example "auth|123456789"
     */
    userId?: string
    /**
     * Username
     * @example "John Doe"
     */
    userName?: string
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedSource {
    /**
     * Connection ID
     * @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8"
     */
    connectionID?: string
    /**
     * Clout Provider
     * @example "Azure"
     */
    connector?: SourceType
    /**
     * Provider Connection ID
     * @example "1283192749"
     */
    providerConnectionID?: string
    /** Provider Connection Name */
    providerConnectionName?: string
    /**
     * Status
     * @example true
     */
    status?: boolean
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment {
    /** Unix timestamp */
    assignedAt?: string
    /**
     * Benchmark ID
     * @example "azure_cis_v140"
     */
    benchmarkId?: string
    /**
     * Connection ID
     * @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8"
     */
    sourceId?: string
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary {
    /** Checks summary */
    checks?: TypesSeverityResult
    /**
     * Cloud providers
     * @example ["[Azure]"]
     */
    connectors?: SourceType[]
    /**
     * Benchmark description
     * @example "The CIS Microsoft Azure Foundations Security Benchmark provides prescriptive guidance for establishing a secure baseline configuration for Microsoft Azure."
     */
    description?: string
    /**
     * Enabled
     * @example true
     */
    enabled?: boolean
    /**
     * Evaluated at
     * @example "2020-01-01T00:00:00Z"
     */
    evaluatedAt?: string
    /**
     * Benchmark ID
     * @example "azure_cis_v140"
     */
    id?: string
    /** Compliance result summary */
    result?: TypesComplianceResultSummary
    /** Tags */
    tags?: Record<string, string[]>
    /**
     * Benchmark title
     * @example "Azure CIS v1.4.0"
     */
    title?: string
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTree {
    children?: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTree[]
    /**
     * Benchmark ID
     * @example "azure_cis_v140"
     */
    id?: string
    policies?: GithubComKaytuIoKaytuEnginePkgComplianceApiPolicyTree[]
    /**
     * Benchmark title
     * @example "CIS v1.4.0"
     */
    title?: string
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint {
    checks?: TypesSeverityResult
    result?: TypesComplianceResultSummary
    /**
     * Time
     * @example 1686346668
     */
    timestamp?: number
}

export enum GithubComKaytuIoKaytuEnginePkgComplianceApiDirectionType {
    DirectionAscending = 'asc',
    DirectionDescending = 'desc',
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFilters {
    /**
     * Benchmark ID
     * @example ["azure_cis_v140"]
     */
    benchmarkID?: string[]
    /**
     * Connection ID
     * @example ["8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8"]
     */
    connectionID?: string[]
    /**
     * Clout Provider
     * @example ["Azure"]
     */
    connector?: SourceType[]
    /**
     * Policy ID
     * @example ["azure_cis_v140_7_5"]
     */
    policyID?: string[]
    /**
     * Resource unique identifier
     * @example ["/subscriptions/123/resourceGroups/rg-1/providers/Microsoft.Compute/virtualMachines/vm-1"]
     */
    resourceID?: string[]
    /**
     * Resource type
     * @example ["/subscriptions/123/resourceGroups/rg-1/providers/Microsoft.Compute/virtualMachines"]
     */
    resourceTypeID?: string[]
    /**
     * Severity
     * @example ["low"]
     */
    severity?: string[]
    /**
     * Compliance result status
     * @example ["alarm"]
     */
    status?: TypesComplianceResult[]
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiFindingSortItem {
    /**
     * Sort direction
     * @example "asc"
     */
    direction?: 'asc' | 'desc'
    /**
     * Field to sort by
     * @example "status"
     */
    field?:
        | 'resourceID'
        | 'resourceName'
        | 'resourceType'
        | 'serviceName'
        | 'category'
        | 'resourceLocation'
        | 'status'
        | 'describedAt'
        | 'evaluatedAt'
        | 'sourceID'
        | 'connectionProviderID'
        | 'connectionProviderName'
        | 'sourceType'
        | 'benchmarkID'
        | 'policyID'
        | 'policySeverity'
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse {
    benchmarkSummary?: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary[]
    totalChecks?: TypesSeverityResult
    totalResult?: TypesComplianceResultSummary
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsRequest {
    filters?: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFilters
    page: GithubComKaytuIoKaytuEnginePkgComplianceApiPage
    sorts?: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingSortItem[]
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse {
    findings?: TypesFinding[]
    /** @example 100 */
    totalCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse {
    records?: GithubComKaytuIoKaytuEnginePkgComplianceApiTopFieldRecord[]
    /** @example 100 */
    totalCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiInsight {
    /**
     * Cloud Provider
     * @example "Azure"
     */
    connector?: SourceType
    /**
     * Description
     * @example "List clusters that have role-based access control (RBAC) disabled"
     */
    description?: string
    /** @example true */
    enabled?: boolean
    /** Old Total Result Date */
    firstOldResultDate?: string
    /**
     * Insight ID
     * @example 23
     */
    id?: number
    /** @example false */
    internal?: boolean
    /** Links */
    links?: string[]
    /** Logo URL */
    logoURL?: string
    /**
     * Long Title
     * @example "List clusters that have role-based access control (RBAC) disabled"
     */
    longTitle?: string
    /**
     * Number of Old Total Result Value
     * @example 0
     */
    oldTotalResultValue?: number
    /** Query */
    query?: GithubComKaytuIoKaytuEnginePkgComplianceApiQuery
    /** Insight Results */
    result?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightResult[]
    /**
     * Short Title
     * @example "Clusters with no RBAC"
     */
    shortTitle?: string
    /** Tags */
    tags?: Record<string, string[]>
    /**
     * Number of Total Result Value
     * @example 10
     */
    totalResultValue?: number
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiInsightConnection {
    connection_id?: string
    original_id?: string
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiInsightDetail {
    headers?: string[]
    rows?: any[][]
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup {
    /** @example ["[\"Azure\""," \"AWS\"]"] */
    connectors?: SourceType[]
    /** @example "List clusters that have role-based access control (RBAC) disabled" */
    description?: string
    /** @example "2023-04-21T08:53:09.928Z" */
    firstOldResultDate?: string
    /** @example 23 */
    id?: number
    insights?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight[]
    /** @example "https://kaytu.io/logo.png" */
    logoURL?: string
    /** @example "List clusters that have role-based access control (RBAC) disabled" */
    longTitle?: string
    /** @example 0 */
    oldTotalResultValue?: number
    /** @example "Clusters with no RBAC" */
    shortTitle?: string
    tags?: Record<string, string[]>
    /** @example 10 */
    totalResultValue?: number
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiInsightResult {
    /**
     * Connection ID
     * @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8"
     */
    connectionID?: string
    /** Connections */
    connections?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightConnection[]
    /** Insight Details */
    details?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightDetail
    /**
     * Time of Execution
     * @example "2023-04-21T08:53:09.928Z"
     */
    executedAt?: string
    /**
     * Insight ID
     * @example 23
     */
    insightID?: number
    /**
     * Job ID
     * @example 1
     */
    jobID?: number
    /** Locations */
    locations?: string[]
    /**
     * Result
     * @example 1000
     */
    result?: number
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint {
    /**
     * Time
     * @example 1686346668
     */
    timestamp?: number
    /**
     * Resource Count
     * @example 1000
     */
    value?: number
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiPage {
    /**
     * Number of pages
     * @example 5
     */
    no?: number
    /**
     * Number of items per page
     * @example 100
     */
    size?: number
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiPolicyTree {
    /**
     * Policy ID
     * @example "azure_cis_v140_7_5"
     */
    id?: string
    /**
     * Last checked
     * @example 0
     */
    lastChecked?: number
    /**
     * Severity
     * @example "low"
     */
    severity?: TypesFindingSeverity
    /**
     * Status
     * @example "passed"
     */
    status?: TypesPolicyStatus
    /**
     * Policy title
     * @example "7.5 Ensure that the latest OS Patches for all Virtual Machines are applied"
     */
    title?: string
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiQuery {
    /** @example "Azure" */
    connector?: string
    /** @example "2023-06-07T14:00:15.677558Z" */
    createdAt?: string
    /** @example "steampipe-v0.5" */
    engine?: string
    /** @example "azure_ad_manual_control" */
    id?: string
    /** @example ["null"] */
    listOfTables?: string[]
    /**
     * @example "select
     *   -- Required Columns
     *   'active_directory' as resource,
     *   'info' as status,
     *   'Manual verification required.' as reason;
     * "
     */
    queryToExecute?: string
    /** @example "2023-06-16T14:58:08.759554Z" */
    updatedAt?: string
}

export enum GithubComKaytuIoKaytuEnginePkgComplianceApiSortFieldType {
    FieldResourceID = 'resourceID',
    FieldResourceName = 'resourceName',
    FieldResourceType = 'resourceType',
    FieldServiceName = 'serviceName',
    FieldCategory = 'category',
    FieldResourceLocation = 'resourceLocation',
    FieldStatus = 'status',
    FieldDescribedAt = 'describedAt',
    FieldEvaluatedAt = 'evaluatedAt',
    FieldSourceID = 'sourceID',
    FieldConnectionProviderID = 'connectionProviderID',
    FieldConnectionProviderName = 'connectionProviderName',
    FieldSourceType = 'sourceType',
    FieldBenchmarkID = 'benchmarkID',
    FieldPolicyID = 'policyID',
    FieldPolicySeverity = 'policySeverity',
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiTopFieldRecord {
    count?: number
    value?: string
}

export enum GithubComKaytuIoKaytuEnginePkgDescribeApiEvaluationType {
    EvaluationTypeInsight = 'INSIGHT',
    EvaluationTypeBenchmark = 'BENCHMARK',
}

export interface GithubComKaytuIoKaytuEnginePkgDescribeApiGetStackFindings {
    /**
     * Benchmark IDs to filter
     * @example ["azure_cis_v140"]
     */
    benchmarkIds?: string[]
    /** Pages count to retrieve */
    page: GithubComKaytuIoKaytuEnginePkgComplianceApiPage
    /** Sorts to apply */
    sorts?: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingSortItem[]
}

export interface GithubComKaytuIoKaytuEnginePkgDescribeApiStack {
    /**
     * Accounts included in the stack
     * @example ["[0123456789]"]
     */
    accountIds?: string[]
    /**
     * Stack creation date
     * @example "2023-06-01T17:00:00.000000Z"
     */
    createdAt?: string
    /** Stack evaluations history, including insight evaluations and compliance evaluations */
    evaluations?: GithubComKaytuIoKaytuEnginePkgDescribeApiStackEvaluation[]
    /**
     * Stack failure message
     * @example "error message"
     */
    failureMessage?: string
    /**
     * Stack resource types
     * @example ["[Microsoft.Compute/virtualMachines]"]
     */
    resourceTypes?: string[]
    /**
     * Stack resources list
     * @example ["[/subscriptions/123/resourceGroups/rg-1/providers/Microsoft.Compute/virtualMachines/vm-1]"]
     */
    resources?: string[]
    /**
     * Source type
     * @example "Azure"
     */
    sourceType?: SourceType
    /**
     * Stack unique identifier
     * @example "stack-twr32a5d-5as5-4ffe-b1cc-e32w1ast87s0"
     */
    stackId: string
    /**
     * Stack status. CREATED, EVALUATED, IN_PROGRESS, FAILED
     * @example "CREATED"
     */
    status?: GithubComKaytuIoKaytuEnginePkgDescribeApiStackStatus
    /** Stack tags */
    tags?: Record<string, string[]>
    /**
     * Stack last update date
     * @example "2023-06-01T17:00:00.000000Z"
     */
    updatedAt?: string
}

export interface GithubComKaytuIoKaytuEnginePkgDescribeApiStackEvaluation {
    /**
     * Evaluation creation date
     * @example "2020-01-01T00:00:00Z"
     */
    createdAt?: string
    /**
     * Benchmark ID or Insight ID
     * @example "azure_cis_v140"
     */
    evaluatorId?: string
    /**
     * Evaluation Job ID to find the job results
     * @example 1
     */
    jobId?: number
    status?: GithubComKaytuIoKaytuEnginePkgDescribeApiStackEvaluationStatus
    /**
     * BENCHMARK or INSIGHT
     * @example "BENCHMARK"
     */
    type?: GithubComKaytuIoKaytuEnginePkgDescribeApiEvaluationType
}

export enum GithubComKaytuIoKaytuEnginePkgDescribeApiStackEvaluationStatus {
    StackEvaluationStatusInProgress = 'IN_PROGRESS',
    StackEvaluationStatusFailed = 'COMPLETED_WITH_FAILURE',
    StackEvaluationStatusCompleted = 'COMPLETED',
}

export enum GithubComKaytuIoKaytuEnginePkgDescribeApiStackStatus {
    StackStatusPending = 'PENDING',
    StackStatusStalled = 'STALLED',
    StackStatusCreated = 'CREATED',
    StackStatusDescribing = 'DESCRIBING',
    StackStatusDescribed = 'DESCRIBED_RESOURCES',
    StackStatusEvaluating = 'EVALUATING',
    StackStatusFailed = 'FAILED',
    StackStatusCompleted = 'COMPLETED',
    StackStatusCompletedWithFailure = 'COMPLETED_WITH_FAILURE',
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiAnalyticsCategoriesResponse {
    categoryResourceType?: Record<string, string[]>
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiAnalyticsMetric {
    connectors?: SourceType[]
    finderQuery?: string
    id?: string
    name?: string
    query?: string
    tables?: string[]
    tags?: Record<string, string[]>
    type?: GithubComKaytuIoKaytuEnginePkgAnalyticsDbMetricType
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiAssetTableRow {
    /** @example "compute" */
    dimensionId?: string
    /** @example "Compute" */
    dimensionName?: string
    resourceCount?: Record<string, number>
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiCostMetric {
    /** @example ["Azure"] */
    connector?: SourceType[]
    /** @example "microsoft.compute/disks" */
    cost_dimension_name?: string
    /**
     * @min 0
     * @example 14118.81523108568
     */
    daily_cost_at_end_time?: number
    /**
     * @min 0
     * @example 21232.10443638001
     */
    daily_cost_at_start_time?: number
    /**
     * @min 0
     * @example 621041.2436112489
     */
    total_cost?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint {
    /** @min 0 */
    count?: number
    /** @format date-time */
    date?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiCountPair {
    /** @min 0 */
    count?: number
    /** @min 0 */
    old_count?: number
}

export enum GithubComKaytuIoKaytuEnginePkgInventoryApiDirectionType {
    DirectionAscending = 'asc',
    DirectionDescending = 'desc',
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse {
    /**
     * @min 0
     * @example 100
     */
    others?: number
    top_values?: Record<string, number>
    /**
     * @min 0
     * @example 1000
     */
    total_cost_value?: number
    /**
     * @min 0
     * @example 10
     */
    total_count?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse {
    metrics?: GithubComKaytuIoKaytuEnginePkgInventoryApiCostMetric[]
    /**
     * @min 0
     * @example 1000
     */
    total_cost?: number
    /**
     * @min 0
     * @example 10
     */
    total_count?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListMetricsResponse {
    metrics?: GithubComKaytuIoKaytuEnginePkgInventoryApiMetric[]
    total_count?: number
    total_metrics?: number
    total_old_count?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListQueryRequest {
    /** Specifies the Connectors */
    connectorsFilter?: SourceType[]
    /** Specifies the Title */
    titleFilter?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse {
    others?: GithubComKaytuIoKaytuEnginePkgInventoryApiCountPair
    top_values?: Record<
        string,
        GithubComKaytuIoKaytuEnginePkgInventoryApiCountPair
    >
    /** @min 0 */
    total_count?: number
    /** @min 0 */
    total_value_count?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListServicesCostTrendDatapoint {
    costTrend?: GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint[]
    /** @example "EC2-Service-Example" */
    serviceName?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiLocationResponse {
    /**
     * Region
     * @example "na-west"
     */
    location?: string
    /**
     * Number of resources in the region
     * @min 0
     * @example 100
     */
    resourceCount?: number
    /**
     * @min 0
     * @example 50
     */
    resourceOldCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiMetric {
    /**
     * Cloud Provider
     * @example ["[Azure]"]
     */
    connectors?: SourceType[]
    /**
     * Number of Resources of this Resource Type - Metric
     * @example 100
     */
    count?: number
    /** @example "select * from kaytu_resources where resource_type = 'aws::ec2::instance'" */
    finderQuery?: string
    /** @example "vms" */
    id?: string
    /**
     * Resource Type
     * @example "VMs"
     */
    name?: string
    /**
     * Number of Resources of this Resource Type in the past - Metric
     * @example 90
     */
    old_count?: number
    /** Tags */
    tags?: Record<string, string[]>
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiPage {
    no?: number
    size?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiRegionsResourceCountResponse {
    regions?: GithubComKaytuIoKaytuEnginePkgInventoryApiLocationResponse[]
    /** @min 0 */
    totalCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType {
    /** List supported steampipe Attributes (columns) for this resource type - Metadata (GET only) */
    attributes?: string[]
    /** List of Compliance that support this Resource Type - Metadata (GET only) */
    compliance?: string[]
    /**
     * Number of Compliance that use this Resource Type - Metadata
     * @min 0
     */
    compliance_count?: number
    /**
     * Cloud Provider
     * @example "Azure"
     */
    connector?: SourceType
    /**
     * Number of Resources of this Resource Type - Metric
     * @min 0
     * @example 100
     */
    count?: number
    /** List of Insights that support this Resource Type - Metadata (GET only) */
    insights?: number[]
    /**
     * Number of Insights that use this Resource Type - Metadata
     * @min 0
     */
    insights_count?: number
    /**
     * Logo URI
     * @example "https://kaytu.io/logo.png"
     */
    logo_uri?: string
    /**
     * Number of Resources of this Resource Type in the past - Metric
     * @min 0
     * @example 90
     */
    old_count?: number
    /**
     * Resource Name
     * @example "VM"
     */
    resource_name?: string
    /**
     * Resource Type
     * @example "Microsoft.Compute/virtualMachines"
     */
    resource_type?: string
    /**
     * Service Name
     * @example "compute"
     */
    service_name?: string
    /**
     * Tags
     * @example ["category:[Data and Analytics","Database","Integration","Management Governance","Storage]"]
     */
    tags?: string[]
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint {
    /**
     * @min 0
     * @example 100
     */
    count?: number
    /** @format date-time */
    date?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryRequest {
    page: GithubComKaytuIoKaytuEnginePkgInventoryApiPage
    query?: string
    sorts?: GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQuerySortItem[]
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryResponse {
    /** Column names */
    headers?: string[]
    /** Query */
    query?: string
    /** Result of query. in order to access a specific cell please use Result[Row][Column] */
    result?: any[][]
    /** Query Title */
    title?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryHistory {
    executed_at?: string
    query?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItem {
    /** Category (Tags[category]) */
    category?: string
    /** Description */
    description?: string
    /** Query Id */
    id?: number
    /** Provider */
    provider?: string
    /** Query */
    query?: string
    /** Tags */
    tags?: Record<string, string>
    /** Title */
    title?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQuerySortItem {
    direction?: 'asc' | 'desc'
    /** fill this with column name */
    field?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow {
    /** @example "1239042" */
    accountID?: string
    /** @example "Compute" */
    category?: string
    /** @example "AWS" */
    connector?: SourceType
    costValue?: Record<string, number>
    /** @example "compute" */
    dimensionId?: string
    /** @example "Compute" */
    dimensionName?: string
}

export interface GithubComKaytuIoKaytuEnginePkgMetadataApiSetConfigMetadataRequest {
    key?: string
    value?: any
}

export interface GithubComKaytuIoKaytuEnginePkgMetadataModelsConfigMetadata {
    key?: GithubComKaytuIoKaytuEnginePkgMetadataModelsMetadataKey
    type?: GithubComKaytuIoKaytuEnginePkgMetadataModelsConfigMetadataType
    value?: string
}

export enum GithubComKaytuIoKaytuEnginePkgMetadataModelsConfigMetadataType {
    ConfigMetadataTypeString = 'string',
    ConfigMetadataTypeInt = 'int',
    ConfigMetadataTypeBool = 'bool',
    ConfigMetadataTypeJSON = 'json',
}

export interface GithubComKaytuIoKaytuEnginePkgMetadataModelsFilter {
    kayValue?: Record<string, string>
    name?: string
}

export enum GithubComKaytuIoKaytuEnginePkgMetadataModelsMetadataKey {
    MetadataKeyWorkspaceOwnership = 'workspace_ownership',
    MetadataKeyWorkspaceID = 'workspace_id',
    MetadataKeyWorkspaceName = 'workspace_name',
    MetadataKeyWorkspacePlan = 'workspace_plan',
    MetadataKeyWorkspaceCreationTime = 'workspace_creation_time',
    MetadataKeyWorkspaceDateTimeFormat = 'workspace_date_time_format',
    MetadataKeyWorkspaceDebugMode = 'workspace_debug_mode',
    MetadataKeyWorkspaceTimeWindow = 'workspace_time_window',
    MetadataKeyAssetManagementEnabled = 'asset_management_enabled',
    MetadataKeyComplianceEnabled = 'compliance_enabled',
    MetadataKeyProductManagementEnabled = 'product_management_enabled',
    MetadataKeyCustomIDP = 'custom_idp',
    MetadataKeyResourceLimit = 'resource_limit',
    MetadataKeyConnectionLimit = 'connection_limit',
    MetadataKeyUserLimit = 'user_limit',
    MetadataKeyAllowInvite = 'allow_invite',
    MetadataKeyWorkspaceKeySupport = 'workspace_key_support',
    MetadataKeyWorkspaceMaxKeys = 'workspace_max_keys',
    MetadataKeyAllowedEmailDomains = 'allowed_email_domains',
    MetadataKeyAutoDiscoveryMethod = 'auto_discovery_method',
    MetadataKeyDescribeJobInterval = 'describe_job_interval',
    MetadataKeyFullDiscoveryJobInterval = 'full_discovery_job_interval',
    MetadataKeyHealthCheckJobInterval = 'health_check_job_interval',
    MetadataKeyInsightJobInterval = 'insight_job_interval',
    MetadataKeyMetricsJobInterval = 'metrics_job_interval',
    MetadataKeyDataRetention = 'data_retention_duration',
    MetadataKeyAWSComplianceGitURL = 'aws_compliance_git_url',
    MetadataKeyAzureComplianceGitURL = 'azure_compliance_git_url',
    MetadataKeyInsightsGitURL = 'insights_git_url',
    MetadataKeyQueriesGitURL = 'queries_git_url',
    MetadataKeyAnalyticsGitURL = 'analytics_git_url',
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiAWSCredentialConfig {
    accessKey: string
    accountId?: string
    assumeRoleName?: string
    assumeRolePolicyName?: string
    externalId?: string
    regions?: string[]
    secretKey: string
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiAzureCredentialConfig {
    clientId: string
    clientSecret: string
    objectId: string
    secretId: string
    subscriptionId?: string
    tenantId: string
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics {
    /**
     * @min 0
     * @example 20
     */
    connectionsEnabled?: number
    /**
     * @min 0
     * @example 15
     */
    healthyConnections?: number
    /**
     * @min 0
     * @example 20
     */
    totalConnections?: number
    /**
     * @min 0
     * @example 5
     */
    unhealthyConnections?: number
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiConnection {
    /** @example "scheduled" */
    assetDiscoveryMethod?: SourceAssetDiscoveryMethodType
    /** @example "Azure" */
    connector?: SourceType
    /**
     * @min 0
     * @max 10000000
     * @example 1000
     */
    cost?: number
    credential?: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential
    /** @example "7r6123ac-ca1c-434f-b1a3-91w2w9d277c8" */
    credentialID?: string
    credentialName?: string
    /** @example "manual" */
    credentialType?: GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType
    /**
     * @min 0
     * @max 10000000
     * @example 1000
     */
    dailyCostAtEndTime?: number
    /**
     * @min 0
     * @max 10000000
     * @example 1000
     */
    dailyCostAtStartTime?: number
    /** @example "This is an example connection" */
    description?: string
    /** @example "johndoe@example.com" */
    email?: string
    healthReason?: string
    /** @example "healthy" */
    healthState?: SourceHealthStatus
    /** @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8" */
    id?: string
    /** @example "2023-05-07T00:00:00Z" */
    lastHealthCheckTime?: string
    /** @example "2023-05-07T00:00:00Z" */
    lastInventory?: string
    /** @example "enabled" */
    lifecycleState?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState
    metadata?: Record<string, any>
    /**
     * @min 0
     * @max 1000000
     * @example 100
     */
    oldResourceCount?: number
    /** @example "2023-05-07T00:00:00Z" */
    onboardDate?: string
    /** @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8" */
    providerConnectionID?: string
    /** @example "example-connection" */
    providerConnectionName?: string
    /**
     * @min 0
     * @max 1000000
     * @example 100
     */
    resourceCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionGroup {
    /** @example ["[\"1e8ac3bf-c268-4a87-9374-ce04cc40a596\"]"] */
    connectionIds?: string[]
    connections?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    /** @example "UltraSightApplication" */
    name?: string
    /** @example "SELECT kaytu_id FROM kaytu_connections WHERE tags->'application' IS NOT NULL AND tags->'application' @> '"UltraSight"'" */
    query?: string
}

export enum GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState {
    ConnectionLifecycleStateOnboard = 'ONBOARD',
    ConnectionLifecycleStateDisabled = 'DISABLED',
    ConnectionLifecycleStateDiscovered = 'DISCOVERED',
    ConnectionLifecycleStateInProgress = 'IN_PROGRESS',
    ConnectionLifecycleStateArchived = 'ARCHIVED',
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiConnectorCount {
    /** @example true */
    allowNewConnections?: boolean
    /** @example false */
    autoOnboardSupport?: boolean
    /**
     * @min 0
     * @example 1024
     */
    connection_count?: number
    /** @example "This is a long volume of words for just showing the case of the description for the demo and checking value purposes only and has no meaning whatsoever" */
    description?: string
    direction?: SourceConnectorDirectionType
    /** @example "Azure" */
    label?: string
    /** @example "https://kaytu.io/logo.png" */
    logo?: string
    /**
     * @min 0
     * @example 10000
     */
    maxConnectionLimit?: number
    /** @example "Azure" */
    name?: SourceType
    /** @example "This is a short Description for this connector" */
    shortDescription?: string
    /** @example "enabled" */
    status?: SourceConnectorStatus
    tags?: Record<string, any>
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialRequest {
    config?: any
    /** @example "Azure" */
    source_type?: SourceType
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialResponse {
    id?: string
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiCreateSourceResponse {
    id?: string
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiCredential {
    /**
     * @min 0
     * @max 1000
     * @example 0
     */
    archived_connections?: number
    /** @example false */
    autoOnboardEnabled?: boolean
    config?: any
    connections?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    /** @example "AWS" */
    connectorType?: SourceType
    /** @example "manual-aws-org" */
    credentialType?: GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType
    /**
     * @min 0
     * @max 1000
     * @example 0
     */
    disabled_connections?: number
    /**
     * @min 0
     * @max 100
     * @example 50
     */
    discovered_connections?: number
    /** @example true */
    enabled?: boolean
    /** @example "" */
    healthReason?: string
    /** @example "healthy" */
    healthStatus?: SourceHealthStatus
    /** @example "1028642a-b22e-26ha-c5h2-22nl254678m5" */
    id?: string
    /**
     * @format date-time
     * @example "2023-06-03T12:21:33.406928Z"
     */
    lastHealthCheckTime?: string
    metadata?: Record<string, any>
    /** @example "a-1mahsl7lzk" */
    name?: string
    /**
     * @format date-time
     * @example "2023-06-03T12:21:33.406928Z"
     */
    onboardDate?: string
    /**
     * @min 0
     * @max 1000
     * @example 250
     */
    onboard_connections?: number
    /**
     * @min 0
     * @max 1000
     * @example 300
     */
    total_connections?: number
    /**
     * @min 0
     * @max 100
     * @example 50
     */
    unhealthy_connections?: number
}

export enum GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType {
    CredentialTypeAutoAzure = 'auto-azure',
    CredentialTypeAutoAws = 'auto-aws',
    CredentialTypeManualAwsOrganization = 'manual-aws-org',
    CredentialTypeManualAzureSpn = 'manual-azure-spn',
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse {
    /**
     * @min 0
     * @max 1000
     * @example 10
     */
    connectionCount?: number
    connections?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    /**
     * @min 0
     * @max 100
     * @example 10
     */
    totalArchivedCount?: number
    /**
     * @min 0
     * @max 10000000
     * @example 1000
     */
    totalCost?: number
    /**
     * @min 0
     * @max 100
     * @example 10
     */
    totalDisabledCount?: number
    /**
     * @min 0
     * @max 100
     * @example 10
     */
    totalDiscoveredCount?: number
    /**
     * @min 0
     * @max 1000000
     * @example 100
     */
    totalOldResourceCount?: number
    /**
     * Also includes in-progress
     * @min 0
     * @max 100
     * @example 10
     */
    totalOnboardedCount?: number
    /**
     * @min 0
     * @max 1000000
     * @example 100
     */
    totalResourceCount?: number
    /**
     * @min 0
     * @max 100
     * @example 10
     */
    totalUnhealthyCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiListCredentialResponse {
    credentials?: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
    /**
     * @min 0
     * @max 20
     * @example 5
     */
    totalCredentialCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAwsRequest {
    config?: GithubComKaytuIoKaytuEnginePkgOnboardApiAWSCredentialConfig
    description?: string
    email?: string
    name?: string
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAzureRequest {
    config?: GithubComKaytuIoKaytuEnginePkgOnboardApiAzureCredentialConfig
    description?: string
    name?: string
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiUpdateCredentialRequest {
    config?: any
    /** @example "Azure" */
    connector?: SourceType
    name?: string
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceNameRequest {
    newName?: string
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOrganizationRequest {
    newOrgID?: number
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOwnershipRequest {
    newOwnerUserID?: string
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceTierRequest {
    newName?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiTier
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceRequest {
    description?: string
    name?: string
    tier?: string
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceResponse {
    id?: string
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiOrganization {
    address?: string
    city?: string
    companyName?: string
    contactEmail?: string
    contactName?: string
    contactPhone?: string
    country?: string
    id?: number
    state?: string
    url?: string
}

export enum GithubComKaytuIoKaytuEnginePkgWorkspaceApiTier {
    TierFree = 'FREE',
    TierTeams = 'TEAMS',
    TierEnterprise = 'ENTERPRISE',
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspace {
    /** @example "2023-05-17T14:39:02.707659Z" */
    createdAt?: string
    /** @example "Lorem ipsum dolor sit amet, consectetur adipiscing elit." */
    description?: string
    /** @example "ws-698542025141040315" */
    id?: string
    /** @example "kaytu" */
    name?: string
    organization?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiOrganization
    /** @example "google-oauth2|204590896945502695694" */
    ownerId?: string
    /** @example "PROVISIONED" */
    status?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceStatus
    /** @example "ENTERPRISE" */
    tier?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiTier
    /** @example "https://app.kaytu.dev/kaytu" */
    uri?: string
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimits {
    maxConnections?: number
    maxResources?: number
    maxUsers?: number
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimitsUsage {
    /** @example 100 */
    currentConnections?: number
    /** @example 10000 */
    currentResources?: number
    /** @example 10 */
    currentUsers?: number
    /** @example "ws-698542025141040315" */
    id?: string
    /** @example 1000 */
    maxConnections?: number
    /** @example 100000 */
    maxResources?: number
    /** @example 100 */
    maxUsers?: number
    /** @example "kaytu" */
    name?: string
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse {
    /** @example "2023-05-17T14:39:02.707659Z" */
    createdAt?: string
    /** @example "Lorem ipsum dolor sit amet, consectetur adipiscing elit." */
    description?: string
    /** @example "ws-698542025141040315" */
    id?: string
    /** @example "kaytu" */
    name?: string
    organization?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiOrganization
    /** @example "google-oauth2|204590896945502695694" */
    ownerId?: string
    /** @example "PROVISIONED" */
    status?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceStatus
    /** @example "ENTERPRISE" */
    tier?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiTier
    /** @example "https://app.kaytu.dev/kaytu" */
    uri?: string
    /** @example "v0.45.4" */
    version?: string
}

export enum GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceStatus {
    StatusProvisioned = 'PROVISIONED',
    StatusProvisioning = 'PROVISIONING',
    StatusProvisioningFailed = 'PROVISIONING_FAILED',
    StatusDeleting = 'DELETING',
    StatusDeleted = 'DELETED',
    StatusSuspending = 'SUSPENDING',
    StatusSuspended = 'SUSPENDED',
}

export enum SourceAssetDiscoveryMethodType {
    AssetDiscoveryMethodTypeScheduled = 'scheduled',
}

export enum SourceConnectorDirectionType {
    ConnectorDirectionTypeIngress = 'ingress',
    ConnectorDirectionTypeEgress = 'egress',
    ConnectorDirectionTypeBoth = 'both',
}

export enum SourceConnectorStatus {
    ConnectorStatusEnabled = 'enabled',
    ConnectorStatusDisabled = 'disabled',
    ConnectorStatusComingSoon = 'coming_soon',
}

export enum SourceHealthStatus {
    HealthStatusNil = '',
    HealthStatusHealthy = 'healthy',
    HealthStatusUnhealthy = 'unhealthy',
}

export enum SourceType {
    Nil = '',
    CloudAWS = 'AWS',
    CloudAzure = 'Azure',
}

export enum TypesComplianceResult {
    ComplianceResultOK = 'ok',
    ComplianceResultALARM = 'alarm',
    ComplianceResultINFO = 'info',
    ComplianceResultSKIP = 'skip',
    ComplianceResultERROR = 'error',
}

export interface TypesComplianceResultSummary {
    /** @example 1 */
    alarmCount?: number
    /** @example 1 */
    errorCount?: number
    /** @example 1 */
    infoCount?: number
    /** @example 1 */
    okCount?: number
    /** @example 1 */
    skipCount?: number
}

export interface TypesFinding {
    /**
     * Finding ID
     * @example "/subscriptions/123/resourceGroups/rg-1/providers/Microsoft.Compute/virtualMachines/vm-1-azure_cis_v140_7_5"
     */
    ID?: string
    /**
     * Benchmark ID
     * @example "azure_cis_v140"
     */
    benchmarkID?: string
    /**
     * Compliance job ID
     * @example 1
     */
    complianceJobID?: number
    /**
     * Connection ID
     * @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8"
     */
    connectionID?: string
    /**
     * Cloud provider
     * @example "Azure"
     */
    connector?: SourceType
    /**
     * Timestamp of the policy description
     * @example 1589395200
     */
    describedAt?: number
    /**
     * Timestamp of the policy evaluation
     * @example 1589395200
     */
    evaluatedAt?: number
    /**
     * Evaluator name
     * @example "steampipe-v0.5"
     */
    evaluator?: string
    /**
     * Policy ID
     * @example "azure_cis_v140_7_5"
     */
    policyID?: string
    /**
     * Reason for the policy evaluation result
     * @example "The VM is not using managed disks"
     */
    reason?: string
    /**
     * Resource ID
     * @example "/subscriptions/123/resourceGroups/rg-1/providers/Microsoft.Compute/virtualMachines/vm-1"
     */
    resourceID?: string
    /**
     * Resource location
     * @example "eastus"
     */
    resourceLocation?: string
    /**
     * Resource name
     * @example "vm-1"
     */
    resourceName?: string
    /**
     * Resource type
     * @example "Microsoft.Compute/virtualMachines"
     */
    resourceType?: string
    /**
     * Compliance result
     * @example "alarm"
     */
    result?: TypesComplianceResult
    /**
     * Schedule job ID
     * @example 1
     */
    scheduleJobID?: number
    /**
     * Compliance severity
     * @example "low"
     */
    severity?: TypesFindingSeverity
    /**
     * Whether the policy is active or not
     * @example true
     */
    stateActive?: boolean
}

export enum TypesFindingSeverity {
    FindingSeverityNone = 'none',
    FindingSeverityLow = 'low',
    FindingSeverityMedium = 'medium',
    FindingSeverityHigh = 'high',
    FindingSeverityCritical = 'critical',
}

export enum TypesPolicyStatus {
    PolicyStatusPASSED = 'passed',
    PolicyStatusFAILED = 'failed',
    PolicyStatusUNKNOWN = 'unknown',
}

export interface TypesSeverityResult {
    /** @example 1 */
    criticalCount?: number
    /** @example 1 */
    highCount?: number
    /** @example 1 */
    lowCount?: number
    /** @example 1 */
    mediumCount?: number
    /** @example 1 */
    passedCount?: number
    /** @example 1 */
    unknownCount?: number
}

import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    HeadersDefaults,
    ResponseType,
} from 'axios'

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams
    extends Omit<
        AxiosRequestConfig,
        'data' | 'params' | 'url' | 'responseType'
    > {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean
    /** request path */
    path: string
    /** content type of request body */
    type?: ContentType
    /** query params */
    query?: QueryParamsType
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseType
    /** request body */
    body?: unknown
}

export type RequestParams = Omit<
    FullRequestParams,
    'body' | 'method' | 'query' | 'path'
>

export interface ApiConfig<SecurityDataType = unknown>
    extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
    securityWorker?: (
        securityData: SecurityDataType | null
    ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
    secure?: boolean
    format?: ResponseType
}

export enum ContentType {
    Json = 'application/json',
    FormData = 'multipart/form-data',
    UrlEncoded = 'application/x-www-form-urlencoded',
    Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
    public instance: AxiosInstance
    private securityData: SecurityDataType | null = null
    private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
    private secure?: boolean
    private format?: ResponseType

    constructor({
        securityWorker,
        secure,
        format,
        ...axiosConfig
    }: ApiConfig<SecurityDataType> = {}) {
        this.instance = axios.create({
            ...axiosConfig,
            baseURL: axiosConfig.baseURL || 'https://dev-cluster.kaytu.io',
        })
        this.secure = secure
        this.format = format
        this.securityWorker = securityWorker
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data
    }

    protected mergeRequestParams(
        params1: AxiosRequestConfig,
        params2?: AxiosRequestConfig
    ): AxiosRequestConfig {
        const method = params1.method || (params2 && params2.method)

        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method &&
                    this.instance.defaults.headers[
                        method.toLowerCase() as keyof HeadersDefaults
                    ]) ||
                    {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        }
    }

    protected stringifyFormItem(formItem: unknown) {
        if (typeof formItem === 'object' && formItem !== null) {
            return JSON.stringify(formItem)
        } else {
            return `${formItem}`
        }
    }

    protected createFormData(input: Record<string, unknown>): FormData {
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key]
            const propertyContent: any[] =
                property instanceof Array ? property : [property]

            for (const formItem of propertyContent) {
                const isFileType =
                    formItem instanceof Blob || formItem instanceof File
                formData.append(
                    key,
                    isFileType ? formItem : this.stringifyFormItem(formItem)
                )
            }

            return formData
        }, new FormData())
    }

    public request = async <T = any, _E = any>({
        secure,
        path,
        type,
        query,
        format,
        body,
        ...params
    }: FullRequestParams): Promise<AxiosResponse<T>> => {
        const secureParams =
            ((typeof secure === 'boolean' ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {}
        const requestParams = this.mergeRequestParams(params, secureParams)
        const responseFormat = format || this.format || undefined

        if (
            type === ContentType.FormData &&
            body &&
            body !== null &&
            typeof body === 'object'
        ) {
            body = this.createFormData(body as Record<string, unknown>)
        }

        if (
            type === ContentType.Text &&
            body &&
            body !== null &&
            typeof body !== 'string'
        ) {
            body = JSON.stringify(body)
        }

        return this.instance.request({
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type && type !== ContentType.FormData
                    ? { 'Content-Type': type }
                    : {}),
            },
            params: query,
            responseType: responseFormat,
            data: body,
            url: path,
        })
    }
}

/**
 * @title Kaytu Service API
 * @version 1.0
 * @baseUrl https://dev-cluster.kaytu.io
 * @contact
 */
export class Api<
    SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {
    ai = {
        /**
         * No description
         *
         * @tags resource
         * @name ApiV1GptRunCreate
         * @summary Runs the query on KaytuGPT and returns the generated query
         * @request POST:/ai/api/v1/gpt/run
         * @secure
         */
        apiV1GptRunCreate: (query: string, params: RequestParams = {}) =>
            this.request<Record<string, string[]>, any>({
                path: `/ai/api/v1/gpt/run`,
                method: 'POST',
                body: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),
    }
    auth = {
        /**
         * @description Creates workspace key for the defined role with the defined name in the workspace.
         *
         * @tags keys
         * @name ApiV1KeyCreateCreate
         * @summary Create Workspace Key
         * @request POST:/auth/api/v1/key/create
         * @secure
         */
        apiV1KeyCreateCreate: (
            request: GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyRequest,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyResponse,
                EchoHTTPError
            >({
                path: `/auth/api/v1/key/create`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Deletes the specified workspace key by ID.
         *
         * @tags keys
         * @name ApiV1KeyDeleteDelete
         * @summary Delete Workspace Key
         * @request DELETE:/auth/api/v1/key/{id}/delete
         * @secure
         */
        apiV1KeyDeleteDelete: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/auth/api/v1/key/${id}/delete`,
                method: 'DELETE',
                secure: true,
                ...params,
            }),

        /**
         * @description Gets list of all keys in the workspace.
         *
         * @tags keys
         * @name ApiV1KeysList
         * @summary Get Workspace Keys
         * @request GET:/auth/api/v1/keys
         * @secure
         */
        apiV1KeysList: (params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey[],
                any
            >({
                path: `/auth/api/v1/keys`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Sends an invitation to a user to join the workspace with a designated role.
         *
         * @tags users
         * @name ApiV1UserInviteCreate
         * @summary Invite User
         * @request POST:/auth/api/v1/user/invite
         * @secure
         */
        apiV1UserInviteCreate: (
            request: GithubComKaytuIoKaytuEnginePkgAuthApiInviteRequest,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/auth/api/v1/user/invite`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Updates the role of a user in the workspace.
         *
         * @tags users
         * @name ApiV1UserRoleBindingUpdate
         * @summary Update User Role
         * @request PUT:/auth/api/v1/user/role/binding
         * @secure
         */
        apiV1UserRoleBindingUpdate: (
            request: GithubComKaytuIoKaytuEnginePkgAuthApiPutRoleBindingRequest,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/auth/api/v1/user/role/binding`,
                method: 'PUT',
                body: request,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Revokes a user's access to the workspace
         *
         * @tags users
         * @name ApiV1UserRoleBindingDelete
         * @summary Revoke User Access
         * @request DELETE:/auth/api/v1/user/role/binding
         * @secure
         */
        apiV1UserRoleBindingDelete: (
            query: {
                /** User ID */
                userId: string
            },
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/auth/api/v1/user/role/binding`,
                method: 'DELETE',
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Retrieves the roles that the user who sent the request has in all workspaces they are a member of.
         *
         * @tags users
         * @name ApiV1UserRoleBindingsList
         * @summary Get User Roles
         * @request GET:/auth/api/v1/user/role/bindings
         * @secure
         */
        apiV1UserRoleBindingsList: (params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiGetRoleBindingsResponse,
                any
            >({
                path: `/auth/api/v1/user/role/bindings`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returns user details by specified user id.
         *
         * @tags users
         * @name ApiV1UserDetail
         * @summary Get User details
         * @request GET:/auth/api/v1/user/{userId}
         * @secure
         */
        apiV1UserDetail: (userId: string, params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiGetUserResponse,
                any
            >({
                path: `/auth/api/v1/user/${userId}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieves a list of users who are members of the workspace.
         *
         * @tags users
         * @name ApiV1UsersList
         * @summary List Users
         * @request GET:/auth/api/v1/users
         * @secure
         */
        apiV1UsersList: (
            request: GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersRequest,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersResponse[],
                any
            >({
                path: `/auth/api/v1/users`,
                method: 'GET',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Get all the RoleBindings of the workspace. RoleBinding defines the roles and actions a user can perform. There are currently three roles (admin, editor, viewer). The workspace path is based on the DNS such as (workspace1.app.kaytu.io)
         *
         * @tags users
         * @name ApiV1WorkspaceRoleBindingsList
         * @summary Workspace user roleBindings.
         * @request GET:/auth/api/v1/workspace/role/bindings
         * @secure
         */
        apiV1WorkspaceRoleBindingsList: (params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding[],
                any
            >({
                path: `/auth/api/v1/workspace/role/bindings`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),
    }
    compliance = {
        /**
         * @description Retrieving all benchmark assigned sources with benchmark id
         *
         * @tags benchmarks_assignment
         * @name ApiV1AssignmentsBenchmarkDetail
         * @summary Get benchmark assigned sources
         * @request GET:/compliance/api/v1/assignments/benchmark/{benchmark_id}
         * @secure
         */
        apiV1AssignmentsBenchmarkDetail: (
            benchmarkId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedSource[],
                any
            >({
                path: `/compliance/api/v1/assignments/benchmark/${benchmarkId}`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Creating a benchmark assignment for a connection.
         *
         * @tags benchmarks_assignment
         * @name ApiV1AssignmentsConnectionCreate
         * @summary Create benchmark assignment
         * @request POST:/compliance/api/v1/assignments/{benchmark_id}/connection/{connection_id}
         * @secure
         */
        apiV1AssignmentsConnectionCreate: (
            benchmarkId: string,
            connectionId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment[],
                any
            >({
                path: `/compliance/api/v1/assignments/${benchmarkId}/connection/${connectionId}`,
                method: 'POST',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Delete benchmark assignment with source id and benchmark id
         *
         * @tags benchmarks_assignment
         * @name ApiV1AssignmentsConnectionDelete
         * @summary Delete benchmark assignment
         * @request DELETE:/compliance/api/v1/assignments/{benchmark_id}/connection/{connection_id}
         * @secure
         */
        apiV1AssignmentsConnectionDelete: (
            benchmarkId: string,
            connectionId: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/compliance/api/v1/assignments/${benchmarkId}/connection/${connectionId}`,
                method: 'DELETE',
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Retrieving a summary of all benchmarks and their associated checks and results within a specified time interval.
         *
         * @tags compliance
         * @name ApiV1BenchmarksSummaryList
         * @summary List benchmarks summaries
         * @request GET:/compliance/api/v1/benchmarks/summary
         * @secure
         */
        apiV1BenchmarksSummaryList: (
            query?: {
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** timestamp for values in epoch seconds */
                timeAt?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse,
                any
            >({
                path: `/compliance/api/v1/benchmarks/summary`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving a summary of a benchmark and its associated checks and results.
         *
         * @tags compliance
         * @name ApiV1BenchmarksSummaryDetail
         * @summary Get benchmark summary
         * @request GET:/compliance/api/v1/benchmarks/{benchmark_id}/summary
         * @secure
         */
        apiV1BenchmarksSummaryDetail: (
            benchmarkId: string,
            query?: {
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** timestamp for values in epoch seconds */
                timeAt?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary,
                any
            >({
                path: `/compliance/api/v1/benchmarks/${benchmarkId}/summary`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving the benchmark tree, including all of its child benchmarks.
         *
         * @tags compliance
         * @name ApiV1BenchmarksTreeDetail
         * @summary Get benchmark tree
         * @request GET:/compliance/api/v1/benchmarks/{benchmark_id}/tree
         * @secure
         */
        apiV1BenchmarksTreeDetail: (
            benchmarkId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTree,
                any
            >({
                path: `/compliance/api/v1/benchmarks/${benchmarkId}/tree`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving a trend of a benchmark result and checks.
         *
         * @tags compliance
         * @name ApiV1BenchmarksTrendDetail
         * @summary Get benchmark trend
         * @request GET:/compliance/api/v1/benchmarks/{benchmark_id}/trend
         * @secure
         */
        apiV1BenchmarksTrendDetail: (
            benchmarkId: string,
            query?: {
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** timestamp for start of the chart in epoch seconds */
                startTime?: number
                /** timestamp for end of the chart in epoch seconds */
                endTime?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint[],
                any
            >({
                path: `/compliance/api/v1/benchmarks/${benchmarkId}/trend`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving all compliance run findings with respect to filters.
         *
         * @tags compliance
         * @name ApiV1FindingsCreate
         * @summary Get findings
         * @request POST:/compliance/api/v1/findings
         * @secure
         */
        apiV1FindingsCreate: (
            request: GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsRequest,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse,
                any
            >({
                path: `/compliance/api/v1/findings`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving the top field by finding count.
         *
         * @tags compliance
         * @name ApiV1FindingsTopDetail
         * @summary Get top field by finding count
         * @request GET:/compliance/api/v1/findings/{benchmarkId}/{field}/top/{count}
         * @secure
         */
        apiV1FindingsTopDetail: (
            benchmarkId: string,
            field: 'resourceType' | 'connectionID' | 'resourceID' | 'service',
            count: number,
            query?: {
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Severities to filter by */
                severities?: ('none' | 'low' | 'medium' | 'high' | 'critical')[]
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse,
                any
            >({
                path: `/compliance/api/v1/findings/${benchmarkId}/${field}/top/${count}`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving list of insights based on specified filters. Provides details of insights, including results during the specified time period for the specified connection. Returns "all:provider" job results if connectionId is not defined.
         *
         * @tags insights
         * @name ApiV1InsightList
         * @summary List insights
         * @request GET:/compliance/api/v1/insight
         * @secure
         */
        apiV1InsightList: (
            query?: {
                /** Key-Value tags in key=value format to filter by */
                tag?: string[]
                /** filter insights by connector */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** filter the result by source id */
                connectionId?: string[]
                /** unix seconds for the start time of the trend */
                startTime?: number
                /** unix seconds for the end time of the trend */
                endTime?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiInsight[],
                any
            >({
                path: `/compliance/api/v1/insight`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving list of insight groups based on specified filters. The API provides details of insights, including results during the specified time period for the specified connection. Returns "all:provider" job results if connectionId is not defined.
         *
         * @tags insights
         * @name ApiV1InsightGroupList
         * @summary List insight groups
         * @request GET:/compliance/api/v1/insight/group
         * @secure
         */
        apiV1InsightGroupList: (
            query?: {
                /** Key-Value tags in key=value format to filter by */
                tag?: string[]
                /** filter insights by connector */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** filter the result by source id */
                connectionId?: string[]
                /** unix seconds for the start time of the trend */
                startTime?: number
                /** unix seconds for the end time of the trend */
                endTime?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup[],
                any
            >({
                path: `/compliance/api/v1/insight/group`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving the specified insight with ID. Provides details of the insight, including results during the specified time period for the specified connection. Returns "all:provider" job results if connectionId is not defined.
         *
         * @tags insights
         * @name ApiV1InsightDetail
         * @summary Get insight
         * @request GET:/compliance/api/v1/insight/{insightId}
         * @secure
         */
        apiV1InsightDetail: (
            insightId: string,
            query?: {
                /** filter the result by source id */
                connectionId?: string[]
                /** unix seconds for the start time of the trend */
                startTime?: number
                /** unix seconds for the end time of the trend */
                endTime?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiInsight,
                any
            >({
                path: `/compliance/api/v1/insight/${insightId}`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving insight results datapoints for a specified connection during a specified time period. Returns "all:provider" job results if connectionId is not defined.
         *
         * @tags insights
         * @name ApiV1InsightTrendDetail
         * @summary Get insight trend
         * @request GET:/compliance/api/v1/insight/{insightId}/trend
         * @secure
         */
        apiV1InsightTrendDetail: (
            insightId: string,
            query?: {
                /** filter the result by source id */
                connectionId?: string[]
                /** unix seconds for the start time of the trend */
                startTime?: number
                /** unix seconds for the end time of the trend */
                endTime?: number
                /** number of datapoints to return */
                datapointCount?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint[],
                any
            >({
                path: `/compliance/api/v1/insight/${insightId}/trend`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving insight metadata by id
         *
         * @tags insights
         * @name ApiV1MetadataInsightDetail
         * @summary Get insight metadata
         * @request GET:/compliance/api/v1/metadata/insight/{insightId}
         * @secure
         */
        apiV1MetadataInsightDetail: (
            insightId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiInsight,
                any
            >({
                path: `/compliance/api/v1/metadata/insight/${insightId}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving a list of insights tag keys with their possible values.
         *
         * @tags insights
         * @name ApiV1MetadataTagInsightList
         * @summary List insights tag keys
         * @request GET:/compliance/api/v1/metadata/tag/insight
         * @secure
         */
        apiV1MetadataTagInsightList: (params: RequestParams = {}) =>
            this.request<Record<string, string[]>, any>({
                path: `/compliance/api/v1/metadata/tag/insight`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Syncs queries with the git backend.
         *
         * @tags compliance
         * @name ApiV1QueriesSyncList
         * @summary Sync queries
         * @request GET:/compliance/api/v1/queries/sync
         * @secure
         */
        apiV1QueriesSyncList: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/compliance/api/v1/queries/sync`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                ...params,
            }),
    }
    inventory = {
        /**
         * @description Retrieving list of smart queries by specified filters
         *
         * @tags smart_query
         * @name ApiV1QueryList
         * @summary List smart queries
         * @request GET:/inventory/api/v1/query
         * @secure
         */
        apiV1QueryList: (
            request: GithubComKaytuIoKaytuEnginePkgInventoryApiListQueryRequest,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItem[],
                any
            >({
                path: `/inventory/api/v1/query`,
                method: 'GET',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Run provided smart query and returns the result.
         *
         * @tags smart_query
         * @name ApiV1QueryRunCreate
         * @summary Run query
         * @request POST:/inventory/api/v1/query/run
         * @secure
         */
        apiV1QueryRunCreate: (
            request: GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryRequest,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryResponse,
                any
            >({
                path: `/inventory/api/v1/query/run`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description List queries which have been run recently
         *
         * @tags smart_query
         * @name ApiV1QueryRunHistoryList
         * @summary List recently ran queries
         * @request GET:/inventory/api/v1/query/run/history
         * @secure
         */
        apiV1QueryRunHistoryList: (params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryHistory[],
                any
            >({
                path: `/inventory/api/v1/query/run/history`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving list of categories for analytics
         *
         * @tags analytics
         * @name ApiV2AnalyticsCategoriesList
         * @summary List Analytics categories
         * @request GET:/inventory/api/v2/analytics/categories
         * @secure
         */
        apiV2AnalyticsCategoriesList: (
            query?: {
                /** Metric type, default: assets */
                metricType?: 'assets' | 'spend'
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiAnalyticsCategoriesResponse,
                any
            >({
                path: `/inventory/api/v2/analytics/categories`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving tag values with the most resources for the given key.
         *
         * @tags analytics
         * @name ApiV2AnalyticsCompositionDetail
         * @summary List analytics composition
         * @request GET:/inventory/api/v2/analytics/composition/{key}
         * @secure
         */
        apiV2AnalyticsCompositionDetail: (
            key: string,
            query: {
                /** Metric type, default: assets */
                metricType?: 'assets' | 'spend'
                /** How many top values to return default is 5 */
                top: number
                /** Connector types to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by - mutually exclusive with connectionGroup */
                connectionId?: string[]
                /** Connection group to filter by - mutually exclusive with connectionId */
                connectionGroup?: string
                /** timestamp for resource count in epoch seconds */
                endTime?: number
                /** timestamp for resource count change comparison in epoch seconds */
                startTime?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse,
                any
            >({
                path: `/inventory/api/v2/analytics/composition/${key}`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving list of analytics with metrics of each type based on the given input filters.
         *
         * @tags analytics
         * @name ApiV2AnalyticsMetricList
         * @summary List analytics metrics
         * @request GET:/inventory/api/v2/analytics/metric
         * @secure
         */
        apiV2AnalyticsMetricList: (
            query?: {
                /** Key-Value tags in key=value format to filter by */
                tag?: string[]
                /** Metric type, default: assets */
                metricType?: 'assets' | 'spend'
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by - mutually exclusive with connectionGroup */
                connectionId?: string[]
                /** Connection group to filter by - mutually exclusive with connectionId */
                connectionGroup?: string
                /** Metric IDs */
                metricIDs?: string[]
                /** timestamp for resource count in epoch seconds */
                endTime?: number
                /** timestamp for resource count change comparison in epoch seconds */
                startTime?: number
                /** Minimum number of resources with this tag value, default 1 */
                minCount?: number
                /** Sort by field - default is count */
                sortBy?: 'name' | 'count' | 'growth' | 'growth_rate'
                /** page size - default is 20 */
                pageSize?: number
                /** page number - default is 1 */
                pageNumber?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiListMetricsResponse,
                any
            >({
                path: `/inventory/api/v2/analytics/metric`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returns list of metrics
         *
         * @tags analytics
         * @name ApiV2AnalyticsMetricsListList
         * @summary List metrics
         * @request GET:/inventory/api/v2/analytics/metrics/list
         * @secure
         */
        apiV2AnalyticsMetricsListList: (
            query?: {
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Metric type, default: assets */
                metricType?: 'assets' | 'spend'
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiAnalyticsMetric[],
                any
            >({
                path: `/inventory/api/v2/analytics/metrics/list`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving list of regions analytics summary
         *
         * @tags analytics
         * @name ApiV2AnalyticsRegionsSummaryList
         * @summary List Regions Summary
         * @request GET:/inventory/api/v2/analytics/regions/summary
         * @secure
         */
        apiV2AnalyticsRegionsSummaryList: (
            query?: {
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by - mutually exclusive with connectionGroup */
                connectionId?: string[]
                /** Connection group to filter by - mutually exclusive with connectionId */
                connectionGroup?: string
                /** start time in unix seconds - default is now */
                startTime?: number
                /** end time in unix seconds - default is one week ago */
                endTime?: number
                /** column to sort by - default is resource_count */
                sortBy?: 'resource_count' | 'growth' | 'growth_rate'
                /** page size - default is 20 */
                pageSize?: number
                /** page number - default is 1 */
                pageNumber?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiRegionsResourceCountResponse,
                any
            >({
                path: `/inventory/api/v2/analytics/regions/summary`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving the cost composition with respect to specified filters. Retrieving information such as the total cost for the given time range, and the top services by cost.
         *
         * @tags analytics
         * @name ApiV2AnalyticsSpendCompositionList
         * @summary List cost composition
         * @request GET:/inventory/api/v2/analytics/spend/composition
         * @secure
         */
        apiV2AnalyticsSpendCompositionList: (
            query?: {
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by - mutually exclusive with connectionGroup */
                connectionId?: string[]
                /** Connection group to filter by - mutually exclusive with connectionId */
                connectionGroup?: string
                /** How many top values to return default is 5 */
                top?: number
                /** timestamp for start in epoch seconds */
                startTime?: number
                /** timestamp for end in epoch seconds */
                endTime?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse,
                any
            >({
                path: `/inventory/api/v2/analytics/spend/composition`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving cost metrics with respect to specified filters. The API returns information such as the total cost and costs per each service based on the specified filters.
         *
         * @tags analytics
         * @name ApiV2AnalyticsSpendMetricList
         * @summary List spend metrics
         * @request GET:/inventory/api/v2/analytics/spend/metric
         * @secure
         */
        apiV2AnalyticsSpendMetricList: (
            query?: {
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by - mutually exclusive with connectionGroup */
                connectionId?: string[]
                /** Connection group to filter by - mutually exclusive with connectionId */
                connectionGroup?: string
                /** timestamp for start in epoch seconds */
                startTime?: number
                /** timestamp for end in epoch seconds */
                endTime?: number
                /** Sort by field - default is cost */
                sortBy?: 'dimension' | 'cost' | 'growth' | 'growth_rate'
                /** page size - default is 20 */
                pageSize?: number
                /** page number - default is 1 */
                pageNumber?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse,
                any
            >({
                path: `/inventory/api/v2/analytics/spend/metric`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving a list of costs over the course of the specified time frame based on the given input filters. If startTime and endTime are empty, the API returns the last month trend.
         *
         * @tags analytics
         * @name ApiV2AnalyticsSpendMetricsTrendList
         * @summary Get Cost Trend
         * @request GET:/inventory/api/v2/analytics/spend/metrics/trend
         * @secure
         */
        apiV2AnalyticsSpendMetricsTrendList: (
            query?: {
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by - mutually exclusive with connectionGroup */
                connectionId?: string[]
                /** Metrics IDs */
                metricIds?: string[]
                /** Connection group to filter by - mutually exclusive with connectionId */
                connectionGroup?: string
                /** timestamp for start in epoch seconds */
                startTime?: number
                /** timestamp for end in epoch seconds */
                endTime?: number
                /** Granularity of the table, default is daily */
                granularity?: 'monthly' | 'daily' | 'yearly'
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiListServicesCostTrendDatapoint[],
                any
            >({
                path: `/inventory/api/v2/analytics/spend/metrics/trend`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returns spend table with respect to the dimension and granularity
         *
         * @tags inventory
         * @name ApiV2AnalyticsSpendTableList
         * @summary Get Spend Trend
         * @request GET:/inventory/api/v2/analytics/spend/table
         * @secure
         */
        apiV2AnalyticsSpendTableList: (
            query?: {
                /** timestamp for start in epoch seconds */
                startTime?: number
                /** timestamp for end in epoch seconds */
                endTime?: number
                /** Granularity of the table, default is daily */
                granularity?: 'monthly' | 'daily' | 'yearly'
                /** Dimension of the table, default is metric */
                dimension?: 'connection' | 'metric'
                /** Connection IDs to filter by - mutually exclusive with connectionGroup */
                connectionId?: string[]
                /** Metrics IDs */
                metricIds?: string[]
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiSpendTableRow[],
                any
            >({
                path: `/inventory/api/v2/analytics/spend/table`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving a list of costs over the course of the specified time frame based on the given input filters. If startTime and endTime are empty, the API returns the last month trend.
         *
         * @tags analytics
         * @name ApiV2AnalyticsSpendTrendList
         * @summary Get Cost Trend
         * @request GET:/inventory/api/v2/analytics/spend/trend
         * @secure
         */
        apiV2AnalyticsSpendTrendList: (
            query?: {
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by - mutually exclusive with connectionGroup */
                connectionId?: string[]
                /** Metrics IDs */
                metricIds?: string[]
                /** Connection group to filter by - mutually exclusive with connectionId */
                connectionGroup?: string
                /** timestamp for start in epoch seconds */
                startTime?: number
                /** timestamp for end in epoch seconds */
                endTime?: number
                /** Granularity of the table, default is daily */
                granularity?: 'monthly' | 'daily' | 'yearly'
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint[],
                any
            >({
                path: `/inventory/api/v2/analytics/spend/trend`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returns asset table with respect to the dimension and granularity
         *
         * @tags inventory
         * @name ApiV2AnalyticsTableList
         * @summary Get Assets Table
         * @request GET:/inventory/api/v2/analytics/table
         * @secure
         */
        apiV2AnalyticsTableList: (
            query?: {
                /** timestamp for start in epoch seconds */
                startTime?: number
                /** timestamp for end in epoch seconds */
                endTime?: number
                /** Granularity of the table, default is daily */
                granularity?: 'monthly' | 'daily' | 'yearly'
                /** Dimension of the table, default is metric */
                dimension?: 'connection' | 'metric'
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiAssetTableRow[],
                any
            >({
                path: `/inventory/api/v2/analytics/table`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving a list of tag keys with their possible values for all analytic metrics.
         *
         * @tags analytics
         * @name ApiV2AnalyticsTagList
         * @summary List analytics tags
         * @request GET:/inventory/api/v2/analytics/tag
         * @secure
         */
        apiV2AnalyticsTagList: (
            query?: {
                /** Connector type to filter by */
                connector?: string[]
                /** Connection IDs to filter by - mutually exclusive with connectionGroup */
                connectionId?: string[]
                /** Connection group to filter by - mutually exclusive with connectionId */
                connectionGroup?: string
                /** Minimum number of resources/spend with this tag value, default 1 */
                minCount?: number
                /** Start time in unix timestamp format, default now - 1 month */
                startTime?: number
                /** End time in unix timestamp format, default now */
                endTime?: number
                /** Metric type, default: assets */
                metricType?: 'assets' | 'spend'
            },
            params: RequestParams = {}
        ) =>
            this.request<Record<string, string[]>, any>({
                path: `/inventory/api/v2/analytics/tag`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving a list of resource counts over the course of the specified time frame based on the given input filters
         *
         * @tags analytics
         * @name ApiV2AnalyticsTrendList
         * @summary Get metric trend
         * @request GET:/inventory/api/v2/analytics/trend
         * @secure
         */
        apiV2AnalyticsTrendList: (
            query?: {
                /** Key-Value tags in key=value format to filter by */
                tag?: string[]
                /** Metric type, default: assets */
                metricType?: 'assets' | 'spend'
                /** Metric IDs to filter by */
                ids?: string[]
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by - mutually exclusive with connectionGroup */
                connectionId?: string[]
                /** Connection group to filter by - mutually exclusive with connectionId */
                connectionGroup?: string
                /** timestamp for start in epoch seconds */
                startTime?: number
                /** timestamp for end in epoch seconds */
                endTime?: number
                /** maximum number of datapoints to return, default is 30 */
                datapointCount?: string
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint[],
                any
            >({
                path: `/inventory/api/v2/analytics/trend`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving metrics for a specific resource type.
         *
         * @tags resource
         * @name ApiV2ResourcesMetricDetail
         * @summary List resource-type metrics
         * @request GET:/inventory/api/v2/resources/metric/{resourceType}
         * @secure
         */
        apiV2ResourcesMetricDetail: (
            resourceType: string,
            query?: {
                /** Connection IDs to filter by - mutually exclusive with connectionGroup */
                connectionId?: string[]
                /** Connection group to filter by - mutually exclusive with connectionId */
                connectionGroup?: string
                /** timestamp for resource count in epoch seconds */
                endTime?: number
                /** timestamp for resource count change comparison in epoch seconds */
                startTime?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType,
                any
            >({
                path: `/inventory/api/v2/resources/metric/${resourceType}`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),
    }
    metadata = {
        /**
         * No description
         *
         * @tags metadata
         * @name ApiV1FilterList
         * @summary list filters
         * @request GET:/metadata/api/v1/filter
         * @secure
         */
        apiV1FilterList: (params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgMetadataModelsFilter[],
                any
            >({
                path: `/metadata/api/v1/filter`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags metadata
         * @name ApiV1FilterCreate
         * @summary add filter
         * @request POST:/metadata/api/v1/filter
         * @secure
         */
        apiV1FilterCreate: (
            req: GithubComKaytuIoKaytuEnginePkgMetadataModelsFilter,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/metadata/api/v1/filter`,
                method: 'POST',
                body: req,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Sets the config metadata for the given key
         *
         * @tags metadata
         * @name ApiV1MetadataCreate
         * @summary Set key metadata
         * @request POST:/metadata/api/v1/metadata
         * @secure
         */
        apiV1MetadataCreate: (
            req: GithubComKaytuIoKaytuEnginePkgMetadataApiSetConfigMetadataRequest,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/metadata/api/v1/metadata`,
                method: 'POST',
                body: req,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Returns the config metadata for the given key
         *
         * @tags metadata
         * @name ApiV1MetadataDetail
         * @summary Get key metadata
         * @request GET:/metadata/api/v1/metadata/{key}
         * @secure
         */
        apiV1MetadataDetail: (key: string, params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgMetadataModelsConfigMetadata,
                any
            >({
                path: `/metadata/api/v1/metadata/${key}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),
    }
    onboard = {
        /**
         * @description Retrieving the list of metrics for catalog page.
         *
         * @tags onboard
         * @name ApiV1CatalogMetricsList
         * @summary List catalog metrics
         * @request GET:/onboard/api/v1/catalog/metrics
         * @secure
         */
        apiV1CatalogMetricsList: (params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics,
                any
            >({
                path: `/onboard/api/v1/catalog/metrics`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving a list of connection groups
         *
         * @tags connection-groups
         * @name ApiV1ConnectionGroupsList
         * @summary List connection groups
         * @request GET:/onboard/api/v1/connection-groups
         * @secure
         */
        apiV1ConnectionGroupsList: (
            query?: {
                /**
                 * Populate connections
                 * @default false
                 */
                populateConnections?: boolean
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionGroup[],
                any
            >({
                path: `/onboard/api/v1/connection-groups`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving a connection group
         *
         * @tags connection-groups
         * @name ApiV1ConnectionGroupsDetail
         * @summary Get connection group
         * @request GET:/onboard/api/v1/connection-groups/{connectionGroupName}
         * @secure
         */
        apiV1ConnectionGroupsDetail: (
            connectionGroupName: string,
            query?: {
                /**
                 * Populate connections
                 * @default false
                 */
                populateConnections?: boolean
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionGroup,
                any
            >({
                path: `/onboard/api/v1/connection-groups/${connectionGroupName}`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving a list of connections summaries
         *
         * @tags connections
         * @name ApiV1ConnectionsSummaryList
         * @summary List connections summaries
         * @request GET:/onboard/api/v1/connections/summary
         * @secure
         */
        apiV1ConnectionsSummaryList: (
            query?: {
                /** Connector */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs */
                connectionId?: string[]
                /** lifecycle state filter */
                lifecycleState?:
                    | 'DISABLED'
                    | 'DISCOVERED'
                    | 'IN_PROGRESS'
                    | 'ONBOARD'
                    | 'ARCHIVED'
                /** health state filter */
                healthState?: 'healthy' | 'unhealthy'
                /** page size - default is 20 */
                pageSize?: number
                /** page number - default is 1 */
                pageNumber?: number
                /** start time in unix seconds */
                startTime?: number
                /** end time in unix seconds */
                endTime?: number
                /** for quicker inquiry send this parameter as false, default: true */
                needCost?: boolean
                /** for quicker inquiry send this parameter as false, default: true */
                needResourceCount?: boolean
                /** column to sort by - default is cost */
                sortBy?:
                    | 'onboard_date'
                    | 'resource_count'
                    | 'cost'
                    | 'growth'
                    | 'growth_rate'
                    | 'cost_growth'
                    | 'cost_growth_rate'
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
                any
            >({
                path: `/onboard/api/v1/connections/summary`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returns list of all connectors
         *
         * @tags onboard
         * @name ApiV1ConnectorList
         * @summary List connectors
         * @request GET:/onboard/api/v1/connector
         * @secure
         */
        apiV1ConnectorList: (params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectorCount[],
                any
            >({
                path: `/onboard/api/v1/connector`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving list of credentials with their details
         *
         * @tags onboard
         * @name ApiV1CredentialList
         * @summary List credentials
         * @request GET:/onboard/api/v1/credential
         * @secure
         */
        apiV1CredentialList: (
            query?: {
                /** filter by connector type */
                connector?: '' | 'AWS' | 'Azure'
                /** filter by health status */
                health?: 'healthy' | 'unhealthy'
                /** filter by credential type */
                credentialType?: (
                    | 'auto-azure'
                    | 'auto-aws'
                    | 'manual-aws-org'
                    | 'manual-azure-spn'
                )[]
                /**
                 * page size
                 * @default 50
                 */
                pageSize?: number
                /**
                 * page number
                 * @default 1
                 */
                pageNumber?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiListCredentialResponse,
                any
            >({
                path: `/onboard/api/v1/credential`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Creating connection credentials
         *
         * @tags onboard
         * @name ApiV1CredentialCreate
         * @summary Create connection credentials
         * @request POST:/onboard/api/v1/credential
         * @secure
         */
        apiV1CredentialCreate: (
            config: GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialRequest,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialResponse,
                any
            >({
                path: `/onboard/api/v1/credential`,
                method: 'POST',
                body: config,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieving credential details by credential ID
         *
         * @tags onboard
         * @name ApiV1CredentialDetail
         * @summary Get Credential
         * @request GET:/onboard/api/v1/credential/{credentialId}
         * @secure
         */
        apiV1CredentialDetail: (
            credentialId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
                any
            >({
                path: `/onboard/api/v1/credential/${credentialId}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Edit a credential by ID
         *
         * @tags onboard
         * @name ApiV1CredentialUpdate
         * @summary Edit credential
         * @request PUT:/onboard/api/v1/credential/{credentialId}
         * @secure
         */
        apiV1CredentialUpdate: (
            credentialId: string,
            config: GithubComKaytuIoKaytuEnginePkgOnboardApiUpdateCredentialRequest,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/onboard/api/v1/credential/${credentialId}`,
                method: 'PUT',
                body: config,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Remove a credential by ID
         *
         * @tags onboard
         * @name ApiV1CredentialDelete
         * @summary Delete credential
         * @request DELETE:/onboard/api/v1/credential/{credentialId}
         * @secure
         */
        apiV1CredentialDelete: (
            credentialId: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/onboard/api/v1/credential/${credentialId}`,
                method: 'DELETE',
                secure: true,
                ...params,
            }),

        /**
         * @description Onboard all available connections for a credential
         *
         * @tags onboard
         * @name ApiV1CredentialAutoonboardCreate
         * @summary Onboard credential connections
         * @request POST:/onboard/api/v1/credential/{credentialId}/autoonboard
         * @secure
         */
        apiV1CredentialAutoonboardCreate: (
            credentialId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[],
                any
            >({
                path: `/onboard/api/v1/credential/${credentialId}/autoonboard`,
                method: 'POST',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Creating AWS source
         *
         * @tags onboard
         * @name ApiV1SourceAwsCreate
         * @summary Create AWS source
         * @request POST:/onboard/api/v1/source/aws
         * @secure
         */
        apiV1SourceAwsCreate: (
            request: GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAwsRequest,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiCreateSourceResponse,
                any
            >({
                path: `/onboard/api/v1/source/aws`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Creating Azure source
         *
         * @tags onboard
         * @name ApiV1SourceAzureCreate
         * @summary Create Azure source
         * @request POST:/onboard/api/v1/source/azure
         * @secure
         */
        apiV1SourceAzureCreate: (
            request: GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAzureRequest,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiCreateSourceResponse,
                any
            >({
                path: `/onboard/api/v1/source/azure`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Deleting a single source either AWS / Azure for the given source id.
         *
         * @tags onboard
         * @name ApiV1SourceDelete
         * @summary Delete source
         * @request DELETE:/onboard/api/v1/source/{sourceId}
         * @secure
         */
        apiV1SourceDelete: (sourceId: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/onboard/api/v1/source/${sourceId}`,
                method: 'DELETE',
                secure: true,
                ...params,
            }),

        /**
         * @description Get live source health status with given source ID.
         *
         * @tags onboard
         * @name ApiV1SourceHealthcheckDetail
         * @summary Get source health
         * @request GET:/onboard/api/v1/source/{sourceId}/healthcheck
         * @secure
         */
        apiV1SourceHealthcheckDetail: (
            sourceId: string,
            query?: {
                /**
                 * Whether to update metadata or not
                 * @default true
                 */
                updateMetadata?: boolean
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
                any
            >({
                path: `/onboard/api/v1/source/${sourceId}/healthcheck`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),
    }
    schedule = {
        /**
         * @description Triggers a describe job to run immediately for the given connection
         *
         * @tags describe
         * @name ApiV1DescribeTriggerUpdate
         * @summary Triggers describer
         * @request PUT:/schedule/api/v1/describe/trigger/{connection_id}
         * @secure
         */
        apiV1DescribeTriggerUpdate: (
            connectionId: string,
            query?: {
                /** Resource Type */
                resource_type?: string[]
            },
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/schedule/api/v1/describe/trigger/${connectionId}`,
                method: 'PUT',
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Get list of stacks
         *
         * @tags stack
         * @name ApiV1StacksList
         * @summary List Stacks
         * @request GET:/schedule/api/v1/stacks
         * @secure
         */
        apiV1StacksList: (
            query?: {
                /** Key-Value tags in key=value format to filter by */
                tag?: string[]
                /** Account IDs to filter by */
                accountIds?: string[]
            },
            params: RequestParams = {}
        ) =>
            this.request<GithubComKaytuIoKaytuEnginePkgDescribeApiStack[], any>(
                {
                    path: `/schedule/api/v1/stacks`,
                    method: 'GET',
                    query: query,
                    secure: true,
                    type: ContentType.Json,
                    format: 'json',
                    ...params,
                }
            ),

        /**
         * @description Create a stack by giving terraform statefile and additional resources Config structure for azure: {tenantId: string, objectId: string, secretId: string, clientId: string, clientSecret:string} Config structure for aws: {accessKey: string, secretKey: string}
         *
         * @tags stack
         * @name ApiV1StacksCreateCreate
         * @summary Create stack
         * @request POST:/schedule/api/v1/stacks/create
         * @secure
         */
        apiV1StacksCreateCreate: (
            data: {
                /**
                 * File to upload
                 * @format binary
                 */
                terraformFile: File
                /** Tags Map[string][]string */
                tag?: string
                /** Config json structure */
                config: string
            },
            params: RequestParams = {}
        ) =>
            this.request<GithubComKaytuIoKaytuEnginePkgDescribeApiStack, any>({
                path: `/schedule/api/v1/stacks/create`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.FormData,
                format: 'json',
                ...params,
            }),

        /**
         * @description Get list of all stacks containing a resource
         *
         * @tags stack
         * @name ApiV1StacksResourceList
         * @summary List Resource Stacks
         * @request GET:/schedule/api/v1/stacks/resource
         * @secure
         */
        apiV1StacksResourceList: (
            query: {
                /** Resource ID */
                resourceId: string
            },
            params: RequestParams = {}
        ) =>
            this.request<GithubComKaytuIoKaytuEnginePkgDescribeApiStack[], any>(
                {
                    path: `/schedule/api/v1/stacks/resource`,
                    method: 'GET',
                    query: query,
                    secure: true,
                    type: ContentType.Json,
                    format: 'json',
                    ...params,
                }
            ),

        /**
         * @description Get stack details by ID
         *
         * @tags stack
         * @name ApiV1StacksDetail
         * @summary Get Stack
         * @request GET:/schedule/api/v1/stacks/{stackId}
         * @secure
         */
        apiV1StacksDetail: (stackId: string, params: RequestParams = {}) =>
            this.request<GithubComKaytuIoKaytuEnginePkgDescribeApiStack, any>({
                path: `/schedule/api/v1/stacks/${stackId}`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Delete a stack by ID
         *
         * @tags stack
         * @name ApiV1StacksDelete
         * @summary Delete Stack
         * @request DELETE:/schedule/api/v1/stacks/{stackId}
         * @secure
         */
        apiV1StacksDelete: (stackId: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/schedule/api/v1/stacks/${stackId}`,
                method: 'DELETE',
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Get all findings for a stack
         *
         * @tags stack
         * @name ApiV1StacksFindingsCreate
         * @summary Get Stack Findings
         * @request POST:/schedule/api/v1/stacks/{stackId}/findings
         * @secure
         */
        apiV1StacksFindingsCreate: (
            stackId: string,
            request: GithubComKaytuIoKaytuEnginePkgDescribeApiGetStackFindings,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse,
                any
            >({
                path: `/schedule/api/v1/stacks/${stackId}/findings`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Get Insight results for a stack in the given time period
         *
         * @tags stack
         * @name ApiV1StacksInsightDetail
         * @summary Get Stack Insight
         * @request GET:/schedule/api/v1/stacks/{stackId}/insight
         * @secure
         */
        apiV1StacksInsightDetail: (
            stackId: string,
            query: {
                /** InsightID */
                insightId: number
                /** unix seconds for the start time of the trend */
                startTime?: number
                /** unix seconds for the end time of the trend */
                endTime?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiInsight,
                any
            >({
                path: `/schedule/api/v1/stacks/${stackId}/insight`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Get all Insights results with the given filters
         *
         * @tags stack
         * @name ApiV1StacksInsightsDetail
         * @summary List Stack Insights
         * @request GET:/schedule/api/v1/stacks/{stackId}/insights
         * @secure
         */
        apiV1StacksInsightsDetail: (
            stackId: string,
            query?: {
                /** Insight IDs to filter with. If empty, then all insights are returned */
                insightIds?: number[]
                /** unix seconds for the start time of the trend */
                startTime?: number
                /** unix seconds for the end time of the trend */
                endTime?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiInsight[],
                any
            >({
                path: `/schedule/api/v1/stacks/${stackId}/insights`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),
    }
    workspace = {
        /**
         * No description
         *
         * @tags workspace
         * @name ApiV1OrganizationCreate
         * @summary Create an organization
         * @request POST:/workspace/api/v1/organization
         * @secure
         */
        apiV1OrganizationCreate: (
            request: GithubComKaytuIoKaytuEnginePkgWorkspaceApiOrganization,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgWorkspaceApiOrganization,
                any
            >({
                path: `/workspace/api/v1/organization`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags workspace
         * @name ApiV1OrganizationDelete
         * @summary Create an organization
         * @request DELETE:/workspace/api/v1/organization/{organizationId}
         * @secure
         */
        apiV1OrganizationDelete: (
            organizationId: number,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/workspace/api/v1/organization/${organizationId}`,
                method: 'DELETE',
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Returns workspace created
         *
         * @tags workspace
         * @name ApiV1WorkspaceCreate
         * @summary Create workspace for workspace service
         * @request POST:/workspace/api/v1/workspace
         * @secure
         */
        apiV1WorkspaceCreate: (
            request: GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceRequest,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceResponse,
                any
            >({
                path: `/workspace/api/v1/workspace`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returns all workspaces with owner id
         *
         * @tags workspace
         * @name ApiV1WorkspaceCurrentList
         * @summary List all workspaces with owner id
         * @request GET:/workspace/api/v1/workspace/current
         * @secure
         */
        apiV1WorkspaceCurrentList: (params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse,
                any
            >({
                path: `/workspace/api/v1/workspace/current`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Delete workspace with workspace id
         *
         * @tags workspace
         * @name ApiV1WorkspaceDelete
         * @summary Delete workspace for workspace service
         * @request DELETE:/workspace/api/v1/workspace/{workspace_id}
         * @secure
         */
        apiV1WorkspaceDelete: (
            workspaceId: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/workspace/api/v1/workspace/${workspaceId}`,
                method: 'DELETE',
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags workspace
         * @name ApiV1WorkspaceNameCreate
         * @summary Change name of workspace
         * @request POST:/workspace/api/v1/workspace/{workspace_id}/name
         * @secure
         */
        apiV1WorkspaceNameCreate: (
            workspaceId: string,
            request: GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceNameRequest,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/workspace/api/v1/workspace/${workspaceId}/name`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags workspace
         * @name ApiV1WorkspaceOrganizationCreate
         * @summary Change organization of workspace
         * @request POST:/workspace/api/v1/workspace/{workspace_id}/organization
         * @secure
         */
        apiV1WorkspaceOrganizationCreate: (
            workspaceId: string,
            request: GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOrganizationRequest,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/workspace/api/v1/workspace/${workspaceId}/organization`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags workspace
         * @name ApiV1WorkspaceOwnerCreate
         * @summary Change ownership of workspace
         * @request POST:/workspace/api/v1/workspace/{workspace_id}/owner
         * @secure
         */
        apiV1WorkspaceOwnerCreate: (
            workspaceId: string,
            request: GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOwnershipRequest,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/workspace/api/v1/workspace/${workspaceId}/owner`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags workspace
         * @name ApiV1WorkspaceResumeCreate
         * @summary Resume workspace
         * @request POST:/workspace/api/v1/workspace/{workspace_id}/resume
         * @secure
         */
        apiV1WorkspaceResumeCreate: (
            workspaceId: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/workspace/api/v1/workspace/${workspaceId}/resume`,
                method: 'POST',
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags workspace
         * @name ApiV1WorkspaceSuspendCreate
         * @summary Suspend workspace
         * @request POST:/workspace/api/v1/workspace/{workspace_id}/suspend
         * @secure
         */
        apiV1WorkspaceSuspendCreate: (
            workspaceId: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/workspace/api/v1/workspace/${workspaceId}/suspend`,
                method: 'POST',
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags workspace
         * @name ApiV1WorkspaceTierCreate
         * @summary Change Tier of workspace
         * @request POST:/workspace/api/v1/workspace/{workspace_id}/tier
         * @secure
         */
        apiV1WorkspaceTierCreate: (
            workspaceId: string,
            request: GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceTierRequest,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/workspace/api/v1/workspace/${workspaceId}/tier`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Returns all workspaces with owner id
         *
         * @tags workspace
         * @name ApiV1WorkspacesList
         * @summary List all workspaces with owner id
         * @request GET:/workspace/api/v1/workspaces
         * @secure
         */
        apiV1WorkspacesList: (params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse[],
                any
            >({
                path: `/workspace/api/v1/workspaces`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags workspace
         * @name ApiV1WorkspacesByidDetail
         * @summary Get workspace
         * @request GET:/workspace/api/v1/workspaces/byid/{workspace_id}
         * @secure
         */
        apiV1WorkspacesByidDetail: (
            workspaceId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspace,
                any
            >({
                path: `/workspace/api/v1/workspaces/byid/${workspaceId}`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags workspace
         * @name ApiV1WorkspacesLimitsByidDetail
         * @summary Get workspace limits
         * @request GET:/workspace/api/v1/workspaces/limits/byid/{workspace_id}
         * @secure
         */
        apiV1WorkspacesLimitsByidDetail: (
            workspaceId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimits,
                any
            >({
                path: `/workspace/api/v1/workspaces/limits/byid/${workspaceId}`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags workspace
         * @name ApiV1WorkspacesLimitsDetail
         * @summary Get workspace limits
         * @request GET:/workspace/api/v1/workspaces/limits/{workspace_name}
         * @secure
         */
        apiV1WorkspacesLimitsDetail: (
            workspaceName: string,
            query?: {
                /** Ignore usage */
                ignore_usage?: boolean
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimitsUsage,
                any
            >({
                path: `/workspace/api/v1/workspaces/limits/${workspaceName}`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Get workspace with workspace id
         *
         * @tags workspace
         * @name ApiV1WorkspacesDetail
         * @summary Get workspace for workspace service
         * @request GET:/workspace/api/v1/workspaces/{workspace_id}
         * @secure
         */
        apiV1WorkspacesDetail: (
            workspaceId: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/workspace/api/v1/workspaces/${workspaceId}`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                ...params,
            }),
    }
}
