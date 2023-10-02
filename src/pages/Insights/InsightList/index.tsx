import {
    Button,
    Card,
    Flex,
    Grid,
    Select,
    SelectItem,
    Text,
    TextInput,
} from '@tremor/react'
import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { useNavigate } from 'react-router-dom'
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Menu from '../../../components/Menu'
import { useComplianceApiV1InsightList } from '../../../api/compliance.gen'
import { filterAtom, notificationAtom, timeAtom } from '../../../store'
import Spinner from '../../../components/Spinner'
import Header from '../../../components/Header'
import Table, { IColumn } from '../../../components/Table'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsight } from '../../../api/api'
import { badgeDelta } from '../../../utilities/deltaType'
import { rowGenerator } from '../../Infrastructure/Details'
import InsightCard from '../../../components/Cards/InsightCard'

const columns: IColumn<any, any>[] = [
    {
        headerName: 'Connector',
        field: 'connector',
        type: 'string',
        width: 120,
        enableRowGroup: true,
    },
    {
        headerName: 'Insight',
        type: 'string',
        sortable: false,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiInsight>
        ) =>
            params.data?.connector && (
                <Flex flexDirection="col" alignItems="start">
                    <Text className="text-gray-800 mb-0.5">
                        {params.data?.shortTitle}
                    </Text>
                    <Text>{params.data?.longTitle}</Text>
                </Flex>
            ),
    },
    {
        field: 'category',
        rowGroup: true,
        enableRowGroup: true,
        headerName: 'Category',
        type: 'string',
        hide: true,
        width: 190,
    },
    {
        field: 'totalResultValue',
        headerName: 'Count',
        type: 'number',
        width: 100,
    },
    {
        field: 'oldTotalResultValue',
        headerName: 'Previous Count',
        type: 'number',
        width: 140,
    },
    {
        headerName: 'Growth',
        type: 'string',
        width: 100,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiInsight>
        ) =>
            params.data?.connector && (
                <Flex justifyContent="center" className="h-full">
                    {params.data?.oldTotalResultValue
                        ? badgeDelta(
                              params.data?.oldTotalResultValue,
                              params.data?.totalResultValue
                          )
                        : badgeDelta(1, 2)}
                </Flex>
            ),
    },
]

export default function InsightList() {
    const [selectedResourceType, setSelectedResourceType] = useState<string>('')
    const [selectedObjective, setSelectedObjective] = useState<string>('')
    const [searchCategory, setSearchCategory] = useState('')
    const [showFilter, setShowFilter] = useState(false)

    const setNotification = useSetAtom(notificationAtom)

    const selectedConnections = useAtomValue(filterAtom)
    const activeTimeRange = useAtomValue(timeAtom)
    const navigate = useNavigate()

    const navigateToInsightsDetails = (id: number | undefined) => {
        navigate(`${id}`)
    }

    const query = {
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
    }

    const {
        response: insightList,
        isLoading: listLoading,
        sendNow: insightSendNow,
        error: insightError,
    } = useComplianceApiV1InsightList(query)

    const filterPanel = () => {
        return (
            <Flex
                flexDirection="col"
                justifyContent="start"
                alignItems="start"
                className="w-full px-6"
            >
                <Text className="m-3">Resource Type</Text>
                <Select
                    value={selectedResourceType}
                    onValueChange={(v) => setSelectedResourceType(v)}
                >
                    <SelectItem value="metric">Service</SelectItem>
                    <SelectItem value="connection">Connection</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                </Select>
                <Text className="m-3">Objective</Text>
                <Select
                    value={selectedObjective}
                    onValueChange={(v) => setSelectedObjective(v)}
                >
                    <SelectItem value="metric">Service</SelectItem>
                    <SelectItem value="connection">Connection</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                </Select>
            </Flex>
        )
    }

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
        // eslint-disable-next-line consistent-return
        isRowSelectable: (param) =>
            param.data?.totalResultValue || param.data?.oldTotalResultValue,
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
    }

    return (
        <Menu currentPage="all-insights">
            <Header datePicker filter />
            <>
                {/* eslint-disable-next-line no-nested-ternary */}
                {listLoading ? (
                    <Flex justifyContent="center" className="mt-56">
                        <Spinner />
                    </Flex>
                ) : insightError === undefined ? (
                    <Flex alignItems="start" className="gap-4">
                        {showFilter ? (
                            <Card className="sticky w-fit">
                                <TextInput
                                    className="w-56 mb-6"
                                    icon={MagnifyingGlassIcon}
                                    placeholder="Search..."
                                    value={searchCategory}
                                    onChange={(e) =>
                                        setSearchCategory(e.target.value)
                                    }
                                />
                            </Card>
                        ) : (
                            <Flex
                                flexDirection="col"
                                justifyContent="center"
                                className="min-h-full w-fit"
                            >
                                <Button
                                    variant="light"
                                    onClick={() => setShowFilter(true)}
                                >
                                    <Flex
                                        flexDirection="col"
                                        className="gap-4 w-4"
                                    >
                                        <FunnelIcon />
                                        <Text className="rotate-90">
                                            Options
                                        </Text>
                                    </Flex>
                                </Button>
                            </Flex>
                        )}
                        <Grid numItems={3} className="w-full gap-4">
                            {insightList?.map((insight) => (
                                <InsightCard metric={insight} />
                            ))}
                        </Grid>
                    </Flex>
                ) : (
                    <Button onClick={() => insightSendNow()}>Retry</Button>
                )}
            </>
        </Menu>
    )
}
