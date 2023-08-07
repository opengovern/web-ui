import { useState } from 'react'
import { ICellRendererParams, RowClickedEvent } from 'ag-grid-community'
import { Badge, Flex, Title } from '@tremor/react'
import { useComplianceApiV1FindingsCreate } from '../../../../../api/compliance.gen'
import { AWSIcon, AzureIcon } from '../../../../../icons/icons'
import DrawerPanel from '../../../../../components/DrawerPanel'
import { RenderObject } from '../../../../../components/RenderObject'
import Table, { IColumn } from '../../../../../components/Table'

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

const columns: IColumn<any, any>[] = [
    {
        width: 50,
        sortable: true,
        filter: true,
        type: 'string',
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
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'connectionID',
        headerName: 'Connection ID',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'resourceID',
        headerName: 'Resource ID',
        type: 'string',
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

    return (
        <>
            <Table
                title="Findings"
                downloadable
                id="compliance_findings"
                columns={columns}
                rowData={findings?.findings || []}
                onCellClicked={(event: RowClickedEvent<any>) => {
                    setFinding(event.data)
                    setOpen(true)
                }}
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
