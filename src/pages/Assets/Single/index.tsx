import { useAtomValue } from 'jotai'
import { useLocation, useParams } from 'react-router-dom'
import { timeAtom } from '../../../store'
import SingleConnection from './SingleConnection'
import NotFound from '../../Errors'
import SingleMetric from './SingleMetric'
import Menu from '../../../components/Menu'

export default function Single() {
    const activeTimeRange = useAtomValue(timeAtom)
    const { id, metric } = useParams()
    const { hash } = useLocation()

    const renderPage = () => {
        switch (hash) {
            case '#account':
                return (
                    <Menu currentPage="assets">
                        <SingleConnection
                            activeTimeRange={activeTimeRange}
                            id={metric || id}
                        />
                    </Menu>
                )
            case '#metric':
                return (
                    <Menu currentPage="assets">
                        <SingleMetric
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
