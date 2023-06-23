import { AppState, Auth0Provider } from '@auth0/auth0-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface IAuth0ProviderWithNavigate {
    children?: React.ReactNode
}

export const Auth0ProviderWithNavigate = ({
    children,
}: IAuth0ProviderWithNavigate) => {
    const navigate = useNavigate()

    const domain = process.env.REACT_APP_AUTH0_DOMAIN
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID
    const redirectUri = `${window.location.origin}/callback`

    const onRedirectCallback = (appState: AppState | undefined) => {
        navigate(appState?.returnTo || window.location.pathname)
    }

    if (!(domain && clientId && redirectUri)) {
        console.error('invalid data')
        return null
    }

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: redirectUri,
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    )
}
