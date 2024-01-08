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

export const topControls = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiTopFieldRecord[]
        | undefined
) => {
    const data = []
    if (input) {
        for (let i = 0; i < input.length; i += 1) {
            let sev = ''
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (input[i].Control?.severity === 'critical') sev = 'e'
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (input[i].Control?.severity === 'high') sev = 'd'
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (input[i].Control?.severity === 'medium') sev = 'c'
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (input[i].Control?.severity === 'low') sev = 'b'
            if (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                input[i].Control?.severity === 'none' ||
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                input[i].Control?.severity === ''
            )
                sev = 'a'

            data.push({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ...input[i].Control,
                count: input[i].count,
                totalCount: input[i].totalCount,
                resourceCount: input[i].resourceCount,
                resourceTotalCount: input[i].resourceTotalCount,
                sev,
            })
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
            title="Controls"
            downloadable
            loading={isLoading}
            columns={policyColumns}
            rowData={topControls(controls?.records)}
            onRowClicked={(event) => navigate(String(event.data.id))}
        />
    )
}
