import { useAtomValue } from 'jotai'
import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community'
import { Flex, Text } from '@tremor/react'
import { useComplianceApiV1FindingsTopDetail } from '../../../../../../api/compliance.gen'
import Table, { IColumn } from '../../../../../../components/Table'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse } from '../../../../../../api/api'
import { isDemoAtom } from '../../../../../../store'

interface IImpactedAccounts {
    controlId: string | undefined
}

export const cloudAccountColumns = (isDemo: boolean) => {
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
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'providerConnectionID',
            headerName: 'Account ID',
            type: 'string',
            resizable: true,
            sortable: true,
            filter: true,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
            ),
        },
        {
            headerName: 'Resources',
            field: 'count',
            type: 'number',
            sortable: true,
            filter: true,
            resizable: true,
            width: 150,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex flexDirection="col" alignItems="start">
                    <Text className="text-gray-800">
                        {param.value || 0} issues
                    </Text>
                    <Text>
                        {(param.data.totalCount || 0) - (param.value || 0)}{' '}
                        passed
                    </Text>
                </Flex>
            ),
        },
    ]
    return temp
}

export const topConnections = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse
        | undefined
) => {
    const data = []
    if (input && input.records) {
        for (let i = 0; i < input.records.length; i += 1) {
            data.push({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ...input.records[i].Connection,
                count: input.records[i].count,
                totalCount: input.records[i].totalCount,
                resourceCount: input.records[i].resourceCount,
                resourceTotalCount: input.records[i].resourceTotalCount,
                controlCount: input.records[i].controlCount,
                controlTotalCount: input.records[i].controlTotalCount,
            })
        }
    }
    return data
}

export default function ImpactedAccounts({ controlId }: IImpactedAccounts) {
    const isDemo = useAtomValue(isDemoAtom)
    const { response: accounts, isLoading: accountsLoading } =
        useComplianceApiV1FindingsTopDetail('connectionID', 10000, {
            controlId: [String(controlId)],
        })
    return (
        <Table
            id="impacted_accounts"
            columns={cloudAccountColumns(isDemo)}
            rowData={topConnections(accounts)}
            loading={accountsLoading}
            onGridReady={(e) => {
                if (accountsLoading) {
                    e.api.showLoadingOverlay()
                }
            }}
        />
    )
}
