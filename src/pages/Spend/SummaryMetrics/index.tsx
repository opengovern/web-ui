import { Grid } from '@tremor/react'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../api/onboard.gen'
import { useInventoryApiV2CostMetricList } from '../../../api/inventory.gen'
import SummaryCard from '../../../components/Cards/SummaryCard'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'
import { filterAtom, spendTimeAtom } from '../../../store'

interface IProps {
    pageSize: number
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

export default function SummaryMetrics({ pageSize }: IProps) {
    const [activeTimeRange, setActiveTimeRange] = useAtom(spendTimeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(activeTimeRange.from && {
            startTime: dayjs(activeTimeRange.from).unix().toString(),
        }),
        ...(activeTimeRange.to && {
            endTime: dayjs(activeTimeRange.to).unix().toString(),
        }),
        ...(pageSize && { pageSize }),
    }
    console.log(selectedConnections)
    const { response: accounts, isLoading: accountsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: [selectedConnections.provider],
            connectionId: selectedConnections.connections,
            startTime: dayjs(activeTimeRange.from).unix(),
            endTime: dayjs(activeTimeRange.to).unix(),
            pageSize: 10000,
            pageNumber: 1,
        })
    const { response: metrics, isLoading: metricLoading } =
        useInventoryApiV2CostMetricList(query)

    return (
        <Grid numItemsMd={2} numItemsLg={3} className="gap-3 mt-6 mb-10">
            <SummaryCard
                title={`Spend across ${getConnections(selectedConnections)}`}
                metric={exactPriceDisplay(accounts?.totalCost)}
                loading={accountsLoading}
            />
            <SummaryCard
                title="Services"
                metric={String(metrics?.total_count?.toLocaleString('en-US'))}
                loading={metricLoading}
            />
        </Grid>
    )
}
