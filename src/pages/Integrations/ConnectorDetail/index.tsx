import { Flex, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import Menu from '../../../components/Menu'
import {
    useOnboardApiV1ConnectionsSummaryList,
    useOnboardApiV1CredentialList,
} from '../../../api/onboard.gen'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { timeAtom } from '../../../store'
import AWSTabs from './AWS/Tabs'
import AWSSummary from './AWS/Summary'
import AzureSummary from './Azure/Summary'
import AzureTabs from './Azure/Tabs'
import { StringToProvider } from '../../../types/provider'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType,
    SourceAssetDiscoveryMethodType,
    SourceHealthStatus,
    SourceType,
} from '../../../api/api'
import { isDemo } from '../../../utilities/demo'

const MockAWS: {
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    Credentials: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
} = {
    accounts: [
        {
            id: 'b599ae6c-3aaf-49b3-9cb7-67685cf970da',
            providerConnectionID: '270355831570',
            providerConnectionName: 'XMC-WPI-WS-A-Prod',
            email: '',
            connector: SourceType.CloudAWS,
            description: '',
            onboardDate: '2023-05-18T19:10:40.310403Z',
            assetDiscoveryMethod:
                SourceAssetDiscoveryMethodType.AssetDiscoveryMethodTypeScheduled,
            credentialID: '7ablapxa-12e1-411a-klls2-65412almvdpo',
            credentialName: 'AWS - 151214229786 - default credentials',
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeAutoAws,
            credential: {
                id: '',
                connectorType: SourceType.Nil,
                credentialType: undefined,
                enabled: false,
                autoOnboardEnabled: false,
                onboardDate: '0001-01-01T00:00:00Z',
                config: null,
                lastHealthCheckTime: '0001-01-01T00:00:00Z',
                healthStatus: SourceHealthStatus.HealthStatusNil,
            },
            lifecycleState:
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState.ConnectionLifecycleStateOnboard,
            lastHealthCheckTime: '2023-08-06T05:47:40.749988Z',
            healthReason: '',
            lastInventory: '2023-08-06T04:24:36.36Z',
            cost: 127046.073815101,
            dailyCostAtStartTime: 4114.104648687,
            dailyCostAtEndTime: 2591.7358406503,
            resourceCount: 4913,
            oldResourceCount: 5165,
            metadata: {
                account_id: '151214229786',
                account_name: 'QWERTYUIOPLKJHGFDXCV1',
                account_organization: {
                    Arn: 'arn:aws:organizations::151214229786:organization/o7xDDkEkLP16',
                    AvailablePolicyTypes: [
                        {
                            Status: 'ENABLED',
                            Type: 'SERVICE_CONTROL_POLICY',
                        },
                    ],
                    FeatureSet: 'ALL',
                    Id: 'o7xDDkEkLP16',
                    MasterAccountArn:
                        'arn:aws:organizations::151214229786:account/o7xDDkEkLP16/151214229786',
                    MasterAccountEmail: 'aws.master@GGWP.com',
                    MasterAccountId: '151214229786',
                },
                account_type: 'standalone',
            },
        },
        {
            id: 'b599ae6c-3aaf-49b3-9cb7-67685cf970da',
            providerConnectionID: '270355831570',
            providerConnectionName: 'XMC-WPI-WS-A-Prod',
            email: '',
            connector: SourceType.CloudAWS,
            description: '',
            onboardDate: '2023-05-18T19:10:40.310403Z',
            assetDiscoveryMethod:
                SourceAssetDiscoveryMethodType.AssetDiscoveryMethodTypeScheduled,
            credentialID: '7ablapxa-12e1-411a-klls2-65412almvdpo',
            credentialName: 'AWS - 151214229786 - default credentials',
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeAutoAws,
            credential: {
                id: '',
                connectorType: SourceType.Nil,
                credentialType: undefined,
                enabled: false,
                autoOnboardEnabled: false,
                onboardDate: '0001-01-01T00:00:00Z',
                config: null,
                lastHealthCheckTime: '0001-01-01T00:00:00Z',
                healthStatus: SourceHealthStatus.HealthStatusNil,
            },
            lifecycleState:
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState.ConnectionLifecycleStateOnboard,
            lastHealthCheckTime: '2023-08-06T05:47:40.749988Z',
            healthReason: '',
            lastInventory: '2023-08-06T04:24:36.36Z',
            cost: 127046.073815101,
            dailyCostAtStartTime: 4114.104648687,
            dailyCostAtEndTime: 2591.7358406503,
            resourceCount: 4913,
            oldResourceCount: 5165,
            metadata: {
                account_id: '151214229786',
                account_name: 'QWERTYUIOPLKJHGFDXCV1',
                account_organization: {
                    Arn: 'arn:aws:organizations::151214229786:organization/o7xDDkEkLP16',
                    AvailablePolicyTypes: [
                        {
                            Status: 'ENABLED',
                            Type: 'SERVICE_CONTROL_POLICY',
                        },
                    ],
                    FeatureSet: 'ALL',
                    Id: 'o7xDDkEkLP16',
                    MasterAccountArn:
                        'arn:aws:organizations::151214229786:account/o7xDDkEkLP16/151214229786',
                    MasterAccountEmail: 'aws.master@GGWP.com',
                    MasterAccountId: '151214229786',
                },
                account_type: 'standalone',
            },
        },
        {
            id: 'b599ae6c-3aaf-49b3-9cb7-67685cf970da',
            providerConnectionID: '270355831570',
            providerConnectionName: 'XMC-WPI-WS-A-Prod',
            email: '',
            connector: SourceType.CloudAWS,
            description: '',
            onboardDate: '2023-05-18T19:10:40.310403Z',
            assetDiscoveryMethod:
                SourceAssetDiscoveryMethodType.AssetDiscoveryMethodTypeScheduled,
            credentialID: '7ablapxa-12e1-411a-klls2-65412almvdpo',
            credentialName: 'AWS - 151214229786 - default credentials',
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeAutoAws,
            credential: {
                id: '',
                connectorType: SourceType.Nil,
                credentialType: undefined,
                enabled: false,
                autoOnboardEnabled: false,
                onboardDate: '0001-01-01T00:00:00Z',
                config: null,
                lastHealthCheckTime: '0001-01-01T00:00:00Z',
                healthStatus: SourceHealthStatus.HealthStatusNil,
            },
            lifecycleState:
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState.ConnectionLifecycleStateOnboard,
            lastHealthCheckTime: '2023-08-06T05:47:40.749988Z',
            healthReason: '',
            lastInventory: '2023-08-06T04:24:36.36Z',
            cost: 127046.073815101,
            dailyCostAtStartTime: 4114.104648687,
            dailyCostAtEndTime: 2591.7358406503,
            resourceCount: 4913,
            oldResourceCount: 5165,
            metadata: {
                account_id: '151214229786',
                account_name: 'QWERTYUIOPLKJHGFDXCV1',
                account_organization: {
                    Arn: 'arn:aws:organizations::151214229786:organization/o7xDDkEkLP16',
                    AvailablePolicyTypes: [
                        {
                            Status: 'ENABLED',
                            Type: 'SERVICE_CONTROL_POLICY',
                        },
                    ],
                    FeatureSet: 'ALL',
                    Id: 'o7xDDkEkLP16',
                    MasterAccountArn:
                        'arn:aws:organizations::151214229786:account/o7xDDkEkLP16/151214229786',
                    MasterAccountEmail: 'aws.master@GGWP.com',
                    MasterAccountId: '151214229786',
                },
                account_type: 'standalone',
            },
        },
        {
            id: 'b599ae6c-3aaf-49b3-9cb7-67685cf970da',
            providerConnectionID: '270355831570',
            providerConnectionName: 'XMC-WPI-WS-A-Prod',
            email: '',
            connector: SourceType.CloudAWS,
            description: '',
            onboardDate: '2023-05-18T19:10:40.310403Z',
            assetDiscoveryMethod:
                SourceAssetDiscoveryMethodType.AssetDiscoveryMethodTypeScheduled,
            credentialID: '7ablapxa-12e1-411a-klls2-65412almvdpo',
            credentialName: 'AWS - 151214229786 - default credentials',
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeAutoAws,
            credential: {
                id: '',
                connectorType: SourceType.Nil,
                credentialType: undefined,
                enabled: false,
                autoOnboardEnabled: false,
                onboardDate: '0001-01-01T00:00:00Z',
                config: null,
                lastHealthCheckTime: '0001-01-01T00:00:00Z',
                healthStatus: SourceHealthStatus.HealthStatusNil,
            },
            lifecycleState:
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState.ConnectionLifecycleStateOnboard,
            lastHealthCheckTime: '2023-08-06T05:47:40.749988Z',
            healthReason: '',
            lastInventory: '2023-08-06T04:24:36.36Z',
            cost: 127046.073815101,
            dailyCostAtStartTime: 4114.104648687,
            dailyCostAtEndTime: 2591.7358406503,
            resourceCount: 4913,
            oldResourceCount: 5165,
            metadata: {
                account_id: '151214229786',
                account_name: 'QWERTYUIOPLKJHGFDXCV1',
                account_organization: {
                    Arn: 'arn:aws:organizations::151214229786:organization/o7xDDkEkLP16',
                    AvailablePolicyTypes: [
                        {
                            Status: 'ENABLED',
                            Type: 'SERVICE_CONTROL_POLICY',
                        },
                    ],
                    FeatureSet: 'ALL',
                    Id: 'o7xDDkEkLP16',
                    MasterAccountArn:
                        'arn:aws:organizations::151214229786:account/o7xDDkEkLP16/151214229786',
                    MasterAccountEmail: 'aws.master@GGWP.com',
                    MasterAccountId: '151214229786',
                },
                account_type: 'standalone',
            },
        },
        {
            id: 'b599ae6c-3aaf-49b3-9cb7-67685cf970da',
            providerConnectionID: '270355831570',
            providerConnectionName: 'XMC-WPI-WS-A-Prod',
            email: '',
            connector: SourceType.CloudAWS,
            description: '',
            onboardDate: '2023-05-18T19:10:40.310403Z',
            assetDiscoveryMethod:
                SourceAssetDiscoveryMethodType.AssetDiscoveryMethodTypeScheduled,
            credentialID: '7ablapxa-12e1-411a-klls2-65412almvdpo',
            credentialName: 'AWS - 151214229786 - default credentials',
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeAutoAws,
            credential: {
                id: '',
                connectorType: SourceType.Nil,
                credentialType: undefined,
                enabled: false,
                autoOnboardEnabled: false,
                onboardDate: '0001-01-01T00:00:00Z',
                config: null,
                lastHealthCheckTime: '0001-01-01T00:00:00Z',
                healthStatus: SourceHealthStatus.HealthStatusNil,
            },
            lifecycleState:
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState.ConnectionLifecycleStateOnboard,
            lastHealthCheckTime: '2023-08-06T05:47:40.749988Z',
            healthReason: '',
            lastInventory: '2023-08-06T04:24:36.36Z',
            cost: 127046.073815101,
            dailyCostAtStartTime: 4114.104648687,
            dailyCostAtEndTime: 2591.7358406503,
            resourceCount: 4913,
            oldResourceCount: 5165,
            metadata: {
                account_id: '151214229786',
                account_name: 'QWERTYUIOPLKJHGFDXCV1',
                account_organization: {
                    Arn: 'arn:aws:organizations::151214229786:organization/o7xDDkEkLP16',
                    AvailablePolicyTypes: [
                        {
                            Status: 'ENABLED',
                            Type: 'SERVICE_CONTROL_POLICY',
                        },
                    ],
                    FeatureSet: 'ALL',
                    Id: 'o7xDDkEkLP16',
                    MasterAccountArn:
                        'arn:aws:organizations::151214229786:account/o7xDDkEkLP16/151214229786',
                    MasterAccountEmail: 'aws.master@GGWP.com',
                    MasterAccountId: '151214229786',
                },
                account_type: 'standalone',
            },
        },
        {
            id: 'b599ae6c-3aaf-49b3-9cb7-67685cf970da',
            providerConnectionID: '270355831570',
            providerConnectionName: 'XMC-WPI-WS-A-Prod',
            email: '',
            connector: SourceType.CloudAWS,
            description: '',
            onboardDate: '2023-05-18T19:10:40.310403Z',
            assetDiscoveryMethod:
                SourceAssetDiscoveryMethodType.AssetDiscoveryMethodTypeScheduled,
            credentialID: '7ablapxa-12e1-411a-klls2-65412almvdpo',
            credentialName: 'AWS - 151214229786 - default credentials',
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeAutoAws,
            credential: {
                id: '',
                connectorType: SourceType.Nil,
                credentialType: undefined,
                enabled: false,
                autoOnboardEnabled: false,
                onboardDate: '0001-01-01T00:00:00Z',
                config: null,
                lastHealthCheckTime: '0001-01-01T00:00:00Z',
                healthStatus: SourceHealthStatus.HealthStatusNil,
            },
            lifecycleState:
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState.ConnectionLifecycleStateOnboard,
            lastHealthCheckTime: '2023-08-06T05:47:40.749988Z',
            healthReason: '',
            lastInventory: '2023-08-06T04:24:36.36Z',
            cost: 127046.073815101,
            dailyCostAtStartTime: 4114.104648687,
            dailyCostAtEndTime: 2591.7358406503,
            resourceCount: 4913,
            oldResourceCount: 5165,
            metadata: {
                account_id: '151214229786',
                account_name: 'QWERTYUIOPLKJHGFDXCV1',
                account_organization: {
                    Arn: 'arn:aws:organizations::151214229786:organization/o7xDDkEkLP16',
                    AvailablePolicyTypes: [
                        {
                            Status: 'ENABLED',
                            Type: 'SERVICE_CONTROL_POLICY',
                        },
                    ],
                    FeatureSet: 'ALL',
                    Id: 'o7xDDkEkLP16',
                    MasterAccountArn:
                        'arn:aws:organizations::151214229786:account/o7xDDkEkLP16/151214229786',
                    MasterAccountEmail: 'aws.master@GGWP.com',
                    MasterAccountId: '151214229786',
                },
                account_type: 'standalone',
            },
        },
    ],
    Credentials: [
        {
            id: 'k689ae6c-2aaf-51b3-4207-67685cf970da',
            name: 'o7xDDkEkLP16',
            connectorType: SourceType.CloudAWS,
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeManualAwsOrganization,
            enabled: true,
            autoOnboardEnabled: false,
            onboardDate: '2023-07-03T12:21:33.406928Z',
            config: '',
            lastHealthCheckTime: '2023-08-06T07:38:36.441058Z',
            healthStatus: SourceHealthStatus.HealthStatusHealthy,
            healthReason: '',
            metadata: {
                account_id: '151214229786',
                attached_policies: [
                    'arn:aws:iam::aws:policy/AWSOrganizationsReadOnlyAccess',
                    'arn:aws:iam::aws:policy/ReadOnlyAccess',
                    'arn:aws:iam::aws:policy/SecurityAudit',
                    'arn:aws:iam::151214229786:policy/ReadOnly-SupplementPolicy',
                ],
                iam_api_key_creation_date: '2023-07-03T10:26:08Z',
                iam_user_name: 'ked-pod-inventory-scripts',
                organization_discovered_account_count: 10,
                organization_id: 'o7xDDkEkLP16',
                organization_master_account_email: 'aws.master@GGWP.com',
                organization_master_account_id: '151214229786',
            },
            total_connections: 10,
            enabled_connections: 3,
            unhealthy_connections: 2,
        },
    ],
}

