import React, { useEffect, useState } from 'react'
import { Card, Grid } from '@tremor/react'
import dayjs from 'dayjs'
import GrowthTrend from './GrowthTrend'
import TopAccountTrend from './TopAccountTrend'
import TopServiceTrend from './TopServiceTrend'
import {
    useInventoryApiV2ServicesMetricList,
    useInventoryApiV2ServicesCostTrendList,
    useInventoryApiV2CostTrendList,
} from '../../../../api/inventory.gen'

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

    const { response: accountTrend, isLoading: accountTrendLoading } =
        useInventoryApiV2CostTrendList({
            ...(provider && { provider }),
            ...(timeRange.from && { endTime: dayjs(timeRange.from).unix() }),
            ...(timeRange.to && { startTime: dayjs(timeRange.to).unix() }),
            ...(connections && { connectionId: connections }),
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

    return (
        <div className="mt-5">
            {/* <div className="h-96" /> */}
            <div className="mb-5">
                <GrowthTrend
                    categories={[
                        {
                            label: 'AWS',
                            value: 'AWS',
                        },
                        {
                            label: 'Azure',
                            value: 'Azure',
                        },
                        {
                            label: 'All',
                            value: '',
                        },
                    ]}
                    timeRange={timeRange}
                    connections={connections}
                />
            </div>
            <div className="mb-5">
                <TopAccountTrend
                    categories={categories}
                    timeRange={timeRange}
                />
            </div>
            <div className="mb-5">
                <TopServiceTrend
                    categories={categories}
                    timeRange={timeRange}
                />
            </div>
            {/* <Grid numItemsMd={2} className="mt-10 gap-6 flex justify-between"> */}
            {/*    <div className="w-full"> */}
            {/*        /!* Placeholder to set height *!/ */}
            {/*        /!* <Card className="h-40" /> *!/ */}
            {/*        <CardWithList */}
            {/*            title="Top by Consumption" */}
            {/*            tabs={['Accounts']} */}
            {/*            data={consumptionData} */}
            {/*            // provider={selectedConnections.provider} */}
            {/*            // connections={connections} */}
            {/*            // count={count} */}
            {/*        /> */}
            {/*    </div> */}
            {/*    <div className="w-full"> */}
            {/*        /!* Placeholder to set height *!/ */}
            {/*        <CardWithList */}
            {/*            title="Top by Growth" */}
            {/*            tabs={['Services']} */}
            {/*            data={growthData} */}
            {/*            // provider={selectedConnections.provider} */}
            {/*            // connections={connections} */}
            {/*            // count={count} */}
            {/*        /> */}
            {/*    </div> */}
            {/* </Grid> */}
        </div>
    )
}
