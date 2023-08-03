import { Grid } from '@tremor/react'
import { useAtomValue } from 'jotai/index'
import SummaryCard from '../../../components/Cards/SummaryCard'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'
import { filterAtom } from '../../../store'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
} from '../../../api/api'
import { isDemo } from '../../../utilities/demo'

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
    const selectedConnections = useAtomValue(filterAtom)

    return (
        <Grid numItemsMd={2} numItemsLg={3} className="gap-4 mt-6 mb-10">
            <SummaryCard
                title={
                    isDemo()
                        ? 'Spend across all accounts'
                        : `Spend across ${getConnections(selectedConnections)}`
                }
                metric={
                    isDemo()
                        ? exactPriceDisplay(9215241)
                        : exactPriceDisplay(accountCostResponse?.totalCost)
                }
                loading={isDemo() ? false : accountCostLoading}
                url="spend-metrics#accounts"
            />
            <SummaryCard
                title="Services"
                metric={
                    isDemo()
                        ? Number(200)
                        : Number(serviceCostResponse?.total_count)
                }
                loading={isDemo() ? false : serviceCostLoading}
                url="spend-metrics#services"
            />
        </Grid>
    )
}
