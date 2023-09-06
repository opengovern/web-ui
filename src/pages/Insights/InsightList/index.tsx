import { Button, Flex, Select, SelectItem, Text } from '@tremor/react'
import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { useNavigate } from 'react-router-dom'
import Menu from '../../../components/Menu'
import { useComplianceApiV1InsightList } from '../../../api/compliance.gen'
import { filterAtom, notificationAtom, timeAtom } from '../../../store'
import Spinner from '../../../components/Spinner'
import Header from '../../../components/Header'
import Table, { IColumn } from '../../../components/Table'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsight } from '../../../api/api'
import { badgeDelta } from '../../../utilities/deltaType'
import { rowGenerator } from '../../Assets/Details/ResourceMetricsDetails'

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

const personaList = ['Developer', 'Security', 'Executive', 'DevOps', 'Product']

export default function InsightList() {
    const [selectedPersona, setSelectedPersona] = useState<string[]>([])
    const [selectedResourceType, setSelectedResourceType] = useState<string>('')
    const [selectedObjective, setSelectedObjective] = useState<string>('')

    const setNotification = useSetAtom(notificationAtom)

    const selectedConnections = useAtomValue(filterAtom)
    const activeTimeRange = useAtomValue(timeAtom)
    const navigate = useNavigate()

    const navigateToAssetsInsightsDetails = (id: number | undefined) => {
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
                <Text className="m-3">Persona</Text>
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    className="gap-1.5"
                >
                    {personaList.map((p) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                        <label
                            onClick={() =>
                                setSelectedPersona((prevState) => {
                                    if (selectedPersona.includes(p)) {
                                        const arr = selectedPersona
                                        arr.splice(arr.indexOf(p), 1)
                                        return arr
                                    }
                                    return [...prevState, p]
                                })
                            }
                            htmlFor={p}
                            className="flex items-center gap-2"
                        >
                            <input
                                id={p}
                                type="checkbox"
                                checked={selectedPersona.includes(p)}
                                className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <Text>{p}</Text>
                        </label>
                    ))}
                </Flex>
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
        onRowClicked: (event: RowClickedEvent) => {
            if (
                event.data?.totalResultValue ||
                event.data?.oldTotalResultValue
            ) {
                navigateToAssetsInsightsDetails(event.data?.id)
            } else {
                setNotification({
                    text: 'Time period is not covered by insight',
                    type: 'warning',
                })
            }
        },
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
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
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
        <Menu currentPage="insight">
            <Header datePicker filter />
            <Flex className="gap-6" alignItems="start">
                {/* eslint-disable-next-line no-nested-ternary */}
                {listLoading ? (
                    <Flex justifyContent="center" className="mt-56">
                        <Spinner />
                    </Flex>
                ) : insightError === undefined ? (
                    <Table
                        id="insight_list"
                        columns={columns}
                        rowData={rowGenerator(insightList).filter((i) => {
                            if (selectedConnections.provider.length) {
                                return (
                                    i.connector === selectedConnections.provider
                                )
                            }
                            return i
                        })}
                        options={options}
                    />
                ) : (
                    <Button onClick={() => insightSendNow()}>Retry</Button>
                )}
            </Flex>
        </Menu>
    )
}
