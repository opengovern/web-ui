import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import { timeAtom } from '../../../store'
import SingleConnection from './SingleConnection'
import NotFound from '../../Errors'
import SingleMetric from './SingleMetric'
import Menu from '../../../components/Menu'

export default function Single() {
    const activeTimeRange = useAtomValue(timeAtom)
    const { id, metric } = useParams()
    const urlParams = window.location.pathname.split('/')

    const idGenerator = () => {
        if (metric) {
            if (urlParams[urlParams.length - 1].startsWith('account_')) {
                return metric.replace('account_', '')
            }
            if (urlParams[urlParams.length - 1].startsWith('metric_')) {
                return metric.replace('metric_', '')
            }
            return undefined
        }
        if (id) {
            if (urlParams[urlParams.length - 1].startsWith('account_')) {
                return id.replace('account_', '')
            }
            if (urlParams[urlParams.length - 1].startsWith('metric_')) {
                return id.replace('metric_', '')
            }
            return undefined
        }
        return undefined
    }

    const renderPage = () => {
        if (urlParams[urlParams.length - 1].startsWith('account_')) {
            return (
                <Menu currentPage="assets">
                    <SingleConnection
                        activeTimeRange={activeTimeRange}
                        id={idGenerator()}
                    />
                </Menu>
            )
        }
        if (urlParams[urlParams.length - 1].startsWith('metric_')) {
            return (
                <Menu currentPage="assets">
                    <SingleMetric
                        activeTimeRange={activeTimeRange}
                        metricId={idGenerator()}
                    />
                </Menu>
            )
        }
        return <NotFound />
    }

    return renderPage()
}
