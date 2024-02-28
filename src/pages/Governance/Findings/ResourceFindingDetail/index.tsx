import { useAtomValue, useSetAtom } from 'jotai'
import {
    Card,
    Flex,
    Grid,
    List,
    ListItem,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    Title,
} from '@tremor/react'
import { useEffect } from 'react'
import ReactJson from '@microlink/react-json-view'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    GithubComKaytuIoKaytuEnginePkgComplianceApiResourceFinding,
} from '../../../../api/api'
import DrawerPanel from '../../../../components/DrawerPanel'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import { useComplianceApiV1FindingsResourceCreate } from '../../../../api/compliance.gen'
import Spinner from '../../../../components/Spinner'
import { severityBadge } from '../../Controls'
import { isDemoAtom, notificationAtom } from '../../../../store'
import Timeline from '../FindingsWithFailure/Detail/Timeline'

interface IResourceFindingDetail {
    resourceFinding:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiResourceFinding
        | undefined
    controlID?: string
    open: boolean
    onClose: () => void
    onRefresh: () => void
}

export default function ResourceFindingDetail({
    resourceFinding,
    controlID,
    open,
    onClose,
    onRefresh,
}: IResourceFindingDetail) {
    const { response, isLoading, sendNow } =
        useComplianceApiV1FindingsResourceCreate(
            { kaytuResourceId: resourceFinding?.kaytuResourceID || '' },
            {},
            false
        )

    useEffect(() => {
        if (resourceFinding && open) {
            sendNow()
        }
    }, [resourceFinding, open])

    const isDemo = useAtomValue(isDemoAtom)

    return (
        <DrawerPanel
            open={open}
            onClose={onClose}
            title={
                <Flex justifyContent="start">
                    {getConnectorIcon(resourceFinding?.connector)}
                    <Title className="text-lg font-semibold ml-2 my-1">
                        {resourceFinding?.resourceName}
                    </Title>
                </Flex>
            }
        >
            <Grid className="w-full gap-4 mb-6" numItems={2}>
                <SummaryCard
                    title="Account"
                    metric={resourceFinding?.providerConnectionName}
                    secondLine={resourceFinding?.providerConnectionID}
                    blur={isDemo}
                    blurSecondLine={isDemo}
                    isString
                />
                <SummaryCard
                    title="Resource"
                    metric={resourceFinding?.resourceName}
                    secondLine={resourceFinding?.kaytuResourceID}
                    blurSecondLine={isDemo}
                    isString
                />
                <SummaryCard
                    title="Resource Type"
                    metric={resourceFinding?.resourceTypeLabel}
                    secondLine={resourceFinding?.resourceType}
                    isString
                />
                <SummaryCard
                    title="Conformance Status"
                    metric={
                        (resourceFinding?.failedCount || 0) > 0 ? (
                            <Flex className="w-fit gap-1.5">
                                <XCircleIcon className="h-4 text-rose-600" />
                                <Text>Failed</Text>
                            </Flex>
                        ) : (
                            <Flex className="w-fit gap-1.5">
                                <CheckCircleIcon className="h-4 text-emerald-500" />
                                <Text>Passed</Text>
                            </Flex>
                        )
                    }
                    isString
                />
            </Grid>
            <TabGroup>
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    alignItems="end"
                >
                    <TabList className="w-full">
                        <>
                            <Tab>Applicable Controls</Tab>
                            <Tab disabled={!response?.resource}>
                                Resource Details
                            </Tab>
                        </>
                    </TabList>
                </Flex>

                <TabPanels>
                    <TabPanel>
                        {isLoading ? (
                            <Spinner className="mt-12" />
                        ) : (
                            <List>
                                {response?.controls
                                    ?.filter((c) => {
                                        if (controlID !== undefined) {
                                            return c.controlID === controlID
                                        }
                                        return true
                                    })
                                    .map((control) => (
                                        <ListItem>
                                            <Flex
                                                flexDirection="col"
                                                alignItems="start"
                                                className="gap-1 w-fit max-w-[80%]"
                                            >
                                                <Text className="text-gray-800 w-full truncate">
                                                    {control.controlTitle}
                                                </Text>
                                                <Flex justifyContent="start">
                                                    {control.conformanceStatus ===
                                                    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusPassed ? (
                                                        <Flex className="w-fit gap-1.5">
                                                            <CheckCircleIcon className="h-4 text-emerald-500" />
                                                            <Text>Passed</Text>
                                                        </Flex>
                                                    ) : (
                                                        <Flex className="w-fit gap-1.5">
                                                            <XCircleIcon className="h-4 text-rose-600" />
                                                            <Text>Failed</Text>
                                                        </Flex>
                                                    )}
                                                    <Flex className="border-l border-gray-200 ml-3 pl-3 h-full">
                                                        <Text className="text-xs">
                                                            SECTION:
                                                        </Text>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                            {severityBadge(control.severity)}
                                        </ListItem>
                                    ))}
                            </List>
                        )}
                    </TabPanel>
                    <TabPanel>
                        <Title className="mb-2">JSON</Title>
                        <Card className="px-1.5 py-3 mb-2">
                            <ReactJson src={response?.resource || {}} />
                        </Card>
                    </TabPanel>
                    <TabPanel className="pt-8">
                        <Timeline data={response} isLoading={isLoading} />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </DrawerPanel>
    )
}
