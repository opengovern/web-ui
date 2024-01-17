import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Assets from '../pages/Assets'
import NotFound from '../pages/Errors'
import { AuthenticationGuard } from '../components/Auth0/authentication-guard'
import { CallbackPage } from '../pages/Callback'
import Settings from '../pages/Settings'
import Workspaces from '../pages/Workspaces'
import Logout from '../pages/Logout'
import Integrations from '../pages/Integrations'
import ConnectorDetail from '../pages/Integrations/ConnectorDetail'
import Compliance from '../pages/Governance/Compliance'
import BenchmarkSummary from '../pages/Governance/Compliance/BenchmarkSummary'
import Home from '../pages/Home'
import Stack from '../pages/Stack'
import Query from '../pages/Query'
import Single from '../pages/Assets/Single'
import SingleSpend from '../pages/Spend/Single'
import ServiceAdvisor from '../pages/Governance/ServiceAdvisor'
import InsightDetails from '../pages/Insights/Details'
import InsightList from '../pages/Insights/InsightList'
import AssetDetails from '../pages/Assets/Details'
import Rules from '../pages/Automation/Rules'
import Alerts from '../pages/Automation/Alerts'
import SingleComplianceConnection from '../pages/Governance/Compliance/BenchmarkSummary/SingleConnection'
import Boostrap from '../pages/Workspaces/Bootstrap'
import ResourceCollection from '../pages/ResourceCollection'
import ResourceCollectionDetail from '../pages/ResourceCollection/Detail'
import ControlDetail from '../pages/Governance/Controls/ControlSummary'
import ConnectorResourceTypes from '../pages/Integrations/ConnectorDetail/ResourceTypes'
import Billing from '../pages/Billing'
import Findings from '../pages/Governance/Findings'
import { SpendOverview } from '../pages/Spend/Overview'
import { SpendMetrics } from '../pages/Spend/Metric'
import { SpendAccounts } from '../pages/Spend/Account'
import Layout from '../components/Layout'

