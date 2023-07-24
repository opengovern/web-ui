export const isDemo = () => {
    console.log(
        'isDemo:',
        process.env.REACT_APP_RUNTIME_ENVIRONMENT,
        window.__RUNTIME_CONFIG__.REACT_APP_RUNTIME_ENVIRONMENT,
        process.env.REACT_APP_RUNTIME_ENVIRONMENT === 'demo'
    )
    return process.env.REACT_APP_RUNTIME_ENVIRONMENT === 'demo'
}
