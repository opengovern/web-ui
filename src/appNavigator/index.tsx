import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Assets from '../pages/Assets'
import NotFound from '../pages/Errors'
import { AuthenticationGuard } from '../components/Auth0/authentication-guard'
import { CallbackPage } from '../pages/Callback'
import Insights from '../pages/Insights'
import Settings from '../pages/Settings'
import Workspaces from '../pages/Workspaces'
import Logout from '../pages/Logout'

interface NavigateToWorkspacePageProps {
    page: string
}

const NavigateToWorkspacePage = ({ page }: NavigateToWorkspacePageProps) => {
    const workspace = useParams<{ ws: string }>().ws

    const path = `/${workspace}${page}`
    return <Navigate to={path} replace />
}

export const defaultRoutes = [
    {
        name: '',
        path: '/',
        component: <Navigate to="/demo" replace />,
    },
    {
        name: 'Callback',
        path: '/callback',
        component: CallbackPage,
    },
    {
        name: 'Insights',
        path: '/insights',
        // component: Insights,
    },
]

export const normalizeRoutes = (routes = defaultRoutes) => {
    return routes.map((route) => {
        if (
            route?.path === '/' ||
            /^workspaces.*/.test(route?.path) ||
            route?.path === '/invitation' ||
            route?.path === '/logout' ||
            route?.path === '*'
        ) {
            return route
        }
        const pathWithWorkspaceParam = `:workspaceName${route.path}`
        return {
            ...route,
            path: pathWithWorkspaceParam,
        }
    })
}

// const getRouteElement = (component) => {
//     return (
//         <Suspense key={component?.name} fallback={<Spinner />}>
//             {component}
//         </Suspense>
//     )
// }

export default function AppNavigator() {
    // const [err, setErr] = useState(404)
    // const routeElements =
    //     err === 403 || err === 500 || err === 503 ? (
    //         <Route key="*" path="*" element={<NotFound error={err} />} />
    //     ) : (
    //         normalizeRoutes(defaultRoutes).map(
    //             ({ name, path, component }): JSX.Element => (
    //                 <Route
    //                     key={`${name}${path}`}
    //                     path={path}
    //                     element={getRouteElement(component)}
    //                 />
    //             )
    //         )
    //     )

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/workspaces" replace />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route
                key="assets"
                path="/:ws/assets"
                element={<AuthenticationGuard component={Assets} />}
            />
            <Route
                key="insights"
                path="/:ws/insight"
                element={<AuthenticationGuard component={Insights} />}
            />
            <Route
                key="settings"
                path="/:ws/settings"
                element={<AuthenticationGuard component={Settings} />}
            />
            <Route
                key="workspaces"
                path="/workspaces"
                element={<AuthenticationGuard component={Workspaces} />}
            />
            <Route
                key="workspaceHome"
                path="/:ws"
                element={<NavigateToWorkspacePage page="/assets" />}
            />
            <Route key="*" path="*" element={<NotFound error={404} />} />
            {/* <Routes> */}
            {/*    {routeElements} */}
            {/*    <Route key="*" path="*" element={<NotFound error={404} />} /> */}
            {/* </Routes> */}
        </Routes>
    )
}
