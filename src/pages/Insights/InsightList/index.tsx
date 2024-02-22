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
    Icon,
    Badge,
    TabPanels,
    TabPanel,
} from '@tremor/react'
import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    CheckBadgeIcon,
    CheckCircleIcon,
    XCircleIcon,
    MagnifyingGlassIcon,
    CommandLineIcon,
    BookOpenIcon,
    CodeBracketIcon,
    Cog8ToothIcon,
} from '@heroicons/react/24/outline'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    useComplianceApiV1InsightList,
    useComplianceApiV1MetadataTagInsightList,
} from '../../../api/compliance.gen'
import { notificationAtom } from '../../../store'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsight } from '../../../api/api'
import { badgeDelta } from '../../../utilities/deltaType'
import TopHeader from '../../../components/Layout/Header'
import {
    defaultTime,
    searchAtom,
    useFilterState,
    useURLParam,
    useUrlDateRangeState,
} from '../../../utilities/urlstate'
import Table, { IColumn } from '../../../components/Table'

const columns: IColumn<any, any>[] = [
    {
        headerName: 'Insight Title',
        type: 'custom',
        sortable: false,
        isBold: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiInsight>
        ) =>
            params.data?.connector && (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="gap-2"
                >
                    <Text className="text-gray-800 mb-0.5 font-bold">
                        {params.data?.shortTitle}
                    </Text>
                </Flex>
            ),
    },
    {
        headerName: 'Service',
        field: 'connector',
        type: 'string',
        sortable: true,
        width: 200,
        enableRowGroup: true,
    },
    {
        headerName: 'Categories',
        type: 'custom',
        sortable: true,
        width: 120,
        enableRowGroup: true,
        cellRenderer: () => (
            <Flex
                justifyContent="center"
                className="gap-1.5"
                flexDirection="col"
            >
                <Badge size="xs" color="gray">
                    Security
                </Badge>
                <Badge size="xs" color="gray">
                    Reliablity
                </Badge>
            </Flex>
        ),
    },

    {
        headerName: 'Risk',
        field: 'risk',
        type: 'custom',
        sortable: true,
        width: 100,
        enableRowGroup: true,
        cellRenderer: () => (
            <Flex justifyContent="start" className="gap-1">
                <Badge size="xs" color="emerald">
                    Low
                </Badge>
            </Flex>
        ),
    },

    {
        headerName: 'Result',
        field: 'result',
        type: 'custom',
        width: 160,
        cellRenderer: () => (
            <Flex className="mt-1" flexDirection="col" justifyContent="center">
                <Flex justifyContent="start" className="gap-1">
                    <Icon
                        className="w-4"
                        icon={CheckCircleIcon}
                        color="emerald"
                    />
                    <Text>Passed :</Text>
                    <Text className="font-bold">112</Text>
                </Flex>
                <Flex justifyContent="start" className="gap-1">
                    <Icon className="w-4" icon={XCircleIcon} color="rose" />
                    <Text>Failed :</Text>
                    <Text className="font-bold ">34</Text>
                </Flex>
            </Flex>
        ),
    },
    {
        headerName: 'Fix It',
        type: 'custom',
        sortable: true,
        width: 200,
        enableRowGroup: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiInsight>
        ) => (
            <Flex justifyContent="start" className="gap-3">
                {true && (
                    <div className="group relative flex justify-center cursor-pointer">
                        <CommandLineIcon className="text-kaytu-500 w-5" />
                        <Card className="absolute -top-2.5 left-6 w-fit z-40 scale-0 transition-all rounded p-2 group-hover:scale-100">
                            <Text>Command line (CLI)</Text>
                        </Card>
                    </div>
                )}
                {true && (
                    <div className="group relative flex justify-center cursor-pointer">
                        <BookOpenIcon className="text-kaytu-500 w-5" />
                        <Card className="absolute -top-2.5 left-6 w-fit z-40 scale-0 transition-all rounded p-2 group-hover:scale-100">
                            <Text>Manual</Text>
                        </Card>
                    </div>
                )}
                {true && (
                    <div className="group relative flex justify-center cursor-pointer">
                        <CodeBracketIcon className="text-kaytu-500 w-5" />
                        <Card className="absolute -top-2.5 left-6 w-fit z-40 scale-0 transition-all rounded p-2 group-hover:scale-100">
                            <Text>Programmatic</Text>
                        </Card>
                    </div>
                )}
                {true && (
                    <div className="group relative flex justify-center cursor-pointer">
                        <Cog8ToothIcon className="text-kaytu-500 w-5" />
                        <Card className="absolute -top-2.5 left-6 w-fit z-40 scale-0 transition-all rounded p-2 group-hover:scale-100">
                            <Text>Guard rail</Text>
                        </Card>
                    </div>
                )}
            </Flex>
        ),
    },
]

const options: GridOptions = {
    // eslint-disable-next-line consistent-return
    isRowSelectable: (param) =>
        param.data?.totalResultValue || param.data?.oldTotalResultValue,
}

export default function InsightList() {
    const [category, setCategory] = useURLParam('category', '')
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
    const [searchCategory, setSearchCategory] = useState('')
    const [selectedPersona, setSelectedPersona] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')

    const { value: activeTimeRange } = useUrlDateRangeState(defaultTime)
    const { value: selectedConnections } = useFilterState()
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
        navigate(`${id}?${searchParams}`)
    }

    return (
        <>
            <TopHeader datePicker filter />

            <Flex alignItems="start" className="gap-4">
                {/* <Card className="sticky w-fit">
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
                                </Card> */}
                {insightError === undefined ? (
                    <Flex className="flex flex-col">
                        <TabGroup className="mb-6">
                            <TabList>
                                <Tab>SCORE Insights</Tab>
                                <Tab>Service Insights</Tab>
                            </TabList>
                        </TabGroup>
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
                            rowHeight="xl"
                        >
                            {/*
                        <TabGroup>
                            <TabList variant="solid" className="px-0">
                                <Tab
                                    className="px-4 py-2"
                                    onClick={() => setSelectedPersona('')}
                                >
                                    All
                                </Tab>
                                // eslint-disable-next-line react/jsx-no-useless-fragment
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
                        */}
                        </Table>
                    </Flex>
                ) : (
                    <Button onClick={() => insightSendNow()}>Retry</Button>
                )}
            </Flex>
        </>
    )
}
