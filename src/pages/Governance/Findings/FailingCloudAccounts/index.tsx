import { Flex } from '@tremor/react'
import { useState } from 'react'
import { useComplianceApiV1FindingsTopDetail } from '../../../../api/compliance.gen'
import { SourceType } from '../../../../api/api'
import Table from '../../../../components/Table'
import {
    cloudAccountColumns,
    rows,
} from '../../Compliance/BenchmarkSummary/Controls/ControlSummary/Tabs/ImpactedAccounts'
import FindingFilters from '../FindingsWithFailure/Filters'

export default function FailingCloudAccounts() {
    const [providerFilter, setProviderFilter] = useState<SourceType[]>([])
    const [connectionFilter, setConnectionFilter] = useState<string[]>([])
    const [benchmarkFilter, setBenchmarkFilter] = useState<string[]>([])

    const topQuery = {
        connector: providerFilter,
        connectionId: connectionFilter,
        benchmarkId: benchmarkFilter,
    }

    const { response: accounts, isLoading: accountsLoading } =
        useComplianceApiV1FindingsTopDetail('connectionID', 10000, topQuery)

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
                id="impacted_accounts"
                columns={cloudAccountColumns(false)}
                rowData={rows(accounts)}
                loading={accountsLoading}
                onGridReady={(e) => {
                    if (accountsLoading) {
                        e.api.showLoadingOverlay()
                    }
                }}
            />
        </Flex>
    )
}
