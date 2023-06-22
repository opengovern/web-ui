import React, { Suspense, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import Assets from '../pages/Assets'
import NotFound from '../pages/Errors'

export const defaultRoutes = [
    {
        name: '',
        path: '/',
        component: <Navigate to="/assets" replace />,
    },
    {
        name: 'Assets',
        path: '/assets',
        meta: {
            requiresAuth: false,
            requiresWorkspace: false,
        },
        component: <Assets />,
    },
]

export const normalizeRoutes = (routes = defaultRoutes) => {
    return routes.map((route) => {
        if (
            !route?.meta?.requiresAuth ||
            route?.path === '/' ||
            /^workspaces.*/.test(route?.path) ||
            route?.path === '/invitation' ||
            route?.path === '/logout' ||
            route?.path === '*'
        ) {
            return route
        }
        // const pathWithWorkspaceParam = `:workspaceName${route.path}`
        const pathWithWorkspaceParam = `${route.path}`

        return {
            ...route,
            path: pathWithWorkspaceParam,
        }
    })
}

const getRouteElement = (meta: any, component: any) => {
    // if (meta?.requiresAuth && !meta?.requiresWorkspace) {
    //     if (component.name === 'InvitationCheck') {
    //         const Component = component
    //         return (
    //             <Suspense fallback={<h1>Fallback</h1>}>
    //                 <Component />
    //             </Suspense>
    //         )
    //     }
    //     return (
    //         <Suspense key={component?.name} fallback={<h1>Loading...</h1>}>
    //             <ProtectedRoute component={component} />
    //         </Suspense>
    //     )
    // }

    // if (meta?.requiresWorkspace) {
    //     return <WithWorkspace key={component?.name} component={component} />
    // }

    return (
        <Suspense key={component?.name} fallback={<Spinner />}>
            {component}
        </Suspense>
    )
}

export default function AppNavigator() {
    const navigate = useNavigate()
    const [err, setErr] = useState(404)
    // generate routes
    const routeElements =
        err === 403 || err === 500 || err === 503 ? (
            <Route key="*" path="*" element={<NotFound error={err} />} />
        ) : (
            normalizeRoutes(defaultRoutes).map(
                ({ name, path, component, meta }): JSX.Element => (
                    <Route
                        key={`${name}${path}`}
                        path={path}
                        element={getRouteElement(meta, component)}
                    />
                )
            )
        )
    return <Routes>{routeElements}</Routes>
}
