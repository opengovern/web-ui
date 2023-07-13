import { useState } from 'react'
import { useAtom } from 'jotai/index'
import { selectedResourceCategoryAtom } from '../../../../store'
import { exactPriceDisplay } from '../../../../utilities/numericDisplay'
import MetricsList, { IMetric } from '../../../../components/MetricsList'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
} from '../../../../api/api'

interface IProps {
    accountCostResponse:
        | GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse
        | undefined
    serviceCostResponse:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse
        | undefined
    accountCostLoading: boolean
    serviceCostLoading: boolean
    categories: {
        label: string
        value: string
    }[]
}

export default function CostMetrics({
    accountCostResponse,
    serviceCostResponse,
    accountCostLoading,
    serviceCostLoading,
    categories,
}: IProps) {
    const [selectedScopeIdx, setSelectedScopeIdx] = useState<number>(0)
    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )

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
            isLoading={
                selectedScopeIdx === 0 ? accountCostLoading : serviceCostLoading
            }
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
