import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import { timeAtom } from '../../../store'
import SingleConnection from './SingleConnection'
import NotFound from '../../Errors'
import SingleMetric from './SingleMetric'
import Layout from '../../../components/Layout'

export default function Single() {
    const activeTimeRange = useAtomValue(timeAtom)
    const { id, metric, resourceId } = useParams()
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
                <Layout currentPage="assets">
                    <SingleConnection
                        activeTimeRange={activeTimeRange}
                        id={idGenerator()}
                        resourceId={resourceId}
                    />
                </Layout>
            )
        }
        if (urlParams[urlParams.length - 1].startsWith('metric_')) {
            return (
                <Layout currentPage="assets">
                    <SingleMetric
                        activeTimeRange={activeTimeRange}
                        metricId={idGenerator()}
                        resourceId={resourceId}
                    />
                </Layout>
            )
        }
        return <NotFound />
    }

    return renderPage()
}
