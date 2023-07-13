import { useAtom } from 'jotai'
import { Flex } from '@tremor/react'
import { DateRangePicker } from '@react-spectrum/datepicker'
import { Provider } from '@react-spectrum/provider'
import { theme } from '@react-spectrum/theme-default'
import { today, getLocalTimeZone } from '@internationalized/date'
import { useNavigate } from 'react-router-dom'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import { filterAtom, timeAtom } from '../../../../store'
import SingleAccount from './SingleAccount'
import MultiAccount from './MultiAccount'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import ConnectionList from '../../../../components/ConnectionList'

export default function AccountsDetails() {
    const navigate = useNavigate()

    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

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

                <Flex flexDirection="row" justifyContent="end">
                    <Provider theme={theme}>
                        <DateRangePicker
                            value={activeTimeRange}
                            onChange={setActiveTimeRange}
                            maxValue={today(getLocalTimeZone())}
                        />
                    </Provider>
                    <ConnectionList />
                </Flex>
            </Flex>
            {selectedConnections.connections.length === 1 ? (
                <SingleAccount />
            ) : (
                <MultiAccount />
            )}
        </LoggedInLayout>
    )
}
