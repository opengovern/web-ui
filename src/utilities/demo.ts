export const isDemo = () => {
    console.log(
        'isDemo:',
        process.env.REACT_APP_RUNTIME_ENVIRONMENT,
        window.__RUNTIME_CONFIG__.REACT_APP_RUNTIME_ENVIRONMENT,
        window.__RUNTIME_CONFIG__.REACT_APP_RUNTIME_ENVIRONMENT === 'demo'
    )
    return window.__RUNTIME_CONFIG__.REACT_APP_RUNTIME_ENVIRONMENT === 'demo'
}
