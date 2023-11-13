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
import { useParams } from 'react-router-dom'
import clipboardCopy from 'clipboard-copy'
import { ChevronRightIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    IServerSideDatasource,
    RowClickedEvent,
    SortModelItem,
} from 'ag-grid-community'
import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import Header from '../../../../../components/Header'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import Spinner from '../../../../../components/Spinner'
import { dateTimeDisplay } from '../../../../../utilities/dateDisplay'
import DrawerPanel from '../../../../../components/DrawerPanel'
import { RenderObject } from '../../../../../components/RenderObject'
import { isDemoAtom, notificationAtom } from '../../../../../store'
import Layout from '../../../../../components/Layout'
import {
    useComplianceApiV1AssignmentsConnectionDetail,
    useComplianceApiV1BenchmarksPoliciesDetail,
    useComplianceApiV1BenchmarksSummaryDetail,
    useComplianceApiV1FindingsCreate,
} from '../../../../../api/compliance.gen'
import Table from '../../../../../components/Table'
import { columns } from '../../../Findings'
import Breakdown from '../../../../../components/Breakdown'
import { policyColumns } from '../Details/Tabs/Policies'

export default function SingleComplianceConnection() {
    const [openDrawer, setOpenDrawer] = useState(false)
    const { connection } = useParams()
    const setNotification = useSetAtom(notificationAtom)
    const isDemo = useAtomValue(isDemoAtom)
    const [sortModel, setSortModel] = useState<SortModelItem[]>([])
    const [openFinding, setOpenFinding] = useState(false)
    const [finding, setFinding] = useState<any>(undefined)

    const query = {
        ...(connection && {
            connectionId: [connection.replace('account_', '')],
        }),
    }
    const { response: accountInfo, isLoading: accountInfoLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            ...query,
            pageSize: 1,
            needCost: false,
        })
    const con = accountInfo?.connections?.at(0)

    const { response: benchmarkList } =
        useComplianceApiV1AssignmentsConnectionDetail(
            connection?.replace('account_', '') || ''
        )
    const [benchmark, setBenchmark] = useState(
        benchmarkList?.filter((bm) => bm.status)[0].benchmarkId?.id
    )
    const {
        response: benchmarkDetail,
        isLoading: detailLoading,
        sendNow: updateDetail,
    } = useComplianceApiV1BenchmarksSummaryDetail(
        benchmark || '',
        {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connectionID: [connection?.replace('account_', '') || ''],
        },
        {},
        false
    )

    const {
        response: findings,
        isLoading,
        sendNow: updateFindings,
    } = useComplianceApiV1FindingsCreate({
        filters: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connectionID: [connection?.replace('account_', '') || ''],
        },
        sort: sortModel.length
            ? { [sortModel[0].colId]: sortModel[0].sort }
            : {},
    })
    const {
        response: policies,
        isLoading: policiesLoading,
        sendNow: updatePolicy,
    } = useComplianceApiV1BenchmarksPoliciesDetail(benchmark || '', {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        connectionID: [connection?.replace('account_', '') || ''],
    })

    useEffect(() => {
        if (benchmark) {
            updatePolicy()
            updateDetail()
        }
    }, [benchmark])

    const getData = (sort: SortModelItem[]) => {
        setSortModel(sort)
        updateFindings()
    }

    const datasource: IServerSideDatasource = {
        getRows: (params: IServerSideGetRowsParams) => {
            if (params.request.sortModel.length > 0) {
                if (sortModel.length > 0) {
                    if (
                        params.request.sortModel[0].colId !==
                            sortModel[0].colId ||
                        params.request.sortModel[0].sort !== sortModel[0].sort
                    ) {
                        getData([params.request.sortModel[0]])
                    }
                } else {
                    getData([params.request.sortModel[0]])
                }
            } else if (sortModel.length > 0) {
                getData([])
            }
            if (findings) {
                params.success({
                    rowData: findings?.findings || [],
                    rowCount: findings?.totalCount || 0,
                })
            } else {
                params.fail()
            }
        },
    }

    const critical = benchmarkDetail?.checks?.criticalCount || 0
    const high = benchmarkDetail?.checks?.highCount || 0
    const medium = benchmarkDetail?.checks?.mediumCount || 0
    const low = benchmarkDetail?.checks?.lowCount || 0
    const passed = benchmarkDetail?.checks?.passedCount || 0
    const unknown = benchmarkDetail?.checks?.unknownCount || 0

    return (
        <Layout currentPage="compliance">
            <Header
                breadCrumb={[
                    con ? con?.providerConnectionName : 'Single account detail',
                ]}
            />
            <Grid numItems={2} className="w-full gap-4">
                <Card className="w-full">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="h-full"
                    >
                        <Flex flexDirection="col" alignItems="start">
                            <Title className="font-semibold">
                                Connection details
                            </Title>
                            {accountInfoLoading ? (
                                <Spinner className="my-28" />
                            ) : (
                                <List className="mt-2">
                                    <ListItem>
                                        <Text>Connector</Text>
                                        <Text className="text-gray-800">
                                            {con?.connector}
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Discovered name</Text>
                                        <Flex className="gap-1 w-fit">
                                            <Button
                                                variant="light"
                                                onClick={() =>
                                                    clipboardCopy(
                                                        `Discovered name: ${con?.providerConnectionName}`
                                                    ).then(() =>
                                                        setNotification({
                                                            text: 'Discovered name copied to clipboard',
                                                            type: 'info',
                                                        })
                                                    )
                                                }
                                                icon={Square2StackIcon}
                                            />
                                            <Text className="text-gray-800">
                                                {con?.providerConnectionName}
                                            </Text>
                                        </Flex>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Discovered ID</Text>
                                        <Flex className="gap-1 w-fit">
                                            <Button
                                                variant="light"
                                                onClick={() =>
                                                    clipboardCopy(
                                                        `Discovered ID: ${con?.providerConnectionID}`
                                                    ).then(() =>
                                                        setNotification({
                                                            text: 'Discovered ID copied to clipboard',
                                                            type: 'info',
                                                        })
                                                    )
                                                }
                                                icon={Square2StackIcon}
                                            />
                                            <Text className="text-gray-800">
                                                {con?.providerConnectionID}
                                            </Text>
                                        </Flex>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Lifecycle state</Text>
                                        <Text className="text-gray-800">
                                            {con?.lifecycleState}
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Onboard date</Text>
                                        <Text className="text-gray-800">
                                            {dateTimeDisplay(con?.onboardDate)}
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Last inventory</Text>
                                        <Text className="text-gray-800">
                                            {dateTimeDisplay(
                                                con?.lastInventory
                                            )}
                                        </Text>
                                    </ListItem>
                                </List>
                            )}
                        </Flex>
                        <Flex justifyContent="end">
                            <Button
                                variant="light"
                                icon={ChevronRightIcon}
                                iconPosition="right"
                                onClick={() => setOpenDrawer(true)}
                            >
                                see more
                            </Button>
                        </Flex>
                        <DrawerPanel
                            title="Connection details"
                            open={openDrawer}
                            onClose={() => setOpenDrawer(false)}
                        >
                            <RenderObject obj={con} />
                        </DrawerPanel>
                    </Flex>
                </Card>
                <Breakdown
                    title={`Severity breakdown for ${benchmark}`}
                    chartData={[
                        { name: 'Critical', value: critical },
                        { name: 'High', value: high },
                        { name: 'Medium', value: medium },
                        { name: 'Low', value: low },
                        { name: 'Passed', value: passed },
                        { name: 'Unknown', value: unknown },
                    ]}
                    loading={detailLoading}
                />
            </Grid>
            <TabGroup className="mt-4">
                <TabList className="mb-3">
                    {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
                    <>
                        {benchmarkList
                            ?.filter((bm) => bm.status)
                            ?.map((bm) => (
                                <Tab
                                    onClick={() =>
                                        setBenchmark(bm.benchmarkId?.id || '')
                                    }
                                >
                                    {bm.benchmarkId?.title}
                                </Tab>
                            ))}
                        <Tab>Findings</Tab>
                    </>
                </TabList>
                <TabPanels>
                    {benchmarkList
                        ?.filter((bm) => bm.status)
                        ?.map((bm) => (
                            <TabPanel>
                                <Table
                                    title={`${bm.benchmarkId?.title} policies`}
                                    downloadable
                                    id="compliance_policies"
                                    loading={policiesLoading}
                                    columns={policyColumns}
                                    rowData={policies}
                                />
                            </TabPanel>
                        ))}
                    <TabPanel>
                        <Table
                            title="Findings"
                            downloadable
                            id="compliance_findings"
                            columns={columns(isDemo)}
                            onCellClicked={(event: RowClickedEvent) => {
                                setFinding(event.data)
                                setOpenFinding(true)
                            }}
                            onGridReady={(e) => {
                                if (isLoading) {
                                    e.api.showLoadingOverlay()
                                }
                            }}
                            serverSideDatasource={datasource}
                            loading={isLoading}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
            <DrawerPanel
                open={openFinding}
                onClose={() => setOpenFinding(false)}
                title="Finding Detail"
            >
                <Title>Summary</Title>
                <RenderObject obj={finding} />
            </DrawerPanel>
        </Layout>
    )
}
