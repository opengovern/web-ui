import { useAtomValue } from 'jotai'
import Menu from '../../../../components/Menu'
import { filterAtom } from '../../../../store'
import SingleAccount from './SingleAccount'
import MultiAccount from './MultiAccount'
import Header from '../../../../components/Header'

export default function AccountsDetails() {
    const selectedConnections = useAtomValue(filterAtom)

    return (
        <Menu currentPage="assets">
            <Header
                title="Assets"
                breadCrumb={['Account Detail']}
                connectionFilter
                datePicker
            />
            {selectedConnections.connections.length === 1 ? (
                <SingleAccount />
            ) : (
                <MultiAccount />
            )}
        </Menu>
    )
}
