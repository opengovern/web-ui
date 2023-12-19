import { useAtomValue } from 'jotai/index'
import { useNavigate } from 'react-router-dom'
import { filterAtom } from '../../../../../../store'
import { useComplianceApiV1FindingsTopDetail } from '../../../../../../api/compliance.gen'
import Table from '../../../../../../components/Table'
import { policyColumns } from '../../Controls/ControlList'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiTopFieldRecord } from '../../../../../../api/api'

interface IFinder {
    id: string | undefined
}

const rows = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiTopFieldRecord[]
        | undefined
) => {
    const data = []
    if (input) {
        for (let i = 0; i < input.length; i += 1) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.push(input[i].Control)
        }
    }
    return data
}

export default function Controls({ id }: IFinder) {
    const selectedConnections = useAtomValue(filterAtom)
    const navigate = useNavigate()

    const topQuery = {
        ...(id && { benchmarkId: [id] }),
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
    }
    const { response: controls, isLoading } =
        useComplianceApiV1FindingsTopDetail('controlID', 10000, topQuery)

    return (
        <Table
            id="compliance_policies"
            loading={isLoading}
            columns={policyColumns}
            rowData={rows(controls?.records)}
            onRowClicked={(event) => navigate(String(event.data.id))}
        />
    )
}
