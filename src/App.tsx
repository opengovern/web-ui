import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import * as Sentry from '@sentry/react'
import {
    createRoutesFromChildren,
    matchRoutes,
    useLocation,
    useNavigationType,
} from 'react-router-dom'
import Router from './router'
import Spinner from './components/Spinner'
import { setAuthHeader } from './api/ApiConfig'

Sentry.init({
    dsn: 'https://f1ec1f17fb784a12af5cd4f7ddf29d09@sen.kaytu.io/2',
    integrations: [
        new Sentry.BrowserTracing({
            // See docs for support of different versions of variation of react router
            // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
            routingInstrumentation: Sentry.reactRouterV6Instrumentation(
                useEffect,
                useLocation,
                useNavigationType,
                createRoutesFromChildren,
                matchRoutes
            ),
        }),
        new Sentry.Replay(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    tracesSampleRate: 1.0,

    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/app\.kaytu\.io/],

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
})

export default function App() {
    const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
    const [token, setToken] = useState<string>('')
    const [accessTokenLoading, setAccessTokenLoading] = useState<boolean>(false)

    useEffect(() => {
        if (isAuthenticated && token === '') {
            if (!accessTokenLoading) {
                setAccessTokenLoading(true)
                getAccessTokenSilently()
                    .then((accessToken) => {
                        setToken(accessToken)
                        setAuthHeader(accessToken)
                        setAccessTokenLoading(false)
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
            <div className="flex items-center justify-center mt-96 w-full">
                <Spinner />
            </div>
        )
    }

    return <Router />
}
