import axios from 'axios'

const { hostname, origin } = window.location

const nodeEnv = process.env.RUNTIME_ENVIRONMENT as string
// const BASE_URL = window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL as string
const BASE_URL = process.env.REACT_APP_BASE_URL as string
const isDemo = nodeEnv === 'demo'
// const BASE_URL = 'http://127.0.0.1:4010/'
const instance = axios.create({
    baseURL:
        hostname === 'localhost' || hostname === '127.0.0.1'
            ? `${BASE_URL}${isDemo ? '' : '/kaytu/'}`
            : `${origin}${isDemo ? '' : '/kaytu/'}`,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

export const setAuthHeader = (authToken?: string) => {
    instance.defaults.headers.common.Authorization = `Bearer ${authToken}`
}

export const setWorkspace = (workspaceName?: string) => {
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // instance.defaults.baseURL = `${BASE_URL}/${workspaceName}/`
        instance.defaults.baseURL = `${BASE_URL}${
            isDemo ? '' : `/${workspaceName}`
        }`
    } else {
        // instance.defaults.baseURL = `${origin}/${workspaceName}/`
        instance.defaults.baseURL = `${origin}${
            isDemo ? '' : `/${workspaceName}`
        }/`
    }
}

export const getApiBaseURL = () => {
    return hostname === 'localhost' || hostname === '127.0.0.1'
        ? `${BASE_URL}`
        : origin
}

export default instance
