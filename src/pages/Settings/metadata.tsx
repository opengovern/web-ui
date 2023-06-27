import React from 'react'
import {
    Bold,
    Card,
    Flex,
    Grid,
    List,
    ListItem,
    Metric,
    ProgressBar,
    Text,
    Title,
} from '@tremor/react'
import {
    BuildingOfficeIcon,
    HomeIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { Link, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import LoggedInLayout from '../../components/LoggedInLayout'
import {
    useWorkspaceApiV1WorkspaceCurrentList,
    useWorkspaceApiV1WorkspacesLimitsDetail,
} from '../../api/workspace.gen'
import Spinner from '../../components/Spinner'
import { numericDisplay } from '../../utilities/numericDisplay'
import { useAuthApiV1UserDetail } from '../../api/auth.gen'

const SettingsMetadata: React.FC<any> = () => {
    const workspace = useParams<{ ws: string }>().ws
    const { response, isLoading } = useWorkspaceApiV1WorkspacesLimitsDetail(
        workspace || ''
    )

    const { response: currentWorkspace, isLoading: loadingCurrentWS } =
        useWorkspaceApiV1WorkspaceCurrentList()

    if (isLoading || loadingCurrentWS) {
        return <Spinner />
    }

    const currentUsers = response?.currentUsers || 0
    const currentConnections = response?.currentConnections || 0
    const currentResources = response?.currentResources || 0

    const maxUsers = response?.maxUsers || 1
    const maxConnections = response?.maxConnections || 1
    const maxResources = response?.maxResources || 1

    const usersPercentage = Math.ceil(currentUsers / maxUsers)
    const connectionsPercentage = Math.ceil(currentConnections / maxConnections)
    const resourcesPercentage = Math.ceil(currentResources / maxResources)

    const wsDetails = [
        {
            title: 'Workspace ID',
            value: currentWorkspace?.id,
        },
        {
            title: 'Displayed Name',
            value: currentWorkspace?.name,
        },
        {
            title: 'URL',
            value: currentWorkspace?.uri,
        },
        {
            title: 'Workspace Owner',
            value: currentWorkspace?.ownerId, //TODO get name from backend
        },
        {
            title: 'Workspace Version',
            value: currentWorkspace?.version,
        },
        {
            title: 'Creation Date',
            value: new Date(
                Date.parse(currentWorkspace?.createdAt || Date.now().toString())
            ).toLocaleDateString('en-US'),
        },
        {
            title: 'Workspace Tier',
            value: currentWorkspace?.tier,
        },
    ]

    return (
        <>
            <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
                <Card key="activeUsers">
                    <Text>Active users</Text>
                    <Metric>{numericDisplay(currentUsers)}</Metric>
                    <Flex className="mt-4">
                        <Text className="truncate">{`${usersPercentage}%`}</Text>
                        <Text>{numericDisplay(maxUsers)} Allowed</Text>
                    </Flex>
                    <ProgressBar value={usersPercentage} className="mt-2" />
                </Card>
                <Card key="connections">
                    <Text>Connections</Text>
                    <Metric>{numericDisplay(currentConnections)}</Metric>
                    <Flex className="mt-4">
                        <Text className="truncate">{`${connectionsPercentage}%`}</Text>
                        <Text>{numericDisplay(maxConnections)} Allowed</Text>
                    </Flex>
                    <ProgressBar
                        value={connectionsPercentage}
                        className="mt-2"
                    />
                </Card>
                <Card key="activeUsers">
                    <Text>Resources</Text>
                    <Metric>{numericDisplay(currentResources)}</Metric>
                    <Flex className="mt-4">
                        <Text className="truncate">{`${resourcesPercentage}%`}</Text>
                        <Text>{numericDisplay(maxResources)} Allowed</Text>
                    </Flex>
                    <ProgressBar value={resourcesPercentage} className="mt-2" />
                </Card>
            </Grid>
            <Card key="summary" className="top-10">
                <Title>Summary</Title>
                <List className="mt-4">
                    {wsDetails.map((item) => (
                        <ListItem key={item.title}>
                            <Flex
                                justifyContent="start"
                                className="truncate space-x-4"
                            >
                                <div className="truncate">
                                    <Text className="truncate">
                                        <Bold>{item.title}</Bold>
                                    </Text>
                                </div>
                            </Flex>
                            <Text>{item.value}</Text>
                        </ListItem>
                    ))}
                </List>
            </Card>
        </>
    )
}

export default SettingsMetadata
