import axios from 'axios'

const { hostname, origin } = window.location

/* eslint no-underscore-dangle: ["error", { "allow": ["__RUNTIME_CONFIG__"] }] */
// const BASE_URL = window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL as string
const BASE_URL = 'https://app.kaytu.dev'
const instance = axios.create({
    baseURL:
        hostname === 'localhost' || hostname === '127.0.0.1'
            ? `${BASE_URL}/keibi/` // 'https://app.dev.keibi.io/keibi/'
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
        instance.defaults.baseURL = `${BASE_URL}/${workspaceName}/`
    } else {
        instance.defaults.baseURL = `${origin}/${workspaceName}/`
    }
}

export const getApiBaseURL = () => {
    return hostname === 'localhost' || hostname === '127.0.0.1'
        ? `${BASE_URL}` // 'https://app.dev.keibi.io'
        : origin
}

export default instance
