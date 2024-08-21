import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Assets from '../pages/Assets'
import NotFound from '../pages/Errors'
import { CallbackPage } from '../pages/Callback'
import Settings from '../pages/Settings'
import Workspaces from '../pages/Workspaces'
import Logout from '../pages/Logout'
import Integrations from '../pages/Integrations'
import ConnectorDetail from '../pages/Integrations/ConnectorDetail'
import Compliance from '../pages/Governance/Compliance'
import BenchmarkSummary from '../pages/Governance/Compliance/BenchmarkSummary'
import Overview from '../pages/Overview'
import Stack from '../pages/Stack'
import Query from '../pages/Query'
import Single from '../pages/Assets/Single'
import SingleSpend from '../pages/Spend/Single'
import SingleComplianceConnection from '../pages/Governance/Compliance/BenchmarkSummary/SingleConnection'
import Boostrap from '../pages/Workspaces/Bootstrap'
import ResourceCollection from '../pages/ResourceCollection'
import ResourceCollectionDetail from '../pages/ResourceCollection/Detail'
import ControlDetail from '../pages/Governance/Controls/ControlSummary'
import ConnectorResourceTypes from '../pages/Integrations/ConnectorDetail/ResourceTypes'
import Findings from '../pages/Governance/Findings'
import { SpendOverview } from '../pages/Spend/Overview'
import { SpendMetrics } from '../pages/Spend/Metric'
import { SpendAccounts } from '../pages/Spend/Account'
import Layout from '../components/Layout'
import RequestDemo from '../pages/RequestDemo'
import AssetAccounts from '../pages/Assets/Account'
import AssetMetrics from '../pages/Assets/Metric'
import ScoreOverview from '../pages/Insights/ScoreOverview'
import ScoreCategory from '../pages/Insights/ScoreCategory'
import ScoreDetails from '../pages/Insights/Details'
import SecurityOverview from '../pages/Governance/Overview'
import WorkloadOptimizer from '../pages/WorkloadOptimizer'
import RequestAccess from '../pages/Integrations/RequestAccess'

