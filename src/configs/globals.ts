export {}

declare global {
    interface Window {
        __RUNTIME_CONFIG__: {
            NODE_ENV: string
            REACT_APP_CLIENT_ID: string
            REACT_APP_DOMAIN: string
            REACT_APP_AUDIENCE: string
            REACT_APP_BASE_URL: string
        }
    }
}
