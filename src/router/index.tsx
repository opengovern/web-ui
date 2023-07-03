import { Navigate, Route, Routes } from 'react-router-dom'
import Assets from '../pages/Assets'
import NotFound from '../pages/Errors'
import { AuthenticationGuard } from '../components/Auth0/authentication-guard'
import { CallbackPage } from '../pages/Callback'
import Insights from '../pages/Insights'
import Settings from '../pages/Settings'
import Workspaces from '../pages/Workspaces'
import Logout from '../pages/Logout'
import InsightDetail from '../pages/Insights/InsightDetail'
import AccountsDetails from '../pages/Assets/Details/AccountsDetails'
import Spend from '../pages/Spend'
import ServicesDetails from '../pages/Assets/Details/ServicesDetails'

const routes = [
    {
        key: 'url',
        path: '/',
        element: <Navigate to="/workspaces" replace />,
    },
    {
        key: 'ws name',
        path: '/:ws',
        element: <Navigate to="assets" />,
    },
    {
        key: 'callback',
        path: '/callback',
        element: <CallbackPage />,
    },
    {
        key: 'logout',
        path: '/logout',
        element: <Logout />,
    },
    {
        key: '*',
        path: '*',
        element: <NotFound error={404} />,
    },
]

const authRoutes = [
    {
        key: 'workspaces',
        path: '/workspaces',
        component: Workspaces,
    },
    {
        key: 'assets',
        path: '/:ws/assets',
        component: Assets,
    },
    {
        key: 'accounts detail',
        path: '/:ws/assets/accounts-detail',
        component: AccountsDetails,
    },
    {
        key: 'services detail',
        path: '/:ws/assets/services-detail',
        component: ServicesDetails,
    },
    {
        key: 'spend',
        path: '/:ws/spend',
        component: Spend,
    },
    {
        key: 'insights',
        path: '/:ws/insight',
        component: Insights,
    },
    {
        key: 'insight detail',
        path: '/:ws/insight/:id',
        component: InsightDetail,
    },
    {
        key: 'settings',
        path: '/:ws/settings',
        component: Settings,
    },
    {
        key: 'settings page',
        path: '/:ws/settings/:settingsPage',
        component: Settings,
    },
]

export default function Router() {
    return (
        <Routes>
            {routes.map((route) => (
                <Route
                    key={route.key}
                    path={route.path}
                    element={route.element}
                />
            ))}
            {authRoutes.map((route) => (
                <Route
                    key={route.key}
                    path={route.path}
                    element={
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        <AuthenticationGuard component={route.component} />
                    }
                />
            ))}
        </Routes>
    )
}
