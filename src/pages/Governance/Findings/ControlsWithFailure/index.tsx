import { useEffect, useState } from 'react'
import { Flex } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { RowClickedEvent } from 'ag-grid-community'
import { useComplianceApiV1FindingsTopDetail } from '../../../../api/compliance.gen'
import { SourceType } from '../../../../api/api'
import Table from '../../../../components/Table'
import { policyColumns } from '../../Compliance/BenchmarkSummary/Controls/ControlList'
import { rows } from '../../Compliance/BenchmarkSummary/TopDetails/Controls'
import FindingFilters from '../FindingsWithFailure/Filters'

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
    // console.log(controls)

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
                    setBenchmarkFilter(obj.connection)
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
                rowData={rows(controls?.records)}
                onRowClicked={(event: RowClickedEvent) => {
                    if (event.data) {
                        navigate(event.data.id)
                    }
                }}
            />
        </Flex>
    )
}
