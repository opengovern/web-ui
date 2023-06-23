import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import { Navigate } from 'react-router-dom'

export const CallbackPage = () => {
    const { error } = useAuth0()

    if (error) {
        return <span>{error.message}</span>
    }

    return <Navigate to="/" replace />
}
