import { useAuth } from '../../utilities/auth'

export const CallbackPage = () => {
    const { error, isAuthenticated } = useAuth()
    if (isAuthenticated) {
        window.location.href = '/'
        return null
    }

    if (error) {
        return <span>{error.message}</span>
    }
    return null
}
