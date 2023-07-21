import axios from 'axios'

const { hostname, origin } = window.location

// eslint-disable-next-line no-underscore-dangle
const nodeEnv = window.__RUNTIME_CONFIG__.NODE_ENV as string
// eslint-disable-next-line no-underscore-dangle
const BASE_URL = window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL as string

const isDemo = nodeEnv === 'demo'
// const BASE_URL = 'http://127.0.0.1:4010/'
const instance = axios.create({
    baseURL:
        hostname === 'localhost' || hostname === '127.0.0.1'
            ? `${BASE_URL}${isDemo ? '/keibi/' : ''}` // 'https://app.dev.keibi.io/keibi/'
            : `${origin}/keibi/`,
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
            isDemo ? `/${workspaceName}` : ''
        }`
    } else {
        // instance.defaults.baseURL = `${origin}/${workspaceName}/`
        instance.defaults.baseURL = `${origin}/${workspaceName}/`
    }
}

export const getApiBaseURL = () => {
    return hostname === 'localhost' || hostname === '127.0.0.1'
        ? `${BASE_URL}` // 'https://app.dev.keibi.io'
        : origin
}

export default instance
