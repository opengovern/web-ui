import { Grid } from '@tremor/react'
import { useAtomValue } from 'jotai'
import GrowthTrend from './GrowthTrend'
import TopAccountTrend from './TopAccountTrend'
import TopServiceTrend from './TopServiceTrend'
import { useInventoryApiV2CostMetricList } from '../../../../api/inventory.gen'
import { filterAtom, spendTimeAtom } from '../../../../store'
import CardWithList from '../../../../components/Cards/CardWithList'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../api/onboard.gen'
import { percentageByChange } from '../../../../utilities/deltaType'
import { isDemo } from '../../../../utilities/demo'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
}

const MockData = {
    growthData: {
        accounts: [
            {
                name: 'PODZ',
                value: '97.9 %',
            },
            {
                name: 'TARK-BALK',
                value: '75.6 %',
            },
            {
                name: 'KOZET',
                value: '50.8 %',
            },
            {
                name: 'Central Management',
                value: '49.0 %',
            },
            {
                name: 'MAGNUM',
                value: '10 %',
            },
        ],
        services: [
            {
                name: 'M-Verst',
                value: '100 %',
            },
            {
                name: 'DDEVOPS',
                value: '80 %',
            },
            {
                name: 'D-Search',
                value: '69.69 %',
            },
            {
                name: 'Chico',
                value: '51.2 %',
            },
            {
                name: 'Mango',
                value: '36.0 %',
            },
        ],
    },
    consumptionData: {
        accounts: [
            {
                name: 'Central Management',
                value: '1304549',
            },
            {
                name: 'PODZ',
                value: '504549',
            },
            {
                name: 'KOZET',
                value: '304549',
            },
            {
                name: 'MAGNUM',
                value: '104549',
            },
            {
                name: 'TARK-BALK',
                value: '4549',
            },
        ],
        services: [
            {
                name: 'DDEVOPS',
                value: '1,204,549',
            },
            {
                name: 'D-Search',
                value: '549,549',
            },
            {
                name: 'Mango',
                value: '314,420',
            },
            {
                name: 'Chico',
                value: '104,110',
            },
            {
                name: 'M-Verst',
                value: '4,420',
            },
        ],
    },
}

export default function TrendsTab({ categories }: IProps) {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const { response: topAccounts, isLoading: isLoadingTopAccount } =
        useOnboardApiV1ConnectionsSummaryList({
            ...(selectedConnections.provider !== '' && {
                connector: [selectedConnections.provider],
            }),
            connectionId: selectedConnections?.connections,
            ...(activeTimeRange.start && {
                startTime: activeTimeRange.start.unix(),
            }),
            ...(activeTimeRange.end && {
                endTime: activeTimeRange.end.unix(),
            }),
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'cost',
        })

    const {
        response: topGrowthAccounts,
        isLoading: isLoadingTopGrowthAccounts,
    } = useOnboardApiV1ConnectionsSummaryList({
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        connectionId: selectedConnections?.connections,
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
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
                startTime: activeTimeRange.start.unix().toString(),
            }),
            ...(activeTimeRange.end && {
                endTime: activeTimeRange.end.unix().toString(),
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
            startTime: activeTimeRange.start.unix().toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix().toString(),
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        pageSize: 5,
        sortBy: 'growth',
    })

    const growthData = () => {
        const AccountData = isDemo()
            ? MockData.growthData.accounts
            : topGrowthAccounts?.connections?.map((item) => {
                  return {
                      name: item.providerConnectionName,
                      value: `${percentageByChange(
                          item.dailyCostAtEndTime,
                          item.dailyCostAtStartTime
                      )} %`,
                  }
              }) || []

        const ServiceData = isDemo()
            ? MockData.growthData.services
            : topGrowingServices?.metrics?.map((item) => {
                  return {
                      name: item.cost_dimension_name,
                      value: `${percentageByChange(
                          item.daily_cost_at_end_time,
                          item.daily_cost_at_start_time
                      )} %`,
                  }
              }) || []

        return {
            Accounts: AccountData,
            Services: ServiceData,
        }
    }

    const consumptionData = () => {
        const AccountData = isDemo()
            ? MockData.consumptionData.accounts
            : topAccounts?.connections?.map((item) => {
                  return {
                      name: item.providerConnectionName,
                      value: item.cost,
                  }
              }) || []

        const ServiceData = isDemo()
            ? MockData.consumptionData.services
            : topServices?.metrics?.map((item) => {
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
            <Grid numItems={1} numItemsMd={2} className="gap-4 mb-3">
                <CardWithList
                    title="Top by Consumption"
                    tabs={['Accounts', 'Services']}
                    data={consumptionData()}
                    loading={
                        isDemo()
                            ? false
                            : isLoadingTopAccount || isLoadingTopServices
                    }
                    valueIsPrice
                />
                <CardWithList
                    title="Top by Growth"
                    tabs={['Accounts', 'Services']}
                    data={growthData()}
                    loading={
                        isDemo()
                            ? false
                            : isLoadingTopGrowthAccounts ||
                              isLoadingTopGrowingServices
                    }
                    isPercentage
                />
            </Grid>
            <GrowthTrend />
            <TopAccountTrend />
            <TopServiceTrend categories={categories} />
        </>
    )
}
