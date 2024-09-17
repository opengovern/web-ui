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
    Tab,
    TabGroup,
    TabList,
    Button,
    TextInput,
} from '@tremor/react'
import { useParams } from 'react-router-dom'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'

import {
    useWorkspaceApiV1WorkspaceCurrentList,
    useWorkspaceApiV1WorkspacesLimitsDetail,
} from '../../../api/workspace.gen'
import Spinner from '../../../components/Spinner'
import { numericDisplay } from '../../../utilities/numericDisplay'
import { useAuthApiV1UserDetail } from '../../../api/auth.gen'
import { dateDisplay } from '../../../utilities/dateDisplay'
import { GithubComKaytuIoKaytuEnginePkgWorkspaceApiTier } from '../../../api/api'
import {  previewAtom } from '../../../store'
import {
    useMetadataApiV1MetadataCreate,
    useMetadataApiV1MetadataDetail,
} from '../../../api/metadata.gen'
import { useComplianceApiV1QueriesSyncList } from '../../../api/compliance.gen'
import { getErrorMessage } from '../../../types/apierror'
import { ConvertToBoolean } from '../../../utilities/bool'


interface ITextMetric {
    title: string
    metricId: string
    disabled?: boolean
}

function TextMetric({ title, metricId, disabled }: ITextMetric) {
    const [value, setValue] = useState<string>('')
    const [timer, setTimer] = useState<any>()

    const {
        response,
        isLoading,
        isExecuted,
        sendNow: refresh,
    } = useMetadataApiV1MetadataDetail(metricId)

    const {
        isLoading: setIsLoading,
        isExecuted: setIsExecuted,
        error,
        sendNow: sendSet,
    } = useMetadataApiV1MetadataCreate(
        {
            key: metricId,
            value,
        },
        {},
        false
    )

    useEffect(() => {
        if (isExecuted && !isLoading) {
            setValue(response?.value || '')
        }
    }, [isLoading])

    useEffect(() => {
        if (setIsExecuted && !setIsLoading) {
            refresh()
        }
    }, [setIsLoading])

    useEffect(() => {
        if (value === '' || value === response?.value) {
            return
        }

        if (timer !== undefined && timer !== null) {
            clearTimeout(timer)
        }

        const t = setTimeout(() => {
            sendSet()
        }, 1500)

        setTimer(t)
    }, [value])

    return (
        <Flex flexDirection="row" className="mb-4">
            <Flex justifyContent="start" className="truncate space-x-4 ">
                <div className="truncate">
                    <Text className="truncate text-sm">{title}:</Text>
                </div>
            </Flex>

            <TextInput
                value={value}
                onValueChange={(e) => setValue(String(e))}
                error={error !== undefined}
                errorMessage={getErrorMessage(error)}
                icon={isLoading ? Spinner : undefined}
                disabled={isLoading || disabled}
            />
        </Flex>
    )
}
export default function SettingsEntitlement() {
    const workspace = useParams<{ ws: string }>().ws
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
    const [preview, setPreview] = useAtom(previewAtom)
 const {
     response: customizationEnabled,
     isLoading: loadingCustomizationEnabled,
 } = useMetadataApiV1MetadataDetail('customization_enabled')
 const isCustomizationEnabled =
     ConvertToBoolean((customizationEnabled?.value || 'false').toLowerCase()) ||
     false

    const wsTier = (v?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiTier) => {
        switch (v) {
            // case GithubComKaytuIoKaytuEnginePkgWorkspaceApiTier.TierEnterprise:
            //     return 'Enterprise'
            default:
                return 'Community'
        }
    }
    const wsDetails = [
        // {
        //     title: 'Workspace ID',
        //     value: currentWorkspace?.id,
        // },
        // {
        //     title: 'Displayed name',
        //     value: currentWorkspace?.name,
        // },
        // {
        //     title: 'URL',
        //     value: currentWorkspace?.,
        // },
        // {
        //     title: 'Workspace owner',
        //     value: ownerResp?.userName,
        // },
        {
            title: 'Version',
            value: currentWorkspace?.version,
        },
        {
            title: 'License',
            value: (
                <a
                    href="https://github.com/elastic/eui/blob/main/licenses/ELASTIC-LICENSE-2.0.md"
                    className="text-blue-600 underline"
                >
                    Elastic License V2
                </a>
            ),
        },
        {
            title: 'Creation date',
            value: dateDisplay(
                currentWorkspace?.createdAt || Date.now().toString()
            ),
        },
        {
            title: 'Edition',
            value: wsTier(currentWorkspace?.tier),
        },
    ]
       const {
           isLoading: syncLoading,
           isExecuted: syncExecuted,
           error: syncError,
           sendNow: runSync,
       } = useComplianceApiV1QueriesSyncList({}, {}, false)


    return isLoading || loadingCurrentWS || ownerIsLoading ? (
        <Flex justifyContent="center" className="mt-56">
            <Spinner />
        </Flex>
    ) : (
        <Flex flexDirection="col">
            {/* <Grid numItemsSm={2} numItemsLg={3} className="gap-4 w-full"> */}
            {/* <Card key="activeUsers">
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
                </Card> */}
            {/* <Card key="hosts">
                    <Text>Hosts</Text>
                    <Metric>{numericDisplay(noOfHosts)}</Metric>
                    <Flex className="mt-3">
                        <Text className="truncate">{`${hostsPercentage}%`}</Text>
                        <Text>{numericDisplay(maxHosts)} Allowed</Text>
                    </Flex>
                    <ProgressBar value={hostsPercentage} className="mt-2" />
                </Card> */}
            {/* </Grid> */}
            <Card key="summary" className=" w-full">
                <Title className="font-semibold">Workspace Settings</Title>
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
                <Title className="font-semibold mt-8">Git Repositories</Title>
                <Flex justifyContent="start" className="truncate space-x-4">
                    <div className="truncate">
                        <Text className="truncate text-sm">
                            At the present time, for git repositories to
                            function, they need to be public and accessible over
                            https://.
                        </Text>
                    </div>
                </Flex>
                <Flex
                    flexDirection="row"
                    className="mt-4"
                    alignItems="start"
                    justifyContent="start"
                >
                    <TextMetric
                        metricId="analytics_git_url"
                        title="Configuration Git URL"
                        disabled={
                            loadingCustomizationEnabled ||
                            isCustomizationEnabled === false
                        }
                    />
                    <Button
                        variant="secondary"
                        className="ml-2"
                        loading={syncExecuted && syncLoading}
                        onClick={() => runSync()}
                    >
                        Re-Sync
                    </Button>
                </Flex>

                <Title className="font-semibold mt-8">App configurations</Title>

                {/* <Flex
                flexDirection="row"
                justifyContent="between"
                className="w-full mt-2"
            >
                <Text className="font-normal">Demo Mode</Text>
                <TabGroup
                    index={selectedMode}
                    onIndexChange={setSelectedMode}
                    className="w-fit"
                >
                    <TabList className="border border-gray-200" variant="solid">
                        <Tab>App mode</Tab>
                        <Tab>Demo mode</Tab>
                    </TabList>
                </TabGroup>
            </Flex> */}
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    className="w-full mt-4"
                >
                    <Text className="font-normal">Show preview features</Text>
                    <TabGroup
                        index={preview === 'true' ? 0 : 1}
                        onIndexChange={(idx) =>
                            setPreview(idx === 0 ? 'true' : 'false')
                        }
                        className="w-fit"
                    >
                        <TabList
                            className="border border-gray-200"
                            variant="solid"
                        >
                            <Tab>On</Tab>
                            <Tab>Off</Tab>
                        </TabList>
                    </TabGroup>
                </Flex>
            </Card>
        </Flex>
    )
}
