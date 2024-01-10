import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import jwtDecode from 'jwt-decode'
import { Flex } from '@tremor/react'
import Router from './router'
import Spinner from './components/Spinner'
import { setAuthHeader } from './api/ApiConfig'
import { colorBlindModeAtom, tokenAtom } from './store'
import { applyTheme, parseTheme } from './utilities/theme'
import { Auth0AppMetadata } from './types/appMetadata'

// Sentry.init({
//     dsn: 'https://f1ec1f17fb784a12af5cd4f7ddf29d09@sen.kaytu.io/2',
//     integrations: [
//         new Sentry.BrowserTracing({
//             // See docs for support of different versions of variation of react router
//             // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
//             routingInstrumentation: Sentry.reactRouterV6Instrumentation(
//                 useEffect,
//                 useLocation,
//                 useNavigationType,
//                 createRoutesFromChildren,
//                 matchRoutes
//             ),
//         }),
//         new Sentry.Replay(),
//     ],

//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     tracesSampleRate: 1.0,

//     // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
//     tracePropagationTargets: ['localhost', /^https:\/\/app\.kaytu\.io/],

//     // Capture Replay for 10% of all sessions,
//     // plus for 100% of sessions with an error
//     replaysSessionSampleRate: 0.1,
//     replaysOnErrorSampleRate: 1.0,
// })

export default function App() {
    const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
    const [token, setToken] = useAtom(tokenAtom)
    const [accessTokenLoading, setAccessTokenLoading] = useState<boolean>(false)
    const [colorBlindMode, setColorBlindMode] = useAtom(colorBlindModeAtom)

    useEffect(() => {
        if (isAuthenticated && token === '') {
            if (!accessTokenLoading) {
                setAccessTokenLoading(true)
                getAccessTokenSilently()
                    .then((accessToken) => {
                        setToken(accessToken)
                        setAuthHeader(accessToken)
                        setAccessTokenLoading(false)
                        const decodedToken =
                            accessToken === undefined || accessToken === ''
                                ? undefined
                                : jwtDecode<Auth0AppMetadata>(accessToken)
                        if (decodedToken !== undefined) {
                            applyTheme(
                                parseTheme(
                                    decodedToken['https://app.kaytu.io/theme']
                                )
                            )
                            setColorBlindMode(
                                decodedToken[
                                    'https://app.kaytu.io/colorBlindMode'
                                ] || false
                            )
                        }
                    })
                    .catch((err) => {
                        console.error(err)
                        setAccessTokenLoading(false)
                    })
            }
        }
    }, [isAuthenticated])

    if (isLoading || accessTokenLoading) {
        return (
            <Flex
                flexDirection="col"
                justifyContent="center"
                alignItems="center"
                className="w-full h-screen dark:bg-gray-900"
            >
                <Spinner />
            </Flex>
        )
    }

    return <Router />
}
