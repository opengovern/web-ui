import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import AppNavigator from './appNavigator'
import Spinner from './components/Spinner'
import { setAuthHeader, setWorkspace } from './api/ApiConfig'

function App() {
    const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
    const [token, setToken] = useState<string>('')
    const [accessTokenLoading, setAccessTokenLoading] = useState<boolean>(false)

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

    if (isLoading || accessTokenLoading) {
        return <Spinner />
    }

    return <AppNavigator />
}

export default App
