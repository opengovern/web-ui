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

export interface AwsResources {
    errorCode?: string
    errors?: Record<string, string>
    resources?: Record<string, DescriberResource[]>
}

export interface DescribeComplianceReportJob {
    /**
     * Not the primary key but should be a unique identifier
     * @example "azure_cis_v1"
     */
    BenchmarkId?: string
    /** @example false */
    IsStack?: boolean
    /** @example 1619510400 */
    ReportCreatedAt?: number
    /**
     * Not the primary key but should be a unique identifier
     * @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8"
     */
    SourceId?: string
    /** @example "Azure" */
    SourceType?: SourceType
    /** @example "InProgress" */
    Status?: GithubComKaytuIoKaytuEnginePkgComplianceApiComplianceReportJobStatus
    createdAt?: string
    deletedAt?: GormDeletedAt
    /** Should be NULLSTRING */
    failureMessage?: string
    id?: number
    /** @example 1 */
    scheduleJobId?: number
    updatedAt?: string
}

export interface DescribeDescribeResourceJob {
    createdAt?: string
    deletedAt?: GormDeletedAt
    describedResourceCount?: number
    /** Should be NULLSTRING */
    errorCode?: string
    /** Should be NULLSTRING */
    failureMessage?: string
    id?: number
    parentJobID?: number
    resourceType?: string
    retryCount?: number
    status?: GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeResourceJobStatus
    updatedAt?: string
}

export interface DescribeDescribeSourceJob {
    accountID?: string
    createdAt?: string
    deletedAt?: GormDeletedAt
    describeResourceJobs?: DescribeDescribeResourceJob[]
    describedAt?: string
    fullDiscovery?: boolean
    id?: number
    /** Not the primary key but should be a unique identifier */
    sourceID?: string
    sourceType?: SourceType
    status?: GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSourceJobStatus
    triggerType?: GithubComKaytuIoKaytuEnginePkgDescribeEnumsDescribeTriggerType
    updatedAt?: string
}

export interface DescribeInsightJob {
    accountID?: string
    createdAt?: string
    deletedAt?: GormDeletedAt
    failureMessage?: string
    id?: number
    insightID?: number
    isStack?: boolean
    scheduleUUID?: string
    sourceID?: string
    sourceType?: SourceType
    status?: GithubComKaytuIoKaytuEnginePkgInsightApiInsightJobStatus
    updatedAt?: string
}

export interface DescribeSummarizerJob {
    createdAt?: string
    deletedAt?: GormDeletedAt
    failureMessage?: string
    id?: number
    jobType?: SummarizerJobType
    scheduleJobID?: number
    status?: GithubComKaytuIoKaytuEnginePkgSummarizerApiSummarizerJobStatus
    updatedAt?: string
}

export interface DescriberResource {
    account?: string
    /** ARN uniquely identifies an AWS resource across regions, accounts and types. */
    arn?: string
    description?: any
    /**
     * ID doesn't uniquely identifies a resource. It will be used to create a
     * unique identifier by concating PARTITION|REGION|ACCOUNT|TYPE|ID
     */
    id?: string
    name?: string
    partition?: string
    region?: string
    type?: string
}

