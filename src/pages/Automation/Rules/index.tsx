import { Button, Flex, Tab, TabGroup, TabList, TextInput } from '@tremor/react'
import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Menu from '../../../components/Menu'
import Header from '../../../components/Header'
import { useAlertingApiV1RuleListList } from '../../../api/alerting.gen'
import Table, { IColumn } from '../../../components/Table'

const columns: IColumn<any, any>[] = [
    {
        headerName: 'Rule name',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
    },
    {
        headerName: 'Description',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
    },
    {
        headerName: 'Condition',
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
    },
]

export default function Rules() {
    const [selectedIndex, setSelectedIndex] = useState(0)
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
                    <Button icon={PlusIcon}>Create rule</Button>
                </Flex>
            </Flex>
            <Table
                id="rules"
                columns={columns}
                rowData={[]}
                loading={isLoading}
            />
        </Menu>
    )
}
