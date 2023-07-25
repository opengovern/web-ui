import { AgGridReact } from 'ag-grid-react'
import { useRef, useState } from 'react'
import {
    ColDef,
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { Badge, Flex, Title } from '@tremor/react'
import dayjs from 'dayjs'
import { useComplianceApiV1FindingsCreate } from '../../../../../api/compliance.gen'
import { AWSIcon, AzureIcon } from '../../../../../icons/icons'
import DrawerPanel from '../../../../../components/DrawerPanel'
import { RenderObject } from '../../../../../components/RenderObject'

interface IFinder {
    id: string | undefined
    connections: any
}

const renderBadge = (severity: any) => {
    if (severity) {
        if (severity === 'low') {
            return <Badge color="lime">Low</Badge>
        }
        if (severity === 'medium') {
            return <Badge color="yellow">Medium</Badge>
        }
        if (severity === 'high') {
            return <Badge color="orange">High</Badge>
        }
        return <Badge color="rose">Critical</Badge>
    }
    return ''
}

const columns: ColDef[] = [
    {
        width: 50,
        sortable: true,
        filter: true,
        cellStyle: { padding: 0 },
        cellRenderer: (params: ICellRendererParams) => {
            return (
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    className="w-full h-full"
                >
                    {params.data.connector === 'Azure' ? (
                        <AzureIcon key="azure" />
                    ) : (
                        <AWSIcon key="aws" />
                    )}
                </Flex>
            )
        },
    },
    {
        field: 'policyID',
        headerName: 'Policy ID',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'connectionID',
        headerName: 'Connection ID',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'resourceID',
        headerName: 'Resource ID',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'severity',
        headerName: 'Severity',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 0.5,
        cellRenderer: (params: ICellRendererParams) => (
            <Flex
                className="h-full w-full"
                justifyContent="center"
                alignItems="center"
            >
                {renderBadge(params.data?.severity)}
            </Flex>
        ),
    },
    {
        field: 'reason',
        headerName: 'Reason',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'evaluatedAt',
        headerName: 'Evaluation Date',
        sortable: true,
        filter: true,
        resizable: true,
        valueFormatter: (param) => {
            if (param.value) {
                return dayjs(param.value).format('MMM DD, YYYY')
            }
            return ''
        },
        flex: 1,
    },
]

export default function Findings({ id, connections }: IFinder) {
    const gridRef = useRef<AgGridReact>(null)
    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<any>(undefined)

    const { response: findings } = useComplianceApiV1FindingsCreate({
        filters: {
            benchmarkID: [String(id)],
            connector: connections.provider.length
                ? [connections.provider]
                : [],
            connectionID: connections.connections,
        },
        page: {
            no: 1,
            size: 10000,
        },
    })

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        animateRows: true,
        paginationPageSize: 25,
        getRowHeight: (params) => 50,
        onRowClicked(event: RowClickedEvent<any>) {
            setFinding(event.data)
            setOpen(true)
        },
    }

    return (
        <div className="ag-theme-alpine w-full">
            <AgGridReact
                ref={gridRef}
                domLayout="autoHeight"
                gridOptions={gridOptions}
                rowData={findings?.findings || []}
            />
            <DrawerPanel
                open={open}
                onClose={() => setOpen(false)}
                title="Finding Detail"
            >
                <Title>Summary</Title>
                <RenderObject obj={finding} />
            </DrawerPanel>
        </div>
    )
}
