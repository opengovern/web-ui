import { useState } from 'react'
import {
    GridOptions,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { Title } from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useComplianceApiV1FindingsCreate } from '../../../../../../../api/compliance.gen'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import { RenderObject } from '../../../../../../../components/RenderObject'
import Table, { IColumn } from '../../../../../../../components/Table'
import { IFilter, isDemoAtom } from '../../../../../../../store'
import { dateTimeDisplay } from '../../../../../../../utilities/dateDisplay'

interface IFinder {
    id: string | undefined
    connections: IFilter
}

const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
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
            hide: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'policyTitle',
            headerName: 'Policy Title',
            type: 'string',
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'providerConnectionID',
            headerName: 'Account ID',
            type: 'string',
            hide: true,
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'providerConnectionName',
            headerName: 'Account Name',
            type: 'string',
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'connectionID',
            headerName: 'Kaytu Connection ID',
            type: 'string',
            hide: true,
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
            filter: true,
            hide: true,
            resizable: true,
            flex: 0.5,
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
            headerName: 'Last checked',
            type: 'date',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            valueFormatter: (param: ValueFormatterParams) => {
                return param.value ? dateTimeDisplay(param.value) : ''
            },
        },
    ]
    return temp
}

export default function Findings({ id, connections }: IFinder) {
    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<any>(undefined)
    const isDemo = useAtomValue(isDemoAtom)

    const { response: findings, isLoading } = useComplianceApiV1FindingsCreate({
        filters: {
            benchmarkID: [String(id)],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector: connections.provider.length
                ? [connections.provider]
                : [],
            connectionID: connections.connections,
            activeOnly: true,
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
                columns={columns(isDemo)}
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
