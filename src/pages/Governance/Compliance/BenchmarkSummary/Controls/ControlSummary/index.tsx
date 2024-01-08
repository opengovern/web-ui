import { Link, useParams } from 'react-router-dom'
import {
    Button,
    Card,
    Divider,
    Flex,
    Grid,
    Icon,
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
import {
    BookOpenIcon,
    ChevronRightIcon,
    CodeBracketIcon,
    CodeBracketSquareIcon,
    Cog8ToothIcon,
    CommandLineIcon,
    DocumentDuplicateIcon,
    InformationCircleIcon,
    Square2StackIcon,
} from '@heroicons/react/24/outline'
import { useSetAtom } from 'jotai/index'
import clipboardCopy from 'clipboard-copy'
import { useState } from 'react'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import Markdown from 'react-markdown'
import Layout from '../../../../../../components/Layout'
import { useComplianceApiV1ControlsSummaryDetail } from '../../../../../../api/compliance.gen'
import { notificationAtom, queryAtom } from '../../../../../../store'
import { severityBadge } from '../index'
import Spinner from '../../../../../../components/Spinner'
import Detail from './Tabs/Detail'
import ImpactedResources from './Tabs/ImpactedResources'
import Benchmarks from './Tabs/Benchmarks'
import ImpactedAccounts from './Tabs/ImpactedAccounts'
import DrawerPanel from '../../../../../../components/DrawerPanel'
import { dateTimeDisplay } from '../../../../../../utilities/dateDisplay'

export default function ControlDetail() {
    const { controlId, ws } = useParams()
    const setNotification = useSetAtom(notificationAtom)

    const [openDetail, setOpenDetail] = useState(false)
    const [doc, setDoc] = useState('')
    const [docTitle, setDocTitle] = useState('')
    const setQuery = useSetAtom(queryAtom)

    const { response: controlDetail, isLoading } =
        useComplianceApiV1ControlsSummaryDetail(String(controlId))

    return (
        <Layout
            currentPage="compliance"
            breadCrumb={[
                controlDetail
                    ? controlDetail?.control?.title
                    : 'Control detail',
            ]}
        >
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <>
                    <Flex className="mb-6">
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                            className="gap-2 w-3/4"
                        >
                            <Flex className="gap-3 w-fit">
                                <Title className="font-semibold whitespace-nowrap">
                                    {controlDetail?.control?.title}
                                </Title>
                                {severityBadge(
                                    controlDetail?.control?.severity
                                )}
                            </Flex>
                            <div className="group w-full relative flex justify-center">
                                <Text className="truncate">
                                    {controlDetail?.control?.description}
                                </Text>
                                <div className="absolute w-full z-40 top-0 scale-0 transition-all rounded p-2 shadow-md bg-white group-hover:scale-100">
                                    <Text>
                                        {controlDetail?.control?.description}
                                    </Text>
                                </div>
                            </div>
                        </Flex>
                    </Flex>
                    <Grid numItems={2} className="h-full w-full gap-4 mb-6">
                        <TabGroup className="h-full">
                            <TabList
                                variant="solid"
                                className="border border-gray-200"
                            >
                                <Tab icon={InformationCircleIcon}>
                                    Information
                                </Tab>
                                <Tab icon={CodeBracketSquareIcon}>Query</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel className="h-full">
                                    <Card className="h-full">
                                        <Flex
                                            flexDirection="col"
                                            alignItems="start"
                                            className="h-full"
                                        >
                                            <List>
                                                <ListItem>
                                                    <Text>Control ID</Text>
                                                    <Flex className="gap-1 w-fit">
                                                        <Button
                                                            variant="light"
                                                            onClick={() =>
                                                                clipboardCopy(
                                                                    `Control ID: ${controlDetail?.control?.id}`
                                                                ).then(() =>
                                                                    setNotification(
                                                                        {
                                                                            text: 'Control ID copied to clipboard',
                                                                            type: 'info',
                                                                        }
                                                                    )
                                                                )
                                                            }
                                                            icon={
                                                                Square2StackIcon
                                                            }
                                                        />
                                                        <Text className="text-gray-800">
                                                            {
                                                                controlDetail
                                                                    ?.control
                                                                    ?.id
                                                            }
                                                        </Text>
                                                    </Flex>
                                                </ListItem>
                                                <ListItem>
                                                    <Text>Resource type</Text>
                                                    <Flex className="gap-1 w-fit">
                                                        <Button
                                                            variant="light"
                                                            onClick={() =>
                                                                clipboardCopy(
                                                                    `Resource type: ${controlDetail?.resourceType?.resource_type}`
                                                                ).then(() =>
                                                                    setNotification(
                                                                        {
                                                                            text: 'Resource type copied to clipboard',
                                                                            type: 'info',
                                                                        }
                                                                    )
                                                                )
                                                            }
                                                            icon={
                                                                Square2StackIcon
                                                            }
                                                        />
                                                        <Text className="text-gray-800">
                                                            {
                                                                controlDetail
                                                                    ?.resourceType
                                                                    ?.resource_type
                                                            }
                                                        </Text>
                                                    </Flex>
                                                </ListItem>
                                                <ListItem>
                                                    <Text># of findings</Text>
                                                    <Text className="text-gray-800">
                                                        {
                                                            controlDetail?.totalResourcesCount
                                                        }
                                                    </Text>
                                                </ListItem>
                                                <ListItem>
                                                    <Text>
                                                        # of passed findings
                                                    </Text>
                                                    <Text className="text-emerald-500">
                                                        {(controlDetail?.totalResourcesCount ||
                                                            0) -
                                                            (controlDetail?.failedResourcesCount ||
                                                                0)}
                                                    </Text>
                                                </ListItem>
                                                <ListItem>
                                                    <Text>
                                                        # of failed findings
                                                    </Text>
                                                    <Text className="text-rose-600">
                                                        {
                                                            controlDetail?.failedResourcesCount
                                                        }
                                                    </Text>
                                                </ListItem>
                                                <ListItem>
                                                    <Text>Last updated</Text>
                                                    <Text className="text-gray-800">
                                                        {dateTimeDisplay(
                                                            controlDetail
                                                                ?.control
                                                                ?.updatedAt
                                                        )}
                                                    </Text>
                                                </ListItem>
                                            </List>
                                            <Flex justifyContent="end">
                                                <Button
                                                    variant="light"
                                                    icon={ChevronRightIcon}
                                                    iconPosition="right"
                                                    onClick={() =>
                                                        setOpenDetail(true)
                                                    }
                                                >
                                                    See more
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    </Card>
                                </TabPanel>
                                <TabPanel>
                                    <Card className="max-h-[289px] overflow-scroll">
                                        <Editor
                                            onValueChange={() =>
                                                console.log('')
                                            }
                                            highlight={(text) =>
                                                highlight(
                                                    text,
                                                    languages.sql,
                                                    'sql'
                                                )
                                            }
                                            value={
                                                controlDetail?.control?.query?.queryToExecute?.replace(
                                                    '$IS_ALL_CONNECTIONS_QUERY',
                                                    'true'
                                                ) || ''
                                            }
                                            className="w-full bg-white dark:bg-gray-900 dark:text-gray-50 font-mono text-sm"
                                            style={{
                                                minHeight: '200px',
                                            }}
                                            placeholder="-- write your SQL query here"
                                        />
                                        <Divider />
                                        <Flex>
                                            <Flex className="gap-4">
                                                <Button
                                                    variant="light"
                                                    icon={DocumentDuplicateIcon}
                                                    iconPosition="left"
                                                    onClick={() =>
                                                        clipboardCopy(
                                                            controlDetail?.control?.query?.queryToExecute?.replace(
                                                                '$IS_ALL_CONNECTIONS_QUERY',
                                                                'true'
                                                            ) || ''
                                                        ).then(() =>
                                                            setNotification({
                                                                text: 'Query copied to clipboard',
                                                                type: 'info',
                                                            })
                                                        )
                                                    }
                                                >
                                                    Copy
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setQuery(
                                                            controlDetail?.control?.query?.queryToExecute?.replace(
                                                                '$IS_ALL_CONNECTIONS_QUERY',
                                                                'true'
                                                            ) || ''
                                                        )
                                                    }}
                                                >
                                                    <Link to={`/${ws}/query`}>
                                                        Open in Query
                                                    </Link>
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    </Card>
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                            className="h-full"
                        >
                            <DrawerPanel
                                title={docTitle}
                                open={doc.length > 0}
                                onClose={() => setDoc('')}
                            >
                                <Markdown>{doc}</Markdown>
                            </DrawerPanel>
                            <Title className="font-semibold mt-2 mb-2">
                                Remediation
                            </Title>
                            <Grid numItems={2} className="w-full h-full gap-4">
                                <Card
                                    className={
                                        controlDetail?.control
                                            ?.manualRemediation &&
                                        controlDetail?.control
                                            ?.manualRemediation.length
                                            ? 'cursor-pointer'
                                            : 'grayscale opacity-70'
                                    }
                                    onClick={() => {
                                        if (
                                            controlDetail?.control
                                                ?.manualRemediation &&
                                            controlDetail?.control
                                                ?.manualRemediation.length
                                        ) {
                                            setDoc(
                                                controlDetail?.control
                                                    ?.manualRemediation
                                            )
                                            setDocTitle('Manual')
                                        }
                                    }}
                                >
                                    <Flex className="mb-2.5">
                                        <Flex
                                            justifyContent="start"
                                            className="w-fit gap-3"
                                        >
                                            <Icon
                                                icon={BookOpenIcon}
                                                className="p-0"
                                            />
                                            <Title className="font-semibold">
                                                Manual
                                            </Title>
                                        </Flex>
                                        <ChevronRightIcon className="w-5 text-kaytu-500" />
                                    </Flex>
                                    <Text>
                                        Step by Step Guided solution to resolve
                                        instances of non-compliance
                                    </Text>
                                </Card>
                                <Card
                                    className={
                                        controlDetail?.control
                                            ?.cliRemediation &&
                                        controlDetail?.control?.cliRemediation
                                            .length
                                            ? 'cursor-pointer'
                                            : 'grayscale opacity-70'
                                    }
                                    onClick={() => {
                                        if (
                                            controlDetail?.control
                                                ?.cliRemediation &&
                                            controlDetail?.control
                                                ?.cliRemediation.length
                                        ) {
                                            setDoc(
                                                controlDetail?.control
                                                    ?.cliRemediation
                                            )
                                            setDocTitle('Command line (CLI)')
                                        }
                                    }}
                                >
                                    <Flex className="mb-2.5">
                                        <Flex
                                            justifyContent="start"
                                            className="w-fit gap-3"
                                        >
                                            <Icon
                                                icon={CommandLineIcon}
                                                className="p-0"
                                            />
                                            <Title className="font-semibold">
                                                Command line (CLI)
                                            </Title>
                                        </Flex>
                                        <ChevronRightIcon className="w-5 text-kaytu-500" />
                                    </Flex>
                                    <Text>
                                        Guided steps to resolve the issue
                                        utilizing CLI
                                    </Text>
                                </Card>
                                <Card className="grayscale opacity-70">
                                    <Flex className="mb-2.5">
                                        <Flex
                                            justifyContent="start"
                                            className="w-fit gap-3"
                                        >
                                            <Icon
                                                icon={Cog8ToothIcon}
                                                className="p-0"
                                            />
                                            <Title className="font-semibold">
                                                Guard rails
                                            </Title>
                                        </Flex>
                                        <ChevronRightIcon className="w-5 text-kaytu-500" />
                                    </Flex>
                                    <Text>
                                        Resolve and ensure compliance, at scale
                                        utilizing solutions where possible
                                    </Text>
                                </Card>
                                <Card className="grayscale opacity-70">
                                    <Flex className="mb-2.5">
                                        <Flex
                                            justifyContent="start"
                                            className="w-fit gap-3"
                                        >
                                            <Icon
                                                icon={CodeBracketIcon}
                                                className="p-0"
                                            />
                                            <Title className="font-semibold">
                                                Programmatic
                                            </Title>
                                        </Flex>
                                        <ChevronRightIcon className="w-5 text-kaytu-500" />
                                    </Flex>
                                    <Text>
                                        Scripts that help you resolve the issue,
                                        at scale
                                    </Text>
                                </Card>
                            </Grid>
                        </Flex>
                    </Grid>
                    <TabGroup>
                        <TabList>
                            <Tab>Impacted resources</Tab>
                            <Tab>Impacted accounts</Tab>
                            <Tab
                                disabled={
                                    controlDetail?.control?.explanation
                                        ?.length === 0 &&
                                    controlDetail?.control?.nonComplianceCost
                                        ?.length === 0 &&
                                    controlDetail?.control?.usefulExample
                                        ?.length === 0
                                }
                            >
                                Control information
                            </Tab>
                            <Tab>Benchmarks</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <ImpactedResources
                                    controlId={controlDetail?.control?.id}
                                />
                            </TabPanel>
                            <TabPanel>
                                <ImpactedAccounts
                                    controlId={controlDetail?.control?.id}
                                />
                            </TabPanel>
                            <TabPanel>
                                <Detail control={controlDetail?.control} />
                            </TabPanel>
                            <TabPanel>
                                <Benchmarks
                                    benchmarks={controlDetail?.benchmarks}
                                />
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </>
            )}
        </Layout>
    )
}
