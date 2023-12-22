import { Link, useParams } from 'react-router-dom'
import {
    Button,
    Card,
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
    ChevronRightIcon,
    Cog8ToothIcon,
    CommandLineIcon,
    CreditCardIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    Square2StackIcon,
} from '@heroicons/react/24/outline'
import { useSetAtom } from 'jotai/index'
import clipboardCopy from 'clipboard-copy'
import { useState } from 'react'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import Layout from '../../../../../../components/Layout'
import { useComplianceApiV1ControlsSummaryDetail } from '../../../../../../api/compliance.gen'
import Header from '../../../../../../components/Header'
import { notificationAtom, queryAtom } from '../../../../../../store'
import { severityBadge } from '../index'
import Spinner from '../../../../../../components/Spinner'
import Detail from './Tabs/Detail'
import ImpactedResources from './Tabs/ImpactedResources'
import Benchmarks from './Tabs/Benchmarks'
import Modal from '../../../../../../components/Modal'
import ImpactedAccounts from './Tabs/ImpactedAccounts'
import { dateTimeDisplay } from '../../../../../../utilities/dateDisplay'

export default function ControlDetail() {
    const { controlId, ws } = useParams()
    const setNotification = useSetAtom(notificationAtom)

    const [openDetail, setOpenDetail] = useState(false)
    const [modalData, setModalData] = useState('')
    const setQuery = useSetAtom(queryAtom)

    const { response: controlDetail, isLoading } =
        useComplianceApiV1ControlsSummaryDetail(String(controlId))

    return (
        <Layout currentPage="compliance">
            <Header
                breadCrumb={[
                    controlDetail
                        ? controlDetail?.control?.title
                        : 'Control detail',
                ]}
                datePicker
            />
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <>
                    <Flex className="mb-6">
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                            className="gap-2"
                        >
                            <Flex className="gap-3 w-fit">
                                <Title className="font-semibold whitespace-nowrap">
                                    {controlDetail?.control?.title}
                                </Title>
                                {severityBadge(
                                    controlDetail?.control?.severity
                                )}
                            </Flex>
                            <Text className="w-2/3">
                                {controlDetail?.control?.description}
                            </Text>
                        </Flex>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                setModalData(
                                    controlDetail?.control?.query?.queryToExecute?.replace(
                                        '$IS_ALL_CONNECTIONS_QUERY',
                                        'true'
                                    ) || ''
                                )
                            }
                        >
                            See query
                        </Button>
                        <Modal
                            open={!!modalData.length}
                            onClose={() => setModalData('')}
                        >
                            <Title className="font-semibold">
                                Metric query
                            </Title>
                            <Card className="my-4">
                                <Editor
                                    onValueChange={() => console.log('')}
                                    highlight={(text) =>
                                        highlight(text, languages.sql, 'sql')
                                    }
                                    value={modalData}
                                    className="w-full bg-white dark:bg-gray-900 dark:text-gray-50 font-mono text-sm"
                                    style={{
                                        minHeight: '200px',
                                    }}
                                    placeholder="-- write your SQL query here"
                                />
                            </Card>
                            <Flex>
                                <Button
                                    variant="light"
                                    icon={DocumentDuplicateIcon}
                                    iconPosition="left"
                                    onClick={() =>
                                        clipboardCopy(modalData).then(() =>
                                            setNotification({
                                                text: 'Query copied to clipboard',
                                                type: 'info',
                                            })
                                        )
                                    }
                                >
                                    Copy
                                </Button>
                                <Flex className="w-fit gap-4">
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setQuery(modalData)
                                        }}
                                    >
                                        <Link to={`/${ws}/query`}>
                                            Open in Query
                                        </Link>
                                    </Button>
                                    <Button onClick={() => setModalData('')}>
                                        Close
                                    </Button>
                                </Flex>
                            </Flex>
                        </Modal>
                    </Flex>
                    <Grid numItems={2} className="w-full gap-4 mb-6">
                        <Card>
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="h-full"
                            >
                                <Flex flexDirection="col" alignItems="start">
                                    <Title className="font-semibold mb-2">
                                        Control detail
                                    </Title>
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
                                                            setNotification({
                                                                text: 'Control ID copied to clipboard',
                                                                type: 'info',
                                                            })
                                                        )
                                                    }
                                                    icon={Square2StackIcon}
                                                />
                                                <Text className="text-gray-800">
                                                    {controlDetail?.control?.id}
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
                                                            setNotification({
                                                                text: 'Resource type copied to clipboard',
                                                                type: 'info',
                                                            })
                                                        )
                                                    }
                                                    icon={Square2StackIcon}
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
                                            <Text># of passed findings</Text>
                                            <Text className="text-emerald-500">
                                                {(controlDetail?.totalResourcesCount ||
                                                    0) -
                                                    (controlDetail?.failedResourcesCount ||
                                                        0)}
                                            </Text>
                                        </ListItem>
                                        <ListItem>
                                            <Text># of failed findings</Text>
                                            <Text className="text-rose-600">
                                                {
                                                    controlDetail?.failedResourcesCount
                                                }
                                            </Text>
                                        </ListItem>
                                        {/* <ListItem>
                                            <Text>Last updated</Text>
                                            <Text className="text-gray-800">
                                                {dateTimeDisplay(
                                                    controlDetail?.control
                                                        ?.updatedAt
                                                )}
                                            </Text>
                                        </ListItem> */}
                                    </List>
                                </Flex>
                                <Flex justifyContent="end">
                                    <Button
                                        variant="light"
                                        icon={ChevronRightIcon}
                                        iconPosition="right"
                                        onClick={() => setOpenDetail(true)}
                                    >
                                        See more
                                    </Button>
                                </Flex>
                            </Flex>
                        </Card>
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="h-full"
                        >
                            <Title className="mb-2">Remediation</Title>
                            <Grid numItems={2} className="w-full gap-4">
                                <Card>
                                    <Flex className="mb-2.5">
                                        <Flex
                                            justifyContent="start"
                                            className="w-fit gap-3"
                                        >
                                            <Icon
                                                icon={FolderIcon}
                                                variant="light"
                                                color="sky"
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
                                <Card>
                                    <Flex className="mb-2.5">
                                        <Flex
                                            justifyContent="start"
                                            className="w-fit gap-3"
                                        >
                                            <Icon
                                                icon={CommandLineIcon}
                                                variant="light"
                                                color="sky"
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
                                <Card>
                                    <Flex className="mb-2.5">
                                        <Flex
                                            justifyContent="start"
                                            className="w-fit gap-3"
                                        >
                                            <Icon
                                                icon={Cog8ToothIcon}
                                                variant="light"
                                                color="sky"
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
                                <Card>
                                    <Flex className="mb-2.5">
                                        <Flex
                                            justifyContent="start"
                                            className="w-fit gap-3"
                                        >
                                            <Icon
                                                icon={CreditCardIcon}
                                                variant="light"
                                                color="sky"
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
                            <Tab>Control information</Tab>
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