const MockAzure: {
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    Credentials: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
} = {
    accounts: [
        {
            id: 'b599ae6c-3aaf-49b3-9cb7-67685cf970da',
            providerConnectionID: '270355831570',
            providerConnectionName: 'MA-KEKT-SP-8-Prod',
            email: '',
            connector: SourceType.CloudAzure,
            description: '',
            onboardDate: '2023-05-18T19:10:40.310403Z',
            assetDiscoveryMethod:
                SourceAssetDiscoveryMethodType.AssetDiscoveryMethodTypeScheduled,
            credentialID: '7ablapxa-12e1-411a-klls2-65412almvdpo',
            credentialName: 'Azure - 270355831570 - default credentials',
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeAutoAzure,
            credential: {
                id: '',
                connectorType: SourceType.Nil,
                credentialType: undefined,
                enabled: false,
                autoOnboardEnabled: false,
                onboardDate: '0001-01-01T00:00:00Z',
                config: null,
                lastHealthCheckTime: '0001-01-01T00:00:00Z',
                healthStatus: SourceHealthStatus.HealthStatusNil,
            },
            lifecycleState:
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState.ConnectionLifecycleStateOnboard,
            lastHealthCheckTime: '2023-08-06T05:47:40.749988Z',
            healthReason: '',
            lastInventory: '2023-08-06T04:24:36.36Z',
            cost: 127046.073815101,
            dailyCostAtStartTime: 4114.104648687,
            dailyCostAtEndTime: 2591.7358406503,
            resourceCount: 4913,
            oldResourceCount: 5165,
            metadata: {
                account_id: '270355831570',
                account_name: 'ASKCXUIOPLKJHGFDXCV1',
                account_organization: {
                    Arn: 'arn:azure:organizations::270355831570:organization/KappaXDDkEkLP16',
                    AvailablePolicyTypes: [
                        {
                            Status: 'ENABLED',
                            Type: 'SERVICE_CONTROL_POLICY',
                        },
                    ],
                    FeatureSet: 'ALL',
                    Id: 'KappaXDDkEkLP16',
                    MasterAccountArn:
                        'arn:azure:organizations::270355831570:account/KappaXDDkEkLP16/270355831570',
                    MasterAccountEmail: 'azure.master@GGWP.com',
                    MasterAccountId: '270355831570',
                },
                account_type: 'standalone',
            },
        },
        {
            id: 'b599ae6c-3aaf-49b3-9cb7-67685cf970da',
            providerConnectionID: '270355831570',
            providerConnectionName: 'MA-KEKT-SP-8-Prod',
            email: '',
            connector: SourceType.CloudAzure,
            description: '',
            onboardDate: '2023-05-18T19:10:40.310403Z',
            assetDiscoveryMethod:
                SourceAssetDiscoveryMethodType.AssetDiscoveryMethodTypeScheduled,
            credentialID: '7ablapxa-12e1-411a-klls2-65412almvdpo',
            credentialName: 'Azure - 270355831570 - default credentials',
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeAutoAzure,
            credential: {
                id: '',
                connectorType: SourceType.Nil,
                credentialType: undefined,
                enabled: false,
                autoOnboardEnabled: false,
                onboardDate: '0001-01-01T00:00:00Z',
                config: null,
                lastHealthCheckTime: '0001-01-01T00:00:00Z',
                healthStatus: SourceHealthStatus.HealthStatusNil,
            },
            lifecycleState:
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState.ConnectionLifecycleStateOnboard,
            lastHealthCheckTime: '2023-08-06T05:47:40.749988Z',
            healthReason: '',
            lastInventory: '2023-08-06T04:24:36.36Z',
            cost: 127046.073815101,
            dailyCostAtStartTime: 4114.104648687,
            dailyCostAtEndTime: 2591.7358406503,
            resourceCount: 4913,
            oldResourceCount: 5165,
            metadata: {
                account_id: '270355831570',
                account_name: 'ASKCXUIOPLKJHGFDXCV1',
                account_organization: {
                    Arn: 'arn:azure:organizations::270355831570:organization/KappaXDDkEkLP16',
                    AvailablePolicyTypes: [
                        {
                            Status: 'ENABLED',
                            Type: 'SERVICE_CONTROL_POLICY',
                        },
                    ],
                    FeatureSet: 'ALL',
                    Id: 'KappaXDDkEkLP16',
                    MasterAccountArn:
                        'arn:azure:organizations::270355831570:account/KappaXDDkEkLP16/270355831570',
                    MasterAccountEmail: 'azure.master@GGWP.com',
                    MasterAccountId: '270355831570',
                },
                account_type: 'standalone',
            },
        },
        {
            id: 'b599ae6c-3aaf-49b3-9cb7-67685cf970da',
            providerConnectionID: '270355831570',
            providerConnectionName: 'MA-KEKT-SP-8-Prod',
            email: '',
            connector: SourceType.CloudAzure,
            description: '',
            onboardDate: '2023-05-18T19:10:40.310403Z',
            assetDiscoveryMethod:
                SourceAssetDiscoveryMethodType.AssetDiscoveryMethodTypeScheduled,
            credentialID: '7ablapxa-12e1-411a-klls2-65412almvdpo',
            credentialName: 'Azure - 270355831570 - default credentials',
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeAutoAzure,
            credential: {
                id: '',
                connectorType: SourceType.Nil,
                credentialType: undefined,
                enabled: false,
                autoOnboardEnabled: false,
                onboardDate: '0001-01-01T00:00:00Z',
                config: null,
                lastHealthCheckTime: '0001-01-01T00:00:00Z',
                healthStatus: SourceHealthStatus.HealthStatusNil,
            },
            lifecycleState:
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState.ConnectionLifecycleStateOnboard,
            lastHealthCheckTime: '2023-08-06T05:47:40.749988Z',
            healthReason: '',
            lastInventory: '2023-08-06T04:24:36.36Z',
            cost: 127046.073815101,
            dailyCostAtStartTime: 4114.104648687,
            dailyCostAtEndTime: 2591.7358406503,
            resourceCount: 4913,
            oldResourceCount: 5165,
            metadata: {
                account_id: '270355831570',
                account_name: 'ASKCXUIOPLKJHGFDXCV1',
                account_organization: {
                    Arn: 'arn:azure:organizations::270355831570:organization/KappaXDDkEkLP16',
                    AvailablePolicyTypes: [
                        {
                            Status: 'ENABLED',
                            Type: 'SERVICE_CONTROL_POLICY',
                        },
                    ],
                    FeatureSet: 'ALL',
                    Id: 'KappaXDDkEkLP16',
                    MasterAccountArn:
                        'arn:azure:organizations::270355831570:account/KappaXDDkEkLP16/270355831570',
                    MasterAccountEmail: 'azure.master@GGWP.com',
                    MasterAccountId: '270355831570',
                },
                account_type: 'standalone',
            },
        },
        {
            id: 'b599ae6c-3aaf-49b3-9cb7-67685cf970da',
            providerConnectionID: '270355831570',
            providerConnectionName: 'MA-KEKT-SP-8-Prod',
            email: '',
            connector: SourceType.CloudAzure,
            description: '',
            onboardDate: '2023-05-18T19:10:40.310403Z',
            assetDiscoveryMethod:
                SourceAssetDiscoveryMethodType.AssetDiscoveryMethodTypeScheduled,
            credentialID: '7ablapxa-12e1-411a-klls2-65412almvdpo',
            credentialName: 'Azure - 270355831570 - default credentials',
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeAutoAzure,
            credential: {
                id: '',
                connectorType: SourceType.Nil,
                credentialType: undefined,
                enabled: false,
                autoOnboardEnabled: false,
                onboardDate: '0001-01-01T00:00:00Z',
                config: null,
                lastHealthCheckTime: '0001-01-01T00:00:00Z',
                healthStatus: SourceHealthStatus.HealthStatusNil,
            },
            lifecycleState:
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState.ConnectionLifecycleStateOnboard,
            lastHealthCheckTime: '2023-08-06T05:47:40.749988Z',
            healthReason: '',
            lastInventory: '2023-08-06T04:24:36.36Z',
            cost: 127046.073815101,
            dailyCostAtStartTime: 4114.104648687,
            dailyCostAtEndTime: 2591.7358406503,
            resourceCount: 4913,
            oldResourceCount: 5165,
            metadata: {
                account_id: '270355831570',
                account_name: 'ASKCXUIOPLKJHGFDXCV1',
                account_organization: {
                    Arn: 'arn:azure:organizations::270355831570:organization/KappaXDDkEkLP16',
                    AvailablePolicyTypes: [
                        {
                            Status: 'ENABLED',
                            Type: 'SERVICE_CONTROL_POLICY',
                        },
                    ],
                    FeatureSet: 'ALL',
                    Id: 'KappaXDDkEkLP16',
                    MasterAccountArn:
                        'arn:azure:organizations::270355831570:account/KappaXDDkEkLP16/270355831570',
                    MasterAccountEmail: 'azure.master@GGWP.com',
                    MasterAccountId: '270355831570',
                },
                account_type: 'standalone',
            },
        },
        {
            id: 'b599ae6c-3aaf-49b3-9cb7-67685cf970da',
            providerConnectionID: '270355831570',
            providerConnectionName: 'MA-KEKT-SP-8-Prod',
            email: '',
            connector: SourceType.CloudAzure,
            description: '',
            onboardDate: '2023-05-18T19:10:40.310403Z',
            assetDiscoveryMethod:
                SourceAssetDiscoveryMethodType.AssetDiscoveryMethodTypeScheduled,
            credentialID: '7ablapxa-12e1-411a-klls2-65412almvdpo',
            credentialName: 'Azure - 270355831570 - default credentials',
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeAutoAzure,
            credential: {
                id: '',
                connectorType: SourceType.Nil,
                credentialType: undefined,
                enabled: false,
                autoOnboardEnabled: false,
                onboardDate: '0001-01-01T00:00:00Z',
                config: null,
                lastHealthCheckTime: '0001-01-01T00:00:00Z',
                healthStatus: SourceHealthStatus.HealthStatusNil,
            },
            lifecycleState:
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState.ConnectionLifecycleStateOnboard,
            lastHealthCheckTime: '2023-08-06T05:47:40.749988Z',
            healthReason: '',
            lastInventory: '2023-08-06T04:24:36.36Z',
            cost: 127046.073815101,
            dailyCostAtStartTime: 4114.104648687,
            dailyCostAtEndTime: 2591.7358406503,
            resourceCount: 4913,
            oldResourceCount: 5165,
            metadata: {
                account_id: '270355831570',
                account_name: 'ASKCXUIOPLKJHGFDXCV1',
                account_organization: {
                    Arn: 'arn:azure:organizations::270355831570:organization/KappaXDDkEkLP16',
                    AvailablePolicyTypes: [
                        {
                            Status: 'ENABLED',
                            Type: 'SERVICE_CONTROL_POLICY',
                        },
                    ],
                    FeatureSet: 'ALL',
                    Id: 'KappaXDDkEkLP16',
                    MasterAccountArn:
                        'arn:azure:organizations::270355831570:account/KappaXDDkEkLP16/270355831570',
                    MasterAccountEmail: 'azure.master@GGWP.com',
                    MasterAccountId: '270355831570',
                },
                account_type: 'standalone',
            },
        },
        {
            id: 'b599ae6c-3aaf-49b3-9cb7-67685cf970da',
            providerConnectionID: '270355831570',
            providerConnectionName: 'MA-KEKT-SP-8-Prod',
            email: '',
            connector: SourceType.CloudAzure,
            description: '',
            onboardDate: '2023-05-18T19:10:40.310403Z',
            assetDiscoveryMethod:
                SourceAssetDiscoveryMethodType.AssetDiscoveryMethodTypeScheduled,
            credentialID: '7ablapxa-12e1-411a-klls2-65412almvdpo',
            credentialName: 'Azure - 270355831570 - default credentials',
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeAutoAzure,
            credential: {
                id: '',
                connectorType: SourceType.Nil,
                credentialType: undefined,
                enabled: false,
                autoOnboardEnabled: false,
                onboardDate: '0001-01-01T00:00:00Z',
                config: null,
                lastHealthCheckTime: '0001-01-01T00:00:00Z',
                healthStatus: SourceHealthStatus.HealthStatusNil,
            },
            lifecycleState:
                GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionLifecycleState.ConnectionLifecycleStateOnboard,
            lastHealthCheckTime: '2023-08-06T05:47:40.749988Z',
            healthReason: '',
            lastInventory: '2023-08-06T04:24:36.36Z',
            cost: 127046.073815101,
            dailyCostAtStartTime: 4114.104648687,
            dailyCostAtEndTime: 2591.7358406503,
            resourceCount: 4913,
            oldResourceCount: 5165,
            metadata: {
                account_id: '270355831570',
                account_name: 'ASKCXUIOPLKJHGFDXCV1',
                account_organization: {
                    Arn: 'arn:azure:organizations::270355831570:organization/KappaXDDkEkLP16',
                    AvailablePolicyTypes: [
                        {
                            Status: 'ENABLED',
                            Type: 'SERVICE_CONTROL_POLICY',
                        },
                    ],
                    FeatureSet: 'ALL',
                    Id: 'KappaXDDkEkLP16',
                    MasterAccountArn:
                        'arn:azure:organizations::270355831570:account/KappaXDDkEkLP16/270355831570',
                    MasterAccountEmail: 'azure.master@GGWP.com',
                    MasterAccountId: '270355831570',
                },
                account_type: 'standalone',
            },
        },
    ],
    Credentials: [
        {
            id: '420BP9ae6c-faxi-61b3-4207-67685cf970da',
            name: 'KappaXDDkEkLP16',
            connectorType: SourceType.CloudAWS,
            credentialType:
                GithubComKaytuIoKaytuEnginePkgOnboardApiCredentialType.CredentialTypeManualAwsOrganization,
            enabled: true,
            autoOnboardEnabled: false,
            onboardDate: '2023-07-03T12:21:33.406928Z',
            config: '',
            lastHealthCheckTime: '2023-08-06T07:38:36.441058Z',
            healthStatus: SourceHealthStatus.HealthStatusHealthy,
            healthReason: '',
            metadata: {
                account_id: '151214229786',
                attached_policies: [
                    'arn:azure:iam::azure:policy/AZUREOrganizationsReadOnlyAccess',
                    'arn:azure:iam::azure:policy/ReadOnlyAccess',
                    'arn:azure:iam::azure:policy/SecurityAudit',
                    'arn:azure:iam::151214229786:policy/ReadOnly-SupplementPolicy',
                ],
                iam_api_key_creation_date: '2023-07-03T10:26:08Z',
                iam_user_name: 'gab-aes-inventory-scripts',
                organization_discovered_account_count: 10,
                organization_id: 'KappaXDDkEkLP16',
                organization_master_account_email: 'azure.master@GGWP.com',
                organization_master_account_id: '151214229786',
            },
            total_connections: 10,
            enabled_connections: 3,
            unhealthy_connections: 2,
        },
    ],
}
export default function ConnectorDetail() {
    const navigate = useNavigate()
    const { connector } = useParams()

    const activeTimeRange = useAtomValue(timeAtom)
    const provider = StringToProvider(connector || '')
    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            ...(provider !== '' && {
                connector: [provider],
            }),
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            pageSize: 10000,
            pageNumber: 1,
        })
    const { response: credentials, isLoading: isCredentialLoading } =
        useOnboardApiV1CredentialList({
            connector: provider,
        })

    const breadcrumbsPages = [
        {
            name: 'Integrations',
            path: () => {
                navigate('./..')
            },
            current: false,
        },
        { name: connector, path: '', current: true },
    ]
    return (
        <Menu currentPage="integration">
            <Flex flexDirection="col" alignItems="start">
                <Flex className="mb-6">
                    <Breadcrumbs pages={breadcrumbsPages} />
                </Flex>
                <Title className="font-semibold">{connector}</Title>
                {connector === 'AWS' ? (
                    <>
                        <AWSSummary
                            accountsSummary={accounts}
                            accountLoading={isAccountsLoading}
                            credential={credentials}
                            credentialLoading={isCredentialLoading}
                        />
                        <AWSTabs
                            accounts={
                                isDemo()
                                    ? MockAWS.accounts
                                    : accounts?.connections || []
                            }
                            organizations={
                                isDemo()
                                    ? MockAWS.Credentials
                                    : credentials?.credentials || []
                            }
                            loading={isDemo() ? false : isAccountsLoading}
                        />
                    </>
                ) : (
                    <>
                        <AzureSummary
                            principalsSummary={credentials}
                            principalsLoading={isCredentialLoading}
                            subscriptionsSummary={accounts}
                            subscriptionsLoading={isAccountsLoading}
                        />
                        <AzureTabs
                            principals={
                                isDemo()
                                    ? MockAzure.accounts
                                    : credentials?.credentials || []
                            }
                            subscriptions={
                                isDemo()
                                    ? MockAzure.accounts
                                    : accounts?.connections || []
                            }
                            loading={isDemo() ? false : isAccountsLoading}
                        />
                    </>
                )}
            </Flex>
        </Menu>
    )
}
