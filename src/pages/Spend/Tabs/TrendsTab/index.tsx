import { Grid } from '@tremor/react'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import GrowthTrend from './GrowthTrend'
import TopAccountTrend from './TopAccountTrend'
import TopServiceTrend from './TopServiceTrend'
import { useInventoryApiV2CostMetricList } from '../../../../api/inventory.gen'
import { filterAtom, spendTimeAtom } from '../../../../store'
import CardWithList from '../../../../components/Cards/CardWithList'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../api/onboard.gen'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
}
export default function TrendsTab({ categories }: IProps) {
    const [activeTimeRange, setActiveTimeRange] = useAtom(spendTimeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    const { response: topAccounts, isLoading: isLoadingTopAccount } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: [selectedConnections?.provider],
            connectionId: selectedConnections?.connections,
            ...(activeTimeRange.start && {
                startTime: dayjs(activeTimeRange.start.toString()).unix(),
            }),
            ...(activeTimeRange.end && {
                endTime: dayjs(activeTimeRange.end.toString())
                    .endOf('day')
                    .unix(),
            }),
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'cost',
        })

    const {
        response: topGrowthAccounts,
        isLoading: isLoadingTopGrowthAccounts,
    } = useOnboardApiV1ConnectionsSummaryList({
        connector: [selectedConnections?.provider],
        connectionId: selectedConnections?.connections,
        ...(activeTimeRange.start && {
            startTime: dayjs(activeTimeRange.start.toString()).unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: dayjs(activeTimeRange.end.toString()).endOf('day').unix(),
        }),
        pageSize: 5,
        pageNumber: 1,
        sortBy: 'cost_growth',
    })

    const { response: topServices, isLoading: isLoadingTopServices } =
        useInventoryApiV2CostMetricList({
            ...(selectedConnections.provider && {
                connector: [selectedConnections.provider],
            }),
            ...(activeTimeRange.start && {
                startTime: dayjs(activeTimeRange.start.toString())
                    .unix()
                    .toString(),
            }),
            ...(activeTimeRange.end && {
                endTime: dayjs(activeTimeRange.end.toString())
                    .endOf('day')
                    .unix()
                    .toString(),
            }),
            ...(selectedConnections.connections && {
                connectionId: selectedConnections.connections,
            }),
            pageSize: 5,
            sortBy: 'cost',
        })

    const {
        response: topGrowingServices,
        isLoading: isLoadingTopGrowingServices,
    } = useInventoryApiV2CostMetricList({
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(activeTimeRange.start && {
            startTime: dayjs(activeTimeRange.start.toString())
                .unix()
                .toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: dayjs(activeTimeRange.end.toString())
                .endOf('day')
                .unix()
                .toString(),
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        pageSize: 5,
        sortBy: 'growth',
    })

    const growthData = () => {
        const AccountData =
            topGrowthAccounts?.connections?.map((item) => {
                return {
                    name: item.providerConnectionName,
                    value: item.cost,
                }
            }) || []

        const ServiceData =
            topGrowingServices?.metrics?.map((item) => {
                return {
                    name: item.cost_dimension_name,
                    value: item.total_cost,
                }
            }) || []

        return {
            Accounts: AccountData,
            Services: ServiceData,
        }
    }

    const consumptionData = () => {
        const AccountData =
            topAccounts?.connections?.map((item) => {
                return {
                    name: item.providerConnectionName,
                    value: item.cost,
                }
            }) || []

        const ServiceData =
            topServices?.metrics?.map((item) => {
                return {
                    name: item.cost_dimension_name,
                    value: item.total_cost,
                }
            }) || []

        return {
            Accounts: AccountData,
            Services: ServiceData,
        }
    }

    return (
        <>
            <Grid numItems={1} numItemsMd={2} className="gap-3 mb-3">
                <CardWithList
                    title="Top by Consumption"
                    tabs={['Accounts', 'Services']}
                    data={consumptionData()}
                    loading={isLoadingTopAccount || isLoadingTopServices}
                    valueIsPrice
                />
                <CardWithList
                    title="Top by Growth"
                    tabs={['Accounts', 'Services']}
                    data={growthData()}
                    loading={
                        isLoadingTopGrowthAccounts ||
                        isLoadingTopGrowingServices
                    }
                    valueIsPrice
                />
            </Grid>
            <GrowthTrend />
            <TopAccountTrend />
            <TopServiceTrend categories={categories} />
        </>
    )
}
