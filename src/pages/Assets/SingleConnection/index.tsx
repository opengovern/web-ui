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
import { useAtomValue } from 'jotai'
import Breakdown from '../../../components/Breakdown'
import {
    useInventoryApiV2AnalyticsCompositionDetail,
    useInventoryApiV2AnalyticsMetricList,
} from '../../../api/inventory.gen'
import { filterAtom, timeAtom } from '../../../store'
import Table from '../../../components/Table'
import {
    resourceTableColumns,
    rowGenerator,
} from '../Details/ResourceMetricsDetails'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../api/onboard.gen'
import { dateTimeDisplay } from '../../../utilities/dateDisplay'
import Spinner from '../../../components/Spinner'
import DrawerPanel from '../../../components/DrawerPanel'
import { RenderObject } from '../../../components/RenderObject'
import { pieData } from '../index'
import Menu from '../../../components/Menu'

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

export default function SingleConnection() {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const [openDrawer, setOpenDrawer] = useState(false)

    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
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
        <Menu currentPage="assets">
            <Grid numItems={2} className="w-full gap-4">
                <Breakdown
                    chartData={pieData(composition).newData}
                    oldChartData={pieData(composition).oldData}
                    activeTime={activeTimeRange}
                    loading={compositionLoading}
                    seeMore="resource-metrics"
                />
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
                                        <Text>
                                            {connection?.providerConnectionID}
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Account name</Text>
                                        <Text>
                                            {connection?.providerConnectionName}
                                        </Text>
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
            </Grid>
            <Card className="mt-4">
                <Table
                    options={options}
                    title="Resource Metrics"
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
        </Menu>
    )
}
