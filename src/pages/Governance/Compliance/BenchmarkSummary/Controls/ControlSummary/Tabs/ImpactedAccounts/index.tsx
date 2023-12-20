import { useComplianceApiV1FindingsTopDetail } from '../../../../../../../../api/compliance.gen'
import Table from '../../../../../../../../components/Table'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse } from '../../../../../../../../api/api'
import { cloudAccountColumns } from '../../../../../../../Assets/Details/Tabs/CloudAccounts'

interface IImpactedAccounts {
    controlId: string | undefined
}

const rows = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse
        | undefined
) => {
    const data = []
    if (input && input.records) {
        for (let i = 0; i < input.records.length; i += 1) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.push(input.records[i].Connection)
        }
    }
    return data
}

export default function ImpactedAccounts({ controlId }: IImpactedAccounts) {
    const { response: accounts, isLoading: accountsLoading } =
        useComplianceApiV1FindingsTopDetail('connectionID', 10000, {
            controlId: [String(controlId)],
        })
    console.log(accounts)
    return (
        <Table
            id="impacted_accounts"
            columns={cloudAccountColumns(false)}
            rowData={rows(accounts)}
            loading={accountsLoading}
        />
    )
}
