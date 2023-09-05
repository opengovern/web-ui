import Menu from '../../../../components/Menu'
import MultiAccount from './MultiAccount'
import Header from '../../../../components/Header'

export default function AccountsDetails() {
    return (
        <Menu currentPage="assets">
            <Header
                title="Assets"
                breadCrumb={['Account Detail']}
                filter
                datePicker
            />
            <MultiAccount />
        </Menu>
    )
}
