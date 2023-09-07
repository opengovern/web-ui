import axios from 'axios'
import { isDemo } from '../utilities/demo'

const { hostname, origin } = window.location
const BASE_URL = process.env.REACT_APP_BASE_URL as string
const instance = axios.create({
    baseURL:
        hostname === 'localhost' || hostname === '127.0.0.1'
            ? `${BASE_URL}${'/kaytu/'}`
            : `${origin.replace('demo.', '')}${'/kaytu/'}`,
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
    instance.defaults.baseURL = `${BASE_URL}/${workspaceName}`
}

export default instance
