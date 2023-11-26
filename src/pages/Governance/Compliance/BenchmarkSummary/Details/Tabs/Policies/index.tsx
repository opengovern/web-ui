import { useState } from 'react'
import {
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { Badge, Flex } from '@tremor/react'
import { useComplianceApiV1BenchmarksPoliciesDetail } from '../../../../../../../api/compliance.gen'
import 'ag-grid-enterprise'
import Table, { IColumn } from '../../../../../../../components/Table'
import { dateTimeDisplay } from '../../../../../../../utilities/dateDisplay'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiPolicySummary } from '../../../../../../../api/api'
import { numberDisplay } from '../../../../../../../utilities/numericDisplay'
import PolicyDetail from './Detail'

interface IPolicies {
    id: string | undefined
}

export const renderBadge = (severity: any) => {
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

export const renderStatus = (status: boolean) => {
    if (status) {
        return <Badge color="emerald">Passed</Badge>
    }
    return <Badge color="rose">Failed</Badge>
}

export const policyColumns: IColumn<any, any>[] = [
    {
        headerName: 'Policy title',
        field: 'policy.title',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
    },
    {
        headerName: 'Policy ID',
        field: 'policy.id',
        width: 170,
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
    },
    {
        headerName: 'Severity',
        field: 'policy.severity',
        width: 120,
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiPolicySummary>
        ) => (
            <Flex
                className="h-full w-full"
                justifyContent="center"
                alignItems="center"
            >
                {renderBadge(params.data?.policy?.severity)}
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
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiPolicySummary>
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
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiPolicySummary>
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
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiPolicySummary>
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
        useComplianceApiV1BenchmarksPoliciesDetail(String(id))

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
