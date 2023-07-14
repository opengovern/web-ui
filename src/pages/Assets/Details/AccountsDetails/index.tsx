import { useAtom } from 'jotai'
import { Flex } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import LoggedInLayout from '../../../../components/LoggedInLayout'
import { filterAtom } from '../../../../store'
import SingleAccount from './SingleAccount'
import MultiAccount from './MultiAccount'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import ConnectionList from '../../../../components/ConnectionList'
import DateRangePicker from '../../../../components/DateRangePicker'

export default function AccountsDetails() {
    const navigate = useNavigate()
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
                    <DateRangePicker />
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