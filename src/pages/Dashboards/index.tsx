import { embedDashboard } from '@superset-ui/embedded-sdk'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import TopHeader from '../../components/Layout/Header'
import { ssTokenAtom, workspaceAtom } from '../../store'

export default function Dashboards() {
    const { dashboardId } = useParams()
    const workspace = useAtomValue(workspaceAtom)
    const ssToken = useAtomValue(ssTokenAtom)
    const targetHeight = window.screen.height - 300

    useEffect(() => {
        if (
            (ssToken?.token?.length || 0) > 0 &&
            (workspace.current?.id?.length || 0) > 0
        ) {
            const item = document.getElementById('superset-container')
            if (item !== null) {
                const myDashboard = embedDashboard({
                    id: dashboardId || '',
                    supersetDomain: `https://ss-${workspace.current?.id}.kaytu.io`,
                    mountPoint: item,
                    fetchGuestToken: () =>
                        Promise.resolve(ssToken?.token || ''),
                    dashboardUiConfig: {
                        hideTitle: true,
                        hideTab: true,
                    },
                })

                myDashboard.then((data) => {
                    const iframe = document.querySelector(
                        'iframe'
                    ) as HTMLIFrameElement
                    if (iframe !== null) {
                        iframe.style.width = '100%'
                        iframe.style.height = 'fit'
                        iframe.style.minHeight = `${targetHeight}px`
                        iframe.style.border = 'none'
                    }
                })
            }
        }
    }, [ssToken, workspace])

    const dashboardTitle = ssToken?.dashboards
        ?.filter((d) => d.ID === dashboardId)
        ?.map((d) => d.Name)
        ?.at(0)

    return (
        <>
            <TopHeader breadCrumb={[dashboardTitle || 'Dashboard']} />

            <div id="superset-container" className="w-full h-full" />
        </>
    )
}
