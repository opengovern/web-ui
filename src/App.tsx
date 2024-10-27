import { useNavigate } from 'react-router-dom'
import { ArrowLeftStartOnRectangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { Button, Card, Flex, Text, Title } from '@tremor/react'
import Router from './router'
import Spinner from './components/Spinner'
import { setAuthHeader } from './api/ApiConfig'
import { colorBlindModeAtom, ForbiddenAtom, meAtom, tokenAtom } from './store'
import { applyTheme } from './utilities/theme'
import { OpenGovernance } from './icons/icons'
import { useAuth } from './utilities/auth'
import { useAuthApiV1MeList, useAuthApiV1UserDetail } from './api/auth.gen'
import { GithubComKaytuIoKaytuEnginePkgAuthApiTheme } from './api/api'

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
    const {
        isLoading,
        isAuthenticated,
        getAccessTokenSilently,
        getIdTokenClaims,
        logout
    } = useAuth()
    const [token, setToken] = useAtom(tokenAtom)
    const [me, setMe] = useAtom(meAtom)
    const [accessTokenLoading, setAccessTokenLoading] = useState<boolean>(true)
    const [colorBlindMode, setColorBlindMode] = useAtom(colorBlindModeAtom)
    const [expire, setExpire] = useState<number>(0)
    const [showExpired, setShowExpired] = useState<boolean>(false)
    const forbidden = useAtomValue(ForbiddenAtom)
    const {
        response: meResponse,
        isExecuted: meIsExecuted,
        isLoading: meIsLoading,
        error: meError,
        sendNow: getMe,
    } = useAuthApiV1MeList({}, false)

    const checkExpire = () => {
        if (expire !== 0) {
            const diff = expire - dayjs.utc().unix()
            if (diff < 0) {
                setShowExpired(true)
            }
        }
    }

    useEffect(() => {
        const t = setInterval(checkExpire, 5000)
        return () => {
            clearInterval(t)
        }
    }, [expire])

    useEffect(() => {
        if (meIsExecuted && !meIsLoading) {
            setMe(meResponse)
            applyTheme(
                meResponse?.theme ||
                    GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeLight
            )
            setColorBlindMode(meResponse?.colorBlindMode || false)
        }
    }, [meIsLoading])

    useEffect(() => {
        if (isAuthenticated && token === '') {
            getIdTokenClaims().then((v) => {
                setExpire(v?.exp || 0)
            })
            getAccessTokenSilently()
                .then((accessToken) => {
                    setToken(accessToken)
                    setAuthHeader(accessToken)
                    setAccessTokenLoading(false)
                    getMe()
                })
                .catch((err) => {
                    console.error(err)
                    setAccessTokenLoading(false)
                })
        }
    }, [isAuthenticated])

    return isLoading || accessTokenLoading || meIsLoading ? (
        <Flex
            justifyContent="center"
            alignItems="center"
            className="w-screen h-screen dark:bg-gray-900"
        >
            <Spinner />
        </Flex>
    ) : (
        <>
            <Router />
            {showExpired && (
                <Flex
                    flexDirection="col"
                    className="fixed top-0 left-0 w-screen h-screen bg-gray-900/80 z-50"
                >
                    <Card className="w-1/3 mt-56">
                        <Flex
                            flexDirection="col"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <OpenGovernance className="w-14 h-14 mb-6" />
                            <Title className="mb-3 text-2xl font-bold">
                                Your session has expired
                            </Title>
                            <Text className="mb-6 text-center">
                                Your session has expired. Please log in again to
                                continue accessing OpenGovernance platform
                            </Text>
                            <Button
                                icon={ArrowPathIcon}
                                onClick={() => {
                                    window.location.href =
                                        window.location.toString()
                                }}
                            >
                                Re-Login
                            </Button>
                        </Flex>
                    </Card>
                </Flex>
            )}

            {forbidden && (
                <Flex
                    flexDirection="col"
                    className="fixed top-0 left-0 w-screen h-screen bg-gray-900/80 z-50"
                >
                    <Card className="w-1/3 mt-56">
                        <Flex
                            flexDirection="col"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <OpenGovernance className="w-14 h-14 mb-6" />
                            <Title className="mb-3 text-2xl font-bold">
                                Access Denied
                            </Title>
                            <Text className="mb-6 text-center">
                                You do not have permission to access this page.
                                Please contact your administrator for more
                                information.
                            </Text>
                            <Button
                                icon={ArrowLeftStartOnRectangleIcon}
                                onClick={() => logout()}
                            >
                                Logout
                            </Button>
                        </Flex>
                    </Card>
                </Flex>
            )}
        </>
    )
}
