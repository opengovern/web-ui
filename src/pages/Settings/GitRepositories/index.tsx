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
    const [newMetricsGitURL, setNewMetricsGitURL] = useState<string>('')

    const { response: metricsGitURL, isLoading: loadingMetricsGitURL } =
        useMetadataApiV1MetadataDetail('analytics_git_url')
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

    if (loadingMetricsGitURL) {
        return (
            <Flex justifyContent="center" className="mt-56">
                <Spinner />
            </Flex>
        )
    }

    if (!updateInputs) {
        setUpdateInputs(true)
        setNewMetricsGitURL(metricsGitURL?.value || '')
    }

    const save = async () => {
        const setUrls = [
            setMetricsGitURL(),
        ]
        await Promise.all(setUrls).then(() => {
            syncQueries()
        })
    }

    const saveLoading = () => {
        return (
            (executeSetMetricsGitURL && loadingSetMetricsGitURL) ||
            (executeSyncQueries && loadingSyncQueries)
        )
    }

    return (
        <Card key="summary" className="top-6">
            <Title className="font-semibold">Git Repositories</Title>
            <Flex justifyContent="start" className="truncate space-x-4">
                <div className="truncate">
                    <Text className="truncate text-sm">
                        At the present time, for git repositories to function,
                        they need to be public and accessible over https://.
                    </Text>
                </div>
            </Flex>
            <List className="mt-4">
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
