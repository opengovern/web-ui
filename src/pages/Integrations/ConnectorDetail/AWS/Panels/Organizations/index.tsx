import { Button, Card, Flex, Title } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { ColDef, GridOptions } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef, useState } from 'react'
import DrawerPanel from '../../../../../../components/DrawerPanel'
import Steps from './Steps'

export default function Organizations() {
    const gridRef = useRef<AgGridReact>(null)
    const [open, setOpen] = useState(false)

    const columns: ColDef[] = [
        {
            field: 'metricName',
            headerName: 'Metric Name',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
    ]

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
        getRowHeight: (params) => 50,
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
                    toolPanel: 'agFiltersToolPanel',
                },
            ],
            defaultToolPanel: '',
        },
    }

    return (
        <>
            <Card>
                <Flex flexDirection="row">
                    <Title>Organizations</Title>
                    <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                        Create New Organization
                    </Button>
                </Flex>
                <div className="ag-theme-alpine mt-6">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                        rowData={[]}
                    />
                </div>
            </Card>
            <DrawerPanel
                title="New Organization"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Steps close={() => setOpen(false)} />
            </DrawerPanel>
        </>
    )
}
