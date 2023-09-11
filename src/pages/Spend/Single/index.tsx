import { useAtomValue } from 'jotai'
import { useLocation, useParams } from 'react-router-dom'
import { timeAtom } from '../../../store'
import NotFound from '../../Errors'
import Menu from '../../../components/Menu'
import SingleSpendConnection from './SingleConnection'

export default function SingleSpend() {
    const activeTimeRange = useAtomValue(timeAtom)
    const { id } = useParams()
    const { hash } = useLocation()

    const renderPage = () => {
        switch (hash) {
            case '#account':
                return (
                    <SingleSpendConnection
                        activeTimeRange={activeTimeRange}
                        id={id}
                    />
                )
            case '#metric':
                return
            default:
                return <NotFound />
        }
    }

    return <Menu currentPage="spend">{renderPage()}</Menu>
}
