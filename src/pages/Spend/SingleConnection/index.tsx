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
    Text,
    Title,
} from '@tremor/react'
import { ColDef, GridOptions, ValueFormatterParams } from 'ag-grid-community'
import {
    ArrowDownOnSquareIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useParams } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react'
import clipboardCopy from 'clipboard-copy'
import Breakdown from '../../../components/Breakdown'
import {
    useInventoryApiV2AnalyticsSpendCompositionList,
    useInventoryApiV2AnalyticsSpendTableList,
} from '../../../api/inventory.gen'
import { notificationAtom, timeAtom } from '../../../store'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../api/onboard.gen'
import { dateTimeDisplay } from '../../../utilities/dateDisplay'
import Spinner from '../../../components/Spinner'
import DrawerPanel from '../../../components/DrawerPanel'
import { RenderObject } from '../../../components/RenderObject'
import { pieData } from '../index'
import Menu from '../../../components/Menu'
import Header from '../../../components/Header'
import { checkGranularity } from '../../../utilities/dateComparator'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'

export default function SpendSingleConnection() {
    const activeTimeRange = useAtomValue(timeAtom)
    const { id } = useParams()
    const [openDrawer, setOpenDrawer] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(1)
    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'yearly'
    >(
        checkGranularity(activeTimeRange.start, activeTimeRange.end).monthly
            ? 'monthly'
            : 'daily'
    )
    const setNotification = useSetAtom(notificationAtom)
    useEffect(() => {
        switch (selectedIndex) {
            case 0:
                setSelectedGranularity('daily')
                break
            case 1:
                setSelectedGranularity('monthly')
                break
            case 2:
                setSelectedGranularity('yearly')
                break
            default:
                setSelectedGranularity('monthly')
                break
        }
    }, [selectedIndex])

    const tableQuery = (): {
        startTime?: number | undefined
        endTime?: number | undefined
        granularity?: 'daily' | 'monthly' | 'yearly' | undefined
        dimension?: 'metric' | 'connection' | undefined
        connectionId?: string[]
        metricIds?: string[]
    } => {
        let gra: 'monthly' | 'daily' | 'yearly' = 'daily'
        if (selectedGranularity === 'monthly') {
            gra = 'monthly'
        }

        return {
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            dimension: 'metric',
            granularity: gra,
            connectionId: [String(id)],
        }
    }
    const { response, isLoading } = useInventoryApiV2AnalyticsSpendTableList(
        tableQuery()
    )

    const gridRef = useRef<AgGridReact>(null)

    const filterPanel = () => {
        return (
            <Flex
                flexDirection="col"
                justifyContent="start"
                alignItems="start"
                className="w-full px-6"
            >
                <Text className="m-3">Granularity</Text>
                <TabGroup
                    index={selectedIndex}
                    onIndexChange={setSelectedIndex}
                    className="w-fit rounded-lg"
                >
                    <TabList variant="solid">
                        <Tab>Daily</Tab>
                        <Tab
                            disabled={
                                !checkGranularity(
                                    activeTimeRange.start,
                                    activeTimeRange.end
                                ).monthly
                            }
                        >
                            Monthly
                        </Tab>
                        <Tab
                            disabled={
                                !checkGranularity(
                                    activeTimeRange.start,
                                    activeTimeRange.end
                                ).yearly
                            }
                        >
                            Yearly
                        </Tab>
                    </TabList>
                </TabGroup>
            </Flex>
        )
    }

    useEffect(() => {
        gridRef.current?.api?.setSideBar({
            toolPanels: [
                {
                    id: 'columns',
                    labelDefault: 'Columns',
                    labelKey: 'columns',
                    iconKey: 'columns',
                    toolPanel: 'agColumnsToolPanel',
                },
                {
                    id: 'filters',
                    labelDefault: 'Table Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                },
                {
                    id: 'chart',
                    labelDefault: 'Options',
                    labelKey: 'chart',
                    iconKey: 'chart',
                    minWidth: 300,
                    maxWidth: 300,
                    width: 300,
                    toolPanel: filterPanel,
                },
            ],
            defaultToolPanel: '',
        })
    }, [selectedGranularity])

    const gridOptions: GridOptions = {
        pagination: true,
        paginationPageSize: 25,
        suppressExcelExport: true,
        animateRows: true,
        enableGroupEdit: true,
        columnTypes: {
            dimension: {
                enableRowGroup: true,
                enablePivot: true,
            },
        },
        rowGroupPanelShow: 'always',
        groupAllowUnbalanced: true,
        autoGroupColumnDef: {
            pinned: true,
            flex: 2,
            sortable: true,
            filter: true,
            resizable: true,
            cellRendererParams: {
                footerValueGetter: (params: any) => {
                    const isRootLevel = params.node.level === -1
                    if (isRootLevel) {
                        return 'Grand Total'
                    }
                    return `Sub Total (${params.value})`
                },
            },
        },
        getRowHeight: () => 50,
        onGridReady: (e) => {
            if (isLoading) {
                e.api.showLoadingOverlay()
            }
        },
        sideBar: {
            toolPanels: [
                {
                    id: 'columns',
                    labelDefault: 'Columns',
                    labelKey: 'columns',
                    iconKey: 'columns',
                    toolPanel: 'agColumnsToolPanel',
                },
                {
                    id: 'filters',
                    labelDefault: 'Table Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                },
                {
                    id: 'chart',
                    labelDefault: 'Options',
                    labelKey: 'chart',
                    iconKey: 'chart',
                    minWidth: 300,
                    maxWidth: 300,
                    width: 300,
                    toolPanel: filterPanel,
                },
            ],
            defaultToolPanel: '',
        },
        enableRangeSelection: true,
        groupIncludeFooter: true,
        groupIncludeTotalFooter: true,
    }

    // eslint-disable-next-line consistent-return

    useEffect(() => {
        if (!isLoading) {
            const defaultCols: ColDef[] = [
                {
                    field: 'connector',
                    headerName: 'Connector',
                    type: 'connector',
                    enableRowGroup: true,
                    resizable: true,
                    sortable: true,
                    pinned: true,
                    hide: true,
                },
                {
                    field: 'dimension',
                    headerName: 'Service name',
                    sortable: true,
                    resizable: true,
                    pivot: false,
                    pinned: true,
                },
                {
                    field: 'totalCost',
                    headerName: 'Total cost',
                    sortable: true,
                    aggFunc: 'sum',
                    resizable: true,
                    pivot: false,
                    pinned: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value ? exactPriceDisplay(param.value) : ''
                    },
                },
                {
                    field: 'percent',
                    headerName: '%',
                    pinned: true,
                    sortable: true,
                    aggFunc: 'sum',
                    resizable: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value ? `${param.value.toFixed(2)}%` : ''
                    },
                },
                {
                    field: 'category',
                    headerName: 'Category',
                    rowGroup: true,
                    enableRowGroup: true,
                    sortable: true,
                    resizable: true,
                    pinned: true,
                },
            ]

            const columnNames =
                response
                    ?.map((row) => {
                        if (row.costValue) {
                            return Object.entries(row.costValue).map(
                                (value) => value[0]
                            )
                        }
                        return []
                    })
                    .flat() || []

            const dynamicCols: ColDef[] = columnNames
                .filter((value, index, array) => array.indexOf(value) === index)
                .map((colName) => {
                    const v: ColDef = {
                        field: colName,
                        headerName: colName,
                        sortable: true,
                        suppressMenu: true,
                        resizable: true,
                        pivot: false,
                        valueFormatter: (param) => {
                            return param.value
                                ? exactPriceDisplay(param.value)
                                : ''
                        },
                    }
                    return v
                })

            const cols = [...defaultCols, ...dynamicCols]
            const rows =
                response?.map((row) => {
                    let temp = {}
                    let totalCost = 0
                    if (row.costValue) {
                        temp = Object.fromEntries(Object.entries(row.costValue))
                    }
                    Object.values(temp).map(
                        // eslint-disable-next-line no-return-assign
                        (v: number | unknown) => (totalCost += Number(v))
                    )
                    return {
                        dimension: row.dimensionName
                            ? row.dimensionName
                            : row.dimensionId,
                        category: row.category,
                        accountId: row.accountID,
                        connector: row.connector,
                        totalCost,
                        ...temp,
                    }
                }) || []
            let sum = 0
            const newRow = []
            for (let i = 0; i < rows.length; i += 1) {
                sum += rows[i].totalCost
            }
            for (let i = 0; i < rows.length; i += 1) {
                newRow.push({
                    ...rows[i],
                    percent: (rows[i].totalCost / sum) * 100,
                })
            }
            gridRef.current?.api?.setColumnDefs(cols)
            gridRef.current?.api?.setRowData(newRow)
        }
    }, [isLoading])
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
        useInventoryApiV2AnalyticsSpendCompositionList({
            ...query,
            top: 4,
        })
    const { response: accountInfo, isLoading: accountInfoLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            ...query,
            pageSize: 1,
            needCost: false,
        })
    const connection = accountInfo?.connections?.at(0)

    return (
        <Menu currentPage="spend">
            <Header breadCrumb={['Single account detail']} datePicker />
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
                    chartData={pieData(composition)}
                    loading={compositionLoading}
                />
            </Grid>
            <Card className="mt-4">
                <Flex>
                    <Title className="font-semibold">Spend</Title>
                    <Flex className="gap-4 w-fit">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                gridRef.current?.api?.exportDataAsCsv()
                            }}
                            icon={ArrowDownOnSquareIcon}
                        >
                            Download
                        </Button>
                    </Flex>
                </Flex>
                <div className="ag-theme-alpine mt-4">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                    />
                </div>
            </Card>
        </Menu>
    )
}
