import { useState } from 'react'
import {
    GridOptions,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { Title } from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useComplianceApiV1FindingsAccountsDetail } from '../../../../../../../api/compliance.gen'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import { RenderObject } from '../../../../../../../components/RenderObject'
import Table, { IColumn } from '../../../../../../../components/Table'
import { dateTimeDisplay } from '../../../../../../../utilities/dateDisplay'
import { IFilter, isDemoAtom } from '../../../../../../../store'

interface IFinder {
    id: string | undefined
    connections: IFilter
    resourceId: string | undefined
}

const rowGenerator = (data: any) => {
    const temp: any = []
    if (data && data?.accounts) {
        const holder = data?.accounts
        for (let i = 0; i < holder.length; i += 1) {
            temp.push({ ...holder[i], ...holder[i].SeveritiesCount })
        }
    }
    return temp
}

const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'accountName',
            headerName: 'Discovered name',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'accountId',
            headerName: 'Discovered ID',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
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
                return `${param.value ? Number(param.value).toFixed(2) : '0'}%`
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
    return temp
}

export default function CloudAccounts({
    id,
    connections,
    resourceId,
}: IFinder) {
    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<any>(undefined)
    const isDemo = useAtomValue(isDemoAtom)

    const { response: findings, isLoading } =
        useComplianceApiV1FindingsAccountsDetail(id || '', {
            connectionId: connections.connections,
            connectionGroup: connections.connectionGroup,
            ...(resourceId && {
                resourceCollection: [resourceId],
            }),
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
                title="Cloud accounts"
                downloadable
                id="compliance_connections"
                columns={columns(isDemo)}
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
