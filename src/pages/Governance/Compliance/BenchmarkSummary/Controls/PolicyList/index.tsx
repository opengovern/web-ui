import { Badge, Flex } from '@tremor/react'
import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community'
import Table, { IColumn } from '../../../../../../components/Table'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary } from '../../../../../../api/api'
import { numberDisplay } from '../../../../../../utilities/numericDisplay'
import { dateTimeDisplay } from '../../../../../../utilities/dateDisplay'
import DrawerPanel from '../../../../../../components/DrawerPanel'
import { severityBadge } from '../index'

export const renderStatus = (status: boolean) => {
    if (status) {
        return <Badge color="emerald">Passed</Badge>
    }
    return <Badge color="rose">Failed</Badge>
}

export const policyColumns: IColumn<any, any>[] = [
    {
        headerName: 'title',
        field: 'control.title',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
    },
    {
        headerName: 'Control ID',
        field: 'control.id',
        width: 170,
        type: 'string',
        hide: true,
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
                {severityBadge(params.data?.control?.severity)}
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
        hide: true,
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

interface IPolicyList {
    policies: any
    open: boolean
    onClose: () => void
    isLoading: boolean
}

export default function PolicyList({
    open,
    onClose,
    policies,
    isLoading,
}: IPolicyList) {
    return (
        <DrawerPanel open={open} onClose={onClose} title="Contorls">
            <Table
                id="compliance_policies"
                loading={isLoading}
                columns={policyColumns}
                rowData={policies}
            />
        </DrawerPanel>
    )
}
