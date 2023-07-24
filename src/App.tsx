import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import Router from './router'
import Spinner from './components/Spinner'
import { setAuthHeader, setWorkspace } from './api/ApiConfig'

function App() {
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

export default App
