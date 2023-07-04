import React, { useEffect, useState } from 'react'
import { Flex, Grid } from '@tremor/react'
import dayjs from 'dayjs'
import GrowthTrend from './GrowthTrend'
import CardWithList from '../../../../components/Cards/CardWithList'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../api/onboard.gen'
import {
    useInventoryApiV2ResourcesRegionsSummaryList,
    useInventoryApiV2ServicesMetricList,
} from '../../../../api/inventory.gen'
import Spinner from '../../../../components/Spinner'

type IProps = {
    categories: any
    timeRange: any
    connections: any
    provider: any
}
export default function TrendsTab({
    categories,
    timeRange,
    connections,
    provider,
}: IProps) {
    const [consumptionData, setConsumptionData] = useState({})
    const [growthData, setGrowthData] = useState({})
    const {
        response: accountsConsumption,
        isLoading: loadingAccountsConsumption,
    } = useOnboardApiV1ConnectionsSummaryList({
        connector: provider,
        connectionId: connections,
        startTime: dayjs(timeRange.from).unix(),
        endTime: dayjs(timeRange.to).unix(),
        pageSize: 5,
        pageNumber: 1,
        sortBy: 'resource_count',
    })
    const { response: accountsGrowth, isLoading: loadingAccountsGrowth } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: provider,
            connectionId: connections,
            startTime: dayjs(timeRange.from).unix(),
            endTime: dayjs(timeRange.to).unix(),
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'growth_rate',
        })
    const {
        response: servicesConsumption,
        isLoading: loadingServicesConsumption,
    } = useInventoryApiV2ServicesMetricList({
        connector: provider,
        connectionId: connections,
        startTime: String(dayjs(timeRange.from).unix()),
        endTime: String(dayjs(timeRange.to).unix()),
        pageSize: 5,
        pageNumber: 1,
        sortBy: 'count',
    })
    const { response: servicesGrowth, isLoading: loadingServicesGrowth } =
        useInventoryApiV2ServicesMetricList({
            connector: provider,
            connectionId: connections,
            startTime: String(dayjs(timeRange.from).unix()),
            endTime: String(dayjs(timeRange.to).unix()),
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'growth_rate',
        })
    const { response: regionConsumption, isLoading: loadingRegionConsumption } =
        useInventoryApiV2ResourcesRegionsSummaryList({
            connector: provider,
            connectionId: connections,
            startTime: dayjs(timeRange.from).unix(),
            endTime: dayjs(timeRange.to).unix(),
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'resource_count',
        })
    const { response: regionGrowth, isLoading: loadingRegionGrowth } =
        useInventoryApiV2ResourcesRegionsSummaryList({
            connector: provider,
            connectionId: connections,
            startTime: dayjs(timeRange.from).unix(),
            endTime: dayjs(timeRange.to).unix(),
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'growth_rate',
        })
    const consumptionAccountData = (data: any) => {
        const result: { name: any; value: any }[] = []
        if (!data) return result
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data.length; i++) {
            const element = data[i]
            result.push({
                name: element.providerConnectionName,
                value: element.resourceCount,
            })
        }
        return result
    }
    const consumptionServicesData = (data: any) => {
        const result: { name: any; value: any }[] = []
        if (!data) return result
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data.length; i++) {
            const element = data[i]
            result.push({
                name: element.service_label,
                value: element.resource_count,
            })
        }
        return result
    }
    const consumptionRegionData = (data: any) => {
        const result: { name: any; value: any }[] = []
        if (!data) return result
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data.length; i++) {
            const element = data[i]
            result.push({
                name: element.location,
                value: element.resourceCount,
            })
        }
        return result
    }
    const growthAccountData = (data: any) => {
        const result: { name: any; value: any }[] = []
        if (!data) return result
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data.length; i++) {
            const element = data[i]
            let growthRate
            try {
                growthRate =
                    ((element.resourceCount - element.oldResourceCount) /
                        element.oldResourceCount) *
                    100
            } catch (e) {
                growthRate = 0
            }
            result.push({
                name: element.providerConnectionName,
                value: `${growthRate.toFixed(2)} %`,
            })
        }
        return result
    }
    const growthServicesData = (data: any) => {
        const result: { name: any; value: any }[] = []
        if (!data) return result
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data.length; i++) {
            const element = data[i]
            let growthRate = 0
            try {
                growthRate =
                    ((element.resource_count - element.old_resource_count) /
                        element.old_resource_count) *
                    100
            } catch (e) {
                growthRate = 0
            }
            result.push({
                name: element.service_label,
                value: `${growthRate.toFixed(2)} %`,
            })
        }
        return result
    }
    const growthRegionData = (data: any) => {
        const result: { name: any; value: any }[] = []
        if (!data) return result
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data.length; i++) {
            const element = data[i]
            let growthRate
            try {
                growthRate =
                    ((element.resourceCount - element.resourceOldCount) /
                        element.resourceOldCount) *
                    100
            } catch (e) {
                growthRate = 0
            }
            result.push({
                name: element.location,
                value: `${growthRate.toFixed(2)} %`,
            })
        }
        return result
    }

    useEffect(() => {
        const AccountData = consumptionAccountData(
            accountsConsumption?.connections
        )
        const ServicesData = consumptionServicesData(
            servicesConsumption?.services
        )
        const RegionData = consumptionRegionData(regionConsumption?.regions)
        const gAccountData = growthAccountData(accountsGrowth?.connections)
        const GServicesData = growthServicesData(servicesGrowth?.services)
        const GRegionData = growthRegionData(regionGrowth?.regions)
        // console.log('data', data)
        setConsumptionData({
            ...consumptionData,
            Accounts: AccountData,
            Services: ServicesData,
            Regions: RegionData,
        })
        setGrowthData({
            ...growthData,
            Accounts: gAccountData,
            Services: GServicesData,
            Regions: GRegionData,
        })
    }, [
        accountsConsumption,
        servicesConsumption,
        accountsGrowth,
        servicesGrowth,
    ])

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

    return (
        <div className="mt-5">
            <GrowthTrend categories={categories} timeRange={timeRange} />
            <Grid numItemsMd={2} className="mt-3 gap-3 flex justify-between">
                <div className="w-full">
                    <CardWithList
                        title="Top by Consumption"
                        tabs={['Accounts', 'Services', 'Regions']}
                        data={consumptionData}
                    />
                </div>
                <div className="w-full">
                    <CardWithList
                        title="Top by Growth"
                        tabs={['Accounts', 'Services', 'Regions']}
                        data={growthData}
                        isPercentage
                    />
                </div>
            </Grid>
        </div>
    )
}
