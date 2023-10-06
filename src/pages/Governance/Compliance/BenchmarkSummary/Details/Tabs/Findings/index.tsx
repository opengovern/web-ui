import { useState } from 'react'
import { GridOptions, RowClickedEvent } from 'ag-grid-community'
import { Title } from '@tremor/react'
import { useComplianceApiV1FindingsCreate } from '../../../../../../../api/compliance.gen'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import { RenderObject } from '../../../../../../../components/RenderObject'
import Table, { IColumn } from '../../../../../../../components/Table'

interface IFinder {
    id: string | undefined
    connections: any
}

// const renderBadge = (severity: any) => {
//     if (severity) {
//         if (severity === 'low') {
//             return <Badge color="blue">Low</Badge>
//         }
//         if (severity === 'medium') {
//             return <Badge color="yellow">Medium</Badge>
//         }
//         if (severity === 'high') {
//             return <Badge color="orange">High</Badge>
//         }
//         return <Badge color="rose">Critical</Badge>
//     }
//     return ''
// }

const columns: IColumn<any, any>[] = [
    {
        width: 120,
        field: 'connector',
        headerName: 'Connector',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
    },
    {
        field: 'policyID',
        headerName: 'Policy ID',
        type: 'string',
        enableRowGroup: true,
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'connectionID',
        headerName: 'Connection ID',
        type: 'string',
        enableRowGroup: true,
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'resourceID',
        headerName: 'Resource ID',
        type: 'string',
        enableRowGroup: true,
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'severity',
        headerName: 'Severity',
        type: 'string',
        sortable: true,
        rowGroup: true,
        enableRowGroup: true,
        filter: true,
        resizable: true,
        flex: 0.5,
        // cellRenderer: (params: ICellRendererParams) => (
        //     <Flex
        //         className="h-full w-full"
        //         justifyContent="center"
        //         alignItems="center"
        //     >
        //         {renderBadge(params.data?.value)}
        //     </Flex>
        // ),
    },
    {
        field: 'reason',
        headerName: 'Reason',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'evaluatedAt',
        headerName: 'Evaluation Date',
        type: 'date',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
]

export default function Findings({ id, connections }: IFinder) {
    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<any>(undefined)

    const { response: findings, isLoading } = useComplianceApiV1FindingsCreate({
        filters: {
            benchmarkID: [String(id)],
            connector: connections.provider.length
                ? [connections.provider]
                : [],
            connectionID: connections.connections,
            activeOnly: false,
        },
        page: {
            no: 1,
            size: 10000,
        },
    })

    const options: GridOptions = {
        enableGroupEdit: true,
        columnTypes: {
            dimension: {
                enableRowGroup: true,
                enablePivot: true,
            },
        },
        rowGroupPanelShow: 'always',
        groupAllowUnbalanced: true,
        autoGroupColumnDef: {
            headerName: 'Severity',
            flex: 2,
            sortable: true,
            filter: true,
            resizable: true,
            // cellRendererParams: {
            //     suppressCount: true,
            // },
        },
    }

    return (
        <>
            <Table
                title="Findings"
                downloadable
                id="compliance_findings"
                columns={columns}
                rowData={findings?.findings || []}
                onCellClicked={(event: RowClickedEvent) => {
                    setFinding(event.data)
                    setOpen(true)
                }}
                options={options}
                onGridReady={(e) => {
                    if (isLoading) {
                        e.api.showLoadingOverlay()
                    }
                }}
                loading={isLoading}
            />
            <DrawerPanel
                open={open}
                onClose={() => setOpen(false)}
                title="Finding Detail"
            >
                <Title>Summary</Title>
                <RenderObject obj={finding} />
            </DrawerPanel>
        </>
    )
}
