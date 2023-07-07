import { Grid } from '@tremor/react'
import dayjs from 'dayjs'
import Composition from '../../../../components/Cards/Composition'
import { useInventoryApiV2CostCompositionList } from '../../../../api/inventory.gen'
import { exactPriceDisplay } from '../../../../utilities/numericDisplay'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse } from '../../../../api/api'

type IProps = {
    connector: any
    connectionId: any
    time: any
    top: any
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

export default function CompositionTab({
    connector,
    time,
    top,
    connectionId,
}: IProps) {
    const { response: compositionOld, isLoading: oldIsLoading } =
        useInventoryApiV2CostCompositionList({
            top,
            ...(connector && { connector }),
            ...(connectionId && { connectionId }),
            ...(time.from && { endTime: dayjs(time.from).unix() }),
            ...(time.from && {
                startTime: dayjs(time.from).subtract(1, 'day').unix(),
            }),
        })
    const { response: compositionNew, isLoading: newIsLoading } =
        useInventoryApiV2CostCompositionList({
            top,
            ...(connector && { connector }),
            ...(connectionId && { connectionId }),
            ...(time.to && { endTime: dayjs(time.to).unix() }),
            ...(time.to && {
                startTime: dayjs(time.to).subtract(1, 'day').unix(),
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
        v.chart.push({ name: 'others', value: compositionData?.others || 0 })
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
            name: 'others',
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
