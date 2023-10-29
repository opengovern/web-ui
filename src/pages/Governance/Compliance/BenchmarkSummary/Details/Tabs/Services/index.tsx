import { useState } from 'react'
import {
    GridOptions,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { Title } from '@tremor/react'
import { useComplianceApiV1FindingsServicesDetail } from '../../../../../../../api/compliance.gen'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import { RenderObject } from '../../../../../../../components/RenderObject'
import Table, { IColumn } from '../../../../../../../components/Table'
import { dateTimeDisplay } from '../../../../../../../utilities/dateDisplay'
import { IFilter } from '../../../../../../../store'

interface IFinder {
    id: string | undefined
    connections: IFilter
}

const rowGenerator = (data: any) => {
    const temp: any = []
    if (data && data?.services) {
        const holder = data?.services
        for (let i = 0; i < holder.length; i += 1) {
            temp.push({ ...holder[i], ...holder[i].SeveritiesCount })
        }
    }
    return temp
}

const columns: IColumn<any, any>[] = [
    {
        field: 'serviceName',
        headerName: 'Service name',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'serviceLabel',
        headerName: 'Service label',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'severitiesCount.critical',
        headerName: 'Critical',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 0.5,
    },
    {
        field: 'severitiesCount.high',
        headerName: 'High',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 0.5,
    },
    {
        field: 'severitiesCount.medium',
        headerName: 'Medium',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 0.5,
    },
    {
        field: 'severitiesCount.low',
        headerName: 'Low',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 0.5,
    },
    {
        field: 'securityScore',
        headerName: 'Security score',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 0.5,
        valueFormatter: (param: ValueFormatterParams) => {
            return `${param.value ? Number(param.value).toFixed(2) : ''}%`
        },
    },
    {
        field: 'lastCheckTime',
        headerName: 'Last checked',
        type: 'datetime',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        hide: true,
        valueFormatter: (param: ValueFormatterParams) => {
            return param.value ? dateTimeDisplay(param.value) : ''
        },
    },
]

export default function Services({ id, connections }: IFinder) {
    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<any>(undefined)

    const { response: findings, isLoading } =
        useComplianceApiV1FindingsServicesDetail(id || '', {
            connectionId: connections.connections,
            connectionGroup: connections.connectionGroup,
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
    }

    return (
        <>
            <Table
                title="Services"
                downloadable
                id="compliance_services"
                columns={columns}
                rowData={rowGenerator(findings) || []}
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
