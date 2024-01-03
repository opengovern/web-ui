import {
    Card,
    Flex,
    Grid,
    List,
    ListItem,
    Metric,
    ProgressBar,
    Switch,
    Text,
    Title,
} from '@tremor/react'
import { useParams } from 'react-router-dom'
import { useAtom } from 'jotai'
import {
    useWorkspaceApiV1WorkspaceCurrentList,
    useWorkspaceApiV1WorkspacesLimitsDetail,
} from '../../../api/workspace.gen'
import Spinner from '../../../components/Spinner'
import { numericDisplay } from '../../../utilities/numericDisplay'
import { useAuthApiV1UserDetail } from '../../../api/auth.gen'
import { dateDisplay } from '../../../utilities/dateDisplay'
import { previewAtom } from '../../../store'

export default function SettingsEntitlement() {
    const workspace = useParams<{ ws: string }>().ws
    const [preview, setPreview] = useAtom(previewAtom)

    const { response, isLoading } = useWorkspaceApiV1WorkspacesLimitsDetail(
        workspace || ''
    )
    const { response: currentWorkspace, isLoading: loadingCurrentWS } =
        useWorkspaceApiV1WorkspaceCurrentList()
    const { response: ownerResp, isLoading: ownerIsLoading } =
        useAuthApiV1UserDetail(
            currentWorkspace?.ownerId || '',
            {},
            !loadingCurrentWS
        )

    const noOfHosts = 0 // metricsResp?.count || 0

    const currentUsers = response?.currentUsers || 0
    const currentConnections = response?.currentConnections || 0
    const currentResources = response?.currentResources || 0

    const maxUsers = response?.maxUsers || 1
    const maxConnections = response?.maxConnections || 1
    const maxResources = response?.maxResources || 1
    const maxHosts = 100000

    const usersPercentage = Math.ceil((currentUsers / maxUsers) * 100.0)
    const connectionsPercentage = Math.ceil(
        (currentConnections / maxConnections) * 100.0
    )
    const resourcesPercentage = Math.ceil(
        (currentResources / maxResources) * 100.0
    )
    const hostsPercentage = Math.ceil((noOfHosts / maxHosts) * 100.0)

    const wsDetails = [
        {
            title: 'Workspace ID',
            value: currentWorkspace?.id,
        },
        {
            title: 'Displayed name',
            value: currentWorkspace?.name,
        },
        // {
        //     title: 'URL',
        //     value: currentWorkspace?.,
        // },
        {
            title: 'Workspace owner',
            value: ownerResp?.userName,
        },
        {
            title: 'Workspace version',
            value: currentWorkspace?.version,
        },
        {
            title: 'Creation date',
            value: dateDisplay(
                currentWorkspace?.createdAt || Date.now().toString()
            ),
        },
        {
            title: 'Workspace tier',
            value: currentWorkspace?.tier,
        },
    ]

    return isLoading || loadingCurrentWS || ownerIsLoading ? (
        <Flex justifyContent="center" className="mt-56">
            <Spinner />
        </Flex>
    ) : (
        <Flex flexDirection="col">
            <Grid numItemsSm={2} numItemsLg={4} className="gap-4 w-full">
                <Card key="activeUsers">
                    <Text>Active users</Text>
                    <Metric>{numericDisplay(currentUsers)}</Metric>
                    <Flex className="mt-3">
                        <Text className="truncate">{`${usersPercentage}%`}</Text>
                        <Text>{numericDisplay(maxUsers)} Allowed</Text>
                    </Flex>
                    <ProgressBar value={usersPercentage} className="mt-2" />
                </Card>
                <Card key="connections">
                    <Text>Connections</Text>
                    <Metric>{numericDisplay(currentConnections)}</Metric>
                    <Flex className="mt-3">
                        <Text className="truncate">{`${connectionsPercentage}%`}</Text>
                        <Text>{numericDisplay(maxConnections)} Allowed</Text>
                    </Flex>
                    <ProgressBar
                        value={connectionsPercentage}
                        className="mt-2"
                    />
                </Card>
                <Card key="resources">
                    <Text>Resources</Text>
                    <Metric>{numericDisplay(currentResources)}</Metric>
                    <Flex className="mt-3">
                        <Text className="truncate">{`${resourcesPercentage}%`}</Text>
                        <Text>{numericDisplay(maxResources)} Allowed</Text>
                    </Flex>
                    <ProgressBar value={resourcesPercentage} className="mt-2" />
                </Card>
                <Card key="hosts">
                    <Text>Hosts</Text>
                    <Metric>{numericDisplay(noOfHosts)}</Metric>
                    <Flex className="mt-3">
                        <Text className="truncate">{`${hostsPercentage}%`}</Text>
                        <Text>{numericDisplay(maxHosts)} Allowed</Text>
                    </Flex>
                    <ProgressBar value={hostsPercentage} className="mt-2" />
                </Card>
            </Grid>
            <Card key="summary" className="mt-4 w-full">
                <Title className="font-semibold">Summary</Title>
                <List className="mt-3">
                    {wsDetails.map((item) => (
                        <ListItem key={item.title} className="my-1">
                            <Text className="truncate">{item.title}</Text>
                            <Text className="text-gray-800">{item.value}</Text>
                        </ListItem>
                    ))}
                    {/* <ListItem>
                        <Text>Show preview features</Text>
                        <Switch
                            onClick={() =>
                                preview === 'true'
                                    ? setPreview('false')
                                    : setPreview('true')
                            }
                            checked={preview === 'true'}
                        />
                    </ListItem> */}
                </List>
            </Card>
        </Flex>
    )
}
