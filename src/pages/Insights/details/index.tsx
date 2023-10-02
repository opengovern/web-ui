import { useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { filterAtom, timeAtom } from '../../../store'
import InsightDetail from './InsightDetail'
import KeyInsightDetail from './keyInsightDetail'
import Menu from '../../../components/Menu'

export default function InsightDetails() {
    const { id, ws } = useParams()
    const isKeyInsight = id?.includes('key_insight_')

    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    return (
        <Menu currentPage="insights">
            {isKeyInsight ? (
                <KeyInsightDetail
                    id={id?.replace('key_insight_', '')}
                    activeTimeRange={activeTimeRange}
                    selectedConnections={selectedConnections}
                />
            ) : (
                <InsightDetail
                    id={id}
                    ws={ws}
                    activeTimeRange={activeTimeRange}
                    selectedConnections={selectedConnections}
                />
            )}
        </Menu>
    )
}
