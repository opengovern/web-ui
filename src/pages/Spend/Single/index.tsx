import { useAtomValue } from 'jotai'
import { useLocation, useParams } from 'react-router-dom'
import { timeAtom } from '../../../store'
import NotFound from '../../Errors'
import Menu from '../../../components/Menu'
import SingleSpendConnection from './SingleConnection'
import SingleSpendMetric from './SingleMetric'

export default function SingleSpend() {
    const activeTimeRange = useAtomValue(timeAtom)
    const { id, metric } = useParams()
    const { hash } = useLocation()

    const renderPage = () => {
        switch (hash) {
            case '#account':
                return (
                    <Menu currentPage="spend">
                        <SingleSpendConnection
                            activeTimeRange={activeTimeRange}
                            id={metric || id}
                        />
                    </Menu>
                )
            case '#metric':
                return (
                    <Menu currentPage="spend">
                        <SingleSpendMetric
                            activeTimeRange={activeTimeRange}
                            metricId={metric || id}
                        />
                    </Menu>
                )
            default:
                return <NotFound />
        }
    }

    return renderPage()
}
