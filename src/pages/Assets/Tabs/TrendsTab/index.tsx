import { Flex, Grid } from '@tremor/react'
import { useAtomValue } from 'jotai'
import GrowthTrend from './GrowthTrend'
import CardWithList from '../../../../components/Cards/CardWithList'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../api/onboard.gen'
import {
    useInventoryApiV2AnalyticsMetricList,
    useInventoryApiV2AnalyticsRegionsSummaryList,
} from '../../../../api/inventory.gen'
import Spinner from '../../../../components/Spinner'
import { filterAtom, timeAtom } from '../../../../store'
import { percentageByChange } from '../../../../utilities/deltaType'
import { isDemo } from '../../../../utilities/demo'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
}
export default function TrendsTab({ categories }: IProps) {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const queryTop5ConnectionsWithSort = (
        sortBy?:
            | 'onboard_date'
            | 'resource_count'
            | 'cost'
            | 'growth'
            | 'growth_rate'
            | 'cost_growth'
            | 'cost_growth_rate'
    ) => {
        return {
            ...(selectedConnections.provider !== '' && {
                connector: [selectedConnections.provider],
            }),
            connectionId: selectedConnections.connections,
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            pageSize: 5,
            pageNumber: 1,
            sortBy,
        }
    }

    const {
        response: accountsConsumption,
        isLoading: loadingAccountsConsumption,
    } = useOnboardApiV1ConnectionsSummaryList(
        queryTop5ConnectionsWithSort('resource_count'),
        {
            ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
        }
    )

    const { response: accountsGrowth, isLoading: loadingAccountsGrowth } =
        useOnboardApiV1ConnectionsSummaryList(
            queryTop5ConnectionsWithSort('growth_rate'),
            {
                ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
            }
        )

    const queryTop5ServicesWithSort = (
        sortBy?: 'name' | 'count' | 'growth' | 'growth_rate'
    ) => {
        return {
            connector: [selectedConnections.provider],
            connectionId: selectedConnections.connections,
            startTime: activeTimeRange.start.unix().toString(),
            endTime: activeTimeRange.end.unix().toString(),
            pageSize: 5,
            pageNumber: 1,
            sortBy,
        }
    }

    const {
        response: servicesConsumption,
        isLoading: loadingServicesConsumption,
    } = useInventoryApiV2AnalyticsMetricList(
        queryTop5ServicesWithSort('count'),
        {
            ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
        }
    )

    const { response: servicesGrowth, isLoading: loadingServicesGrowth } =
        useInventoryApiV2AnalyticsMetricList(
            queryTop5ServicesWithSort('growth_rate'),
            {
                ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
            }
        )

    const queryTop5RegionsWithSort = (
        sortBy?: 'resource_count' | 'growth' | 'growth_rate'
    ) => {
        return {
            connector: [selectedConnections.provider],
            connectionId: selectedConnections.connections,
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            pageSize: 5,
            pageNumber: 1,
            sortBy,
        }
    }

    const { response: regionConsumption, isLoading: loadingRegionConsumption } =
        useInventoryApiV2AnalyticsRegionsSummaryList(
            queryTop5RegionsWithSort('resource_count'),
            {
                ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
            }
        )

    const { response: regionGrowth, isLoading: loadingRegionGrowth } =
        useInventoryApiV2AnalyticsRegionsSummaryList(
            queryTop5RegionsWithSort('growth_rate'),
            {
                ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
            }
        )

    if (
        loadingAccountsConsumption ||
        loadingAccountsGrowth ||
        loadingServicesConsumption ||
        loadingServicesGrowth ||
        loadingRegionConsumption ||
        loadingRegionGrowth
    ) {
        return (
            <Flex justifyContent="center" className="mt-56">
                <Spinner />
            </Flex>
        )
    }

    const consumptionData = () => {
        const AccountData =
            accountsConsumption?.connections?.map((item) => {
                return {
                    name: item.providerConnectionName,
                    value: item.resourceCount,
                }
            }) || []
        const ServicesData =
            servicesConsumption?.metrics?.map((item) => {
                return {
                    name: item.name,
                    value: item.count,
                }
            }) || []
        const RegionData =
            regionConsumption?.regions?.map((item) => {
                return {
                    name: item.location,
                    value: item.resourceCount,
                }
            }) || []
        return {
            Accounts: AccountData,
            Services: ServicesData,
            Regions: RegionData,
        }
    }

    const growthData = () => {
        const AccountData =
            accountsGrowth?.connections?.map((item) => {
                return {
                    name: item.providerConnectionName,
                    value: `${percentageByChange(
                        item.oldResourceCount,
                        item.resourceCount
                    )} %`,
                }
            }) || []
        const ServicesData =
            servicesGrowth?.metrics?.map((item) => {
                return {
                    name: item.name,
                    value: `${percentageByChange(
                        item.old_count,
                        item.count
                    )} %`,
                }
            }) || []
        const RegionData =
            regionGrowth?.regions?.map((item) => {
                return {
                    name: item.location,
                    value: `${percentageByChange(
                        item.resourceOldCount,
                        item.resourceCount
                    )} %`,
                }
            }) || []
        return {
            Accounts: AccountData,
            Services: ServicesData,
            Regions: RegionData,
        }
    }

    return (
        <>
            <Grid numItems={1} numItemsMd={2} className="mb-4 gap-4">
                <CardWithList
                    title="Top by Consumption"
                    tabs={['Accounts', 'Services', 'Regions']}
                    data={consumptionData()}
                />
                <CardWithList
                    title="Top by Growth"
                    tabs={['Accounts', 'Services', 'Regions']}
                    data={growthData()}
                    isPercentage
                />
            </Grid>
            <GrowthTrend categories={categories} />
        </>
    )
}
