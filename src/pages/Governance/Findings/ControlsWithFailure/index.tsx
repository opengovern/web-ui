import { useEffect, useState } from 'react'
import { Flex, Text } from '@tremor/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ICellRendererParams, RowClickedEvent } from 'ag-grid-community'
import { useComplianceApiV1FindingsTopDetail } from '../../../../api/compliance.gen'
import { SourceType } from '../../../../api/api'
import Table, { IColumn } from '../../../../components/Table'
import { topControls } from '../../Compliance/BenchmarkSummary/TopDetails/Controls'
import { severityBadge } from '../../Controls'

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
        field: 'sev',
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
                {severityBadge(params.data.severity)}
            </Flex>
        ),
    },
    {
        headerName: 'Findings',
        field: 'count',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        cellRenderer: (param: ICellRendererParams) => (
            <Flex flexDirection="col" alignItems="start">
                <Text className="text-gray-800">{param.value || 0} issues</Text>
                <Text>
                    {(param.data.totalCount || 0) - (param.value || 0)} passed
                </Text>
            </Flex>
        ),
    },
    {
        headerName: 'Resources',
        field: 'resourceCount',
        type: 'number',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        cellRenderer: (param: ICellRendererParams) => (
            <Flex flexDirection="col" alignItems="start">
                <Flex flexDirection="col" alignItems="start">
                    <Text className="text-gray-800">
                        {param.value || 0} issues
                    </Text>
                    <Text>
                        {(param.data.resourceTotalCount || 0) -
                            (param.value || 0)}{' '}
                        passed
                    </Text>
                </Flex>
            </Flex>
        ),
    },
]

interface ICount {
    count: (x: number | undefined) => void
}

export default function ControlsWithFailure({ count }: ICount) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
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
            {/* <FindingFilters */}
            {/*     type="controls" */}
            {/*     providerFilter={providerFilter} */}
            {/*     connectionFilter={connectionFilter} */}
            {/*     benchmarkFilter={benchmarkFilter} */}
            {/*     onApply={(obj) => { */}
            {/*         setProviderFilter(obj.provider) */}
            {/*         setConnectionFilter(obj.connection) */}
            {/*         setBenchmarkFilter(obj.benchmark) */}
            {/*     }} */}
            {/* /> */}
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
                        navigate(`${event.data.id}?${searchParams}`)
                    }
                }}
            />
        </Flex>
    )
}
