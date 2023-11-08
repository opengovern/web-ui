import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community'
import { Badge, Flex } from '@tremor/react'
import { useComplianceApiV1BenchmarksPoliciesDetail } from '../../../../../../../api/compliance.gen'
import 'ag-grid-enterprise'
import Table, { IColumn } from '../../../../../../../components/Table'
import { dateTimeDisplay } from '../../../../../../../utilities/dateDisplay'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiPolicySummary } from '../../../../../../../api/api'

interface IPolicies {
    id: string | undefined
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

const renderStatus = (status: boolean) => {
    if (status) {
        return <Badge color="emerald">Passed</Badge>
    }
    return <Badge color="rose">Failed</Badge>
}

const columns: IColumn<any, any>[] = [
    {
        headerName: 'Title',
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
        field: 'severity',
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
        headerName: 'Status',
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
        headerName: '# of failed resources',
        field: 'resources',
        type: 'string',
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiPolicySummary>
        ) =>
            `${params.data?.failedResourcesCount} out of ${params.data?.totalResourcesCount}`,
        resizable: true,
    },
    {
        headerName: '# of failed accounts',
        field: 'accounts',
        type: 'string',
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiPolicySummary>
        ) =>
            `${params.data?.failedConnectionCount} out of ${params.data?.totalConnectionCount}`,
        resizable: true,
    },
    {
        headerName: 'Last checked',
        field: 'evaluatedAt',
        type: 'date',
        sortable: true,
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
    const { response: policies, isLoading } =
        useComplianceApiV1BenchmarksPoliciesDetail(String(id))

    return (
        <Table
            title="Policies"
            downloadable
            id="compliance_policies"
            loading={isLoading}
            columns={columns}
            rowData={policies}
        />
    )
}
