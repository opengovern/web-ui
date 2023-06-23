import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import AppNavigator from './appNavigator'
import Spinner from './components/Spinner'
import { setAuthHeader } from './api/ApiConfig'

function App() {
    const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
    const [token, setToken] = useState<string>('')
    const [accessTokenLoading, setAccessTokenLoading] = useState<boolean>(false)

    if (isAuthenticated && token === '') {
        console.log('authenticated')
        if (!accessTokenLoading) {
            console.log('access token loading')

            setAccessTokenLoading(true)

            getAccessTokenSilently()
                .then((accessToken) => {
                    console.log('got the token')
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
        console.log('loading', isLoading, accessTokenLoading)
        return <Spinner />
    }

    return <AppNavigator />
}

export default App
