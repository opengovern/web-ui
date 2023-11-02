import { Flex, TextInput } from '@tremor/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { RowClickedEvent, ValueFormatterParams } from 'ag-grid-community'
import { useState } from 'react'
import Menu from '../../../components/Menu'
import Header from '../../../components/Header'
import Table, { IColumn } from '../../../components/Table'
import { useAlertingApiV1TriggerListList } from '../../../api/alerting.gen'
import { numericDisplay } from '../../../utilities/numericDisplay'
import { RenderObject } from '../../../components/RenderObject'
import DrawerPanel from '../../../components/DrawerPanel'

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
        field: 'triggered_at',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'datetime',
    },
    {
        headerName: 'Amount',
        field: 'value',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'number',
        valueFormatter: (param: ValueFormatterParams) => {
            return `${param.value ? numericDisplay(param.value) : ''}%`
        },
    },
    {
        headerName: 'Response',
        field: 'response_status',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
    },
]

export default function Alerts() {
    const [openDrawer, setOpenDrawer] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)
    const { response, isLoading } = useAlertingApiV1TriggerListList()

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
            <Table
                id="alerts"
                columns={columns}
                rowData={response}
                loading={isLoading}
                onRowClicked={(event: RowClickedEvent) => {
                    setSelectedRow(event.data)
                    setOpenDrawer(true)
                }}
            />
            <DrawerPanel
                title="Alert details"
                open={openDrawer}
                onClose={() => {
                    setOpenDrawer(false)
                    // setSelectedRow(null)
                }}
            >
                <RenderObject obj={selectedRow} />
            </DrawerPanel>
        </Menu>
    )
}
