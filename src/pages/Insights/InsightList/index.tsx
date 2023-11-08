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
import { useEffect, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { useNavigate } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { useComplianceApiV1InsightList } from '../../../api/compliance.gen'
import { filterAtom, notificationAtom, timeAtom } from '../../../store'
import Spinner from '../../../components/Spinner'
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

export default function InsightList() {
    const navigate = useNavigate()
    const [searchCategory, setSearchCategory] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        switch (selectedIndex) {
            case 0:
                setSelectedCategory('')
                break
            case 1:
                setSelectedCategory('DevOps')
                break
            case 2:
                setSelectedCategory('Executive')
                break
            case 3:
                setSelectedCategory('FinOps')
                break
            case 4:
                setSelectedCategory('Product')
                break
            case 5:
                setSelectedCategory('Security')
                break
            default:
                setSelectedCategory('')
                break
        }
    }, [selectedIndex])

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

    const navigateToInsightsDetails = (id: number | undefined) => {
        navigate(`${id}`)
    }

    const options: GridOptions = {
        // eslint-disable-next-line consistent-return
        isRowSelectable: (param) =>
            param.data?.totalResultValue || param.data?.oldTotalResultValue,
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
                <Flex flexDirection="col" alignItems="start">
                    <TabGroup
                        index={selectedIndex}
                        onIndexChange={setSelectedIndex}
                    >
                        <TabList variant="solid" className="px-0 mb-4">
                            <Tab className="px-4 py-2">All</Tab>
                            <Tab className="px-4 py-2">DevOps</Tab>
                            <Tab className="px-4 py-2">Executive</Tab>
                            <Tab className="px-4 py-2">FinOps</Tab>
                            <Tab className="px-4 py-2">Product</Tab>
                            <Tab className="px-4 py-2">Security</Tab>
                        </TabList>
                    </TabGroup>
                    {insightError === undefined ? (
                        <Table
                            id="insight_list"
                            columns={columns}
                            rowData={insightList?.filter((i) => {
                                if (selectedConnections.provider.length) {
                                    return (
                                        i.connector ===
                                        selectedConnections.provider
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
                        />
                    ) : (
                        <Button onClick={() => insightSendNow()}>Retry</Button>
                    )}
                </Flex>
            </Flex>
        </Layout>
    )
}
