import axios from 'axios'
import { isDemo } from '../utilities/demo'

const { hostname, origin } = window.location
const BASE_URL = process.env.REACT_APP_BASE_URL as string
const apiHostname = () => {
    switch (hostname) {
        case 'localhost':
        case '127.0.0.1':
        case 'app.kaytu.dev':
            return 'https://api.kaytu.dev'
        default:
            return BASE_URL
    }
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
