import { Grid } from '@tremor/react'
import { useAtom } from 'jotai'
import SummaryCard from '../../../components/Cards/SummaryCard'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'
import { filterAtom } from '../../../store'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
} from '../../../api/api'

interface IProps {
    accountCostResponse:
        | GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse
        | undefined
    serviceCostResponse:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse
        | undefined
    accountCostLoading: boolean
    serviceCostLoading: boolean
}

const getConnections = (con: any) => {
    if (con.provider.length) {
        return con.provider
    }
    if (con.connections.length) {
        return `${con.connections.length} accounts`
    }
    return 'all accounts'
}

export default function SummaryMetrics({
    accountCostResponse,
    serviceCostResponse,
    accountCostLoading,
    serviceCostLoading,
}: IProps) {
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    return (
        <Grid numItemsMd={2} numItemsLg={3} className="gap-3 mt-6 mb-10">
            <SummaryCard
                title={`Spend across ${getConnections(selectedConnections)}`}
                metric={exactPriceDisplay(accountCostResponse?.totalCost)}
                loading={accountCostLoading}
            />
            <SummaryCard
                title="Services"
                metric={Number(serviceCostResponse?.total_count)}
                loading={serviceCostLoading}
            />
        </Grid>
    )
}
