import { Navigate, Route, Routes } from 'react-router-dom'
import Assets from '../pages/Assets'
import NotFound from '../pages/Errors'
import { AuthenticationGuard } from '../components/Auth0/authentication-guard'
import { CallbackPage } from '../pages/Callback'
import InsightList from '../pages/Insights/InsightList'
import Settings from '../pages/Settings'
import Workspaces from '../pages/Workspaces'
import Logout from '../pages/Logout'
import InsightDetail from '../pages/Insights/InsightList/InsightDetail'
import AccountsDetails from '../pages/Assets/Details/AccountsDetails'
import Spend from '../pages/Spend'
import ResourceMetricsDetails from '../pages/Assets/Details/ResourceMetricsDetails'
import Integrations from '../pages/Integrations'
import CostMetricsDetails from '../pages/Spend/Details'
import ConnectorDetail from '../pages/Integrations/ConnectorDetail'
import Compliance from '../pages/Compliance'
import BenchmarkDetail from '../pages/Compliance/BenchmarkDetail'
import Home from '../pages/Home'
import Stack from '../pages/Stack'
import Finder from '../pages/Finder'
import KeyInsights from '../pages/Insights/KeyInsights'

const routes = [
    {
        key: 'url',
        path: '/',
        element: <Navigate to="/workspaces" replace />,
    },
    {
        key: 'ws name',
        path: '/:ws',
        element: <Navigate to="home" />,
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
        element: <NotFound />,
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
        path: '/:ws/assets/accounts',
        component: AccountsDetails,
    },
    {
        key: 'accounts detail',
        path: '/:ws/assets/accounts',
        component: AccountsDetails,
    },
    {
        key: 'resource metrics',
        path: '/:ws/assets/resource-metrics',
        component: ResourceMetricsDetails,
    },
    {
        key: 'spend',
        path: '/:ws/spend',
        component: Spend,
    },
    {
        key: 'spend metrics',
        path: '/:ws/spend/spend-details',
        component: CostMetricsDetails,
    },
    {
        key: 'insight list',
        path: '/:ws/all-insights',
        component: InsightList,
    },
    {
        key: 'key insights',
        path: '/:ws/key-insights',
        component: KeyInsights,
    },
    {
        key: 'insight detail',
        path: '/:ws/all-insights/:id',
        component: InsightDetail,
    },
    {
        key: 'integrations',
        path: '/:ws/integrations',
        component: Integrations,
    },
    {
        key: 'connector detail',
        path: '/:ws/integrations/:connector',
        component: ConnectorDetail,
    },
    {
        key: 'settings page',
        path: '/:ws/settings',
        component: Settings,
    },
    {
        key: 'compliance',
        path: '/:ws/compliance',
        component: Compliance,
    },
    {
        key: 'benchmark detail',
        path: '/:ws/compliance/:id',
        component: BenchmarkDetail,
    },
    {
        key: 'home',
        path: '/:ws/home',
        component: Home,
    },
    {
        key: 'deployment',
        path: '/:ws/deployment',
        component: Stack,
    },
    {
        key: 'finder',
        path: '/:ws/finder',
        component: Finder,
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
