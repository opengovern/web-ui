import { useState } from 'react'
import { useAtom, useAtomValue } from 'jotai/index'
import { selectedResourceCategoryAtom, spendTimeAtom } from '../../../../store'
import { exactPriceDisplay } from '../../../../utilities/numericDisplay'
import MetricsList, { IMetric } from '../../../../components/MetricsList'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
} from '../../../../api/api'
import { isDemo } from '../../../../utilities/demo'

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
    accountCostError?: any
    serviceCostError?: any
    accountCostSendNow: () => void
    serviceCostSendNow: () => void
}
const accountCostResponse2: IMetric[] = [
    {
        displayedValue: '$3,204,549',
        name: 'Central Management',
        newValue: 3023.5634300536,
        oldValue: 13130.07900738,
    },
    {
        displayedValue: '$231,411',
        name: 'POD3-X-Prod',
        newValue: 1063.5634300536,
        oldValue: 12630.07900738,
    },
    {
        displayedValue: '$1,231,411',
        name: 'POD1',
        newValue: 4063.5634300536,
        oldValue: 92630.07900738,
    },
    {
        displayedValue: '$352,411',
        name: 'Prod',
        newValue: 5063.5634300536,
        oldValue: 42630.07900738,
    },
    {
        displayedValue: '$241,411',
        name: 'DEVA',
        newValue: 1063.5634300536,
        oldValue: 12630.07900738,
    },
    {
        displayedValue: '$331,411',
        name: 'US-Prod',
        newValue: 2063.5634300536,
        oldValue: 62630.07900738,
    },
    {
        displayedValue: '$2,621,411',
        name: 'KOZET-PROD',
        newValue: 2063.5634300536,
        oldValue: 12630.07900738,
    },
    {
        displayedValue: '$131,411',
        name: 'DEVB',
        newValue: 12630.5634300536,
        oldValue: 126.07900738,
    },
]

const serviceCostResponse2: IMetric[] = [
    {
        name: 'Azure',
        displayedValue: '$1,312,915',
        newValue: 13266.249999999996,
        oldValue: 20469.250000000022,
    },
    {
        displayedValue: '$431,411',
        name: 'Disk',
        newValue: 1063.5634300536,
        oldValue: 11630.07900738,
    },
    {
        displayedValue: '$2,231,411',
        name: 'ElasticSearch',
        newValue: 9063.5634300536,
        oldValue: 82630.07900738,
    },
    {
        displayedValue: '$352,411',
        name: 'AWS Config',
        newValue: 5063.5634300536,
        oldValue: 42630.07900738,
    },
    {
        displayedValue: '$241,411',
        name: 'microsoft.recoveryservices',
        newValue: 1063.5634300536,
        oldValue: 12630.07900738,
    },
    {
        displayedValue: '$331,411',
        name: 'Amazon Elastic Load Balancing',
        newValue: 2063.5634300536,
        oldValue: 62630.07900738,
    },
    {
        displayedValue: '$1,221,411',
        name: 'KOZET',
        newValue: 1063.5634300536,
        oldValue: 2630.07900738,
    },
    {
        displayedValue: '$131,411',
        name: 'VM',
        newValue: 16430.5634300536,
        oldValue: 10206.07900738,
    },
]

export default function CostMetrics({
    accountCostResponse,
    serviceCostResponse,
    accountCostLoading,
    serviceCostLoading,
    accountCostError,
    accountCostSendNow,
    serviceCostError,
    serviceCostSendNow,
    categories,
}: IProps) {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const [selectedScopeIdx, setSelectedScopeIdx] = useState<number>(0)
    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedResourceCategoryAtom
    )

    const metrics = () => {
        const accountsMetrics = isDemo()
            ? accountCostResponse2
            : accountCostResponse?.connections?.map((conn) => {
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
              })

        const servicesMetrics = isDemo()
            ? serviceCostResponse2
            : serviceCostResponse?.metrics?.map((svc) => {
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
                // eslint-disable-next-line no-nested-ternary
                selectedScopeIdx === 0
                    ? isDemo()
                        ? false
                        : accountCostLoading
                    : isDemo()
                    ? false
                    : serviceCostLoading
            }
            metrics={metrics()}
            error={selectedScopeIdx === 0 ? accountCostError : serviceCostError}
            sendNow={
                selectedScopeIdx === 0 ? accountCostSendNow : serviceCostSendNow
            }
            categories={categories}
            selectedCategory={selectedResourceCategory}
            onChangeCategory={setSelectedResourceCategory}
            scopes={['Accounts', 'Services']}
            selectedScopeIdx={selectedScopeIdx}
            onScopeChange={setSelectedScopeIdx}
            hideFrom
            isSameDay={
                activeTimeRange.start.toString() ===
                activeTimeRange.end.toString()
            }
        />
    )
}
