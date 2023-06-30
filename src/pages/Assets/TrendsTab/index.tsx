import React, { useEffect, useState } from 'react'
import { Card, Flex, Grid } from '@tremor/react'
import dayjs from 'dayjs'
import GrowthTrend from './GrowthTrend'
import CardWithList from '../../../components/Blocks/CardWithList'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../api/onboard.gen'
import { useInventoryApiV2ServicesMetricList } from '../../../api/inventory.gen'
import Spinner from '../../../components/Spinner'

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
                value: growthRate,
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
            let growthRate
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
                value: growthRate,
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
        const gAccountData = growthAccountData(accountsGrowth?.connections)
        const GServicesData = growthServicesData(servicesGrowth?.services)
        // console.log('data', data)
        setConsumptionData({
            ...consumptionData,
            Accounts: AccountData,
            Services: ServicesData,
        })
        setGrowthData({
            ...growthData,
            Accounts: gAccountData,
            Services: GServicesData,
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
        loadingServicesGrowth
    ) {
        return (
            <Flex justifyContent="center" className="mt-56">
                <Spinner />
            </Flex>
        )
    }

    return (
        <div className="mt-5">
            {/* <div className="h-96" /> */}
            <GrowthTrend categories={categories} timeRange={timeRange} />
            <Grid numItemsMd={2} className="mt-10 gap-6 flex justify-between">
                <div className="w-full">
                    {/* Placeholder to set height */}
                    {/* <Card className="h-40" /> */}
                    <CardWithList
                        title="Top by Consumption"
                        tabs={['Accounts', 'Services', 'Regions']}
                        data={consumptionData}
                        // provider={selectedConnections.provider}
                        // connections={connections}
                        // count={count}
                    />
                </div>
                <div className="w-full">
                    {/* Placeholder to set height */}
                    <CardWithList
                        title="Top by Growth"
                        tabs={['Accounts', 'Services', 'Regions']}
                        data={growthData}
                        // provider={selectedConnections.provider}
                        // connections={connections}
                        // count={count}
                    />
                </div>
            </Grid>
        </div>
    )
}
