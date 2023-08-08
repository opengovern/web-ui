import { useAtomValue } from 'jotai'
import Composition from '../../../../components/Cards/Composition'
import { useInventoryApiV2AnalyticsSpendCompositionList } from '../../../../api/inventory.gen'
import { exactPriceDisplay } from '../../../../utilities/numericDisplay'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse } from '../../../../api/api'
import { filterAtom, spendTimeAtom } from '../../../../store'
import { isDemo } from '../../../../utilities/demo'

type IProps = {
    top: number
}

interface chartProps {
    name: string
    value: number
    normalVal?: number | undefined
}

interface dataProps {
    total: string
    totalValueCount: string
    chart: chartProps[]
}

const MockData = {
    total_count: 274,
    total_cost_value: 10010382.278223533,
    top_values: {
        'Amazon Cloud - Compute': 792880.9592041187,
        'Azure Uncategorized': 1312915.3399999999,
        'AWS::MKLL': 804152.81,
        'microsoft.compute/disks': 949111.3869451011,
        'microsoft.compute/virtualmachines': 755810.4877144546,
    },
    others: 5395511.294359864,
}

export default function CompositionTab({ top }: IProps) {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const { response: composition, isLoading } =
        useInventoryApiV2AnalyticsSpendCompositionList({
            top,
            ...(selectedConnections.provider && {
                connector: [selectedConnections.provider],
            }),
            ...(selectedConnections.connections && {
                connectionId: selectedConnections.connections,
            }),
            ...(activeTimeRange.start && {
                endTime: activeTimeRange.end.unix().toString(),
            }),
            ...(activeTimeRange.start && {
                startTime: activeTimeRange.start.unix().toString(),
            }),
        })
    const recordToArray = (record?: Record<string, number>) => {
        if (record === undefined) {
            return []
        }

        return Object.keys(record).map((key) => {
            return {
                name: key,
                value: record[key],
            }
        })
    }

    const compositionChart = (
        compositionData:
            | GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse
            | undefined
    ) => {
        const v: dataProps = {
            total: exactPriceDisplay(compositionData?.total_cost_value),
            totalValueCount: (compositionData?.total_count || 0).toString(),
            chart: recordToArray(compositionData?.top_values),
        }
        if (compositionData?.others !== 0) {
            v.chart.push({
                name: 'Others',
                value: compositionData?.others || 0,
            })
        }
        return v
    }

    const compositionList = (
        compositionData:
            | GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse
            | undefined
    ) => {
        const v = recordToArray(compositionData?.top_values).map((item) => {
            return {
                name: item.name,
                value: exactPriceDisplay(item.value),
                val: Math.round(
                    (item.value / (compositionData?.total_cost_value || 1)) *
                        100
                ),
            }
        })
        if (compositionData?.others !== 0) {
            v.push({
                name: 'Others',
                value: exactPriceDisplay(compositionData?.others),
                val: Math.round(
                    ((compositionData?.others || 0) /
                        (compositionData?.total_cost_value || 1)) *
                        100
                ),
            })
        }
        return v
    }

    return (
        <Composition
            newData={compositionChart(isDemo() ? MockData : composition)}
            isLoading={isDemo() ? false : isLoading}
            newList={compositionList(isDemo() ? MockData : composition)}
            isCost
        />
    )
}
