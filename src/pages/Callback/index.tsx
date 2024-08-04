import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../utilities/auth'

export const CallbackPage = () => {
    const [locationSearchParams, setSearchParams] = useSearchParams()

    const { error, isAuthenticated } = useAuth()
    if (isAuthenticated) {
        window.location.href = '/'
        return null
    }

    if (locationSearchParams.has('error_description')) {
        return <span>{locationSearchParams.get('error_description')}</span>
    }

    if (error) {
        return <span>{error.message}</span>
    }
    return null
}