const authRoutes = [
    {
        key: 'url',
        path: '/',
        element: <Navigate to="/workspaces?onLogin" replace />,
        noAuth: true,
    },
    {
        key: 'ws name',
        path: '/:ws',
        element: <Navigate to="home" />,
        noAuth: true,
    },
    {
        key: 'callback',
        path: '/callback',
        element: <CallbackPage />,
        noAuth: true,
    },
    {
        key: 'logout',
        path: '/logout',
        element: <Logout />,
        noAuth: true,
    },
    {
        key: '*',
        path: '*',
        element: <NotFound />,
        noAuth: true,
    },

    {
        key: 'workspaces',
        path: '/workspaces',
        component: Workspaces,
    },
    {
        key: 'billing',
        path: '/billing',
        component: Billing,
    },
    {
        key: 'assets',
        path: '/:ws/assets',
        component: Assets,
    },
    {
        key: 'assets single',
        path: '/:ws/assets/:id',
        component: Single,
    },
    {
        key: 'assets single metric',
        path: '/:ws/assets/:id/:metric',
        component: Single,
    },
    {
        key: 'assets account detail',
        path: '/:ws/assets/accounts',
        component: AssetDetails,
    },
    {
        key: 'assets metric detail',
        path: '/:ws/assets/metrics',
        component: AssetDetails,
    },
    {
        key: 'assets single 2',
        path: '/:ws/assets/metrics/:id',
        component: Single,
    },
    {
        key: 'assets single metric 2',
        path: '/:ws/assets/metrics/:id/:metric',
        component: Single,
    },
    {
        key: 'spend',
        path: '/:ws/spend',
        component: SpendOverview,
    },
    {
        key: 'spend',
        path: '/:ws/spend/metrics',
        component: SpendMetrics,
    },
    {
        key: 'spend',
        path: '/:ws/spend/accounts',
        component: SpendAccounts,
    },
    {
        key: 'spend single',
        path: '/:ws/spend/accounts/:id',
        component: SingleSpend,
    },
    {
        key: 'spend single metric',
        path: '/:ws/spend/accounts/:id/:metric',
        component: SingleSpend,
    },
    {
        key: 'spend single',
        path: '/:ws/spend/metrics/:id',
        component: SingleSpend,
    },
    {
        key: 'spend single metric',
        path: '/:ws/spend/metrics/:id/:metric',
        component: SingleSpend,
    },
    {
        key: 'spend single 2',
        path: '/:ws/spend/spend-details/:id',
        component: SingleSpend,
    },
    {
        key: 'spend single metric 2',
        path: '/:ws/spend/spend-details/:id/:metric',
        component: SingleSpend,
    },
    {
        key: 'insights',
        path: '/:ws/insights',
        component: InsightList,
    },
    {
        key: 'insight detail',
        path: '/:ws/insights/:id',
        component: InsightDetails,
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
        key: 'connector resource types',
        path: '/:ws/integrations/:connector/resourcetypes',
        component: ConnectorResourceTypes,
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
        key: 'benchmark summary',
        path: '/:ws/compliance/:benchmarkId',
        component: BenchmarkSummary,
    },
    {
        key: 'benchmark summary',
        path: '/:ws/compliance/:benchmarkId/:controlId',
        component: ControlDetail,
    },
    {
        key: 'benchmark single connection',
        path: '/:ws/compliance/:benchmarkId/:connectionId',
        component: SingleComplianceConnection,
    },
    {
        key: 'service advisor',
        path: '/:ws/service-advisor',
        component: ServiceAdvisor,
    },
    {
        key: 'findings control',
        path: '/:ws/findings',
        component: Findings,
    },
    {
        key: 'findings',
        path: '/:ws/findings/:controlId',
        component: ControlDetail,
    },
    {
        key: 'service advisor summary',
        path: '/:ws/service-advisor/:id',
        component: BenchmarkSummary,
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
        key: 'query',
        path: '/:ws/query',
        component: Query,
    },
    {
        key: 'rules',
        path: '/:ws/rules',
        component: Rules,
    },
    {
        key: 'bootstrap',
        path: '/:ws/bootstrap',
        component: Boostrap,
    },
    {
        key: 'new-ws',
        path: '/new-ws',
        component: Boostrap,
    },
    {
        key: 'alerts',
        path: '/:ws/alerts',
        component: Alerts,
    },
    {
        key: 'resource collection',
        path: '/:ws/resource-collection',
        component: ResourceCollection,
    },
    {
        key: 'resource collection detail',
        path: '/:ws/resource-collection/:resourceId',
        component: ResourceCollectionDetail,
    },
    {
        key: 'benchmark summary',
        path: '/:ws/resource-collection/:resourceId/:id',
        component: BenchmarkSummary,
    },
    {
        key: 'benchmark single connection',
        path: '/:ws/resource-collection/:resourceId/:id/:connection',
        component: SingleComplianceConnection,
    },
    {
        key: 'resource collection assets metrics',
        path: '/:ws/resource-collection/:resourceId/assets-details',
        component: AssetDetails,
    },
    {
        key: 'resource collection assets single 2',
        path: '/:ws/resource-collection/:resourceId/assets-details/:id',
        component: Single,
    },
    {
        key: 'resource collection assets single metric 2',
        path: '/:ws/resource-collection/:resourceId/assets-details/:id/:metric',
        component: Single,
    },
]

export default function Router() {
    const navigate = useNavigate()

    const url = window.location.pathname.split('/')
    useEffect(() => {
        if (url[1] === 'undefined') {
            navigate('/workspaces?onLogin')
        }
    }, [url])

    return (
        <Layout>
            <Routes>
                {authRoutes.map((route) => (
                    <Route
                        key={route.key}
                        path={route.path}
                        element={
                            route.noAuth ? (
                                route.element
                            ) : (
                                <AuthenticationGuard
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    component={route.component}
                                />
                            )
                        }
                    />
                ))}
            </Routes>
        </Layout>
    )
}
