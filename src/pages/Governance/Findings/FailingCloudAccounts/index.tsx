import { Flex, Text } from '@tremor/react'
import { useEffect, useState } from 'react'
import { ICellRendererParams } from 'ag-grid-community'
import { useComplianceApiV1FindingsTopDetail } from '../../../../api/compliance.gen'
import { SourceType } from '../../../../api/api'
import Table, { IColumn } from '../../../../components/Table'
import { topConnections } from '../../Controls/ControlSummary/Tabs/ImpactedAccounts'
import FindingFilters from '../Filters'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'

const cloudAccountColumns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'providerConnectionName',
            headerName: 'Account name',
            resizable: true,
            type: 'string',
            sortable: true,
            filter: true,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    justifyContent="start"
                    className={isDemo ? 'blur-md gap-3' : 'gap-3'}
                >
                    {getConnectorIcon(param.data.connector)}
                    <Flex flexDirection="col" alignItems="start">
                        <Text className="text-gray-800">{param.value}</Text>
                        <Text>{param.data.providerConnectionID}</Text>
                    </Flex>
                </Flex>
            ),
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
        {
            headerName: 'Controls',
            field: 'controlTotalCount',
            type: 'number',
            sortable: true,
            filter: true,
            resizable: true,
            width: 150,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex flexDirection="col" alignItems="start">
                    <Text className="text-gray-800">{param.value} issues</Text>
                    <Text>
                        {param.value - (param.data.controlCount || 0)} passed
                    </Text>
                </Flex>
            ),
        },
    ]
    return temp
}

interface ICount {
    count: (x: number | undefined) => void
}

export default function FailingCloudAccounts({ count }: ICount) {
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

    useEffect(() => {
        if (accounts) {
            count(accounts.totalCount || 0)
        }
    }, [accounts])

    return (
        <Flex alignItems="start" className="gap-4">
            <FindingFilters
                type="accounts"
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
                id="impacted_accounts"
                columns={cloudAccountColumns(false)}
                rowData={topConnections(accounts)}
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