const authRoutes = [
    {
        key: 'url',
        path: '/',
        element: <Navigate to="/ws/workspaces?onLogin" replace />,
        noAuth: true,
    },
    {
        key: 'ws name',
        path: '/ws/:ws',
        element: <Navigate to="overview" />,
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
        path: '/ws/workspaces',
        element: <Workspaces />,
    },
    {
        key: 'workload optimizer',
        path: '/ws/:ws/workload-optimizer',
        element: <RequestAccess />,
    },
    {
        key: 'stacks',
        path: '/ws/:ws/stacks',
        element: <RequestAccess />,
    },
    {
        key: 'assets',
        path: '/ws/:ws/assets',
        element: <Assets />,
    },
    {
        key: 'assets single',
        path: '/ws/:ws/assets/:id',
        element: <Single />,
    },
    {
        key: 'assets single metric',
        path: '/ws/:ws/assets/:id/:metric',
        element: <Single />,
    },
    {
        key: 'assets single metric',
        path: '/ws/:ws/asset-cloud-account/:id/:metric',
        element: <Single />,
    },
    {
        key: 'assets account detail',
        path: '/ws/:ws/asset-cloud-accounts',
        element: <AssetAccounts />,
    },
    {
        key: 'assets account detail single',
        path: '/ws/:ws/asset-cloud-accounts/:id/:metric',
        element: <Single />,
    },
    {
        key: 'assets account detail single',
        path: '/ws/:ws/asset-cloud-accounts/:id',
        element: <Single />,
    },
    {
        key: 'assets metric detail',
        path: '/ws/:ws/asset-metrics',
        element: <AssetMetrics />,
    },
    {
        key: 'assets single 2',
        path: '/ws/:ws/asset-metrics/:id',
        element: <Single />,
    },
    {
        key: 'assets single metric 2',
        path: '/ws/:ws/asset-metrics/:id/:metric',
        element: <Single />,
    },
    {
        key: 'spend',
        path: '/ws/:ws/spend',
        element: <SpendOverview />,
    },
    {
        key: 'spend single 1',
        path: '/ws/:ws/spend/:id',
        element: <SingleSpend />,
    },
    {
        key: 'spend single metric 1',
        path: '/ws/:ws/spend/:id/:metric',
        element: <SingleSpend />,
    },
    {
        key: 'spend',
        path: '/ws/:ws/spend-metrics',
        element: <SpendMetrics />,
    },
    {
        key: 'spend',
        path: '/ws/:ws/spend-accounts',
        element: <SpendAccounts />,
    },
    {
        key: 'spend single',
        path: '/ws/:ws/spend-accounts/:id',
        element: <SingleSpend />,
    },
    {
        key: 'spend single metric',
        path: '/ws/:ws/spend-accounts/:id/:metric',
        element: <SingleSpend />,
    },
    {
        key: 'spend single',
        path: '/ws/:ws/spend-metrics/:id',
        element: <SingleSpend />,
    },
    {
        key: 'spend single metric',
        path: '/ws/:ws/spend-metrics/:id/:metric',
        element: <SingleSpend />,
    },
    {
        key: 'spend single 2',
        path: '/ws/:ws/spend/spend-details/:id',
        element: <SingleSpend />,
    },
    {
        key: 'spend single metric 2',
        path: '/ws/:ws/spend/spend-details/:id/:metric',
        element: <SingleSpend />,
    },
    {
        key: 'score',
        path: '/ws/:ws/score',
        element: <ScoreOverview />,
    },
    {
        key: 'score category',
        path: '/ws/:ws/score/:category',
        element: <ScoreCategory />,
    },
    {
        key: 'score details',
        path: '/ws/:ws/score/:category/:id',
        element: <ScoreDetails />,
    },
    {
        key: 'integrations',
        path: '/ws/:ws/integrations',
        element: <Integrations />,
    },
    {
        key: 'request-access',
        path: '/ws/:ws/request-access',
        element: <RequestAccess />,
    },
    {
        key: 'connector detail',
        path: '/ws/:ws/integrations/:connector',
        element: <ConnectorDetail />,
    },
    {
        key: 'connector resource types',
        path: '/ws/:ws/integrations/:connector/resourcetypes',
        element: <ConnectorResourceTypes />,
    },
    {
        key: 'settings page',
        path: '/ws/:ws/settings',
        element: <Settings />,
    },
    {
        key: 'security overview',
        path: '/ws/:ws/security-overview',
        element: <SecurityOverview />,
    },
    {
        key: 'compliance',
        path: '/ws/:ws/compliance',
        element: <Compliance />,
    },
    {
        key: 'benchmark summary',
        path: '/ws/:ws/compliance/:benchmarkId',
        element: <BenchmarkSummary />,
    },
    {
        key: 'benchmark summary',
        path: '/ws/:ws/compliance/:benchmarkId/:controlId',
        element: <ControlDetail />,
    },
    {
        key: 'benchmark single connection',
        path: '/ws/:ws/compliance/:benchmarkId/:connectionId',
        element: <SingleComplianceConnection />,
    },
    {
        key: 'findings control',
        path: '/ws/:ws/findings',
        element: <Findings />,
    },
    {
        key: 'findings',
        path: '/ws/:ws/findings/:controlId',
        element: <ControlDetail />,
    },
    {
        key: 'service advisor summary',
        path: '/ws/:ws/service-advisor/:id',
        element: <BenchmarkSummary />,
    },
    {
        key: 'home',
        path: '/ws/:ws/overview',
        element: <Overview />,
    },
    {
        key: 'deployment',
        path: '/ws/:ws/deployment',
        element: <Stack />,
    },
    {
        key: 'query',
        path: '/ws/:ws/query',
        element: <Query />,
    },
    {
        key: 'bootstrap',
        path: '/ws/:ws/bootstrap',
        element: <Boostrap />,
    },
    {
        key: 'new-ws',
        path: '/ws/new-ws',
        element: <Boostrap />,
    },
    {
        key: 'resource collection',
        path: '/ws/:ws/resource-collection',
        element: <ResourceCollection />,
    },
    {
        key: 'resource collection detail',
        path: '/ws/:ws/resource-collection/:resourceId',
        element: <ResourceCollectionDetail />,
    },
    {
        key: 'benchmark summary',
        path: '/ws/:ws/resource-collection/:resourceId/:id',
        element: <BenchmarkSummary />,
    },
    {
        key: 'benchmark single connection',
        path: '/ws/:ws/resource-collection/:resourceId/:id/:connection',
        element: <SingleComplianceConnection />,
    },
    // {
    //     key: 'resource collection assets metrics',
    //     path: '/:ws/resource-collection/:resourceId/assets-details',
    //     component: AssetDetails,
    // },
    {
        key: 'resource collection assets single 2',
        path: '/ws/:ws/resource-collection/:resourceId/assets-details/:id',
        element: <Single />,
    },
    {
        key: 'resource collection assets single metric 2',
        path: '/ws/:ws/resource-collection/:resourceId/assets-details/:id/:metric',
        element: <Single />,
    },
    {
        key: 'request a demo',
        path: '/ws/requestdemo',
        element: <RequestDemo />,
    },
]

export default function Router() {
    const navigate = useNavigate()

    const url = window.location.pathname.split('/')
    if (url[1] === 'ws') {
        url.shift()
    }

    useEffect(() => {
        if (url[1] === 'undefined') {
            navigate('/ws/workspaces?onLogin')
        }
    }, [url])

    return (
        <Layout>
            <Routes>
                {authRoutes.map((route) => (
                    <Route
                        key={route.key}
                        path={route.path}
                        element={route.element}
                    />
                ))}
            </Routes>
        </Layout>
    )
}