export interface EchoHTTPError {
    message?: any
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

export interface GithubComKaytuIoKaytuEnginePkgAuthApiMembership {
    /**
     * Assignment timestamp in UTC
     * @example "2023-03-31T09:36:09.855Z"
     */
    assignedAt?: string
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
     * Unique identifier for the workspace
     * @example "ws123456789"
     */
    workspaceID?: string
    /**
     * Name of the Workspace
     * @example "demo"
     */
    workspaceName?: string
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
    AdminRole = 'admin',
    EditorRole = 'editor',
    ViewerRole = 'viewer',
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiRoleDetailsResponse {
    /**
     * Role Description and accesses
     * @example "The Administrator role is a super user role with all of the capabilities that can be assigned to a role, and its enables access to all data & configuration on a Kaytu Workspace. You cannot edit or delete the Administrator role."
     */
    description?: string
    /**
     * Name of the role
     * @example "admin"
     */
    role?: 'admin' | 'editor' | 'viewer'
    /**
     * Number of users having this role
     * @example 1
     */
    userCount?: number
    /** List of users having the role */
    users?: GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersResponse[]
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiRoleUser {
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
    /**
     * A list of workspace ids which the user has the specified role in them
     * @example ["demo"]
     */
    workspaces?: string[]
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiRolesListResponse {
    /**
     * Role Description and accesses
     * @example "The Administrator role is a super user role with all of the capabilities that can be assigned to a role, and its enables access to all data & configuration on a Kaytu Workspace. You cannot edit or delete the Administrator role."
     */
    description?: string
    /**
     * Name of the role
     * @example "admin"
     */
    roleName?: 'admin' | 'editor' | 'viewer'
    /**
     * Number of users having this role in the workspace
     * @example 1
     */
    userCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgAuthApiUpdateKeyRoleRequest {
    /** Unique identifier for the key */
    id?: number
    /**
     * Name of the role
     * @example "admin"
     */
    roleName?: 'admin' | 'editor' | 'viewer'
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

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmark {
    /**
     * Whether the benchmark is auto assigned or not
     * @example true
     */
    autoAssign?: boolean
    /**
     * Whether the benchmark is baseline or not
     * @example true
     */
    baseline?: boolean
    /** Benchmark category */
    category?: string
    /**
     * Benchmark children
     * @example ["[azure_cis_v140_1"," azure_cis_v140_2]"]
     */
    children?: string[]
    /**
     * Benchmark connectors
     * @example ["[azure]"]
     */
    connectors?: SourceType[]
    /**
     * Benchmark creation date
     * @example "2020-01-01T00:00:00Z"
     */
    createdAt?: string
    /**
     * Benchmark description
     * @example "The CIS Microsoft Azure Foundations Security Benchmark provides prescriptive guidance for establishing a secure baseline configuration for Microsoft Azure."
     */
    description?: string
    /**
     * Benchmark document URI
     * @example "benchmarks/azure_cis_v140.md"
     */
    documentURI?: string
    /**
     * Whether the benchmark is enabled or not
     * @example true
     */
    enabled?: boolean
    /**
     * Benchmark ID
     * @example "azure_cis_v140"
     */
    id?: string
    /** Benchmark logo URI */
    logoURI?: string
    /**
     * Whether the benchmark is managed or not
     * @example true
     */
    managed?: boolean
    /**
     * Benchmark policies
     * @example ["[azure_cis_v140_1_1"," azure_cis_v140_1_2]"]
     */
    policies?: string[]
    /** Benchmark tags */
    tags?: Record<string, string[]>
    /**
     * Benchmark title
     * @example "Azure CIS v1.4.0"
     */
    title?: string
    /**
     * Benchmark last update date
     * @example "2020-01-01T00:00:00Z"
     */
    updatedAt?: string
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedSource {
    /**
     * Connection ID
     * @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8"
     */
    connectionID?: string
    /** Connection Name */
    connectionName?: string
    /**
     * Clout Provider
     * @example "Azure"
     */
    connector?: SourceType
    /**
     * Status
     * @example true
     */
    status?: boolean
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment {
    /** Unix timestamp */
    assignedAt?: number
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

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkResultTrend {
    resultTrend?: GithubComKaytuIoKaytuEnginePkgComplianceApiResultDatapoint[]
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

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiComplianceReport {
    /** @example "" */
    failureMessage?: string
    /** @example 1 */
    id?: number
    /** @example 1619510400 */
    reportCreatedAt?: number
    /** @example "InProgress" */
    status?: GithubComKaytuIoKaytuEnginePkgComplianceApiComplianceReportJobStatus
    /** @example "2021-01-01T00:00:00Z" */
    updatedAt?: string
}

export enum GithubComKaytuIoKaytuEnginePkgComplianceApiComplianceReportJobStatus {
    ComplianceReportJobCreated = 'CREATED',
    ComplianceReportJobInProgress = 'IN_PROGRESS',
    ComplianceReportJobCompletedWithFailure = 'COMPLETED_WITH_FAILURE',
    ComplianceReportJobCompleted = 'COMPLETED',
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

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsMetricsResponse {
    /** @example 10 */
    failedFindings?: number
    /** @example 10 */
    lastFailedFindings?: number
    /** @example 90 */
    lastPassedFindings?: number
    /** @example 100 */
    lastTotalFindings?: number
    /** @example 0 */
    lastUnknownFindings?: number
    /** @example 90 */
    passedFindings?: number
    /** @example 100 */
    totalFindings?: number
    /** @example 0 */
    unknownFindings?: number
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsRequest {
    filters?: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFilters
    page: GithubComKaytuIoKaytuEnginePkgComplianceApiPage
    sorts?: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingSortItem[]
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse {
    findings?: GithubComKaytuIoKaytuEnginePkgComplianceEsFinding[]
    /** @example 100 */
    totalCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldRequest {
    /**
     * Number of items to return
     * @example 1
     */
    count?: number
    /**
     * Field to get top values for
     * @example "resourceType"
     */
    field?: 'resourceType' | 'serviceName' | 'sourceID' | 'resourceID'
    filters?: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFilters
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse {
    records?: GithubComKaytuIoKaytuEnginePkgComplianceApiTopFieldRecord[]
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

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroupTrendResponse {
    trend?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint[]
    trendPerInsight?: Record<
        string,
        GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint[]
    >
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

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiPolicy {
    /** @example "Azure" */
    connector?: SourceType
    /** @example "2020-01-01T00:00:00Z" */
    createdAt?: string
    /** @example "Enable multi-factor authentication for all user credentials who have write access to Azure resources. These include roles like 'Service Co-Administrators', 'Subscription Owners', 'Contributors'." */
    description?: string
    /** @example "benchmarks/azure_cis_v140_1_1.md" */
    documentURI?: string
    /** @example true */
    enabled?: boolean
    /** @example "azure_cis_v140_1_1" */
    id?: string
    /** @example true */
    managed?: boolean
    /** @example true */
    manualVerification?: boolean
    /** @example "azure_ad_manual_control" */
    queryID?: string
    /** @example "low" */
    severity?: string
    tags?: Record<string, string[]>
    /** @example "1.1 Ensure that multi-factor authentication status is enabled for all privileged users" */
    title?: string
    /** @example "2020-01-01T00:00:00Z" */
    updatedAt?: string
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
    severity?: string
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

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiResultDatapoint {
    /** Result */
    result?: TypesSeverityResult
    /** Datapoint Time */
    time?: number
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

export enum GithubComKaytuIoKaytuEnginePkgComplianceApiTopField {
    TopFieldResourceType = 'resourceType',
    TopFieldCloudService = 'serviceName',
    TopFieldCloudAccount = 'sourceID',
    TopFieldResources = 'resourceID',
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceApiTopFieldRecord {
    count?: number
    value?: string
}

export interface GithubComKaytuIoKaytuEnginePkgComplianceEsFinding {
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
    severity?: string
    /**
     * Whether the policy is active or not
     * @example true
     */
    stateActive?: boolean
}

export interface GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeResource {
    failureMessage?: string
    /** @example "Microsoft.Compute/virtualMachines" */
    resourceType?: string
    /**
     * CREATED, QUEUED, IN_PROGRESS, TIMEOUT, FAILED, SUCCEEDED
     * @example "IN_PROGRESS"
     */
    status?: GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeResourceJobStatus
}

export enum GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeResourceJobStatus {
    DescribeResourceJobCreated = 'CREATED',
    DescribeResourceJobQueued = 'QUEUED',
    DescribeResourceJobInProgress = 'IN_PROGRESS',
    DescribeResourceJobTimeout = 'TIMEOUT',
    DescribeResourceJobFailed = 'FAILED',
    DescribeResourceJobSucceeded = 'SUCCEEDED',
}

export interface GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSingleResourceRequest {
    accessKey?: string
    accountID?: string
    additionalFields?: Record<string, string>
    provider?: SourceType
    resourceType?: string
    secretKey?: string
}

export interface GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSource {
    describeResourceJobs?: GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeResource[]
    /**
     * CREATED, QUEUED, IN_PROGRESS, TIMEOUT, FAILED, SUCCEEDED
     * @example "IN_PROGRESS"
     */
    status?: GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSourceJobStatus
}

export enum GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSourceJobStatus {
    DescribeSourceJobCreated = 'CREATED',
    DescribeSourceJobInProgress = 'IN_PROGRESS',
    DescribeSourceJobCompletedWithFailure = 'COMPLETED_WITH_FAILURE',
    DescribeSourceJobCompleted = 'COMPLETED',
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

export interface GithubComKaytuIoKaytuEnginePkgDescribeApiInsightJob {
    /**
     * Failure Message
     * @example ""
     */
    FailureMessage?: string
    /**
     * Account ID
     * @example "0123456789"
     */
    accountId?: string
    /**
     * Insight Job creation timestamp
     * @example "2021-04-27T15:04:05Z"
     */
    createdAt?: string
    /**
     * Insight Job Unique ID
     * @format int64
     * @example 1
     */
    id?: number
    /**
     * Insight ID
     * @format int64
     * @example 1
     */
    insightId?: number
    /**
     * Source ID
     * @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8"
     */
    sourceId?: string
    /**
     * Cloud provider
     * @example "Azure"
     */
    sourceType?: SourceType
    /**
     * Insight Job Status
     * @example "InProgress"
     */
    status?: GithubComKaytuIoKaytuEnginePkgInsightApiInsightJobStatus
    /**
     * Insight Job last update timestamp
     * @example "2021-04-27T15:04:05Z"
     */
    updatedAt?: string
}

export interface GithubComKaytuIoKaytuEnginePkgDescribeApiListBenchmarkEvaluationsRequest {
    /**
     * Filter evaluations for this benchmark
     * @example "azure_cis_v1"
     */
    benchmarkID?: string
    /**
     * Filter evaluations for this connection
     * @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8"
     */
    connectionID?: string
    /**
     * Filter evaluations for this connector
     * @example "Azure"
     */
    connector?: SourceType
    /**
     * Filter evaluations created after this timestamp
     * @example 1619510400
     */
    evaluatedAtAfter?: number
    /**
     * Filter evaluations created before this timestamp
     * @example 1619610400
     */
    evaluatedAtBefore?: number
}

export interface GithubComKaytuIoKaytuEnginePkgDescribeApiResourceTypeDetail {
    resourceTypeARN?: string
    resourceTypeName?: string
}

export interface GithubComKaytuIoKaytuEnginePkgDescribeApiSource {
    /** @example "123456789012" */
    accountId?: string
    /** @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8" */
    id?: string
    /** @example "2021-01-01T00:00:00Z" */
    lastComplianceReportAt?: string
    /** @example "COMPLETED" */
    lastDescribeJobStatus?: string
    /** @example "2021-01-01T00:00:00Z" */
    lastDescribedAt?: string
    /** @example "Azure" */
    type?: SourceType
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

export interface GithubComKaytuIoKaytuEnginePkgDescribeApiTriggerBenchmarkEvaluationRequest {
    /**
     * Benchmark ID to evaluate
     * @example "azure_cis_v1"
     */
    benchmarkID?: string
    /**
     * Connection ID to evaluate
     * @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8"
     */
    connectionID?: string
    /**
     * Resource IDs to evaluate
     * @example ["/subscriptions/123/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachines/vm1"]
     */
    resourceIDs?: string[]
}

export interface GithubComKaytuIoKaytuEnginePkgDescribeApiTriggerInsightEvaluationRequest {
    /**
     * Connection ID to evaluate
     * @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8"
     */
    connectionID?: string
    /**
     * Insight ID to evaluate
     * @example 1
     */
    insightID?: number
    /**
     * Resource IDs to evaluate
     * @example ["/subscriptions/123/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachines/vm1"]
     */
    resourceIDs?: string[]
}

export enum GithubComKaytuIoKaytuEnginePkgDescribeEnumsDescribeTriggerType {
    DescribeTriggerTypeInitialDiscovery = 'initial_discovery',
    DescribeTriggerTypeScheduled = 'scheduled',
    DescribeTriggerTypeManual = 'manual',
    DescribeTriggerTypeStack = 'stack',
}

export enum GithubComKaytuIoKaytuEnginePkgInsightApiInsightJobStatus {
    InsightJobInProgress = 'IN_PROGRESS',
    InsightJobFailed = 'FAILED',
    InsightJobSucceeded = 'SUCCEEDED',
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiAllResource {
    attributes?: Record<string, string>
    /** Kaytu Connection Id of the resource */
    connectionID?: string
    /** Resource Provider */
    connector?: SourceType
    /** The Region of the resource */
    location?: string
    /** Provider Connection Id */
    providerConnectionID?: string
    /** Provider Connection Name */
    providerConnectionName?: string
    /** Resource Id */
    resourceID?: string
    /** Resource Name */
    resourceName?: string
    /** Resource Type */
    resourceType?: string
    /** Resource Type Label */
    resourceTypeLabel?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiConnectionFull {
    id?: string
    name?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiCostMetric {
    /** @example "azure" */
    connector?: SourceType
    cost_dimension_name?: string
    daily_cost_at_end_time?: number
    daily_cost_at_start_time?: number
    total_cost?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint {
    count?: number
    date?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiCountPair {
    count?: number
    old_count?: number
}

export enum GithubComKaytuIoKaytuEnginePkgInventoryApiDirectionType {
    DirectionAscending = 'asc',
    DirectionDescending = 'desc',
}

/** if you provide two values for same filter OR operation would be used if you provide value for two filters AND operation would be used */
export interface GithubComKaytuIoKaytuEnginePkgInventoryApiFilters {
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    connectionID?: string[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    connectors?: SourceType[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    location?: string[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    resourceType?: string[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    service?: string[]
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersRequest {
    /** search filters */
    filters: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceFilters
    /** search query */
    query?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersResponse {
    /** search filters */
    filters?: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceFiltersResponse
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourceRequest {
    /** Resource ID */
    ID: string
    /** Resource ID */
    resourceType: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesRequest {
    /** search filters */
    filters: GithubComKaytuIoKaytuEnginePkgInventoryApiFilters
    page: GithubComKaytuIoKaytuEnginePkgInventoryApiPage
    /** search query */
    query?: string
    /** NOTE: we don't support multi-field sort for now, if sort is empty, results would be sorted by first column */
    sorts?: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceSortItem[]
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesResponse {
    /** A list of AWS resources with details */
    resources?: GithubComKaytuIoKaytuEnginePkgInventoryApiAllResource[]
    /** Number of returned resources */
    totalCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse {
    /** @example 100 */
    others?: number
    top_values?: Record<string, number>
    /** @example 1000 */
    total_cost_value?: number
    /** @example 10 */
    total_count?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse {
    metrics?: GithubComKaytuIoKaytuEnginePkgInventoryApiCostMetric[]
    /** @example 1000 */
    total_cost?: number
    /** @example 10 */
    total_count?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListQueryRequest {
    /** Labels */
    labels?: string[]
    /** Specifies the Provider */
    providerFilter?: SourceType
    /** Specifies the Title */
    titleFilter?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListRegionsResourceCountCompositionResponse {
    others?: GithubComKaytuIoKaytuEnginePkgInventoryApiCountPair
    top_values?: Record<
        string,
        GithubComKaytuIoKaytuEnginePkgInventoryApiCountPair
    >
    total_count?: number
    total_value_count?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse {
    others?: GithubComKaytuIoKaytuEnginePkgInventoryApiCountPair
    top_values?: Record<
        string,
        GithubComKaytuIoKaytuEnginePkgInventoryApiCountPair
    >
    total_count?: number
    total_value_count?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetadataResponse {
    resource_types?: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType[]
    /** @example 100 */
    total_resource_type_count?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetricsResponse {
    resource_types?: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType[]
    total_count?: number
    total_old_count?: number
    total_resource_types?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetadataResponse {
    services?: GithubComKaytuIoKaytuEnginePkgInventoryApiService[]
    /** @example 100 */
    total_service_count?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetricsResponse {
    services?: GithubComKaytuIoKaytuEnginePkgInventoryApiService[]
    /** @example 10000 */
    total_count?: number
    /** @example 9000 */
    total_old_count?: number
    /** @example 50 */
    total_services?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceSummariesResponse {
    /** A list of service summeries */
    services?: GithubComKaytuIoKaytuEnginePkgInventoryApiServiceSummary[]
    /**
     * Number of services
     * @example 20
     */
    totalCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiLocationByProviderResponse {
    /** Name of the region */
    name?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiLocationResponse {
    /** Region */
    location?: string
    /**
     * Number of resources in the region
     * @example 100
     */
    resourceCount?: number
    /** @example 50 */
    resourceOldCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiPage {
    no?: number
    size?: number
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiRegionsResourceCountResponse {
    regions?: GithubComKaytuIoKaytuEnginePkgInventoryApiLocationResponse[]
    totalCount?: number
}

/** if you provide two values for same filter OR operation would be used if you provide value for two filters AND operation would be used */
export interface GithubComKaytuIoKaytuEnginePkgInventoryApiResourceFilters {
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    category?: string[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    connections?: string[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    location?: string[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    provider?: string[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    resourceType?: string[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    service?: string[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    tagKeys?: string[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    tagValues?: Record<string, string[]>
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiResourceFiltersResponse {
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    category?: Record<string, string>
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    connections?: GithubComKaytuIoKaytuEnginePkgInventoryApiConnectionFull[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    location?: string[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    provider?: string[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    resourceType?: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeFull[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    service?: Record<string, string>
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    tagKeys?: string[]
    /** if you dont need to use this filter, leave them empty. (e.g. []) */
    tagValues?: Record<string, string[]>
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiResourceSortItem {
    direction?: 'asc' | 'desc'
    field?:
        | 'resourceID'
        | 'connector'
        | 'resourceType'
        | 'resourceGroup'
        | 'location'
        | 'connectionID'
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType {
    /** List supported steampipe Attributes (columns) for this resource type - Metadata (GET only) */
    attributes?: string[]
    /** List of Compliance that support this Resource Type - Metadata (GET only) */
    compliance?: string[]
    /** Number of Compliance that use this Resource Type - Metadata */
    compliance_count?: number
    /**
     * Cloud Provider
     * @example "Azure"
     */
    connector?: SourceType
    /**
     * Number of Resources of this Resource Type - Metric
     * @example 100
     */
    count?: number
    /** List of Insights that support this Resource Type - Metadata (GET only) */
    insights?: number[]
    /** Number of Insights that use this Resource Type - Metadata */
    insights_count?: number
    /** Logo URI */
    logo_uri?: string
    /**
     * Number of Resources of this Resource Type in the past - Metric
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
    /** Tags */
    tags?: Record<string, string[]>
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeFull {
    resource_type_arn?: string
    resource_type_name?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint {
    count?: number
    date?: string
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryRequest {
    page: GithubComKaytuIoKaytuEnginePkgInventoryApiPage
    /** NOTE: we don't support multi-field sort for now, if sort is empty, results would be sorted by first column */
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

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiService {
    /** @example "Azure" */
    connector?: SourceType
    logo_uri?: string
    /** @example 90 */
    old_resource_count?: number
    /** @example 100 */
    resource_count?: number
    resource_types?: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType[]
    /** @example "Compute" */
    service_label?: string
    /** @example "compute" */
    service_name?: string
    tags?: Record<string, string[]>
}

export interface GithubComKaytuIoKaytuEnginePkgInventoryApiServiceSummary {
    /**
     * Cloud provider
     * @example "Azure"
     */
    connector?: SourceType
    /**
     * Number of Resources
     * @example 100
     */
    resourceCount?: number
    /**
     * Service Label
     * @example "Compute"
     */
    serviceLabel?: string
    /**
     * Service Name
     * @example "compute"
     */
    serviceName?: string
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

export enum GithubComKaytuIoKaytuEnginePkgInventoryApiSortFieldType {
    SortFieldResourceID = 'resourceID',
    SortFieldConnector = 'connector',
    SortFieldResourceType = 'resourceType',
    SortFieldResourceGroup = 'resourceGroup',
    SortFieldLocation = 'location',
    SortFieldConnectionID = 'connectionID',
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
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiAWSCredential {
    accessKey?: string
    secretKey?: string
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiAWSCredentialConfig {
    accessKey: string
    accountId?: string
    assumeRoleName?: string
    externalId?: string
    regions?: string[]
    secretKey: string
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiAzureCredential {
    clientID?: string
    clientSecret?: string
    tenantID?: string
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
    /** @example 20 */
    connectionsEnabled?: number
    /** @example 15 */
    healthyConnections?: number
    /** @example 20 */
    totalConnections?: number
    /** @example 5 */
    unhealthyConnections?: number
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiChangeConnectionLifecycleStateRequest {
    state?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiConnection {
    /** @example "scheduled" */
    assetDiscoveryMethod?: SourceAssetDiscoveryMethodType
    /** @example "Azure" */
    connector?: SourceType
    /** @example 1000 */
    cost?: number
    /** @example "7r6123ac-ca1c-434f-b1a3-91w2w9d277c8" */
    credentialID?: string
    credentialName?: string
    /** @example 1000 */
    dailyCostAtEndTime?: number
    /** @example 1000 */
    dailyCostAtStartTime?: number
    /** @example "This is an example connection" */
    description?: string
    /** @example "johndoe@example.com" */
    email?: string
    healthReason?: string
    /** @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8" */
    id?: string
    /** @example "2023-05-07T00:00:00Z" */
    lastHealthCheckTime?: string
    /** @example "2023-05-07T00:00:00Z" */
    lastInventory?: string
    /** @example "enabled" */
    lifecycleState?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState
    metadata?: Record<string, any>
    /** @example 100 */
    oldResourceCount?: number
    /** @example "2023-05-07T00:00:00Z" */
    onboardDate?: string
    /** @example "8e0f8e7a-1b1c-4e6f-b7e4-9c6af9d2b1c8" */
    providerConnectionID?: string
    /** @example "example-connection" */
    providerConnectionName?: string
    /** @example 100 */
    resourceCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionCountRequest {
    connectors?: string[]
    state?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState
}

export enum GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState {
    ConnectionLifecycleStateNotOnboard = 'NOT_ONBOARD',
    ConnectionLifecycleStateInProgress = 'IN_PROGRESS',
    ConnectionLifecycleStateOnboard = 'ONBOARD',
    ConnectionLifecycleStateUnhealthy = 'UNHEALTHY',
    ConnectionLifecycleStateArchived = 'ARCHIVED',
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiConnector {
    allowNewConnections?: boolean
    autoOnboardSupport?: boolean
    description?: string
    direction?: SourceConnectorDirectionType
    /** @example "Azure" */
    label?: string
    logo?: string
    maxConnectionLimit?: number
    /** @example "Azure" */
    name?: SourceType
    shortDescription?: string
    status?: SourceConnectorStatus
    tags?: Record<string, any>
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiConnectorCount {
    allowNewConnections?: boolean
    autoOnboardSupport?: boolean
    connection_count?: number
    description?: string
    direction?: SourceConnectorDirectionType
    /** @example "Azure" */
    label?: string
    logo?: string
    maxConnectionLimit?: number
    /** @example "Azure" */
    name?: SourceType
    shortDescription?: string
    status?: SourceConnectorStatus
    tags?: Record<string, any>
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialRequest {
    config?: any
    name?: string
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
    config?: any
    connections?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    connectorType?: SourceType
    credentialType?: SourceCredentialType
    enabled?: boolean
    enabled_connections?: number
    healthReason?: string
    healthStatus?: SourceHealthStatus
    id?: string
    lastHealthCheckTime?: string
    metadata?: Record<string, any>
    name?: string
    onboardDate?: string
    total_connections?: number
    unhealthy_connections?: number
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse {
    /** @example 10 */
    connectionCount?: number
    connections?: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    /** @example 10 */
    oldConnectionCount?: number
    /** @example 1000 */
    totalCost?: number
    /** @example 10 */
    totalDisabledCount?: number
    /** @example 100 */
    totalOldResourceCount?: number
    /** @example 100 */
    totalResourceCount?: number
    /** @example 10 */
    totalUnhealthyCount?: number
}

export interface GithubComKaytuIoKaytuEnginePkgOnboardApiListCredentialResponse {
    credentials?: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
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

export enum GithubComKaytuIoKaytuEnginePkgSummarizerApiSummarizerJobStatus {
    SummarizerJobInProgress = 'IN_PROGRESS',
    SummarizerJobFailed = 'FAILED',
    SummarizerJobSucceeded = 'SUCCEEDED',
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

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiOrganizationResponse {
    addressLine1?: string
    addressLine2?: string
    addressLine3?: string
    city?: string
    companyName?: string
    contactEmail?: string
    contactPerson?: string
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
    description?: string
    id?: string
    name?: string
    organization_id?: number
    owner_id?: string
    status?: string
    tier?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiTier
    uri?: string
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimits {
    maxConnections?: number
    maxResources?: number
    maxUsers?: number
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimitsUsage {
    currentConnections?: number
    currentResources?: number
    currentUsers?: number
    id?: string
    maxConnections?: number
    maxResources?: number
    maxUsers?: number
    name?: string
}

export interface GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse {
    createdAt?: string
    description?: string
    id?: string
    name?: string
    organization?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiOrganizationResponse
    ownerId?: string
    status?: string
    tier?: string
    uri?: string
    version?: string
}

export interface GormDeletedAt {
    time?: string
    /** Valid is true if Time is not NULL */
    valid?: boolean
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

export enum SourceCredentialType {
    CredentialTypeAutoGenerated = 'auto-generated',
    CredentialTypeManual = 'manual',
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

export enum SummarizerJobType {
    JobTypeResourceSummarizer = 'resourceSummarizer',
    JobTypeResourceMustSummarizer = 'resourceMustSummarizer',
    JobTypeComplianceSummarizer = 'complianceSummarizer',
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
            baseURL: axiosConfig.baseURL || 'https://dev-cluster.keibi.io',
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
 * @title Keibi Service API
 * @version 1.0
 * @baseUrl https://dev-cluster.keibi.io
 * @contact
 */
export class Api<
    SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {
    auth = {
        /**
         * @description Retrieves the details of a workspace key with specified ID.
         *
         * @tags keys
         * @name ApiV1KeyDetail
         * @summary Get Workspace Key Details
         * @request GET:/auth/api/v1/key/{id}
         * @secure
         */
        apiV1KeyDetail: (id: string, params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey,
                any
            >({
                path: `/auth/api/v1/key/${id}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Activates Workspace Key by ID
         *
         * @tags keys
         * @name ApiV1KeyActivateCreate
         * @summary Activate Workspace Key
         * @request POST:/auth/api/v1/key/{id}/activate
         * @secure
         */
        apiV1KeyActivateCreate: (id: string, params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey,
                any
            >({
                path: `/auth/api/v1/key/${id}/activate`,
                method: 'POST',
                secure: true,
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
         * @description Suspends Workspace Key by ID
         *
         * @tags keys
         * @name ApiV1KeySuspendCreate
         * @summary Suspend Workspace Key
         * @request POST:/auth/api/v1/key/{id}/suspend
         * @secure
         */
        apiV1KeySuspendCreate: (id: string, params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey,
                any
            >({
                path: `/auth/api/v1/key/${id}/suspend`,
                method: 'POST',
                secure: true,
                format: 'json',
                ...params,
            }),

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
         * @description Updates the role of the specified key in workspace.
         *
         * @tags keys
         * @name ApiV1KeyRoleCreate
         * @summary Update Workspace Key Role
         * @request POST:/auth/api/v1/key/role
         * @secure
         */
        apiV1KeyRoleCreate: (
            request: GithubComKaytuIoKaytuEnginePkgAuthApiUpdateKeyRoleRequest,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey,
                any
            >({
                path: `/auth/api/v1/key/role`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
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
         * @description List Workspace Keys for Specified Role.
         *
         * @tags roles
         * @name ApiV1RoleKeysDetail
         * @summary List Role Keys
         * @request GET:/auth/api/v1/role/{roleName}/keys
         * @secure
         */
        apiV1RoleKeysDetail: (roleName: string, params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey[],
                any
            >({
                path: `/auth/api/v1/role/${roleName}/keys`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returns a list of users in the workspace with the specified role.
         *
         * @tags roles
         * @name ApiV1RoleUsersDetail
         * @summary Lists Role Users
         * @request GET:/auth/api/v1/role/{roleName}/users
         * @secure
         */
        apiV1RoleUsersDetail: (roleName: string, params: RequestParams = {}) =>
            this.request<GithubComKaytuIoKaytuEnginePkgAuthApiRoleUser[], any>({
                path: `/auth/api/v1/role/${roleName}/users`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieve Role Information and User Count for Workspace.
         *
         * @tags roles
         * @name ApiV1RolesList
         * @summary List Roles
         * @request GET:/auth/api/v1/roles
         * @secure
         */
        apiV1RolesList: (params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiRolesListResponse[],
                any
            >({
                path: `/auth/api/v1/roles`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieves Role Details, Description, User Count, and User List for Workspace.
         *
         * @tags roles
         * @name ApiV1RolesDetail
         * @summary Get Role Details
         * @request GET:/auth/api/v1/roles/{roleName}
         * @secure
         */
        apiV1RolesDetail: (roleName: string, params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiRoleDetailsResponse,
                any
            >({
                path: `/auth/api/v1/roles/${roleName}`,
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
         * @description Returns a list of workspaces that the specified user belongs to, along with their role in each workspace.
         *
         * @tags users
         * @name ApiV1UserWorkspaceMembershipDetail
         * @summary User Workspaces
         * @request GET:/auth/api/v1/user/{userId}/workspace/membership
         * @secure
         */
        apiV1UserWorkspaceMembershipDetail: (
            userId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgAuthApiMembership[],
                any
            >({
                path: `/auth/api/v1/user/${userId}/workspace/membership`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Revokes user's access to the workspace.
         *
         * @tags users
         * @name ApiV1UserInviteDelete
         * @summary Revoke Invitation
         * @request DELETE:/auth/api/v1/user/invite
         * @secure
         */
        apiV1UserInviteDelete: (
            query: {
                /** User ID */
                userId: string
            },
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/auth/api/v1/user/invite`,
                method: 'DELETE',
                query: query,
                secure: true,
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
         * @description Get all the RoleBindings of the workspace. RoleBinding defines the roles and actions a user can perform. There are currently three roles (admin, editor, viewer). The workspace path is based on the DNS such as (workspace1.app.keibi.io)
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
         * @description Returns top field by alarm count with respect to filters
         *
         * @tags compliance
         * @name ApiV1AlarmsTopCreate
         * @summary Top field by alarm count
         * @request POST:/compliance/api/v1/alarms/top
         * @secure
         */
        apiV1AlarmsTopCreate: (
            request: GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldRequest,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse,
                any
            >({
                path: `/compliance/api/v1/alarms/top`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returns all assignments
         *
         * @tags benchmarks_assignment
         * @name ApiV1AssignmentsList
         * @summary Get all assignments
         * @request GET:/compliance/api/v1/assignments
         * @secure
         */
        apiV1AssignmentsList: (params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment[],
                any
            >({
                path: `/compliance/api/v1/assignments`,
                method: 'GET',
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
         * @summary Delete benchmark assignment for inventory service
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
         * @description Returns benchmark assignment which insert
         *
         * @tags benchmarks_assignment
         * @name ApiV1AssignmentsConnectionCreate
         * @summary Create benchmark assignment for inventory service
         * @request POST:/compliance/api/v1/assignments/{benchmark_id}/connection/{connection_id}
         * @secure
         */
        apiV1AssignmentsConnectionCreate: (
            benchmarkId: string,
            connectionId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment,
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
         * @description Returns all benchmark assigned sources with benchmark id
         *
         * @tags benchmarks_assignment
         * @name ApiV1AssignmentsBenchmarkDetail
         * @summary Get all benchmark assigned sources with benchmark id
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
         * @description Returns all benchmark assignments with source id
         *
         * @tags benchmarks_assignment
         * @name ApiV1AssignmentsConnectionDetail
         * @summary Get all benchmark assignments with source id
         * @request GET:/compliance/api/v1/assignments/connection/{connection_id}
         * @secure
         */
        apiV1AssignmentsConnectionDetail: (
            connectionId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment[],
                any
            >({
                path: `/compliance/api/v1/assignments/connection/${connectionId}`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API returns a comprehensive list of all available benchmarks. Users can use this API to obtain an overview of the entire set of benchmarks and their corresponding details, such as their names, descriptions, and IDs.
         *
         * @tags compliance
         * @name ApiV1BenchmarksList
         * @summary List benchmarks
         * @request GET:/compliance/api/v1/benchmarks
         * @secure
         */
        apiV1BenchmarksList: (params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmark[],
                any
            >({
                path: `/compliance/api/v1/benchmarks`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API enables users to retrieve benchmark details by specifying the benchmark ID. Users can use this API to obtain specific details about a particular benchmark, such as its name, description, and other relevant information.
         *
         * @tags compliance
         * @name ApiV1BenchmarksDetail
         * @summary Get benchmark
         * @request GET:/compliance/api/v1/benchmarks/{benchmark_id}
         * @secure
         */
        apiV1BenchmarksDetail: (
            benchmarkId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmark,
                any
            >({
                path: `/compliance/api/v1/benchmarks/${benchmarkId}`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API returns a list of all policies associated with a specific benchmark. Users can use this API to obtain a comprehensive overview of the policies related to a particular benchmark and their corresponding details, such as their names, descriptions, and IDs.
         *
         * @tags compliance
         * @name ApiV1BenchmarksPoliciesDetail
         * @summary List Benchmark Policies
         * @request GET:/compliance/api/v1/benchmarks/{benchmark_id}/policies
         * @secure
         */
        apiV1BenchmarksPoliciesDetail: (
            benchmarkId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiPolicy[],
                any
            >({
                path: `/compliance/api/v1/benchmarks/${benchmarkId}/policies`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API enables users to retrieve a summary of a benchmark and its associated checks and results. Users can use this API to obtain an overview of the benchmark, including its name, description, and other relevant information, as well as the checks and their corresponding results.
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
         * @description This API allows users to retrieve datapoints of compliance severities over a specified time period, enabling users to keep track of and monitor changes in compliance.
         *
         * @tags compliance
         * @name ApiV1BenchmarksSummaryResultTrendDetail
         * @summary Get compliance result trend
         * @request GET:/compliance/api/v1/benchmarks/{benchmark_id}/summary/result/trend
         * @secure
         */
        apiV1BenchmarksSummaryResultTrendDetail: (
            benchmarkId: string,
            query: {
                /** Start time */
                start: number
                /** End time */
                end: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkResultTrend,
                any
            >({
                path: `/compliance/api/v1/benchmarks/${benchmarkId}/summary/result/trend`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API retrieves the benchmark tree, including all of its child benchmarks. Users can use this API to obtain a comprehensive overview of the benchmarks within a particular category or hierarchy.
         *
         * @tags compliance
         * @name ApiV1BenchmarksTreeDetail
         * @summary Get benchmark tree
         * @request GET:/compliance/api/v1/benchmarks/{benchmark_id}/tree
         * @secure
         */
        apiV1BenchmarksTreeDetail: (
            benchmarkId: string,
            query: {
                /** Status */
                status: ('passed' | 'failed' | 'unknown')[]
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTree,
                any
            >({
                path: `/compliance/api/v1/benchmarks/${benchmarkId}/tree`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API enables users to retrieve policy details by specifying the policy ID. Users can use this API to obtain specific details about a particular policy, such as its title, description, and other relevant information.
         *
         * @tags compliance
         * @name ApiV1BenchmarksPoliciesDetail2
         * @summary Get policy
         * @request GET:/compliance/api/v1/benchmarks/policies/{policy_id}
         * @originalName apiV1BenchmarksPoliciesDetail
         * @duplicate
         * @secure
         */
        apiV1BenchmarksPoliciesDetail2: (
            policyId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiPolicy,
                any
            >({
                path: `/compliance/api/v1/benchmarks/policies/${policyId}`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API enables users to retrieve a summary of all benchmarks and their associated checks and results within a specified time interval. Users can use this API to obtain an overview of all benchmarks, including their names, descriptions, and other relevant information, as well as the checks and their corresponding results within the specified time period.
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
         * @description This API enables users to retrieve all compliance run findings with respect to filters. Users can use this API to obtain a list of all compliance run findings that match specific filters, such as compliance run ID, resource ID, results, and other relevant parameters.
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
         * @description This API enables users to retrieve the top field by finding count.
         *
         * @tags compliance
         * @name ApiV1FindingsTopDetail
         * @summary Get top field by finding count
         * @request GET:/compliance/api/v1/findings/{benchmarkId}/{field}/top/{count}
         * @secure
         */
        apiV1FindingsTopDetail: (
            benchmarkId: string,
            field: 'resourceType' | 'serviceName' | 'sourceID' | 'resourceID',
            count: number,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse,
                any
            >({
                path: `/compliance/api/v1/findings/${benchmarkId}/${field}/top/${count}`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API enables users to retrieve findings metrics for two given times, which includes the total number of findings, the number of passed findings, the number of failed findings, and the number of unknowns findings. Users can use this API to compare the compliance status of their resources between two different time periods. The API will return the findings metrics for each time period separately, allowing users to easily compare the compliance status of their resources at each time period. This can be useful for monitoring the effectiveness of compliance measures over time and identifying any areas of improvement."
         *
         * @tags compliance
         * @name ApiV1FindingsMetricsList
         * @summary Returns findings metrics
         * @request GET:/compliance/api/v1/findings/metrics
         * @secure
         */
        apiV1FindingsMetricsList: (
            query?: {
                /** unix seconds for the start time */
                start?: number
                /** unix seconds for the end time */
                end?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsMetricsResponse,
                any
            >({
                path: `/compliance/api/v1/findings/metrics`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API returns a list of insights based on specified filters. The API provides details of insights, including results during the specified time period for the specified connection. Returns "all:provider" job results if connectionId is not defined.
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
         * @description This API returns the specified insight with ID. The API provides details of the insight, including results during the specified time period for the specified connection. Returns "all:provider" job results if connectionId is not defined.
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
         * @description This API allows users to retrieve insight results datapoints for a specified connection during a specified time period. Returns "all:provider" job results if connectionId is not defined.
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
         * @description This API returns a list of insight groups based on specified filters. The API provides details of insights, including results during the specified time period for the specified connection. Returns "all:provider" job results if connectionId is not defined.
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
         * @description This API returns the specified insight group with ID. The API provides details of the insight, including results during the specified time period for the specified connection. Returns "all:provider" job results if connectionId is not defined.
         *
         * @tags insights
         * @name ApiV1InsightGroupDetail
         * @summary Get insight group
         * @request GET:/compliance/api/v1/insight/group/{insightGroupId}
         * @secure
         */
        apiV1InsightGroupDetail: (
            insightGroupId: string,
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
                GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup,
                any
            >({
                path: `/compliance/api/v1/insight/group/${insightGroupId}`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve insight group results datapoints for a specified connection during a specified time period. Returns "all:provider" job results if connectionId is not defined.
         *
         * @tags insights
         * @name ApiV1InsightGroupTrendDetail
         * @summary Get insight group trend
         * @request GET:/compliance/api/v1/insight/group/{insightGroupId}/trend
         * @secure
         */
        apiV1InsightGroupTrendDetail: (
            insightGroupId: string,
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
                GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroupTrendResponse,
                any
            >({
                path: `/compliance/api/v1/insight/group/${insightGroupId}/trend`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieves all insights metadata.
         *
         * @tags insights
         * @name ApiV1MetadataInsightList
         * @summary List insights metadata
         * @request GET:/compliance/api/v1/metadata/insight
         * @secure
         */
        apiV1MetadataInsightList: (
            query?: {
                /** filter by connector */
                connector?: ('' | 'AWS' | 'Azure')[]
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiInsight[],
                any
            >({
                path: `/compliance/api/v1/metadata/insight`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Get insight metadata by id
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
         * @description This API allows users to retrieve a list of insights tag keys with their possible values.
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
         * @description This API allows users to retrieve an insights tag key with the possible values for it.
         *
         * @tags insights
         * @name ApiV1MetadataTagInsightDetail
         * @summary Get insights tag key
         * @request GET:/compliance/api/v1/metadata/tag/insight/{key}
         * @secure
         */
        apiV1MetadataTagInsightDetail: (
            key: string,
            params: RequestParams = {}
        ) =>
            this.request<string[], any>({
                path: `/compliance/api/v1/metadata/tag/insight/${key}`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API enables users to retrieve query details by specifying the query ID.
         *
         * @tags compliance
         * @name ApiV1QueriesDetail
         * @summary Get query
         * @request GET:/compliance/api/v1/queries/{query_id}
         * @secure
         */
        apiV1QueriesDetail: (queryId: string, params: RequestParams = {}) =>
            this.request<GithubComKaytuIoKaytuEnginePkgComplianceApiQuery, any>(
                {
                    path: `/compliance/api/v1/queries/${queryId}`,
                    method: 'GET',
                    secure: true,
                    type: ContentType.Json,
                    format: 'json',
                    ...params,
                }
            ),

        /**
         * @description This API syncs queries with the git backend.
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
         * @description Getting locations by provider
         *
         * @tags location
         * @name ApiV1LocationsDetail
         * @summary Get locations
         * @request GET:/inventory/api/v1/locations/{connector}
         * @secure
         */
        apiV1LocationsDetail: (connector: string, params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiLocationByProviderResponse[],
                any
            >({
                path: `/inventory/api/v1/locations/${connector}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Listing smart queries by specified filters
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
                format: 'json',
                ...params,
            }),

        /**
         * @description Run a specific smart query. In order to get the results in CSV format, Accepts header must be filled with `text/csv` value. Note that csv output doesn't process pagination and returns first 5000 records.
         *
         * @tags smart_query
         * @name ApiV1QueryCreate
         * @summary Run a specific smart query
         * @request POST:/inventory/api/v1/query/{queryId}
         * @secure
         */
        apiV1QueryCreate: (
            queryId: string,
            request: GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryRequest,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryResponse,
                any
            >({
                path: `/inventory/api/v1/query/${queryId}`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Counting smart queries
         *
         * @tags smart_query
         * @name ApiV1QueryCountList
         * @summary Count smart queries
         * @request GET:/inventory/api/v1/query/count
         * @secure
         */
        apiV1QueryCountList: (
            request: GithubComKaytuIoKaytuEnginePkgInventoryApiListQueryRequest,
            params: RequestParams = {}
        ) =>
            this.request<number, any>({
                path: `/inventory/api/v1/query/count`,
                method: 'GET',
                body: request,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Getting resource details by id and resource type
         *
         * @tags resource
         * @name ApiV1ResourceCreate
         * @summary Get details of a Resource
         * @request POST:/inventory/api/v1/resource
         * @secure
         */
        apiV1ResourceCreate: (
            request: GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourceRequest,
            params: RequestParams = {}
        ) =>
            this.request<Record<string, string>, any>({
                path: `/inventory/api/v1/resource`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Getting all cloud providers resources by filters
         *
         * @tags resource
         * @name ApiV1ResourcesCreate
         * @summary Get resources
         * @request POST:/inventory/api/v1/resources
         * @secure
         */
        apiV1ResourcesCreate: (
            request: GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesRequest,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesResponse,
                any
            >({
                path: `/inventory/api/v1/resources`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Getting resource filters by filters.
         *
         * @tags resource
         * @name ApiV1ResourcesFiltersCreate
         * @summary Get resource filters
         * @request POST:/inventory/api/v1/resources/filters
         * @secure
         */
        apiV1ResourcesFiltersCreate: (
            request: GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersRequest,
            query?: {
                /** Common filter */
                common?: 'true' | 'false' | 'all'
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersResponse,
                any
            >({
                path: `/inventory/api/v1/resources/filters`,
                method: 'POST',
                query: query,
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags resource
         * @name ApiV1ResourcesRegionsList
         * @summary Returns top n regions of specified provider by resource count
         * @request GET:/inventory/api/v1/resources/regions
         * @secure
         */
        apiV1ResourcesRegionsList: (
            query?: {
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** timestamp for resource count per location in epoch seconds */
                endTime?: string
                /** timestamp for resource count per location change comparison in epoch seconds */
                startTime?: string
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
                path: `/inventory/api/v1/resources/regions`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags resource
         * @name ApiV1ResourcesTopRegionsList
         * @summary Returns top n regions of specified provider by resource count
         * @request GET:/inventory/api/v1/resources/top/regions
         * @secure
         */
        apiV1ResourcesTopRegionsList: (
            query: {
                /** count */
                count: number
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by */
                connectionId?: string[]
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiLocationResponse[],
                any
            >({
                path: `/inventory/api/v1/resources/top/regions`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve the cost composition with respect to specified filters. The API returns information such as the total cost for the given time range, and the top services by cost.
         *
         * @tags inventory
         * @name ApiV2CostCompositionList
         * @summary List cost composition
         * @request GET:/inventory/api/v2/cost/composition
         * @secure
         */
        apiV2CostCompositionList: (
            query?: {
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** How many top values to return default is 5 */
                top?: number
                /** timestamp for start in epoch seconds */
                startTime?: string
                /** timestamp for end in epoch seconds */
                endTime?: string
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse,
                any
            >({
                path: `/inventory/api/v2/cost/composition`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve cost metrics with respect to specified filters. The API returns information such as the total cost and costs per each service based on the specified filters.
         *
         * @tags inventory
         * @name ApiV2CostMetricList
         * @summary List cost metrics
         * @request GET:/inventory/api/v2/cost/metric
         * @secure
         */
        apiV2CostMetricList: (
            query?: {
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** timestamp for start in epoch seconds */
                startTime?: string
                /** timestamp for end in epoch seconds */
                endTime?: string
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
                path: `/inventory/api/v2/cost/metric`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve a list of costs over the course of the specified time frame based on the given input filters. If startTime and endTime are empty, the API returns the last month trend.
         *
         * @tags inventory
         * @name ApiV2CostTrendList
         * @summary Get Cost Trend
         * @request GET:/inventory/api/v2/cost/trend
         * @secure
         */
        apiV2CostTrendList: (
            query?: {
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** timestamp for start in epoch seconds */
                startTime?: string
                /** timestamp for end in epoch seconds */
                endTime?: string
                /** maximum number of datapoints to return, default is 30 */
                datapointCount?: string
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint[],
                any
            >({
                path: `/inventory/api/v2/cost/trend`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Gets a list of all resource types in workspace and their metadata including service name. The results could be filtered by provider name and service name.
         *
         * @tags metadata
         * @name ApiV2MetadataResourcetypeList
         * @summary Get List of Resource Types
         * @request GET:/inventory/api/v2/metadata/resourcetype
         * @secure
         */
        apiV2MetadataResourcetypeList: (
            query: {
                /** Filter by Connector */
                connector: ('' | 'AWS' | 'Azure')[]
                /** Filter by service name */
                service?: string[]
                /** Key-Value tags in key=value format to filter by */
                tag?: string[]
                /** page size - default is 20 */
                pageSize?: number
                /** page number - default is 1 */
                pageNumber?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetadataResponse,
                any
            >({
                path: `/inventory/api/v2/metadata/resourcetype`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Get a single resource type metadata and its details including service name and insights list. Specified by resource type name.
         *
         * @tags metadata
         * @name ApiV2MetadataResourcetypeDetail
         * @summary Get Resource Type
         * @request GET:/inventory/api/v2/metadata/resourcetype/{resourceType}
         * @secure
         */
        apiV2MetadataResourcetypeDetail: (
            resourceType: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType,
                any
            >({
                path: `/inventory/api/v2/metadata/resourcetype/${resourceType}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Gets a list of all workspace cloud services and their metadata, and list of resource types. The results could be filtered by tags.
         *
         * @tags metadata
         * @name ApiV2MetadataServicesList
         * @summary Get List of Cloud Services
         * @request GET:/inventory/api/v2/metadata/services
         * @secure
         */
        apiV2MetadataServicesList: (
            query?: {
                /** Connector */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Key-Value tags in key=value format to filter by */
                tag?: string[]
                /** page size - default is 20 */
                pageSize?: number
                /** page number - default is 1 */
                pageNumber?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetadataResponse,
                any
            >({
                path: `/inventory/api/v2/metadata/services`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Gets a single cloud service details and its metadata and list of resource types.
         *
         * @tags metadata
         * @name ApiV2MetadataServicesDetail
         * @summary Get Cloud Service Details
         * @request GET:/inventory/api/v2/metadata/services/{serviceName}
         * @secure
         */
        apiV2MetadataServicesDetail: (
            serviceName: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiService,
                any
            >({
                path: `/inventory/api/v2/metadata/services/${serviceName}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve tag values with the most resources for the given key.
         *
         * @tags inventory
         * @name ApiV2ResourcesCompositionDetail
         * @summary List resource type composition
         * @request GET:/inventory/api/v2/resources/composition/{key}
         * @secure
         */
        apiV2ResourcesCompositionDetail: (
            key: string,
            query: {
                /** How many top values to return default is 5 */
                top: number
                /** Connector types to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** timestamp for resource count in epoch seconds */
                endTime?: string
                /** timestamp for resource count change comparison in epoch seconds */
                startTime?: string
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse,
                any
            >({
                path: `/inventory/api/v2/resources/composition/${key}`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Number of all resources
         *
         * @tags resource
         * @name ApiV2ResourcesCountList
         * @summary Count resources
         * @request GET:/inventory/api/v2/resources/count
         * @deprecated
         * @secure
         */
        apiV2ResourcesCountList: (params: RequestParams = {}) =>
            this.request<number, any>({
                path: `/inventory/api/v2/resources/count`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve a list of resource types with metrics of each type based on the given input filters.
         *
         * @tags inventory
         * @name ApiV2ResourcesMetricList
         * @summary List resource metrics
         * @request GET:/inventory/api/v2/resources/metric
         * @secure
         */
        apiV2ResourcesMetricList: (
            query?: {
                /** Key-Value tags in key=value format to filter by */
                tag?: string[]
                /** Service names to filter by */
                servicename?: string[]
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** ResourceType */
                resourceType?: string[]
                /** timestamp for resource count in epoch seconds */
                endTime?: string
                /** timestamp for resource count change comparison in epoch seconds */
                startTime?: string
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
                GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetricsResponse,
                any
            >({
                path: `/inventory/api/v2/resources/metric`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve metrics for a specific resource type.
         *
         * @tags inventory
         * @name ApiV2ResourcesMetricDetail
         * @summary Get resource metrics
         * @request GET:/inventory/api/v2/resources/metric/{resourceType}
         * @secure
         */
        apiV2ResourcesMetricDetail: (
            resourceType: string,
            query?: {
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** timestamp for resource count in epoch seconds */
                endTime?: string
                /** timestamp for resource count change comparison in epoch seconds */
                startTime?: string
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

        /**
         * @description Returns list of top regions per given connector type and connection IDs
         *
         * @tags resource
         * @name ApiV2ResourcesRegionsCompositionList
         * @summary List resources regions composition
         * @request GET:/inventory/api/v2/resources/regions/composition
         * @secure
         */
        apiV2ResourcesRegionsCompositionList: (
            query: {
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** How many top values to return default is 5 */
                top: number
                /** start time in unix seconds - default is now */
                startTime?: number
                /** end time in unix seconds - default is one week ago */
                endTime?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiListRegionsResourceCountCompositionResponse,
                any
            >({
                path: `/inventory/api/v2/resources/regions/composition`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returns list of regions resources summary
         *
         * @tags resource
         * @name ApiV2ResourcesRegionsSummaryList
         * @summary List Regions Summary
         * @request GET:/inventory/api/v2/resources/regions/summary
         * @secure
         */
        apiV2ResourcesRegionsSummaryList: (
            query?: {
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by */
                connectionId?: string[]
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
                path: `/inventory/api/v2/resources/regions/summary`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returns list of regions resources summary
         *
         * @tags resource
         * @name ApiV2ResourcesRegionsTrendList
         * @summary Returns trend of resources count in given regions
         * @request GET:/inventory/api/v2/resources/regions/trend
         * @secure
         */
        apiV2ResourcesRegionsTrendList: (
            query?: {
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** start time in unix seconds - default is now */
                startTime?: number
                /** end time in unix seconds - default is one week ago */
                endTime?: number
                /** Regions to filter by */
                region?: string[]
                /** Number of datapoints to return */
                datapointCount?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint[],
                any
            >({
                path: `/inventory/api/v2/resources/regions/trend`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve a list of tag keys with their possible values for all resource types.
         *
         * @tags inventory
         * @name ApiV2ResourcesTagList
         * @summary List resourcetype tags
         * @request GET:/inventory/api/v2/resources/tag
         * @secure
         */
        apiV2ResourcesTagList: (
            query?: {
                /** Connector type to filter by */
                connector?: string[]
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** Minimum number of resources with this tag value, default 1 */
                minCount?: number
                /** End time in unix timestamp format, default now */
                endTime?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<Record<string, string[]>, any>({
                path: `/inventory/api/v2/resources/tag`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve a list of possible values for a given tag key for all resource types.
         *
         * @tags inventory
         * @name ApiV2ResourcesTagDetail
         * @summary Get resourcetype tag
         * @request GET:/inventory/api/v2/resources/tag/{key}
         * @secure
         */
        apiV2ResourcesTagDetail: (
            key: string,
            query?: {
                /** Connector type to filter by */
                connector?: string[]
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** Minimum number of resources with this tag value, default 1 */
                minCount?: number
                /** End time in unix timestamp format, default now */
                endTime?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<string[], any>({
                path: `/inventory/api/v2/resources/tag/${key}`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve a list of resource counts over the course of the specified time frame based on the given input filters
         *
         * @tags inventory
         * @name ApiV2ResourcesTrendList
         * @summary Get resource type trend
         * @request GET:/inventory/api/v2/resources/trend
         * @secure
         */
        apiV2ResourcesTrendList: (
            query?: {
                /** Key-Value tags in key=value format to filter by */
                tag?: string[]
                /** Service names to filter by */
                servicename?: string[]
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** timestamp for start in epoch seconds */
                startTime?: string
                /** timestamp for end in epoch seconds */
                endTime?: string
                /** maximum number of datapoints to return, default is 30 */
                datapointCount?: string
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint[],
                any
            >({
                path: `/inventory/api/v2/resources/trend`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve a list of costs over the course of the specified time frame for the given services. If startTime and endTime are empty, the API returns the last month trend.
         *
         * @tags inventory
         * @name ApiV2ServicesCostTrendList
         * @summary Get Services Cost Trend
         * @request GET:/inventory/api/v2/services/cost/trend
         * @secure
         */
        apiV2ServicesCostTrendList: (
            query?: {
                /** Services to filter by */
                services?: string[]
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** timestamp for start in epoch seconds */
                startTime?: string
                /** timestamp for end in epoch seconds */
                endTime?: string
                /** maximum number of datapoints to return, default is 30 */
                datapointCount?: string
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint[],
                any
            >({
                path: `/inventory/api/v2/services/cost/trend`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve a list of services with metrics of each type based on the given input filters.
         *
         * @tags inventory
         * @name ApiV2ServicesMetricList
         * @summary List services metrics
         * @request GET:/inventory/api/v2/services/metric
         * @secure
         */
        apiV2ServicesMetricList: (
            query?: {
                /** Key-Value tags in key=value format to filter by */
                tag?: string[]
                /** Connector type to filter by */
                connector?: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** timestamp for old values in epoch seconds */
                startTime?: string
                /** timestamp for current values in epoch seconds */
                endTime?: string
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
                GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetricsResponse,
                any
            >({
                path: `/inventory/api/v2/services/metric`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve a service with metrics.
         *
         * @tags inventory
         * @name ApiV2ServicesMetricDetail
         * @summary Get service metrics
         * @request GET:/inventory/api/v2/services/metric/{serviceName}
         * @secure
         */
        apiV2ServicesMetricDetail: (
            serviceName: string,
            query?: {
                /** Connection IDs to filter by */
                connectionId?: string[]
                /** timestamp for old values in epoch seconds */
                startTime?: string
                /** timestamp for current values in epoch seconds */
                endTime?: string
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiService,
                any
            >({
                path: `/inventory/api/v2/services/metric/${serviceName}`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieves list of summaries of the services including the number of them and the API filters and a list of services with more details. Including connector and the resource counts.
         *
         * @tags services
         * @name ApiV2ServicesSummaryList
         * @summary List Cloud Services Summary
         * @request GET:/inventory/api/v2/services/summary
         * @deprecated
         * @secure
         */
        apiV2ServicesSummaryList: (
            query?: {
                /** filter: Connection ID */
                connectionId?: string[]
                /** filter: Connector */
                connector?: string[]
                /** filter: tag for the services */
                tag?: string[]
                /** time for resource count in epoch seconds */
                endTime?: string
                /** page size - default is 20 */
                pageSize?: number
                /** page number - default is 1 */
                pageNumber?: number
                /** column to sort by - default is resourcecount */
                sortBy?: 'servicecode' | 'resourcecount'
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceSummariesResponse,
                any
            >({
                path: `/inventory/api/v2/services/summary`,
                method: 'GET',
                query: query,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieves Cloud Service Summary for the specified service name. Including connector, the resource counts.
         *
         * @tags services
         * @name ApiV2ServicesSummaryDetail
         * @summary Get Cloud Service Summary
         * @request GET:/inventory/api/v2/services/summary/{serviceName}
         * @deprecated
         * @secure
         */
        apiV2ServicesSummaryDetail: (
            serviceName: string,
            query: {
                /** filter: connectorId */
                connectorId?: string[]
                /** filter: connector */
                connector?: string[]
                /** time for resource count in epoch seconds */
                endTime: string
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgInventoryApiServiceSummary,
                any
            >({
                path: `/inventory/api/v2/services/summary/${serviceName}`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve a list of possible values for a given tag key for all services.
         *
         * @tags inventory
         * @name ApiV2ServicesTagList
         * @summary List resourcetype tags
         * @request GET:/inventory/api/v2/services/tag
         * @secure
         */
        apiV2ServicesTagList: (params: RequestParams = {}) =>
            this.request<Record<string, string[]>, any>({
                path: `/inventory/api/v2/services/tag`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve a list of possible values for a given tag key for all resource types.
         *
         * @tags inventory
         * @name ApiV2ServicesTagDetail
         * @summary Get resourcetype tag
         * @request GET:/inventory/api/v2/services/tag/{key}
         * @secure
         */
        apiV2ServicesTagDetail: (key: string, params: RequestParams = {}) =>
            this.request<string[], any>({
                path: `/inventory/api/v2/services/tag/${key}`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),
    }
    metadata = {
        /**
         * @description Sets the config metadata for the given key
         *
         * @tags metadata
         * @name ApiV1MetadataCreate
         * @summary Sets the config metadata for the given key
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
         * @summary Returns the config metadata for the given key
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
         * @description Returns the list of metrics for catalog page.
         *
         * @tags onboard
         * @name ApiV1CatalogMetricsList
         * @summary Get catalog metrics
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
         * @description Enabling a single source either with connection ID.
         *
         * @tags onboard
         * @name ApiV1ConnectionsStateCreate
         * @summary Enable a single source
         * @request POST:/onboard/api/v1/connections/{connectionId}/state
         * @secure
         */
        apiV1ConnectionsStateCreate: (
            connectionId: number,
            request: GithubComKaytuIoKaytuEnginePkgOnboardApiChangeConnectionLifecycleStateRequest,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/onboard/api/v1/connections/${connectionId}/state`,
                method: 'POST',
                body: request,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Returns a count of connections
         *
         * @tags onboard
         * @name ApiV1ConnectionsCountList
         * @summary Connections count
         * @request GET:/onboard/api/v1/connections/count
         * @secure
         */
        apiV1ConnectionsCountList: (
            type: GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionCountRequest,
            params: RequestParams = {}
        ) =>
            this.request<number, any>({
                path: `/onboard/api/v1/connections/count`,
                method: 'GET',
                body: type,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returns a list of connections summaries
         *
         * @tags connections
         * @name ApiV1ConnectionsSummaryList
         * @summary List connections summaries
         * @request GET:/onboard/api/v1/connections/summary
         * @secure
         */
        apiV1ConnectionsSummaryList: (
            query: {
                /** Connector */
                connector: ('' | 'AWS' | 'Azure')[]
                /** Connection IDs */
                connectionId?: string[]
                /** lifecycle state filter */
                lifecycleState?: string
                /** page size - default is 20 */
                pageSize?: number
                /** page number - default is 1 */
                pageNumber?: number
                /** start time in unix seconds */
                startTime?: number
                /** end time in unix seconds */
                endTime?: number
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
         * @description Returns a connections summaries
         *
         * @tags connections
         * @name ApiV1ConnectionsSummaryDetail
         * @summary Get connection summary
         * @request GET:/onboard/api/v1/connections/summary/{connectionId}
         * @secure
         */
        apiV1ConnectionsSummaryDetail: (
            connectionId: string,
            query?: {
                /** start time in unix seconds */
                startTime?: number
                /** end time in unix seconds */
                endTime?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
                any
            >({
                path: `/onboard/api/v1/connections/summary/${connectionId}`,
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
         * @description Returns connector details by name
         *
         * @tags onboard
         * @name ApiV1ConnectorDetail
         * @summary Get connector
         * @request GET:/onboard/api/v1/connector/{connectorName}
         * @secure
         */
        apiV1ConnectorDetail: (
            connectorName: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnector,
                any
            >({
                path: `/onboard/api/v1/connector/${connectorName}`,
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
                /**
                 * filter by credential type
                 * @default "manual"
                 */
                credentialType?: 'manual' | 'auto-generated'
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
         * @description Remove a credential by Id
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
         * @description Edit a credential by Id
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
         * @description Onboard all available connections for a credential
         *
         * @tags onboard
         * @name ApiV1CredentialAutoonboardCreate
         * @summary Onboard all available connections for a credential
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
         * @description Disable credential
         *
         * @tags onboard
         * @name ApiV1CredentialDisableCreate
         * @summary Disable credential
         * @request POST:/onboard/api/v1/credential/{credentialId}/disable
         * @secure
         */
        apiV1CredentialDisableCreate: (
            credentialId: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/onboard/api/v1/credential/${credentialId}/disable`,
                method: 'POST',
                secure: true,
                ...params,
            }),

        /**
         * @description Enable credential
         *
         * @tags onboard
         * @name ApiV1CredentialEnableCreate
         * @summary Enable credential
         * @request POST:/onboard/api/v1/credential/{credentialId}/enable
         * @secure
         */
        apiV1CredentialEnableCreate: (
            credentialId: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/onboard/api/v1/credential/${credentialId}/enable`,
                method: 'POST',
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags onboard
         * @name ApiV1CredentialHealthcheckDetail
         * @summary Get live credential health status
         * @request GET:/onboard/api/v1/credential/{credentialId}/healthcheck
         * @secure
         */
        apiV1CredentialHealthcheckDetail: (
            credentialId: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/onboard/api/v1/credential/${credentialId}/healthcheck`,
                method: 'GET',
                secure: true,
                ...params,
            }),

        /**
         * @description Returning a list of sources including both AWS and Azure unless filtered by Type.
         *
         * @tags onboard
         * @name ApiV1CredentialSourcesListList
         * @summary Returns a list of sources
         * @request GET:/onboard/api/v1/credential/sources/list
         * @secure
         */
        apiV1CredentialSourcesListList: (
            query?: {
                /** filter by connector type */
                connector?: '' | 'AWS' | 'Azure'
                /** filter by credential type */
                credentialType?: 'manual' | 'auto-generated'
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
                path: `/onboard/api/v1/credential/sources/list`,
                method: 'GET',
                query: query,
                secure: true,
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
        apiV1SourceDelete: (sourceId: number, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/onboard/api/v1/source/${sourceId}`,
                method: 'DELETE',
                secure: true,
                ...params,
            }),

        /**
         * @description Returning single source either AWS / Azure.
         *
         * @tags onboard
         * @name ApiV1SourceDetail
         * @summary Get source
         * @request GET:/onboard/api/v1/source/{sourceId}
         * @secure
         */
        apiV1SourceDetail: (sourceId: number, params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
                any
            >({
                path: `/onboard/api/v1/source/${sourceId}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returns credential for a source with given source ID. The responses are different for different source types.
         *
         * @tags onboard
         * @name ApiV1SourceCredentialsDetail
         * @summary Get source credential
         * @request GET:/onboard/api/v1/source/{sourceId}/credentials
         * @secure
         */
        apiV1SourceCredentialsDetail: (
            sourceId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiAzureCredential,
                any
            >({
                path: `/onboard/api/v1/source/${sourceId}/credentials`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Update source credential
         *
         * @tags onboard
         * @name ApiV1SourceCredentialsUpdate
         * @summary Update source credential
         * @request PUT:/onboard/api/v1/source/{sourceId}/credentials
         * @secure
         */
        apiV1SourceCredentialsUpdate: (
            sourceId: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/onboard/api/v1/source/${sourceId}/credentials`,
                method: 'PUT',
                secure: true,
                ...params,
            }),

        /**
         * @description Get live source health status with given source ID.
         *
         * @tags onboard
         * @name ApiV1SourceHealthcheckCreate
         * @summary Get source health
         * @request POST:/onboard/api/v1/source/{sourceId}/healthcheck
         * @secure
         */
        apiV1SourceHealthcheckCreate: (
            sourceId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
                any
            >({
                path: `/onboard/api/v1/source/${sourceId}/healthcheck`,
                method: 'POST',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returning account source either AWS / Azure.
         *
         * @tags onboard
         * @name ApiV1SourceAccountDetail
         * @summary List account sources
         * @request GET:/onboard/api/v1/source/account/{account_id}
         * @secure
         */
        apiV1SourceAccountDetail: (
            accountId: number,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
                any
            >({
                path: `/onboard/api/v1/source/account/${accountId}`,
                method: 'GET',
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
         * @description Returning a list of sources including both AWS and Azure unless filtered by Type.
         *
         * @tags onboard
         * @name ApiV1SourcesList
         * @summary List all sources
         * @request GET:/onboard/api/v1/sources
         * @secure
         */
        apiV1SourcesList: (
            query?: {
                /** filter by source type */
                connector?: ('' | 'AWS' | 'Azure')[]
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[],
                any
            >({
                path: `/onboard/api/v1/sources`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Returning number of sources including both AWS and Azure unless filtered by Type.
         *
         * @tags onboard
         * @name ApiV1SourcesCountList
         * @summary Count sources
         * @request GET:/onboard/api/v1/sources/count
         * @secure
         */
        apiV1SourcesCountList: (
            query?: {
                /** filter by source type */
                connector?: '' | 'AWS' | 'Azure'
            },
            params: RequestParams = {}
        ) =>
            this.request<number, any>({
                path: `/onboard/api/v1/sources/count`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),
    }
    schedule = {
        /**
         * No description
         *
         * @tags describe
         * @name ApiV0ComplianceSummarizerTriggerList
         * @summary Triggers a compliance summarizer job to run immediately
         * @request GET:/schedule/api/v0/compliance/summarizer/trigger
         * @secure
         */
        apiV0ComplianceSummarizerTriggerList: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/schedule/api/v0/compliance/summarizer/trigger`,
                method: 'GET',
                secure: true,
                ...params,
            }),

        /**
         * @description Triggers a compliance job to run immediately
         *
         * @tags describe
         * @name ApiV0ComplianceTriggerList
         * @summary Triggers a compliance job to run immediately
         * @request GET:/schedule/api/v0/compliance/trigger
         * @secure
         */
        apiV0ComplianceTriggerList: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/schedule/api/v0/compliance/trigger`,
                method: 'GET',
                secure: true,
                ...params,
            }),

        /**
         * @description Triggers a describe job to run immediately
         *
         * @tags describe
         * @name ApiV0DescribeTriggerList
         * @summary Triggers a describe job to run immediately
         * @request GET:/schedule/api/v0/describe/trigger
         * @secure
         */
        apiV0DescribeTriggerList: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/schedule/api/v0/describe/trigger`,
                method: 'GET',
                secure: true,
                ...params,
            }),

        /**
         * @description Triggers an insight job to run immediately
         *
         * @tags describe
         * @name ApiV0InsightTriggerList
         * @summary Triggers an insight job to run immediately
         * @request GET:/schedule/api/v0/insight/trigger
         * @secure
         */
        apiV0InsightTriggerList: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/schedule/api/v0/insight/trigger`,
                method: 'GET',
                secure: true,
                ...params,
            }),

        /**
         * @description Triggers a summarize job to run immediately
         *
         * @tags describe
         * @name ApiV0SummarizeTriggerList
         * @summary Triggers a summarize job to run immediately
         * @request GET:/schedule/api/v0/summarize/trigger
         * @secure
         */
        apiV0SummarizeTriggerList: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/schedule/api/v0/summarize/trigger`,
                method: 'GET',
                secure: true,
                ...params,
            }),

        /**
         * @description Triggers a benchmark evaluation job to run immediately
         *
         * @tags describe
         * @name ApiV1BenchmarkEvaluationTriggerUpdate
         * @summary Trigger benchmark evaluation
         * @request PUT:/schedule/api/v1/benchmark/evaluation/trigger
         * @secure
         */
        apiV1BenchmarkEvaluationTriggerUpdate: (
            request: GithubComKaytuIoKaytuEnginePkgDescribeApiTriggerBenchmarkEvaluationRequest,
            params: RequestParams = {}
        ) =>
            this.request<DescribeComplianceReportJob[], any>({
                path: `/schedule/api/v1/benchmark/evaluation/trigger`,
                method: 'PUT',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This API allows users to retrieve details of all benchmark evaluation jobs based on specified filters. The API returns information such as evaluation time, benchmark ID, connection ID, connector name, status, and failure message.
         *
         * @tags describe
         * @name ApiV1BenchmarkEvaluationsList
         * @summary Lists benchmark evaluations
         * @request GET:/schedule/api/v1/benchmark/evaluations
         * @secure
         */
        apiV1BenchmarkEvaluationsList: (
            request: GithubComKaytuIoKaytuEnginePkgDescribeApiListBenchmarkEvaluationsRequest,
            params: RequestParams = {}
        ) =>
            this.request<DescribeComplianceReportJob[], any>({
                path: `/schedule/api/v1/benchmark/evaluations`,
                method: 'GET',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags schedule
         * @name ApiV1ComplianceReportLastCompletedList
         * @summary Get last completed compliance report
         * @request GET:/schedule/api/v1/compliance/report/last/completed
         * @secure
         */
        apiV1ComplianceReportLastCompletedList: (params: RequestParams = {}) =>
            this.request<number, any>({
                path: `/schedule/api/v1/compliance/report/last/completed`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags describe
         * @name ApiV1DescribeResourceCreate
         * @summary Describe single resource
         * @request POST:/schedule/api/v1/describe/resource
         * @secure
         */
        apiV1DescribeResourceCreate: (
            request: GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSingleResourceRequest,
            params: RequestParams = {}
        ) =>
            this.request<AwsResources, any>({
                path: `/schedule/api/v1/describe/resource`,
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
         * @tags schedule
         * @name ApiV1DescribeResourceJobsPendingList
         * @summary Listing describe resource jobs
         * @request GET:/schedule/api/v1/describe/resource/jobs/pending
         * @secure
         */
        apiV1DescribeResourceJobsPendingList: (params: RequestParams = {}) =>
            this.request<DescribeDescribeResourceJob[], any>({
                path: `/schedule/api/v1/describe/resource/jobs/pending`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags schedule
         * @name ApiV1DescribeSourceJobsPendingList
         * @summary Listing describe source jobs
         * @request GET:/schedule/api/v1/describe/source/jobs/pending
         * @secure
         */
        apiV1DescribeSourceJobsPendingList: (params: RequestParams = {}) =>
            this.request<DescribeDescribeSourceJob[], any>({
                path: `/schedule/api/v1/describe/source/jobs/pending`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Triggers a describe job to run immediately
         *
         * @tags describe
         * @name ApiV1DescribeTriggerUpdate
         * @summary Triggers a describe job to run immediately
         * @request PUT:/schedule/api/v1/describe/trigger/{connection_id}
         * @secure
         */
        apiV1DescribeTriggerUpdate: (
            connectionId: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/schedule/api/v1/describe/trigger/${connectionId}`,
                method: 'PUT',
                secure: true,
                ...params,
            }),

        /**
         * @description Trigger an insight evaluation to run immediately with given details
         *
         * @tags describe
         * @name ApiV1InsightEvaluationTriggerUpdate
         * @summary Trigger insight evaluation
         * @request PUT:/schedule/api/v1/insight/evaluation/trigger
         * @secure
         */
        apiV1InsightEvaluationTriggerUpdate: (
            request: GithubComKaytuIoKaytuEnginePkgDescribeApiTriggerInsightEvaluationRequest,
            params: RequestParams = {}
        ) =>
            this.request<DescribeInsightJob[], any>({
                path: `/schedule/api/v1/insight/evaluation/trigger`,
                method: 'PUT',
                body: request,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Get an Insight Job details by ID
         *
         * @tags describe
         * @name ApiV1InsightJobDetail
         * @summary Get an Insight Job
         * @request GET:/schedule/api/v1/insight/job/{jobId}
         * @secure
         */
        apiV1InsightJobDetail: (jobId: string, params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgDescribeApiInsightJob,
                any
            >({
                path: `/schedule/api/v1/insight/job/${jobId}`,
                method: 'GET',
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags schedule
         * @name ApiV1InsightJobsPendingList
         * @summary Listing insight jobs
         * @request GET:/schedule/api/v1/insight/jobs/pending
         * @secure
         */
        apiV1InsightJobsPendingList: (params: RequestParams = {}) =>
            this.request<DescribeInsightJob[], any>({
                path: `/schedule/api/v1/insight/jobs/pending`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description get resource type by provider
         *
         * @tags schedule
         * @name ApiV1ResourceTypeDetail
         * @summary get resource type by provider
         * @request GET:/schedule/api/v1/resource_type/{provider}
         * @secure
         */
        apiV1ResourceTypeDetail: (
            provider: 'aws' | 'azure',
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgDescribeApiResourceTypeDetail[],
                any
            >({
                path: `/schedule/api/v1/resource_type/${provider}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieves list of all of Keibi sources
         *
         * @tags schedule
         * @name ApiV1SourcesList
         * @summary List Sources
         * @request GET:/schedule/api/v1/sources
         * @secure
         */
        apiV1SourcesList: (params: RequestParams = {}) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgDescribeApiSource[],
                any
            >({
                path: `/schedule/api/v1/sources`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieves Keibi source details by id Getting Keibi source by id
         *
         * @tags schedule
         * @name ApiV1SourcesDetail
         * @summary Get source
         * @request GET:/schedule/api/v1/sources/{source_id}
         * @secure
         */
        apiV1SourcesDetail: (sourceId: string, params: RequestParams = {}) =>
            this.request<GithubComKaytuIoKaytuEnginePkgDescribeApiSource, any>({
                path: `/schedule/api/v1/sources/${sourceId}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Retrieves list of source compliance reports for a source by the given source id
         *
         * @tags schedule
         * @name ApiV1SourcesJobsComplianceDetail
         * @summary List source compliance reports
         * @request GET:/schedule/api/v1/sources/{source_id}/jobs/compliance
         * @secure
         */
        apiV1SourcesJobsComplianceDetail: (
            sourceId: string,
            query?: {
                /** From Time (TimeRange) */
                from?: number
                /** To Time (TimeRange) */
                to?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgComplianceApiComplianceReport[],
                any
            >({
                path: `/schedule/api/v1/sources/${sourceId}/jobs/compliance`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Run compliance report jobs
         *
         * @tags schedule
         * @name ApiV1SourcesJobsComplianceRefreshCreate
         * @summary Run compliance report jobs
         * @request POST:/schedule/api/v1/sources/{source_id}/jobs/compliance/refresh
         * @secure
         */
        apiV1SourcesJobsComplianceRefreshCreate: (
            sourceId: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/schedule/api/v1/sources/${sourceId}/jobs/compliance/refresh`,
                method: 'POST',
                secure: true,
                ...params,
            }),

        /**
         * @description Retrieves list of source describe jobs for a source by the given source id
         *
         * @tags schedule
         * @name ApiV1SourcesJobsDescribeDetail
         * @summary List source describe jobs
         * @request GET:/schedule/api/v1/sources/{source_id}/jobs/describe
         * @secure
         */
        apiV1SourcesJobsDescribeDetail: (
            sourceId: string,
            params: RequestParams = {}
        ) =>
            this.request<
                GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSource[],
                any
            >({
                path: `/schedule/api/v1/sources/${sourceId}/jobs/describe`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * @description Run describe jobs
         *
         * @tags schedule
         * @name ApiV1SourcesJobsDescribeRefreshCreate
         * @summary Run describe jobs
         * @request POST:/schedule/api/v1/sources/{source_id}/jobs/describe/refresh
         * @secure
         */
        apiV1SourcesJobsDescribeRefreshCreate: (
            sourceId: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/schedule/api/v1/sources/${sourceId}/jobs/describe/refresh`,
                method: 'POST',
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
         * @description Delete a stack by ID
         *
         * @tags stack
         * @name ApiV1StacksDelete
         * @summary Delete a Stack
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
         * @description Get a stack details by ID
         *
         * @tags stack
         * @name ApiV1StacksDetail
         * @summary Get a Stack
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
         * No description
         *
         * @tags schedule
         * @name ApiV1SummarizeJobsPendingList
         * @summary Listing summarize jobs
         * @request GET:/schedule/api/v1/summarize/jobs/pending
         * @secure
         */
        apiV1SummarizeJobsPendingList: (params: RequestParams = {}) =>
            this.request<DescribeSummarizerJob[], any>({
                path: `/schedule/api/v1/summarize/jobs/pending`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),
    }
    workspace = {
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
    }
}
