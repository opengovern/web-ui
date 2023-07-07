import { useState } from 'react'
import { useAtom } from 'jotai/index'
import dayjs from 'dayjs'
import { selectedResourceCategoryAtom } from '../../../../../store'
import { useInventoryApiV2CostMetricList } from '../../../../../api/inventory.gen'
import { exactPriceDisplay } from '../../../../../utilities/numericDisplay'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import MetricsList, { IMetric } from '../../../../../components/MetricsList'

interface IProps {
    provider: any
    timeRange: any
    connection: any
    categories: {
        label: string
        value: string
    }[]
    pageSize: any
}

export default function CostMetrics({
    provider,
    timeRange,
    pageSize,
    categories,
    connection,
}: IProps) {
    const [selectedScopeIdx, setSelectedScopeIdx] = useState<number>(0)
    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )
    const activeCategory =
        selectedResourceCategory === 'All Categories'
            ? ''
            : selectedResourceCategory
    const query = {
        ...(provider && { connector: provider }),
        ...(connection && { connectionId: connection }),
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
        ...(timeRange.from && { startTime: dayjs(timeRange.from).unix() }),
        ...(timeRange.to && { endTime: dayjs(timeRange.to).unix() }),
        ...(pageSize && { pageSize }),
    }
    const { response: serviceCostResponse, isLoading: serviceCostLoading } =
        useInventoryApiV2CostMetricList(query)

    const { response: accountCostResponse, isLoading: accountCostLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: provider,
            connectionId: connection,
            startTime: dayjs(timeRange.from).unix(),
            endTime: dayjs(timeRange.to).unix(),
            pageSize: 10000,
            pageNumber: 1,
        })

    const metrics = () => {
        const accountsMetrics = accountCostResponse?.connections?.map(
            (conn) => {
                const v: IMetric = {
                    name:
                        conn.providerConnectionName ||
                        conn.providerConnectionID ||
                        '',
                    displayedValue: exactPriceDisplay(conn.cost || 0),
                    newValue: conn.dailyCostAtEndTime || 0,
                    oldValue: conn.dailyCostAtStartTime || 0,
                }

                return v
            }
        )

        const servicesMetrics = serviceCostResponse?.metrics?.map((svc) => {
            const v: IMetric = {
                name: svc.cost_dimension_name || '',
                displayedValue: exactPriceDisplay(svc.total_cost || 0),
                newValue: svc.daily_cost_at_end_time || 0,
                oldValue: svc.daily_cost_at_start_time || 0,
            }

            return v
        })

        if (selectedScopeIdx === 0) {
            return accountsMetrics || []
        }
        return servicesMetrics || []
    }

    return (
        <MetricsList
            name="Cost"
            seeMoreUrl="spend-metrics"
            isLoading={accountCostLoading || serviceCostLoading}
            metrics={metrics()}
            categories={categories}
            selectedCategory={selectedResourceCategory}
            onChangeCategory={setSelectedResourceCategory}
            scopes={['Accounts', 'Services']}
            selectedScopeIdx={selectedScopeIdx}
            onScopeChange={setSelectedScopeIdx}
            hideFrom
        />
    )
}
