import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

const Logout = () => {
    const { logout } = useAuth0()
    useEffect(() => {
        logout()
    }, [logout])
    return <>Logging out</>
}

export default Logout
