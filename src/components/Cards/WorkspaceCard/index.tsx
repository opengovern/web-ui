import {
    Badge,
    Button,
    Card,
    Col,
    Flex,
    Grid,
    Metric,
    Text,
    Title,
} from '@tremor/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { ArrowPathIcon, ArrowSmallRightIcon } from '@heroicons/react/24/solid'
import {
    useWorkspaceApiV1WorkspaceDelete,
    useWorkspaceApiV1WorkspaceResumeCreate,
    useWorkspaceApiV1WorkspacesLimitsDetail,
    useWorkspaceApiV1WorkspaceSuspendCreate,
} from '../../../api/workspace.gen'

interface IWorkSpace {
    workspace: any
}

const getBadgeColor = (status: string) => {
    switch (status) {
        case 'PROVISIONED':
            return 'green'
        case 'SUSPENDED':
            return 'orange'
        case 'DELETED':
        case 'DELETING':
        case 'PROVISIONING_FAILED':
            return 'red'
        default:
            return 'slate'
    }
}

const showDelete = (status: string) => {
    switch (status) {
        case 'PROVISIONED':
        case 'PROVISIONING':
        case 'PROVISIONING_FAILED':
        case 'SUSPENDED':
        case 'SUSPENDING':
            return true
        default:
            return false
    }
}

const showSuspend = (status: string) => {
    switch (status) {
        case 'PROVISIONED':
        case 'PROVISIONING':
        case 'PROVISIONING_FAILED':
            return true
        default:
            return false
    }
}

export default function WorkspaceCard({ workspace }: IWorkSpace) {
    const navigate = useNavigate()
    const { response: workspaceDetail } =
        useWorkspaceApiV1WorkspacesLimitsDetail(workspace.name)
    const {
        isLoading: suspendLoading,
        sendNow: callSuspend,
        isExecuted: eS,
    } = useWorkspaceApiV1WorkspaceSuspendCreate(workspace.id, {}, false)
    const {
        isLoading: resumeLoading,
        sendNow: callResume,
        isExecuted: eR,
    } = useWorkspaceApiV1WorkspaceResumeCreate(workspace.id, {}, false)
    const {
        isLoading: deleteLoading,
        sendNow: callDelete,
        isExecuted: eD,
    } = useWorkspaceApiV1WorkspaceDelete(workspace.id, {}, false)

    const details = {
        Tier: workspace.tier,
        Resources: workspaceDetail?.currentResources || 0,
        Connections: workspaceDetail?.currentConnections || 0,
        Users: workspaceDetail?.currentUsers || 0,
    }

    const getButton = (status: string) => {
        switch (status) {
            case 'PROVISIONED':
                return (
                    <Button
                        variant="primary"
                        icon={ArrowSmallRightIcon}
                        iconPosition="right"
                        onClick={() => {
                            navigate(`/${workspace.name}`)
                        }}
                    >
                        Access
                    </Button>
                )
            case 'SUSPENDED':
                return (
                    <Button
                        variant="primary"
                        icon={ArrowPathIcon}
                        iconPosition="right"
                        loading={resumeLoading && eR}
                        onClick={() => callResume()}
                    >
                        Resume
                    </Button>
                )
            default:
                return null
        }
    }

    return (
        <Card>
            <Flex flexDirection="row" className="mb-6">
                <Flex flexDirection="row" className="w-fit">
                    <Metric>{workspace.name}</Metric>
                    <Badge
                        size="md"
                        color={getBadgeColor(workspace.status || '')}
                        className="ml-2"
                    >
                        {workspace.status}
                    </Badge>
                </Flex>
                <Flex flexDirection="row" className="w-fit">
                    {showSuspend(workspace.status) && (
                        <Button
                            variant="light"
                            className="pr-2 border-r-gray-600"
                            loading={suspendLoading && eS}
                            onClick={() => callSuspend()}
                        >
                            Suspend
                        </Button>
                    )}
                    {showDelete(workspace.status) && (
                        <Button
                            variant="light"
                            className="pl-2"
                            loading={deleteLoading && eD}
                            onClick={() => callDelete()}
                        >
                            Delete
                        </Button>
                    )}
                </Flex>
            </Flex>
            <Grid numItems={2} numItemsLg={4} className="gap-6 mb-6">
                {Object.entries(details).map(([name, value]) => (
                    <Col>
                        <Card>
                            <Flex flexDirection="col">
                                <Title color="slate" className="mb-3">
                                    {name}
                                </Title>
                                <Title>{value}</Title>
                            </Flex>
                        </Card>
                    </Col>
                ))}
            </Grid>
            <Flex flexDirection="row">
                <Flex flexDirection="row" className="w-fit">
                    <Text className="pr-2 border-r-gray-600">
                        {workspace.version}
                    </Text>
                    <Text className="pl-2">
                        {dayjs(workspace.createdAt).format('YYYY-MM-DD')}
                    </Text>
                </Flex>
                {getButton(workspace.status || '')}
            </Flex>
        </Card>
    )
}
