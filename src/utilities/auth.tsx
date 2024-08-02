import { atom, useAtom } from 'jotai'

interface IAuthModel {
    token: string
    isLoading: boolean
    isSuccessful: boolean
    error: string
    resp: any
}

const sessionAuth = sessionStorage.getItem('kaytu_auth')
const sessionAuthModel =
    sessionAuth && sessionAuth.length > 0
        ? (JSON.parse(sessionAuth) as IAuthModel)
        : undefined
const authAtom = atom<IAuthModel>(
    sessionAuthModel || {
        token: '',
        isLoading: false,
        isSuccessful: false,
        error: '',
        resp: {},
    }
)

export function useAuth() {
    const [auth, setAuth] = useAtom(authAtom)

    return {
        isLoading: auth.isLoading,
        isAuthenticated: auth.isSuccessful,
        getAccessTokenSilently: () => {
            if (auth.isSuccessful) {
                return Promise.resolve(auth.token)
            }
            return Promise.reject(Error('not authenticated'))
        },
        getIdTokenClaims: () => {
            if (auth.isSuccessful) {
                return Promise.resolve({
                    exp: 0,
                })
            }
            return Promise.reject(Error('not authenticated'))
        },
        error: {
            message: auth.error,
        },
        user: {
            given_name: '', // TODO-Saleh
            family_name: '',
            name: '',
            email: '',
            picture: '',
        },
        logout: () => {
            const newAuth = {
                token: '',
                isLoading: false,
                isSuccessful: false,
                error: '',
                resp: {},
            }
            setAuth(newAuth)
            sessionStorage.setItem('kaytu_auth', JSON.stringify(newAuth))
        },
        loginWithCode: (code: string) => {
            if (code.length === 0) {
                return Promise.resolve()
            }

            const getToken = async () => {
                setAuth({
                    ...auth,
                    isLoading: true,
                    isSuccessful: false,
                    error: '',
                })

                const callback = `${window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL}/callback`
                const url = `${window.__RUNTIME_CONFIG__.REACT_APP_AUTH_BASE_URL}/dex/token`
                const headers = new Headers()
                headers.append(
                    'Content-Type',
                    'application/x-www-form-urlencoded'
                )

                const body = new URLSearchParams()
                body.append('grant_type', 'authorization_code')
                body.append('client_id', 'public-client')
                body.append('client_secret', '')
                body.append('code', code)
                body.append('redirect_uri', callback)

                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers,
                        body,
                    })

                    const data = await response.json()
                    if (data.error) {
                        setAuth({
                            ...auth,
                            isLoading: false,
                            isSuccessful: false,
                            error: data.error_description,
                        })
                    } else {
                        const newAuth = {
                            token: data.access_token,
                            isLoading: false,
                            isSuccessful: true,
                            error: '',
                            resp: data,
                        }
                        setAuth(newAuth)
                        sessionStorage.setItem(
                            'kaytu_auth',
                            JSON.stringify(newAuth)
                        )
                    }
                } catch (error) {
                    setAuth({
                        ...auth,
                        isLoading: false,
                        isSuccessful: false,
                        error: `Failed to fetch token due to ${error}`,
                    })
                }
            }

            return getToken()
        },
    }
}
