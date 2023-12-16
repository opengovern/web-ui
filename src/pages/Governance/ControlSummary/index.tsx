import { useParams } from 'react-router-dom'
import {
    Button,
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
import { ChevronRightIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import { useSetAtom } from 'jotai/index'
import clipboardCopy from 'clipboard-copy'
import { useState } from 'react'
import Layout from '../../../components/Layout'
import { useComplianceApiV1ControlsSummaryDetail } from '../../../api/compliance.gen'
import Header from '../../../components/Header'
import { notificationAtom } from '../../../store'
import { severityBadge } from '../Compliance/BenchmarkSummary/Controls'
import { dateTimeDisplay } from '../../../utilities/dateDisplay'
import Spinner from '../../../components/Spinner'
import Detail from './Tabs/Detail'
import ImpactedResources from './Tabs/ImpactedResources'

export default function ControlDetail() {
    const { controlId } = useParams()
    const setNotification = useSetAtom(notificationAtom)

    const [openDetail, setOpenDetail] = useState(false)
    const [modalData, setModalData] = useState('')

    const { response: controlDetail, isLoading } =
        useComplianceApiV1ControlsSummaryDetail(String(controlId))
    console.log(controlDetail)
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
                            <Title className="font-semibold whitespace-nowrap">
                                {controlDetail?.control?.title}
                            </Title>
                            <Text className="w-2/3">
                                {controlDetail?.control?.description}
                            </Text>
                        </Flex>
                        <Button
                            variant="secondary"
                            // onClick={() =>
                            //     setModalData(
                            //         insightDetail?.query?.queryToExecute?.replace(
                            //             '$IS_ALL_CONNECTIONS_QUERY',
                            //             'true'
                            //         ) || ''
                            //     )
                            // }
                        >
                            See query
                        </Button>
                    </Flex>
                    <Grid numItems={2} className="w-full gap-4 mb-4">
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
                                                            `Resource type: ${controlDetail?.control?.id}`
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
                                                    {controlDetail?.control?.id}
                                                </Text>
                                            </Flex>
                                        </ListItem>
                                        <ListItem>
                                            <Text>Severity</Text>
                                            {severityBadge(
                                                controlDetail?.control?.severity
                                            )}
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
                                            <Text>Last updated</Text>
                                            <Text className="text-gray-800">
                                                {dateTimeDisplay(
                                                    controlDetail?.control
                                                        ?.updatedAt
                                                )}
                                            </Text>
                                        </ListItem>
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
                    </Grid>
                    <TabGroup>
                        <TabList>
                            <Tab disabled>Take action</Tab>
                            <Tab disabled>Trend line</Tab>
                            <Tab disabled>Benchmarks</Tab>
                            <Tab>Details</Tab>
                            <Tab>Impacted resources</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>hi</TabPanel>
                            <TabPanel>hi</TabPanel>
                            <TabPanel>hi</TabPanel>
                            <TabPanel>
                                <Detail control={controlDetail?.control} />
                            </TabPanel>
                            <TabPanel>
                                <ImpactedResources
                                    controlId={controlDetail?.control?.id}
                                />
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </>
            )}
        </Layout>
    )
}
