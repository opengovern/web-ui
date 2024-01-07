import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import { spendTimeAtom } from '../../../store'
import NotFound from '../../Errors'
import Layout from '../../../components/Layout'
import SingleSpendConnection from './SingleConnection'
import SingleSpendMetric from './SingleMetric'

export default function SingleSpend() {
    const activeTimeRange = useAtomValue(spendTimeAtom)
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
                <Layout
                    currentPage="spend"
                    breadCrumb={['Cloud account spend detail']}
                    datePicker
                >
                    <SingleSpendConnection
                        activeTimeRange={activeTimeRange}
                        id={idGenerator()}
                    />
                </Layout>
            )
        }
        if (urlParams[urlParams.length - 1].startsWith('metric_')) {
            return (
                <Layout
                    currentPage="spend"
                    breadCrumb={['Metric spend detail']}
                    datePicker
                    filter
                >
                    <SingleSpendMetric
                        activeTimeRange={activeTimeRange}
                        metricId={idGenerator()}
                    />
                </Layout>
            )
        }
        return <NotFound />
    }

    return renderPage()
}
