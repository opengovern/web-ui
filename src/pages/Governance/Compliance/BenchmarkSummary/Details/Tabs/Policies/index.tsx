import { useState } from 'react'
import {
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { Badge, Flex } from '@tremor/react'
import 'ag-grid-enterprise'
import Table, { IColumn } from '../../../../../../../components/Table'
import { dateTimeDisplay } from '../../../../../../../utilities/dateDisplay'
import { numberDisplay } from '../../../../../../../utilities/numericDisplay'
import PolicyDetail from './Detail'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary } from '../../../../../../../api/api'
import { useComplianceApiV1BenchmarksControlsDetail } from '../../../../../../../api/compliance.gen'

interface IPolicies {
    id: string | undefined
}

export const renderBadge = (severity: any) => {
    const style = {
        color: '#fff',
        borderRadius: '8px',
        width: '64px',
    }
    if (severity) {
        if (severity === 'none') {
            return (
                <Badge style={{ backgroundColor: '#9BA2AE', ...style }}>
                    None
                </Badge>
            )
        }
        if (severity === 'passed') {
            return (
                <Badge style={{ backgroundColor: '#54B584', ...style }}>
                    Passed
                </Badge>
            )
        }
        if (severity === 'low') {
            return (
                <Badge style={{ backgroundColor: '#F4C744', ...style }}>
                    Low
                </Badge>
            )
        }
        if (severity === 'medium') {
            return (
                <Badge style={{ backgroundColor: '#EE9235', ...style }}>
                    Medium
                </Badge>
            )
        }
        if (severity === 'high') {
            return (
                <Badge style={{ backgroundColor: '#CA2B1D', ...style }}>
                    High
                </Badge>
            )
        }
        return (
            <Badge style={{ backgroundColor: '#6E120B', ...style }}>
                Critical
            </Badge>
        )
    }
    return ''
}

export const renderStatus = (status: boolean) => {
    if (status) {
        return <Badge color="emerald">Passed</Badge>
    }
    return <Badge color="rose">Failed</Badge>
}

export const policyColumns: IColumn<any, any>[] = [
    {
        headerName: 'Policy title',
        field: 'control.title',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
    },
    {
        headerName: 'Policy ID',
        field: 'control.id',
        width: 170,
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
    },
    {
        headerName: 'Severity',
        field: 'control.severity',
        width: 120,
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) => (
            <Flex
                className="h-full w-full"
                justifyContent="center"
                alignItems="center"
            >
                {renderBadge(params.data?.control?.severity)}
            </Flex>
        ),
    },
    {
        headerName: 'Outcome',
        field: 'status',
        width: 100,
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) => {
            return (
                <Flex
                    className="h-full w-full"
                    justifyContent="center"
                    alignItems="center"
                >
                    {renderStatus(params.data?.passed || false)}
                </Flex>
            )
        },
    },
    {
        headerName: 'Failed resources %',
        field: 'resources',
        type: 'string',
        width: 150,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) =>
            `${numberDisplay(
                ((params.data?.failedResourcesCount || 0) /
                    (params.data?.totalResourcesCount || 0)) *
                    100 || 0
            )} %`,
        resizable: true,
    },
    {
        headerName: 'Failed accounts %',
        field: 'accounts',
        type: 'string',
        width: 150,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) =>
            `${numberDisplay(
                ((params.data?.failedConnectionCount || 0) /
                    (params.data?.totalConnectionCount || 0)) *
                    100 || 0
            )} %`,
        resizable: true,
    },
    {
        headerName: 'Last checked',
        field: 'evaluatedAt',
        type: 'date',
        sortable: true,
        hide: true,
        filter: true,
        resizable: true,
        valueFormatter: (param: ValueFormatterParams) => {
            return param.value ? dateTimeDisplay(param.value) : ''
        },
    },
]

// const gridOptions: GridOptions = {
// autoGroupColumnDef: {
//     headerName: 'Title',
//     flex: 2,
//     sortable: true,
//     filter: true,
//     resizable: true,
//     cellRendererParams: {
//         suppressCount: true,
//     },
// },
// treeData: true,
// getDataPath: (data: any) => {
//     return data.path.split('/')
// },
// }

export default function Policies({ id }: IPolicies) {
    const [open, setOpen] = useState(false)
    const [selectedPolicy, setSelectedPolicy] = useState<any>(undefined)

    const { response: policies, isLoading } =
        useComplianceApiV1BenchmarksControlsDetail(String(id))

    return (
        <>
            <Table
                title="Policies"
                downloadable
                id="compliance_policies"
                onRowClicked={(event: RowClickedEvent) => {
                    setSelectedPolicy(event.data)
                    setOpen(true)
                }}
                loading={isLoading}
                columns={policyColumns}
                rowData={policies}
            />
            <PolicyDetail
                selectedPolicy={selectedPolicy}
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    )
}
