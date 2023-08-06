import { Card, Flex, Title } from '@tremor/react'
import { useAtomValue } from 'jotai'
import dayjs from 'dayjs'
import { priceDisplay } from '../../../../../utilities/numericDisplay'
import { useInventoryApiV2CostTrendList } from '../../../../../api/inventory.gen'
import Spinner from '../../../../../components/Spinner'
import Chart from '../../../../../components/Charts'
import { filterAtom, spendTimeAtom } from '../../../../../store'
import { badgeDelta } from '../../../../../utilities/deltaType'
import { dateDisplay } from '../../../../../utilities/dateDisplay'
import { isDemo } from '../../../../../utilities/demo'

const getConnections = (con: any) => {
    if (con.provider.length) {
        return con.provider
    }
    if (con.connections.length === 1) {
        return con.connections[0]
    }
    if (con.connections.length) {
        return `${con.connections.length} accounts`
    }
    return 'all accounts'
}

const costTrendMock = [
    {
        count: 164968.37639515346,
        date: '2023-07-03T12:00:00Z',
    },
    {
        count: 383344.8852319772,
        date: '2023-07-04T12:00:00Z',
    },
    {
        count: 699968.83066657814,
        date: '2023-07-05T12:00:00Z',
    },
    {
        count: 267276.3803975267,
        date: '2023-07-06T12:00:00Z',
    },
    {
        count: 237808.43358911385,
        date: '2023-07-07T12:00:00Z',
    },
    {
        count: 401760.9822912303,
        date: '2023-07-08T12:00:00Z',
    },
    {
        count: 268973.34537212533,
        date: '2023-07-09T12:00:00Z',
    },
    {
        count: 251165.55074963375,
        date: '2023-07-10T12:00:00Z',
    },
    {
        count: 233615.96505844154,
        date: '2023-07-11T12:00:00Z',
    },
    {
        count: 298245.19070923363,
        date: '2023-07-12T12:00:00Z',
    },
    {
        count: 255207.48699518616,
        date: '2023-07-13T12:00:00Z',
    },
    {
        count: 242315.9714109592,
        date: '2023-07-14T12:00:00Z',
    },
    {
        count: 239128.93968616653,
        date: '2023-07-15T12:00:00Z',
    },
    {
        count: 239240.95794920286,
        date: '2023-07-16T12:00:00Z',
    },
    {
        count: 243739.64806236638,
        date: '2023-07-18T12:00:00Z',
    },
    {
        count: 400765.6870442353,
        date: '2023-07-19T12:00:00Z',
    },
    {
        count: 239683.91605434488,
        date: '2023-07-20T12:00:00Z',
    },
    {
        count: 252773.1488107725,
        date: '2023-07-21T12:00:00Z',
    },
    {
        count: 242410.31005899294,
        date: '2023-07-22T12:00:00Z',
    },
    {
        count: 243792.97879507727,
        date: '2023-07-23T12:00:00Z',
    },
    {
        count: 290709.89421451493,
        date: '2023-07-24T12:00:00Z',
    },
    {
        count: 315620.93853927235,
        date: '2023-07-25T12:00:00Z',
    },
    {
        count: 368896.44096600433,
        date: '2023-07-26T12:00:00Z',
    },
    {
        count: 339084.7021878094,
        date: '2023-07-27T12:00:00Z',
    },
    {
        count: 285382.6358439504,
        date: '2023-07-28T12:00:00Z',
    },
    {
        count: 352696.1545727009,
        date: '2023-07-29T12:00:00Z',
    },
    {
        count: 264584.83363305795,
        date: '2023-07-30T12:00:00Z',
    },
    {
        count: 241109.66751290273,
        date: '2023-07-31T12:00:00Z',
    },
    {
        count: 219468.60010028462,
        date: '2023-08-01T12:00:00Z',
    },
    {
        count: 18405.2491693574,
        date: '2023-08-03T12:00:00Z',
    },
]

export default function GrowthTrend() {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const query = {
        ...(selectedConnections.provider.length && {
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
    }
    const { response: costTrend, isLoading } =
        useInventoryApiV2CostTrendList(query)
    const fixTime = (data: any) => {
        const result: any = []
        if (data === undefined) {
            return result
        }
        const keys = Object.keys(data)
        for (let j = 0; j < keys.length; j += 1) {
            const item = keys[j]
            const temp: any = {}
            const title = isDemo()
                ? 'all accounts'
                : getConnections(selectedConnections)
            temp[title] = data[item].count
            temp.date = dateDisplay(data[item].date)
            result.push(temp)
        }
        return result
    }

    const sortedTrend = () => {
        return isDemo()
            ? costTrendMock?.sort((a, b) => {
                  const au = dayjs(a.date).unix()
                  const bu = dayjs(b.date).unix()
                  if (au === bu) {
                      return 0
                  }
                  return au > bu ? 1 : -1
              })
            : costTrend?.sort((a, b) => {
                  const au = dayjs(a.date).unix()
                  const bu = dayjs(b.date).unix()
                  if (au === bu) {
                      return 0
                  }
                  return au > bu ? 1 : -1
              })
    }

    return (
        <Card className="mb-3">
            <Flex justifyContent="start" className="gap-x-2">
                <Title>Overall Spend Trend </Title>
                {costTrend &&
                    costTrend.length > 0 &&
                    badgeDelta(
                        sortedTrend()?.at(0)?.count,
                        sortedTrend()?.at(costTrend.length - 1)?.count
                    )}
            </Flex>
            {isLoading ? (
                <Spinner className="h-80" />
            ) : (
                <Chart
                    className="mt-3"
                    index="date"
                    type="line"
                    yAxisWidth={120}
                    categories={[
                        isDemo()
                            ? 'all accounts'
                            : getConnections(selectedConnections),
                    ]}
                    showLegend={false}
                    data={fixTime(sortedTrend()) || []}
                    showAnimation
                    valueFormatter={priceDisplay}
                />
            )}
        </Card>
    )
}
