export {}

declare global {
    interface Window {
        __RUNTIME_CONFIG__: {
            NODE_ENV: string
            REACT_APP_RUNTIME_ENVIRONMENT: string
            REACT_APP_AUTH0_CLIENT_ID: string
            REACT_APP_AUTH0_DOMAIN: string
            REACT_APP_AUTH0_AUDIENCE: string
            REACT_APP_BASE_URL: string
        }
    }
}
