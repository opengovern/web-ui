import {
    Button,
    Card,
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    Text,
    TextInput,
} from '@tremor/react'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ICellRendererParams } from 'ag-grid-community'
import Menu from '../../../components/Menu'
import { useComplianceApiV1InsightList } from '../../../api/compliance.gen'
import { filterAtom, timeAtom } from '../../../store'
import Spinner from '../../../components/Spinner'
import Header from '../../../components/Header'
import InsightCard from '../../../components/Cards/InsightCard'
import { IColumn } from '../../../components/Table'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsight } from '../../../api/api'
import { badgeDelta } from '../../../utilities/deltaType'

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
            params.data?.connector &&
            badgeDelta(
                params.data?.oldTotalResultValue,
                params.data?.totalResultValue
            ),
    },
]

export default function InsightList() {
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

    return (
        <Menu currentPage="insights">
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
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {listLoading ? (
                        <Flex justifyContent="center" className="mt-56">
                            <Spinner />
                        </Flex>
                    ) : insightError === undefined ? (
                        <Grid numItems={3} className="w-full gap-4">
                            {insightList?.map((insight) => (
                                <InsightCard metric={insight} />
                            ))}
                        </Grid>
                    ) : (
                        <Button onClick={() => insightSendNow()}>Retry</Button>
                    )}
                </Flex>
            </Flex>
        </Menu>
    )
}
