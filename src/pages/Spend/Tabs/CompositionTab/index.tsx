import { Grid } from '@tremor/react'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import Composition from '../../../../components/Cards/Composition'
import { useInventoryApiV2CostCompositionList } from '../../../../api/inventory.gen'
import { exactPriceDisplay } from '../../../../utilities/numericDisplay'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse } from '../../../../api/api'
import { filterAtom, timeAtom } from '../../../../store'

type IProps = {
    top: number
}

interface chartProps {
    name: string
    value: number
}

interface dataProps {
    total: string
    totalValueCount: string
    chart: chartProps[]
}

export default function CompositionTab({ top }: IProps) {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    const { response: compositionOld, isLoading: oldIsLoading } =
        useInventoryApiV2CostCompositionList({
            top,
            ...(selectedConnections.provider && {
                connector: [selectedConnections.provider],
            }),
            ...(selectedConnections.connections && {
                connectionId: selectedConnections.connections,
            }),
            ...(activeTimeRange.start && {
                endTime: dayjs(activeTimeRange.start.toString())
                    .unix()
                    .toString(),
            }),
            ...(activeTimeRange.start && {
                startTime: dayjs(activeTimeRange.start.toString())
                    .subtract(1, 'day')
                    .unix()
                    .toString(),
            }),
        })

    const { response: compositionNew, isLoading: newIsLoading } =
        useInventoryApiV2CostCompositionList({
            top,
            ...(selectedConnections.provider && {
                connector: [selectedConnections.provider],
            }),
            ...(selectedConnections.connections && {
                connectionId: selectedConnections.connections,
            }),
            ...(activeTimeRange.end && {
                endTime: dayjs(activeTimeRange.end.toString())
                    .unix()
                    .toString(),
            }),
            ...(activeTimeRange.end && {
                startTime: dayjs(activeTimeRange.end.toString())
                    .subtract(1, 'day')
                    .unix()
                    .toString(),
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
        v.chart.push({ name: 'Others', value: compositionData?.others || 0 })
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
            }
        })
        v.push({
            name: 'Others',
            value: exactPriceDisplay(compositionData?.others),
        })
        return v
    }

    return (
        <Grid numItemsMd={2} className="mt-5 gap-6 flex justify-between">
            <div className="w-full">
                <Composition
                    newData={compositionChart(compositionNew)}
                    oldData={compositionChart(compositionOld)}
                    isLoading={oldIsLoading || newIsLoading}
                    newList={compositionList(compositionNew)}
                    oldList={compositionList(compositionOld)}
                    isCost
                />
            </div>
        </Grid>
    )
}
