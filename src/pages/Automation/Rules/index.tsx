import {
    Badge,
    Button,
    Flex,
    List,
    ListItem,
    Tab,
    TabGroup,
    TabList,
    Text,
    TextInput,
} from '@tremor/react'
import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { RowClickedEvent, ValueFormatterParams } from 'ag-grid-community'
import { QueryBuilder } from 'react-querybuilder/dist/cjs/react-querybuilder.cjs.development'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import {
    useAlertingApiV1RuleDeleteDelete,
    useAlertingApiV1RuleListList,
} from '../../../api/alerting.gen'
import Table, { IColumn } from '../../../components/Table'
import NewRule from './NewRule'
import { GithubComKaytuIoKaytuEnginePkgAlertingApiRule } from '../../../api/api'
import DrawerPanel from '../../../components/DrawerPanel'

const columns: IColumn<any, any>[] = [
    {
        field: 'metadata.name',
        headerName: 'Rule name',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
    },
    {
        field: 'metadata.description',
        headerName: 'Description',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
    },
    {
        headerName: 'Condition state',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
        cellRenderer: (
            param: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgAlertingApiRule>
        ) => {
            if (param.data?.trigger_status === 'Not Active') {
                return <Badge color="rose">Not satisfied</Badge>
            }
            return <Badge color="emerald">Satisfied</Badge>
        },
    },
    {
        headerName: 'Trigger',
        sortable: true,
        filter: true,
        type: 'string',
        valueFormatter: (
            param: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgAlertingApiRule>
        ) => {
            if (param.data?.event_type?.benchmark_id !== undefined) {
                return `Benchmark: ${param.data?.event_type?.benchmark_id}`
            }
            if (param.data?.event_type?.insight_id !== undefined) {
                return `Insight: ${param.data?.event_type?.insight_id}`
            }
            return ''
        },
    },
]

export default function Rules() {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [openCreate, setOpenCreate] = useState(false)
    const [openDetail, setOpenDetail] = useState(false)
    const [selectedRow, setSelectedRow] = useState<
        GithubComKaytuIoKaytuEnginePkgAlertingApiRule | undefined
    >(undefined)
    const queryCreator = (query: any) => {
        if (query) {
            let temp = JSON.stringify(query)
            temp = temp.replaceAll('condition_type', 'combinator')
            temp = temp.replaceAll('operator', 'rules')
            temp = temp.replaceAll('operator_type', 'operator')

            const re = /value":\s*"([-\d.]+)"/i
            temp = temp.replace(re, 'value": $1')

            return JSON.parse(temp)
        }
        return {}
    }

    const { response: rules, isLoading } = useAlertingApiV1RuleListList()
    const {
        isLoading: isDeleteExecuted,
        isExecuted: isDeleteLoading,
        sendNow: deleteNow,
    } = useAlertingApiV1RuleDeleteDelete(String(selectedRow?.id), {}, false)

    return (
        <Layout currentPage="rules">
            <Header />
            <Flex className="mb-4">
                <TabGroup
                    index={selectedIndex}
                    onIndexChange={setSelectedIndex}
                >
                    <TabList variant="solid" className="px-0">
                        <Tab className="px-4 py-2">All</Tab>
                        <Tab className="px-4 py-2">Satisfied</Tab>
                        <Tab className="px-4 py-2">Not satisfied</Tab>
                    </TabList>
                </TabGroup>
                <Flex className="w-fit gap-4">
                    <TextInput
                        icon={MagnifyingGlassIcon}
                        placeholder="Search rules..."
                        className="w-56"
                    />
                    <Button icon={PlusIcon} onClick={() => setOpenCreate(true)}>
                        Create rule
                    </Button>
                </Flex>
            </Flex>
            <NewRule open={openCreate} onClose={() => setOpenCreate(false)} />
            <Table
                id="rules"
                columns={columns}
                rowData={rules}
                loading={isLoading}
                onRowClicked={(event: RowClickedEvent) => {
                    setSelectedRow(event.data)
                    setOpenDetail(true)
                }}
            />
            <DrawerPanel
                title="Rule detail"
                open={openDetail}
                onClose={() => setOpenDetail(false)}
            >
                <Flex flexDirection="col" alignItems="start" className="h-full">
                    <List>
                        <ListItem className="py-6">
                            <Text>Name</Text>
                            <Text className="text-gray-900 w-3/5 whitespace-pre-wrap text-end">
                                {selectedRow?.metadata?.name}
                            </Text>
                        </ListItem>
                        <ListItem className="py-6">
                            <Text>Description</Text>
                            <Text className="text-gray-900 w-3/5 whitespace-pre-wrap text-end">
                                {selectedRow?.metadata?.description}
                            </Text>
                        </ListItem>
                        <ListItem className="py-5">
                            <Text>Condition state</Text>
                            <Text className="text-gray-900 w-3/5 whitespace-pre-wrap text-end">
                                {selectedRow?.trigger_status === 'Active' ? (
                                    <Badge color="emerald">Satisfied</Badge>
                                ) : (
                                    <Badge color="rose">Not satisfied</Badge>
                                )}
                            </Text>
                        </ListItem>
                        <ListItem className="py-6">
                            <Text>Label</Text>
                            <Text className="text-gray-900 w-3/5 whitespace-pre-wrap text-end">
                                {selectedRow?.metadata?.label}
                            </Text>
                        </ListItem>
                        <ListItem className="py-6">
                            <Text>Event</Text>
                            <Text className="text-gray-900 w-3/5 whitespace-pre-wrap text-end">
                                {JSON.stringify(selectedRow?.event_type)}
                            </Text>
                        </ListItem>
                        <ListItem className="py-6">
                            <Text>Scope</Text>
                            <Text className="text-gray-900 w-3/5 whitespace-pre-wrap text-end">
                                {JSON.stringify(selectedRow?.scope)}
                            </Text>
                        </ListItem>
                        <ListItem className="py-6">
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="editor gap-4"
                            >
                                <Text>Condition</Text>
                                <QueryBuilder
                                    fields={[
                                        {
                                            name: 'score',
                                            label: 'Score (%)',
                                            datatype: 'number',
                                        },
                                    ]}
                                    operators={[
                                        { name: '<', label: '<' },
                                        { name: '>', label: '>' },
                                    ]}
                                    query={queryCreator(
                                        selectedRow?.operator?.condition
                                    )}
                                    disabled
                                />
                            </Flex>
                        </ListItem>
                    </List>
                    <Flex justifyContent="end" className="gap-4">
                        <Button
                            variant="secondary"
                            color="rose"
                            loading={isDeleteExecuted && isDeleteLoading}
                            onClick={deleteNow}
                        >
                            Delete
                        </Button>
                        <Button>Edit</Button>
                    </Flex>
                </Flex>
            </DrawerPanel>
        </Layout>
    )
}
