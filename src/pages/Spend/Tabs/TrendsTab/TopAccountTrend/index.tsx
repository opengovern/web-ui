import React, { useEffect } from 'react'
import { Card, Flex, Title } from '@tremor/react'
import { atom, useAtom } from 'jotai'
import dayjs from 'dayjs'
import {
    useInventoryApiV2CostTrendList,
} from '../../../../../api/inventory.gen'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import Spinner from '../../../../../components/Spinner'
import Chart from '../../../../../components/Charts'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
    timeRange: any
    connections?: any
    connector?: any
}

const trendDataAtom = atom<object[]>([])
const accountNamesAtom = atom<string[]>([])
const rawDataAtom = atom<object[]>([])

export default function TopServicesTrend({
    timeRange,
    connections,
    categories,
    connector,
}: IProps) {
    const [accountNames, setAccountNames] = useAtom(accountNamesAtom)
    const [trendData, setTrendData] = useAtom(trendDataAtom)
    const [rawData, setRawData] = useAtom(rawDataAtom)
    const { response: TopAccounts, isLoading: isLoadingTopAccount } =
        useOnboardApiV1ConnectionsSummaryList({
            // connector: connections?.provider,
            // connectionId: connections?.connections,
            ...(timeRange.from && {
                startTime: dayjs(timeRange.from).unix(),
            }),
            ...(timeRange.to && { endTime: dayjs(timeRange.to).unix() }),
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'cost',
        })

    const { response: acc1 } = useInventoryApiV2CostTrendList(
        {
            datapointCount: 5,
            // ...(connector && { connector }),
            ...(timeRange.from && {
                startTime: dayjs(timeRange.from).unix(),
            }),
            ...(timeRange.to && {
                endTime: dayjs(timeRange.to).unix(),
            }),
            ...(TopAccounts?.connections?.at(0) && {
                connectionId: TopAccounts?.connections[0].id,
            }),
        },
        {},
        !isLoadingTopAccount
    )
    const { response: acc2 } = useInventoryApiV2CostTrendList(
        {
            datapointCount: 5,
            // ...(connector && { connector }),
            ...(timeRange.from && {
                startTime: dayjs(timeRange.from).unix(),
            }),
            ...(timeRange.to && {
                endTime: dayjs(timeRange.to).unix(),
            }),
            ...(TopAccounts?.connections?.at(1) && {
                connectionId: TopAccounts?.connections[1].id,
            }),
        },
        {},
        !isLoadingTopAccount
    )
    const { response: acc3 } = useInventoryApiV2CostTrendList(
        {
            datapointCount: 5,
            // ...(connector && { connector }),
            ...(timeRange.from && {
                startTime: dayjs(timeRange.from).unix(),
            }),
            ...(timeRange.to && {
                endTime: dayjs(timeRange.to).unix(),
            }),
            ...(TopAccounts?.connections?.at(2) && {
                connectionId: TopAccounts?.connections[2].id,
            }),
        },
        {},
        !isLoadingTopAccount
    )
    const { response: acc4 } = useInventoryApiV2CostTrendList(
        {
            datapointCount: 5,
            // ...(connector && { connector }),
            ...(timeRange.from && {
                startTime: dayjs(timeRange.from).unix(),
            }),
            ...(timeRange.to && {
                endTime: dayjs(timeRange.to).unix(),
            }),
            ...(TopAccounts?.connections?.at(3) && {
                connectionId: TopAccounts?.connections[3].id,
            }),
        },
        {},
        !isLoadingTopAccount
    )
    const { response: acc5 } = useInventoryApiV2CostTrendList(
        {
            datapointCount: 5,
            // ...(connector && { connector }),
            ...(timeRange.from && {
                startTime: dayjs(timeRange.from).unix(),
            }),
            ...(timeRange.to && {
                endTime: dayjs(timeRange.to).unix(),
            }),
            ...(TopAccounts?.connections?.at(4) && {
                connectionId: TopAccounts?.connections[4].id,
            }),
        },
        {},
        !isLoadingTopAccount
    )
    const fixData = (
        data1: any,
        data2: any,
        data3: any,
        data4: any,
        data5: any
    ) => {
        const result: object[] = []
        const names: string[] = []
        if (TopAccounts?.connections) {
            // eslint-disable-next-line array-callback-return
            TopAccounts?.connections.map((item) => {
                if (item.id) {
                    names.push(item.id)
                }
            })
            setAccountNames(names)
        }
        if (data1 && data2 && data3 && data4 && data5) {
            // eslint-disable-next-line array-callback-return
            for (let i = 0; i < 5; i += 1) {
                const tmp: any = {}
                if (data1.at(i)) {
                    const day = dayjs(data1.at(i).date).format('DD')
                    const month = dayjs(data1.at(i).date).format('MMM')
                    const value = data1.at(i).count
                    const name = names[0]
                    tmp.date = `${day} ${month}`
                    tmp[name] = value
                }
                if (data2.at(i)) {
                    const day = dayjs(data2.at(i).date).format('DD')
                    const month = dayjs(data2.at(i).date).format('MMM')
                    const value = data2.at(i).count
                    const name = names[1]
                    tmp.date = `${day} ${month}`
                    tmp[name] = value
                }
                if (data3.at(i)) {
                    const day = dayjs(data3.at(i).date).format('DD')
                    const month = dayjs(data3.at(i).date).format('MMM')
                    const value = data3.at(i).count
                    const name = names[2]
                    tmp.date = `${day} ${month}`
                    tmp[name] = value
                }
                if (data4.at(i)) {
                    const day = dayjs(data4.at(i).date).format('DD')
                    const month = dayjs(data4.at(i).date).format('MMM')
                    const value = data4.at(i).count
                    const name = names[3]
                    tmp.date = `${day} ${month}`
                    tmp[name] = value
                }
                if (data5.at(i)) {
                    const day = dayjs(data5.at(i).date).format('DD')
                    const month = dayjs(data5.at(i).date).format('MMM')
                    const value = data5.at(i).count
                    const name = names[4]
                    tmp.date = `${day} ${month}`
                    tmp[name] = value
                }
                result.push(tmp)
            }
            setTrendData(result)
        }
    }

    useEffect(() => {
        fixData(acc1, acc2, acc3, acc4, acc5)
    }, [acc1, acc2, acc3, acc4, acc5])

    return (
        <Card>
            <Flex justifyContent="between" alignItems="start">
                <div className="flex justify-normal gap-x-2 items-center">
                    <Title className="min-w-[7vw]">Top Accounts Trend </Title>
                </div>
            </Flex>
            {trendData.length > 0 ? (
                <Chart
                    className="mt-4 h-80"
                    index="date"
                    type="area"
                    yAxisWidth={60}
                    categories={accountNames}
                    data={trendData}
                    showAnimation
                />
            ) : (
                <div className="flex items-center justify-center">
                    <Spinner />
                </div>
            )}
        </Card>
    )
}
