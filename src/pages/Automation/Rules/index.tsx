import {
    Badge,
    Button,
    Flex,
    Tab,
    TabGroup,
    TabList,
    TextInput,
} from '@tremor/react'
import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ValueFormatterParams } from 'ag-grid-community'
import Menu from '../../../components/Menu'
import Header from '../../../components/Header'
import { useAlertingApiV1RuleListList } from '../../../api/alerting.gen'
import Table, { IColumn } from '../../../components/Table'
import NewRule from './NewRule'
import { GithubComKaytuIoKaytuEnginePkgAlertingApiRule } from '../../../api/api'

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
        headerName: 'Status',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
        cellRenderer: (
            param: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgAlertingApiRule>
        ) => {
            if (param.data?.trigger_status === 'Not Active') {
                return <Badge color="rose">Not Active</Badge>
            }
            return <Badge color="emerald">Active</Badge>
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
    const [openDrawer, setOpenDrawer] = useState(false)

    const { response: rules, isLoading } = useAlertingApiV1RuleListList()

    return (
        <Menu currentPage="rules">
            <Header />
            <Flex className="mb-4">
                <TabGroup
                    index={selectedIndex}
                    onIndexChange={setSelectedIndex}
                >
                    <TabList variant="solid" className="px-0">
                        <Tab className="px-4 py-2">All</Tab>
                        <Tab className="px-4 py-2">Active</Tab>
                        <Tab className="px-4 py-2">Not active</Tab>
                    </TabList>
                </TabGroup>
                <Flex className="w-fit gap-4">
                    <TextInput
                        icon={MagnifyingGlassIcon}
                        placeholder="Search rules..."
                        className="w-56"
                    />
                    <Button icon={PlusIcon} onClick={() => setOpenDrawer(true)}>
                        Create rule
                    </Button>
                </Flex>
            </Flex>
            <NewRule open={openDrawer} onClose={() => setOpenDrawer(false)} />
            <Table
                id="rules"
                columns={columns}
                rowData={rules}
                loading={isLoading}
            />
        </Menu>
    )
}
