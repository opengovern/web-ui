import { withAuthenticationRequired } from '@auth0/auth0-react'
import React from 'react'
import { Card } from '@tremor/react'
import Spinner from '../Spinner'

interface IAuthenticationGuard {
    component: React.ComponentType
}

export const AuthenticationGuard: React.FC<IAuthenticationGuard> = ({
    component,
}) => {
    const Component = withAuthenticationRequired(component, {
        // eslint-disable-next-line react/no-unstable-nested-components
        onRedirecting: () => {
            return (
                <Card>
                    <div className="flex items-center justify-center h-96">
                        <Spinner />
                    </div>
                </Card>
            )
        },
    })
    return <Component />
}
