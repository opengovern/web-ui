import {
    Button,
    Card,
    Flex,
    Grid,
    List,
    ListItem,
    Text,
    Title,
} from '@tremor/react'
import { GridOptions } from 'ag-grid-community'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useSetAtom } from 'jotai'
import clipboardCopy from 'clipboard-copy'
import { Dayjs } from 'dayjs'
import Breakdown from '../../../../components/Breakdown'
import {
    useInventoryApiV2AnalyticsCompositionDetail,
    useInventoryApiV2AnalyticsMetricList,
} from '../../../../api/inventory.gen'
import { notificationAtom } from '../../../../store'
import Table from '../../../../components/Table'
import { resourceTableColumns, rowGenerator } from '../../Details'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../api/onboard.gen'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'
import Spinner from '../../../../components/Spinner'
import DrawerPanel from '../../../../components/DrawerPanel'
import { RenderObject } from '../../../../components/RenderObject'
import { pieData } from '../../index'
import Header from '../../../../components/Header'

const options: GridOptions = {
    enableGroupEdit: true,
    columnTypes: {
        dimension: {
            enableRowGroup: true,
            enablePivot: true,
        },
    },
    groupDefaultExpanded: -1,
    rowGroupPanelShow: 'always',
    groupAllowUnbalanced: true,
}

interface ISingle {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    id: string | undefined
}

export default function SingleConnection({ activeTimeRange, id }: ISingle) {
    const [openDrawer, setOpenDrawer] = useState(false)
    const setNotification = useSetAtom(notificationAtom)

    const query = {
        ...(id && {
            connectionId: [id],
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
    }

    const { response: composition, isLoading: compositionLoading } =
        useInventoryApiV2AnalyticsCompositionDetail('category', {
            ...query,
            top: 4,
        })
    const { response: metrics, isLoading: metricsLoading } =
        useInventoryApiV2AnalyticsMetricList({ ...query, pageSize: 1000 })
    const { response: accountInfo, isLoading: accountInfoLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            ...query,
            pageSize: 1,
            needCost: false,
        })
    const connection = accountInfo?.connections?.at(0)

    return (
        <>
            <Header
                breadCrumb={[
                    connection
                        ? connection?.providerConnectionName
                        : 'Single account detail',
                ]}
                datePicker
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
                                <Spinner className="mt-28" />
                            ) : (
                                <List className="mt-2">
                                    <ListItem>
                                        <Text>Account ID</Text>
                                        <Flex className="w-fit gap-3">
                                            <Button
                                                variant="light"
                                                onClick={() =>
                                                    clipboardCopy(
                                                        `Account ID: ${connection?.providerConnectionID}`
                                                    ).then(() =>
                                                        setNotification({
                                                            text: 'Account ID copied to clipboard',
                                                            type: 'info',
                                                        })
                                                    )
                                                }
                                            >
                                                Copy
                                            </Button>
                                            <Text>
                                                {
                                                    connection?.providerConnectionID
                                                }
                                            </Text>
                                        </Flex>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Account name</Text>
                                        <Flex className="w-fit gap-3">
                                            <Button
                                                variant="light"
                                                onClick={() =>
                                                    clipboardCopy(
                                                        `Account name: ${connection?.providerConnectionName}`
                                                    ).then(() =>
                                                        setNotification({
                                                            text: 'Account name copied to clipboard',
                                                            type: 'info',
                                                        })
                                                    )
                                                }
                                            >
                                                Copy
                                            </Button>
                                            <Text>
                                                {
                                                    connection?.providerConnectionName
                                                }
                                            </Text>
                                        </Flex>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Health state</Text>
                                        <Text>{connection?.healthState}</Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Lifecycle state</Text>
                                        <Text>
                                            {connection?.lifecycleState}
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Onboard date</Text>
                                        <Text>
                                            {dateTimeDisplay(
                                                connection?.onboardDate
                                            )}
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Last inventory</Text>
                                        <Text>
                                            {dateTimeDisplay(
                                                connection?.lastInventory
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
                            <RenderObject obj={connection} />
                        </DrawerPanel>
                    </Flex>
                </Card>
                <Breakdown
                    chartData={pieData(composition).newData}
                    oldChartData={pieData(composition).oldData}
                    activeTime={activeTimeRange}
                    loading={compositionLoading}
                />
            </Grid>
            <Card className="mt-4">
                <Table
                    options={options}
                    title="Resources"
                    downloadable
                    id="asset_resource_metrics"
                    rowData={rowGenerator(metrics?.metrics)}
                    columns={resourceTableColumns}
                    onGridReady={(params) => {
                        if (metricsLoading) {
                            params.api.showLoadingOverlay()
                        }
                    }}
                />
            </Card>
        </>
    )
}
