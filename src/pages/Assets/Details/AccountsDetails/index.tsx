import React from 'react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { DateRangePicker, Flex } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../api/onboard.gen'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import { filterAtom, timeAtom } from '../../../../store'
import SingleAccount from './SingleAccount'
import MultiAccount from './MultiAccount'
import Breadcrumbs from '../../../../components/Breadcrumbs'

export default function AccountsDetails() {
    const navigate = useNavigate()

    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    const { response: topAccounts, isLoading: topAccountLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector: selectedConnections?.provider,
            connectionId: selectedConnections?.connections,
            startTime: dayjs(activeTimeRange.from).unix(),
            endTime: dayjs(activeTimeRange.to).unix(),
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'resource_count',
        })

    const breadcrumbsPages = [
        {
            name: 'Assets',
            path: () => {
                navigate(-1)
            },
            current: false,
        },
        { name: 'Accounts detail', path: '', current: true },
    ]

    return (
        <LoggedInLayout currentPage="assets">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Breadcrumbs pages={breadcrumbsPages} />
                <DateRangePicker
                    className="max-w-md"
                    value={activeTimeRange}
                    onValueChange={setActiveTimeRange}
                    enableClear={false}
                    maxDate={new Date()}
                />
            </Flex>
            {selectedConnections.connections.length === 1 ? (
                <SingleAccount
                    topAccounts={topAccounts}
                    topAccountLoading={topAccountLoading}
                />
            ) : (
                <MultiAccount
                    topAccounts={topAccounts?.connections || []}
                    topAccountLoading={topAccountLoading}
                    selectedConnections={selectedConnections}
                    activeTimeRange={activeTimeRange}
                />
            )}
        </LoggedInLayout>
    )
}
