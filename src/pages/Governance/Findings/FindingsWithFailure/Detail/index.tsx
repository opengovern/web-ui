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
    GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
} from '../../../../../api/api'
import DrawerPanel from '../../../../../components/DrawerPanel'
import { getConnectorIcon } from '../../../../../components/Cards/ConnectorCard'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import {
    useComplianceApiV1BenchmarksControlsDetail,
    useComplianceApiV1ControlsSummaryDetail,
    useComplianceApiV1FindingsEventsDetail,
    useComplianceApiV1FindingsResourceCreate,
} from '../../../../../api/compliance.gen'
import Spinner from '../../../../../components/Spinner'
import { severityBadge } from '../../../Controls'
import { dateTimeDisplay } from '../../../../../utilities/dateDisplay'
import Timeline from './Timeline'
import { benchmarkList } from '../../../Compliance'

interface IFindingDetail {
    finding: GithubComKaytuIoKaytuEnginePkgComplianceApiFinding | undefined
    type: 'finding' | 'resource'
    open: boolean
    onClose: () => void
}

const renderStatus = (state: boolean | undefined) => {
    if (state) {
        return (
            <Flex className="w-fit gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <Text className="text-gray-800">Active</Text>
            </Flex>
        )
    }
    return (
        <Flex className="w-fit gap-2">
            <div className="w-2 h-2 bg-rose-600 rounded-full" />
            <Text className="text-gray-800">Not active</Text>
        </Flex>
    )
}

export default function FindingDetail({
    finding,
    type,
    open,
    onClose,
}: IFindingDetail) {
    console.log(finding)
    const { response, isLoading, sendNow } =
        useComplianceApiV1FindingsResourceCreate(
            { kaytuResourceId: finding?.kaytuResourceID || '' },
            {},
            false
        )
    const {
        response: findingTimeline,
        isLoading: findingTimelineLoading,
        sendNow: findingTimelineSend,
    } = useComplianceApiV1FindingsEventsDetail(finding?.id || '', {}, false)

    const {
        response: controlDetail,
        isLoading: controlDetailLoading,
        sendNow: controlDetailSend,
    } = useComplianceApiV1ControlsSummaryDetail(String(finding?.controlID))

    useEffect(() => {
        if (finding) {
            sendNow()
            if (type === 'finding') {
                findingTimelineSend()
                controlDetailSend()
            }
        }
    }, [finding])

    const failedEvents =
        findingTimeline?.findingEvents?.filter(
            (v) =>
                v.conformanceStatus ===
                GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed
        ) || []

    return (
        <DrawerPanel
            open={open}
            onClose={onClose}
            title={
                <Flex justifyContent="start">
                    {getConnectorIcon(finding?.connector)}
                    <Title className="text-lg font-semibold ml-2 my-1">
                        {finding?.resourceName}
                    </Title>
                </Flex>
            }
        >
            <Grid className="w-full gap-4 mb-6" numItems={2}>
                <SummaryCard
                    title="Account ID"
                    metric={finding?.providerConnectionID}
                    isString
                />
                <SummaryCard
                    title="Account Name"
                    metric={finding?.providerConnectionName}
                    isString
                />
                <SummaryCard
                    title="Resource ID"
                    metric={finding?.resourceID}
                    isString
                />
                <SummaryCard
                    title="Resource Name"
                    metric={finding?.resourceTypeName}
                    isString
                />
                <SummaryCard
                    title="Resource Type"
                    metric={finding?.resourceType}
                    isString
                />
                <SummaryCard
                    title="Severity"
                    metric={severityBadge(finding?.severity)}
                    isString
                />
            </Grid>
            <TabGroup>
                <TabList>
                    {type === 'finding' ? (
                        <>
                            <Tab>Summary</Tab>
                            <Tab disabled={!response?.resource}>
                                Resource Details
                            </Tab>
                            <Tab>Timeline</Tab>
                        </>
                    ) : (
                        <>
                            <Tab>Applicable Controls</Tab>
                            <Tab disabled={!response?.resource}>
                                Resource Details
                            </Tab>
                        </>
                    )}
                </TabList>
                <TabPanels>
                    {type === 'finding' ? (
                        <TabPanel>
                            <List>
                                <ListItem className="py-6">
                                    <Text>Findings state</Text>
                                    {renderStatus(finding?.stateActive)}
                                </ListItem>
                                <ListItem className="py-6">
                                    <Text>Last evaluated</Text>
                                    <Text className="text-gray-800">
                                        {dateTimeDisplay(finding?.evaluatedAt)}
                                    </Text>
                                </ListItem>
                                <ListItem className="py-6">
                                    <Text>Last event</Text>
                                    <Text className="text-gray-800">
                                        {dateTimeDisplay(finding?.lastEvent)}
                                    </Text>
                                </ListItem>
                                <ListItem className="py-6">
                                    <Text>First discovered</Text>
                                    <Text className="text-gray-800">
                                        {dateTimeDisplay(
                                            failedEvents.at(
                                                failedEvents.length - 1
                                            )?.evaluatedAt
                                        )}
                                    </Text>
                                </ListItem>

                                <ListItem className="py-6 space-x-5">
                                    <Flex
                                        flexDirection="row"
                                        justifyContent="between"
                                        alignItems="start"
                                        className="w-full"
                                    >
                                        <Text className="w-1/4">Reason</Text>
                                        <Text className="text-gray-800 text-end text-clip w-3/4">
                                            {finding?.reason}
                                        </Text>
                                    </Flex>
                                </ListItem>
                            </List>
                            <Flex className="pb-4 mb-4 border-b border-b-gray-200 dark:border-b-gray-700">
                                <Title className="font-semibold">Control</Title>
                            </Flex>
                            {controlDetailLoading ? (
                                <Spinner className="mt-12" />
                            ) : (
                                <List>
                                    <ListItem>
                                        <Flex
                                            flexDirection="col"
                                            alignItems="start"
                                            className="gap-1 w-fit max-w-[80%]"
                                        >
                                            <Text className="text-gray-800 w-full truncate">
                                                {finding?.controlTitle}
                                            </Text>
                                            <Flex justifyContent="start">
                                                {controlDetail?.passed ? (
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
                                                        {controlDetail?.benchmarks
                                                            ?.map(
                                                                (b) =>
                                                                    b.referenceCode ||
                                                                    ''
                                                            )
                                                            ?.filter(
                                                                (v) =>
                                                                    v.length !==
                                                                    0
                                                            )
                                                            .join(',')}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                        {severityBadge(
                                            controlDetail?.control?.severity
                                        )}
                                    </ListItem>
                                </List>
                            )}
                        </TabPanel>
                    ) : (
                        <TabPanel>
                            {isLoading ? (
                                <Spinner className="mt-12" />
                            ) : (
                                <List>
                                    {response?.controls?.map((control) => (
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
                    )}
                    <TabPanel>
                        <Title className="mb-2">JSON</Title>
                        <Card className="px-1.5 py-3 mb-2">
                            <ReactJson src={response?.resource || {}} />
                        </Card>
                    </TabPanel>
                    <TabPanel className="pt-8">
                        <Timeline
                            data={
                                type === 'finding' ? findingTimeline : response
                            }
                            isLoading={
                                type === 'finding'
                                    ? findingTimelineLoading
                                    : isLoading
                            }
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </DrawerPanel>
    )
}
