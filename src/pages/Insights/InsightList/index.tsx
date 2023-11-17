import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Button,
    Card,
    Flex,
    Tab,
    TabGroup,
    TabList,
    Text,
    TextInput,
} from '@tremor/react'
import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { useNavigate } from 'react-router-dom'
import Layout from '../../../components/Layout'
import {
    useComplianceApiV1InsightList,
    useComplianceApiV1MetadataTagInsightList,
} from '../../../api/compliance.gen'
import { filterAtom, notificationAtom, timeAtom } from '../../../store'
import Header from '../../../components/Header'
import Table, { IColumn } from '../../../components/Table'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsight } from '../../../api/api'
import { badgeDelta } from '../../../utilities/deltaType'

const columns: IColumn<any, any>[] = [
    {
        headerName: 'Connector',
        field: 'connector',
        type: 'string',
        sortable: true,
        width: 120,
        enableRowGroup: true,
    },
    {
        headerName: 'Insight',
        type: 'string',
        sortable: false,
        field: 'shortTitle',
        // cellRenderer: (
        //     params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiInsight>
        // ) =>
        //     params.data?.connector && (
        //         <Flex flexDirection="col" alignItems="start">
        //             <Text className="text-gray-800 mb-0.5">
        //                 {params.data?.shortTitle}
        //             </Text>
        //             <Text>{params.data?.longTitle}</Text>
        //         </Flex>
        //     ),
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
        width: 120,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiInsight>
        ) =>
            params.data?.connector &&
            badgeDelta(
                params.data?.oldTotalResultValue,
                params.data?.totalResultValue
            ),
    },
]

const options: GridOptions = {
    // eslint-disable-next-line consistent-return
    isRowSelectable: (param) =>
        param.data?.totalResultValue || param.data?.oldTotalResultValue,
}

export default function InsightList() {
    const navigate = useNavigate()
    const [searchCategory, setSearchCategory] = useState('')
    const [selectedPersona, setSelectedPersona] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')

    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const setNotification = useSetAtom(notificationAtom)

    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
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
    const { response: categories } = useComplianceApiV1MetadataTagInsightList()

    const navigateToInsightsDetails = (id: number | undefined) => {
        navigate(`${id}`)
    }

    return (
        <Layout currentPage="insights">
            <Header datePicker filter />
            <Flex alignItems="start" className="gap-4">
                <Card className="sticky w-fit">
                    <TextInput
                        className="w-56 mb-6"
                        icon={MagnifyingGlassIcon}
                        placeholder="Search..."
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    />
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-2 w-full bg-transparent">
                            <Text className="text-gray-800">Categories</Text>
                        </AccordionHeader>
                        <AccordionBody className="p-0 w-full pr-0.5 cursor-default bg-transparent">
                            <Button
                                variant="light"
                                onClick={() => {
                                    setSelectedCategory('')
                                }}
                                className={`flex justify-start min-w-full truncate p-2 rounded-md ${
                                    selectedCategory === ''
                                        ? 'bg-kaytu-100'
                                        : ''
                                }`}
                            >
                                <Text className="w-full truncate hover:text-kaytu-600">
                                    All
                                </Text>
                            </Button>
                            {categories?.category?.map((cat) => (
                                <Button
                                    variant="light"
                                    onClick={() => {
                                        setSelectedCategory(cat)
                                    }}
                                    className={`flex justify-start min-w-full truncate p-2 rounded-md ${
                                        selectedCategory === cat
                                            ? 'bg-kaytu-100'
                                            : ''
                                    }`}
                                >
                                    <Text className="truncate hover:text-kaytu-600">
                                        {cat}
                                    </Text>
                                </Button>
                            ))}
                        </AccordionBody>
                    </Accordion>
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800">Objectives</Text>
                        </AccordionHeader>
                        <AccordionBody className="p-0 w-full pr-0.5 cursor-default bg-transparent">
                            <Text className="ml-4 w-full truncate text-start py-2 cursor-pointer hover:text-kaytu-600">
                                sample
                            </Text>
                            <Text className="ml-4 w-full truncate text-start py-2 cursor-pointer hover:text-kaytu-600">
                                sample
                            </Text>
                            <Text className="ml-4 w-full truncate text-start py-2 cursor-pointer hover:text-kaytu-600">
                                sample
                            </Text>
                        </AccordionBody>
                    </Accordion>
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800">
                                Cloud services
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="p-0 w-full pr-0.5 cursor-default bg-transparent">
                            <Text className="ml-4 w-full truncate text-start py-2 cursor-pointer hover:text-kaytu-600">
                                sample
                            </Text>
                            <Text className="ml-4 w-full truncate text-start py-2 cursor-pointer hover:text-kaytu-600">
                                sample
                            </Text>
                            <Text className="ml-4 w-full truncate text-start py-2 cursor-pointer hover:text-kaytu-600">
                                sample
                            </Text>
                        </AccordionBody>
                    </Accordion>
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800">
                                Resource types
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="p-0 w-full pr-0.5 cursor-default bg-transparent">
                            <Text className="ml-4 w-full truncate text-start py-2 cursor-pointer hover:text-kaytu-600">
                                sample
                            </Text>
                            <Text className="ml-4 w-full truncate text-start py-2 cursor-pointer hover:text-kaytu-600">
                                sample
                            </Text>
                            <Text className="ml-4 w-full truncate text-start py-2 cursor-pointer hover:text-kaytu-600">
                                sample
                            </Text>
                        </AccordionBody>
                    </Accordion>
                </Card>
                {insightError === undefined ? (
                    <Table
                        id="insight_list"
                        columns={columns}
                        rowData={insightList
                            ?.filter((i) => {
                                if (selectedConnections.provider.length) {
                                    return (
                                        i.connector ===
                                        selectedConnections.provider
                                    )
                                }
                                return i
                            })
                            ?.filter((i) => {
                                if (selectedCategory.length) {
                                    return i.tags?.category?.includes(
                                        selectedCategory
                                    )
                                }
                                return i
                            })
                            ?.filter((i) => {
                                if (selectedPersona.length) {
                                    return i.tags?.persona?.includes(
                                        selectedPersona
                                    )
                                }
                                return i
                            })}
                        options={options}
                        onRowClicked={(event: RowClickedEvent) => {
                            if (
                                event.data?.totalResultValue ||
                                event.data?.oldTotalResultValue
                            ) {
                                navigateToInsightsDetails(event.data?.id)
                            } else {
                                setNotification({
                                    text: 'Time period is not covered by insight',
                                    type: 'warning',
                                })
                            }
                        }}
                        loading={listLoading}
                    >
                        <TabGroup>
                            <TabList variant="solid" className="px-0">
                                <Tab
                                    className="px-4 py-2"
                                    onClick={() => setSelectedPersona('')}
                                >
                                    All
                                </Tab>
                                {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
                                <>
                                    {categories?.persona?.map((cat) => (
                                        <Tab
                                            className="px-4 py-2"
                                            onClick={() =>
                                                setSelectedPersona(cat)
                                            }
                                        >
                                            {cat}
                                        </Tab>
                                    ))}
                                </>
                            </TabList>
                        </TabGroup>
                    </Table>
                ) : (
                    <Button onClick={() => insightSendNow()}>Retry</Button>
                )}
            </Flex>
        </Layout>
    )
}
