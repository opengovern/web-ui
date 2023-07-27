import { useState } from 'react'
import {
    Button,
    Card,
    Flex,
    List,
    ListItem,
    Text,
    TextInput,
    Title,
} from '@tremor/react'
import Spinner from '../../../components/Spinner'
import {
    useMetadataApiV1MetadataCreate,
    useMetadataApiV1MetadataDetail,
} from '../../../api/metadata.gen'

import { useComplianceApiV1QueriesSyncList } from '../../../api/compliance.gen'

export default function SettingsGitRepositories() {
    const [updateInputs, setUpdateInputs] = useState<boolean>(false)
    const [newAWSComplianceGitURL, setNewAWSComplianceGitURL] =
        useState<string>('')
    const [newAzureComplianceGitURL, setNewAzureComplianceGitURL] =
        useState<string>('')
    const [newInsightsGitURL, setNewInsightsGitURL] = useState<string>('')
    const [newQueriesGitURL, setNewQueriesGitURL] = useState<string>('')
    const [newMetricsGitURL, setNewMetricsGitURL] = useState<string>('')

    const {
        response: awsComplianceGitURL,
        isLoading: loadingAwsComplianceGitURL,
    } = useMetadataApiV1MetadataDetail('aws_compliance_git_url')
    const {
        response: azureComplianceGitURL,
        isLoading: loadingAzureComplianceGitURL,
    } = useMetadataApiV1MetadataDetail('azure_compliance_git_url')
    const { response: insightsGitURL, isLoading: loadingInsightGitURL } =
        useMetadataApiV1MetadataDetail('insights_git_url')
    const { response: queriesGitURL, isLoading: loadingQueriesGitURL } =
        useMetadataApiV1MetadataDetail('queries_git_url')
    const { response: metricsGitURL, isLoading: loadingMetricsGitURL } =
        useMetadataApiV1MetadataDetail('analytics_git_url')
    const {
        isLoading: loadingSetAwsComplianceGitURL,
        isExecuted: executeSetAwsComplianceGitURL,
        sendNow: setAwsComplianceGitURL,
    } = useMetadataApiV1MetadataCreate(
        {
            key: 'aws_compliance_git_url',
            value: newAWSComplianceGitURL,
        },
        {},
        false
    )
    const {
        isLoading: loadingSetAzureComplianceGitURL,
        isExecuted: executeSetAzureComplianceGitURL,
        sendNow: setAzureComplianceGitURL,
    } = useMetadataApiV1MetadataCreate(
        {
            key: 'azure_compliance_git_url',
            value: newAzureComplianceGitURL,
        },
        {},
        false
    )
    const {
        isLoading: loadingSetInsightGitURL,
        isExecuted: executeSetInsightGitURL,
        sendNow: setInsightGitURL,
    } = useMetadataApiV1MetadataCreate(
        {
            key: 'insights_git_url',
            value: newInsightsGitURL,
        },
        {},
        false
    )
    const {
        isLoading: loadingSetQueriesGitURL,
        isExecuted: executeSetQueriesGitURL,
        sendNow: setQueriesGitURL,
    } = useMetadataApiV1MetadataCreate(
        {
            key: 'queries_git_url',
            value: newQueriesGitURL,
        },
        {},
        false
    )
    const {
        isLoading: loadingSetMetricsGitURL,
        isExecuted: executeSetMetricsGitURL,
        sendNow: setMetricsGitURL,
    } = useMetadataApiV1MetadataCreate(
        {
            key: 'analytics_git_url',
            value: newMetricsGitURL,
        },
        {},
        false
    )
    const {
        isLoading: loadingSyncQueries,
        isExecuted: executeSyncQueries,
        sendNow: syncQueries,
    } = useComplianceApiV1QueriesSyncList({}, false)

    if (
        loadingAwsComplianceGitURL ||
        loadingAzureComplianceGitURL ||
        loadingInsightGitURL ||
        loadingQueriesGitURL ||
        loadingMetricsGitURL
    ) {
        return (
            <Flex justifyContent="center" className="mt-56">
                <Spinner />
            </Flex>
        )
    }

    if (!updateInputs) {
        setUpdateInputs(true)
        setNewAWSComplianceGitURL(awsComplianceGitURL?.value || '')
        setNewAzureComplianceGitURL(azureComplianceGitURL?.value || '')
        setNewInsightsGitURL(insightsGitURL?.value || '')
        setNewQueriesGitURL(queriesGitURL?.value || '')
        setNewMetricsGitURL(metricsGitURL?.value || '')
    }

    const save = async () => {
        const setUrls = [
            setAwsComplianceGitURL(),
            setAzureComplianceGitURL(),
            setInsightGitURL(),
            setQueriesGitURL(),
            setMetricsGitURL(),
        ]
        await Promise.all(setUrls).then(() => {
            syncQueries()
        })
    }

    const saveLoading = () => {
        return (
            (executeSetAwsComplianceGitURL && loadingSetAwsComplianceGitURL) ||
            (executeSetAzureComplianceGitURL &&
                loadingSetAzureComplianceGitURL) ||
            (executeSetInsightGitURL && loadingSetInsightGitURL) ||
            (executeSetQueriesGitURL && loadingSetQueriesGitURL) ||
            (executeSetMetricsGitURL && loadingSetMetricsGitURL) ||
            (executeSyncQueries && loadingSyncQueries)
        )
    }

    return (
        <Card key="summary" className="top-6">
            <Title>Git Repositories</Title>
            <Flex justifyContent="start" className="truncate space-x-4">
                <div className="truncate">
                    <Text className="truncate text-sm">
                        At the present time, for git repositories to function,
                        they need to be public and accessible over https://.
                    </Text>
                </div>
            </Flex>
            <List className="mt-4">
                <ListItem key="aws_compliance_git_url" className="my-1">
                    <Flex justifyContent="start" className="truncate space-x-4">
                        <div className="truncate">
                            <Text className="truncate text-sm">
                                AWS Compliance Git URL:
                            </Text>
                        </div>
                    </Flex>
                    <TextInput
                        className="text-sm"
                        value={newAWSComplianceGitURL}
                        onChange={(e) =>
                            setNewAWSComplianceGitURL(e.target.value)
                        }
                        icon={
                            executeSetAwsComplianceGitURL &&
                            loadingSetAwsComplianceGitURL
                                ? Spinner
                                : undefined
                        }
                        disabled={
                            executeSetAwsComplianceGitURL &&
                            loadingSetAwsComplianceGitURL
                        }
                    />
                </ListItem>
                <ListItem key="azure_compliance_git_url" className="my-1">
                    <Flex justifyContent="start" className="truncate space-x-4">
                        <div className="truncate">
                            <Text className="truncate text-sm">
                                Azure Compliance Git URL:
                            </Text>
                        </div>
                    </Flex>
                    <TextInput
                        className="text-sm"
                        value={newAzureComplianceGitURL}
                        onChange={(e) =>
                            setNewAzureComplianceGitURL(e.target.value)
                        }
                        icon={
                            executeSetAzureComplianceGitURL &&
                            loadingSetAzureComplianceGitURL
                                ? Spinner
                                : undefined
                        }
                        disabled={
                            executeSetAzureComplianceGitURL &&
                            loadingSetAzureComplianceGitURL
                        }
                    />
                </ListItem>
                <ListItem key="insights_git_url" className="my-1">
                    <Flex justifyContent="start" className="truncate space-x-4">
                        <div className="truncate">
                            <Text className="truncate text-sm">
                                Insights Git URL:
                            </Text>
                        </div>
                    </Flex>
                    <TextInput
                        className="text-sm"
                        value={newInsightsGitURL}
                        onChange={(e) => setNewInsightsGitURL(e.target.value)}
                        icon={
                            executeSetInsightGitURL && loadingSetInsightGitURL
                                ? Spinner
                                : undefined
                        }
                        disabled={
                            executeSetInsightGitURL && loadingSetInsightGitURL
                        }
                    />
                </ListItem>
                <ListItem key="queries_git_url" className="my-1">
                    <Flex justifyContent="start" className="truncate space-x-4">
                        <div className="truncate">
                            <Text className="truncate text-sm">
                                Queries Git URL:
                            </Text>
                        </div>
                    </Flex>
                    <TextInput
                        className="text-sm"
                        value={newQueriesGitURL}
                        onChange={(e) => setNewQueriesGitURL(e.target.value)}
                        icon={
                            executeSetQueriesGitURL && loadingSetQueriesGitURL
                                ? Spinner
                                : undefined
                        }
                        disabled={
                            executeSetQueriesGitURL && loadingSetQueriesGitURL
                        }
                    />
                </ListItem>
                <ListItem key="metrics_git_url" className="my-1">
                    <Flex justifyContent="start" className="truncate space-x-4">
                        <div className="truncate">
                            <Text className="truncate text-sm">
                                Metrics Git URL:
                            </Text>
                        </div>
                    </Flex>
                    <TextInput
                        className="text-sm"
                        value={newMetricsGitURL}
                        onChange={(e) => setNewMetricsGitURL(e.target.value)}
                        icon={
                            executeSetMetricsGitURL && loadingSetMetricsGitURL
                                ? Spinner
                                : undefined
                        }
                        disabled={
                            executeSetMetricsGitURL && loadingSetMetricsGitURL
                        }
                    />
                </ListItem>
                <ListItem key="buttons" className="my-1">
                    <Flex justifyContent="end" className="truncate space-x-4">
                        <Button
                            variant="secondary"
                            color="amber"
                            disabled={saveLoading()}
                            loading={executeSyncQueries && loadingSyncQueries}
                            onClick={syncQueries}
                        >
                            Sync
                        </Button>
                        <Button loading={saveLoading()} onClick={save}>
                            Save
                        </Button>
                    </Flex>
                </ListItem>
            </List>
        </Card>
    )
}
