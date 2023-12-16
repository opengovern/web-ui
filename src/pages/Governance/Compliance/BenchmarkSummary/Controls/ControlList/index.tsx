import { Badge, Flex } from '@tremor/react'
import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community'
import { useNavigate } from 'react-router-dom'
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
        field: 'failedResourcesCount',
        type: 'string',
        width: 150,
        valueFormatter: (
            params: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
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
        field: 'failedConnectionCount',
        hide: true,
        type: 'string',
        width: 150,
        valueFormatter: (
            params: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
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

interface IControlList {
    controls:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary[]
        | undefined
    open: boolean
    onClose: () => void
    isLoading: boolean
}

export default function ControlList({
    open,
    onClose,
    controls,
    isLoading,
}: IControlList) {
    const navigate = useNavigate()

    return (
        <DrawerPanel open={open} onClose={onClose} title="Contorls">
            <Table
                id="compliance_policies"
                loading={isLoading}
                columns={policyColumns}
                rowData={controls}
                onRowClicked={(event) => navigate(String(event.data.id))}
            />
        </DrawerPanel>
    )
}
