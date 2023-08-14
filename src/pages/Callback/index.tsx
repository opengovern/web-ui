import { useAuth0 } from '@auth0/auth0-react'

export const CallbackPage = () => {
    const { error } = useAuth0()

    if (error) {
        return <span>{error.message}</span>
    }
    return null
}
