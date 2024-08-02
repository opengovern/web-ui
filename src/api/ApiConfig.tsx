import axios from 'axios'
import { isDemo } from '../utilities/demo'

const { hostname } = window.location
const apiHostname = () => {
    return window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL
}
const instance = axios.create({
    baseURL: `${apiHostname()}${'/kaytu/'}`,
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
