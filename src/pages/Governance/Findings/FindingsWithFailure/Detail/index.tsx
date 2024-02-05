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
    useComplianceApiV1FindingsEventsDetail,
    useComplianceApiV1FindingsResourceCreate,
} from '../../../../../api/compliance.gen'
import Spinner from '../../../../../components/Spinner'
import { severityBadge } from '../../../Controls'
import { dateTimeDisplay } from '../../../../../utilities/dateDisplay'
import Timeline from './Timeline'

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
    } = useComplianceApiV1FindingsEventsDetail(finding?.id || '')

    useEffect(() => {
        if (finding) {
            sendNow()
            if (type === 'finding') {
                findingTimelineSend()
            }
        }
    }, [finding])

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
                            <Flex className="py-4 border-b border-b-gray-200 dark:border-b-gray-700">
                                <Title className="font-semibold">
                                    Overview
                                </Title>
                            </Flex>
                            <List>
                                <ListItem className="py-6">
                                    <Text>Findings state</Text>
                                    {renderStatus(finding?.stateActive)}
                                </ListItem>
                                <ListItem className="py-6">
                                    <Text>Creation date</Text>
                                    <Text className="text-gray-800">
                                        {dateTimeDisplay(finding?.evaluatedAt)}
                                    </Text>
                                </ListItem>
                                <ListItem className="py-6">
                                    <Text>Last evaluated</Text>
                                    <Text className="text-gray-800">
                                        {dateTimeDisplay(finding?.evaluatedAt)}
                                    </Text>
                                </ListItem>
                            </List>
                            <Flex className="py-4 my-4 border-b border-b-gray-200 dark:border-b-gray-700">
                                <Title className="font-semibold">Control</Title>
                            </Flex>
                            {isLoading ? (
                                <Spinner className="mt-12" />
                            ) : (
                                <List>
                                    {response?.controls?.map(
                                        (control, i) =>
                                            i < 1 && (
                                                <ListItem>
                                                    <Flex
                                                        flexDirection="col"
                                                        alignItems="start"
                                                        className="gap-1 w-fit max-w-[80%]"
                                                    >
                                                        <Text className="text-gray-800 w-full truncate">
                                                            {
                                                                control.controlTitle
                                                            }
                                                        </Text>
                                                        <Flex justifyContent="start">
                                                            {control.conformanceStatus ===
                                                            GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusPassed ? (
                                                                <Flex className="w-fit gap-1.5">
                                                                    <CheckCircleIcon className="h-4 text-emerald-500" />
                                                                    <Text>
                                                                        Passed
                                                                    </Text>
                                                                </Flex>
                                                            ) : (
                                                                <Flex className="w-fit gap-1.5">
                                                                    <XCircleIcon className="h-4 text-rose-600" />
                                                                    <Text>
                                                                        Failed
                                                                    </Text>
                                                                </Flex>
                                                            )}
                                                            <Flex className="border-l border-gray-200 ml-3 pl-3 h-full">
                                                                <Text className="text-xs">
                                                                    SECTION:
                                                                </Text>
                                                            </Flex>
                                                        </Flex>
                                                    </Flex>
                                                    {severityBadge(
                                                        control.severity
                                                    )}
                                                </ListItem>
                                            )
                                    )}
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
