import { useState } from 'react'
import { Flex } from '@tremor/react'
import { useComplianceApiV1FindingsTopDetail } from '../../../../api/compliance.gen'
import { SourceType } from '../../../../api/api'
import Table from '../../../../components/Table'
import { policyColumns } from '../../Compliance/BenchmarkSummary/Controls/ControlList'
import { rows } from '../../Compliance/BenchmarkSummary/TopDetails/Controls'
import FindingFilters from '../FindingsWithFailure/Filters'

export default function ControlsWithFailure() {
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

    return (
        <Flex alignItems="start" className="gap-4">
            <FindingFilters
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
                columns={policyColumns}
                rowData={rows(controls?.records)}
            />
        </Flex>
    )
}
