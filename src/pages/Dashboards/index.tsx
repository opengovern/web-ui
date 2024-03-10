import { embedDashboard } from '@superset-ui/embedded-sdk'
import { useEffect } from 'react'
import TopHeader from '../../components/Layout/Header'
import { useAuthApiV1DashboardsTokenCreate } from '../../api/auth.gen'

export default function Dashboards() {
    const {
        response: dashboardToken,
        isLoading,
        isExecuted,
    } = useAuthApiV1DashboardsTokenCreate()

    useEffect(() => {
        if (isExecuted && !isLoading) {
            const item = document.getElementById('superset-container')
            if (item !== null) {
                const myDashboard = embedDashboard({
                    id: '91470dee-a079-44ba-b362-0a5af0262fe7', // given by the Superset embedding UI
                    supersetDomain: 'https://ss.kaytu.io',
                    mountPoint: item,
                    fetchGuestToken: () =>
                        Promise.resolve(dashboardToken?.token || ''),
                    dashboardUiConfig: { hideTitle: true },
                    debug: true,
                })
                myDashboard.then((data) => {
                    const iframe = document.querySelector(
                        'iframe'
                    ) as HTMLIFrameElement
                    if (iframe !== null) {
                        iframe.style.width = '100%'
                        iframe.style.height = '100%'
                        iframe.style.minHeight = '700px'
                        iframe.style.border = 'none'
                    }
                })
            }
        }
    }, [isLoading])

    return (
        <>
            <TopHeader />

            <div id="superset-container" className="w-full h-full" />
        </>
    )
}
