import { useEffect, useState } from 'react'
import { Flex, Text } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import {
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { useComplianceApiV1FindingsTopDetail } from '../../../../api/compliance.gen'
import { SourceType } from '../../../../api/api'
import Table, { IColumn } from '../../../../components/Table'
import { topControls } from '../../Compliance/BenchmarkSummary/TopDetails/Controls'
import FindingFilters from '../FindingsWithFailure/Filters'
import { severityBadge } from '../../Compliance/BenchmarkSummary/Controls'

const policyColumns: IColumn<any, any>[] = [
    {
        headerName: 'Control',
        field: 'title',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (param: ICellRendererParams) => (
            <Flex flexDirection="col" alignItems="start">
                <Text className="text-gray-800">{param.value}</Text>
                <Text>{param.data.id}</Text>
            </Flex>
        ),
    },
    {
        headerName: 'Severity',
        field: 'severity',
        width: 120,
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (params: ICellRendererParams) => (
            <Flex
                className="h-full w-full"
                justifyContent="center"
                alignItems="center"
            >
                {severityBadge(params.data?.severity)}
            </Flex>
        ),
        valueFormatter: (params: ValueFormatterParams) => {
            if (params.data?.severity === 'critical') return '5'
            if (params.data?.severity === 'high') return '4'
            if (params.data?.severity === 'medium') return '3'
            if (params.data?.severity === 'low') return '2'
            return '1'
        },
    },
    {
        headerName: 'Findings',
        field: 'totalCount',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        cellRenderer: (param: ICellRendererParams) => (
            <Flex flexDirection="col" alignItems="start">
                <Text className="text-gray-800">{param.value} issues</Text>
                <Text>{param.value - (param.data.count || 0)} passed</Text>
            </Flex>
        ),
    },
    {
        headerName: 'Resources',
        field: 'resourceTotalCount',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        cellRenderer: (param: ICellRendererParams) => (
            <Flex flexDirection="col" alignItems="start">
                <Text className="text-gray-800">{param.value} issues</Text>
                <Text>
                    {param.value - (param.data.resourceCount || 0)} passed
                </Text>
            </Flex>
        ),
    },
]

interface ICount {
    count: (x: number) => void
}

export default function ControlsWithFailure({ count }: ICount) {
    const navigate = useNavigate()
    const [providerFilter, setProviderFilter] = useState<SourceType[]>([])
    const [connectionFilter, setConnectionFilter] = useState<string[]>([])
    const [benchmarkFilter, setBenchmarkFilter] = useState<string[]>([])

    const topQuery = {
        connector: providerFilter,
        connectionId: connectionFilter,
        benchmarkId: benchmarkFilter,
    }
    const { response: controls, isLoading } =
        useComplianceApiV1FindingsTopDetail('controlID', 10000, topQuery)

    useEffect(() => {
        if (controls) {
            count(controls.totalCount || 0)
        }
    }, [controls])

    return (
        <Flex alignItems="start" className="gap-4">
            <FindingFilters
                type="controls"
                providerFilter={providerFilter}
                connectionFilter={connectionFilter}
                benchmarkFilter={benchmarkFilter}
                onApply={(obj) => {
                    setProviderFilter(obj.provider)
                    setConnectionFilter(obj.connection)
                    setBenchmarkFilter(obj.benchmark)
                }}
            />
            <Table
                id="compliance_policies"
                loading={isLoading}
                onGridReady={(e) => {
                    if (isLoading) {
                        e.api.showLoadingOverlay()
                    }
                }}
                columns={policyColumns}
                rowData={topControls(controls?.records)}
                onRowClicked={(event: RowClickedEvent) => {
                    if (event.data) {
                        navigate(event.data.id)
                    }
                }}
            />
        </Flex>
    )
}
