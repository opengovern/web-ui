import axios from 'axios'
import { isDemo } from '../utilities/demo'

const { hostname } = window.location
export const authHostname = () => {
    if (window.location.origin === 'http://localhost:3000') {
        return window.__RUNTIME_CONFIG__.REACT_APP_AUTH_BASE_URL
    }
    return window.location.origin
}
const apiHostname = () => {
    if (window.location.origin === 'http://localhost:3000') {
        return window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL
    }
    return window.location.origin
}
const instance = axios.create({
    baseURL: `${apiHostname()}${'/main/'}`,
    headers: {
        'Content-Type': 'application/json',
        'X-Kaytu-Demo': isDemo() ? 'true' : 'false',
        Accept: 'application/json',
    },
})

export const setAuthHeader = (authToken?: string) => {
    instance.defaults.headers.common.Authorization = `Bearer ${authToken}`
}

export const setWorkspace = (workspaceName?: string) => {
    instance.defaults.baseURL = `${apiHostname()}/${workspaceName}`
}

export default instance
