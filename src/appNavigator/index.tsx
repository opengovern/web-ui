import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Assets from '../pages/Assets'
import NotFound from '../pages/Errors'
import { AuthenticationGuard } from '../components/Auth0/authentication-guard'
import { CallbackPage } from '../pages/Callback'
import Insights from '../pages/Insights'

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
            <Route path="/" element={<Navigate to="/demo" replace />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route
                key="assets"
                path="/:ws/assets"
                element={<AuthenticationGuard component={Assets} />}
            />
            <Route
                key="insights"
                path="/:ws/insights"
                element={<AuthenticationGuard component={Insights} />}
            />
            <Route
                key="workspace"
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
