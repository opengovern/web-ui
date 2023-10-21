import { Flex, TextInput } from '@tremor/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Menu from '../../../components/Menu'
import Header from '../../../components/Header'
import Table, { IColumn } from '../../../components/Table'

const columns: IColumn<any, any>[] = [
    {
        headerName: 'Alert name',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
    },
    {
        headerName: 'Time',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'datetime',
    },
    {
        headerName: 'Amount',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
    },
    {
        headerName: 'Response',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
    },
]

export default function Alerts() {
    return (
        <Menu currentPage="alerts">
            <Header />
            <Flex justifyContent="end" className="mb-4">
                <TextInput
                    icon={MagnifyingGlassIcon}
                    placeholder="Search alerts..."
                    className="w-56"
                />
            </Flex>
            <Table id="alerts" columns={columns} rowData={[]} />
        </Menu>
    )
}
