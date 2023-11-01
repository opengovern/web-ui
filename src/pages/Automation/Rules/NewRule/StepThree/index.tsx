import {
    Button,
    Divider,
    Flex,
    Select,
    SelectItem,
    Text,
    TextInput,
} from '@tremor/react'
import { useEffect, useState } from 'react'
import {
    useAlertingApiV1ActionCreateCreate,
    useAlertingApiV1ActionJiraCreate,
    useAlertingApiV1ActionSlackCreate,
} from '../../../../../api/alerting.gen'

interface IStep {
    onNext: (id: number | string) => void
    onBack: () => void
}

export default function StepThree({ onNext, onBack }: IStep) {
    const [alert, setAlert] = useState('')
    const [method, setMethod] = useState('')
    const [url, setUrl] = useState('')
    const [header, setHeader] = useState('')
    const [body, setBody] = useState('')

    const {
        response: webhookResponse,
        isLoading: isCreateWebhookActionLoading,
        isExecuted: isCreateWebhookActionExecuted,
        sendNow: createWebhookAction,
    } = useAlertingApiV1ActionCreateCreate(
        { body, headers: { header }, method, url },
        {},
        false
    )

    const [slackURL, setSlackURL] = useState('')
    const [slackChannelName, setSlackChannelName] = useState('')

    const {
        response: slackResponse,
        isLoading: isCreateSlackActionLoading,
        isExecuted: isCreateSlackActionExecuted,
        sendNow: createSlackAction,
    } = useAlertingApiV1ActionSlackCreate(
        { slack_url: slackURL, channel_name: slackChannelName },
        {},
        false
    )

    const [jiraDomain, setJiraDomain] = useState('')
    const [jiraAPIToken, setJiraAPIToken] = useState('')
    const [jiraEmail, setJiraEmail] = useState('')
    const [jiraIssueTypeID, setJiraIssueTypeID] = useState('')
    const [jiraProjectID, setJiraProjectID] = useState('')

    const {
        response: jiraResponse,
        isLoading: isCreateJiraActionLoading,
        isExecuted: isCreateJiraActionExecuted,
        sendNow: createJiraAction,
    } = useAlertingApiV1ActionJiraCreate(
        {
            atlassian_domain: jiraDomain,
            atlassian_api_token: jiraAPIToken,
            email: jiraEmail,
            issue_type_id: jiraIssueTypeID,
            project_id: jiraProjectID,
        },
        {},
        false
    )

    const createAction = () => {
        switch (alert) {
            case 'webhook':
                createWebhookAction()
                break
            case 'jira':
                createJiraAction()
                break
            case 'slack':
                createSlackAction()
                break
            default:
                break
        }
    }

    const isLoading = () => {
        switch (alert) {
            case 'webhook':
                return (
                    isCreateWebhookActionLoading &&
                    isCreateWebhookActionExecuted
                )
            case 'jira':
                return isCreateJiraActionLoading && isCreateJiraActionExecuted
            case 'slack':
                return isCreateSlackActionLoading && isCreateSlackActionExecuted
            default:
                return false
        }
    }

    const response = () => {
        switch (alert) {
            case 'webhook':
                return webhookResponse
            case 'jira':
                return jiraResponse?.action_id
            case 'slack':
                return slackResponse?.action_id
            default:
                return undefined
        }
    }

    useEffect(() => {
        if (
            isCreateWebhookActionExecuted ||
            isCreateJiraActionExecuted ||
            isCreateSlackActionExecuted
        ) {
            if (!isLoading()) {
                onNext(String(response()))
            }
        }
    }, [
        isCreateWebhookActionLoading,
        isCreateJiraActionLoading,
        isCreateSlackActionLoading,
    ])

    const renderOption = () => {
        switch (alert) {
            case 'webhook':
                return (
                    <>
                        <Divider />
                        <Text className="mb-6">
                            You need to fill the following information about
                            your Webhook account
                        </Text>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">Method</Text>
                            <TextInput
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-2/3"
                            />
                        </Flex>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">URL</Text>
                            <TextInput
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-2/3"
                            />
                        </Flex>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">Headers</Text>
                            <TextInput
                                value={header}
                                onChange={(e) => setHeader(e.target.value)}
                                className="w-2/3"
                            />
                        </Flex>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">Body</Text>
                            <TextInput
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="w-2/3"
                            />
                        </Flex>
                    </>
                )
            case 'slack':
                return (
                    <>
                        <Divider />
                        <Text className="mb-6">
                            You need to paste your Slack URL here
                        </Text>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">URL</Text>
                            <TextInput
                                className="w-2/3"
                                value={slackURL}
                                onChange={(e) => setSlackURL(e.target.value)}
                            />
                        </Flex>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">Channel Name</Text>
                            <TextInput
                                className="w-2/3"
                                value={slackChannelName}
                                onChange={(e) =>
                                    setSlackChannelName(e.target.value)
                                }
                            />
                        </Flex>
                    </>
                )
            case 'jira':
                return (
                    <>
                        <Divider />
                        <Text className="mb-6">
                            You need to paste your JIRA Configuration here
                        </Text>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">Domain</Text>
                            <TextInput
                                className="w-2/3"
                                value={jiraDomain}
                                onChange={(e) => setJiraDomain(e.target.value)}
                            />
                        </Flex>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">API Token</Text>
                            <TextInput
                                className="w-2/3"
                                value={jiraAPIToken}
                                onChange={(e) =>
                                    setJiraAPIToken(e.target.value)
                                }
                            />
                        </Flex>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">Email</Text>
                            <TextInput
                                className="w-2/3"
                                value={jiraEmail}
                                onChange={(e) => setJiraEmail(e.target.value)}
                            />
                        </Flex>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">Project ID</Text>
                            <TextInput
                                className="w-2/3"
                                value={jiraProjectID}
                                onChange={(e) =>
                                    setJiraProjectID(e.target.value)
                                }
                            />
                        </Flex>
                        <Flex className="mb-6">
                            <Text className="text-gray-800">Issue Type ID</Text>
                            <TextInput
                                className="w-2/3"
                                value={jiraIssueTypeID}
                                onChange={(e) =>
                                    setJiraIssueTypeID(e.target.value)
                                }
                            />
                        </Flex>
                    </>
                )
            default:
                return <div />
        }
    }

    return (
        <Flex flexDirection="col" className="h-full max-h-screen">
            <Flex flexDirection="col" alignItems="start">
                <Flex justifyContent="start" className="gap-1 mb-6">
                    <Text>3/4.</Text>
                    <Text className="text-gray-800 font-semibold">Action</Text>
                </Flex>
                <Flex>
                    <Text className="text-gray-800">Alert type</Text>
                    <Select
                        className="w-2/3"
                        value={alert}
                        onValueChange={setAlert}
                    >
                        <SelectItem value="webhook">
                            <Text>Webhook</Text>
                        </SelectItem>
                        <SelectItem value="slack">
                            <Text>Slack</Text>
                        </SelectItem>
                        <SelectItem value="jira">
                            <Text>Jira Task</Text>
                        </SelectItem>
                    </Select>
                </Flex>
                {renderOption()}
            </Flex>
            <Flex justifyContent="end" className="gap-4">
                <Button variant="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button loading={isLoading()} onClick={createAction}>
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
