import { Flex, Text } from '@tremor/react'
import { useEffect, useState } from 'react'
import { ICellRendererParams } from 'ag-grid-community'
import { useComplianceApiV1FindingsTopDetail } from '../../../../api/compliance.gen'
import { SourceType } from '../../../../api/api'
import Table, { IColumn } from '../../../../components/Table'
import { rows } from '../../Compliance/BenchmarkSummary/Controls/ControlSummary/Tabs/ImpactedAccounts'
import FindingFilters from '../FindingsWithFailure/Filters'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'

const cloudAccountColumns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'connector',
            headerName: 'Cloud provider',
            type: 'string',
            width: 140,
            hide: true,
            sortable: true,
            filter: true,
            enableRowGroup: true,
        },
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
        // {
        //     field: 'failed',
        //     headerName: 'Findings',
        //     type: 'number',
        //     width: 200,
        //     resizable: true,
        //     sortable: true,
        //     cellRenderer: (param: ICellRendererParams) => (
        //         <Flex flexDirection="col" alignItems="start">
        //             <Text className="text-gray-800">Failed: {param.value}</Text>
        //             <Text>Passed: {param.data.passed}</Text>
        //         </Flex>
        //     ),
        // },
        {
            field: 'failed',
            headerName: 'Findings',
            type: 'number',
            width: 200,
            resizable: true,
            sortable: true,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex flexDirection="col" alignItems="start">
                    <Text className="text-gray-800">Failed: {param.value}</Text>
                    <Text>Passed: {param.data.passed}</Text>
                </Flex>
            ),
        },
        {
            field: 'lastInventory',
            headerName: 'Last inventory',
            type: 'datetime',
            hide: true,
            resizable: true,
            sortable: true,
        },
        {
            field: 'onboardDate',
            headerName: 'Onboard Date',
            type: 'datetime',
            hide: true,
            resizable: true,
            sortable: true,
        },
    ]
    return temp
}

interface ICount {
    count: (x: number) => void
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
    // console.log(accounts)

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
