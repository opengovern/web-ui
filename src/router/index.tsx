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
import Single from '../pages/Assets/Single'
import SingleSpend from '../pages/Spend/Single'
import SingleComplianceConnection from '../pages/Governance/Compliance/BenchmarkSummary/SingleConnection'
// import Boostrap from '../pages/Workspaces/Bootstrap'
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
import SettingsJobs from '../pages/Settings/Jobs'
import AllControls from '../pages/Governance/Compliance/All Controls'
import AllBenchmarks from '../pages/Governance/Compliance/All Benchmarks'
import SettingsWorkspaceAPIKeys from '../pages/Settings/APIKeys'
import SettingsParameters from '../pages/Settings/Parameters'
import SettingsMembers from '../pages/Settings/Members'
import NewBenchmarkSummary from '../pages/Governance/Compliance/NewBenchmarkSummary'
import Dashboard from '../pages/Dashboard'
import Library from '../pages/Governance/Compliance/Library'
import Search from '../pages/Search'
import Test from '../pages/Test'

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
        key: 'Automation',
        path: '/ws/:ws/automation',
        element: <RequestAccess />,
    },
    {
        key: 'dashboards',
        path: '/ws/:ws/dashboards',
        element: <Dashboard />,
    },
    {
        key: 'infrastructure',
        path: '/ws/:ws/dashboard/infrastructure',
        element: <Assets />,
    },
    {
        key: 'infrastructure single',
        path: '/ws/:ws/dashboard/infrastructure/:id',
        element: <Single />,
    },
    {
        key: 'infrastructure single metric',
        path: '/ws/:ws/dashboard/infrastructure/:id/:metric',
        element: <Single />,
    },
    {
        key: 'infrastructure single metric',
        path: '/ws/:ws/dashboard/infrastructure-cloud-account/:id/:metric',
        element: <Single />,
    },
    {
        key: 'infrastructure account detail',
        path: '/ws/:ws/dashboard/infrastructure-cloud-accounts',
        element: <AssetAccounts />,
    },
    {
        key: 'infrastructure account detail single',
        path: '/ws/:ws/dashboard/infrastructure-cloud-accounts/:id/:metric',
        element: <Single />,
    },
    {
        key: 'infrastructure account detail single',
        path: '/ws/:ws/dashboard/infrastructure-cloud-accounts/:id',
        element: <Single />,
    },
    {
        key: 'infrastructure metric detail',
        path: '/ws/:ws/dashboard/infrastructure-metrics',
        element: <AssetMetrics />,
    },
    {
        key: 'infrastructure single 2',
        path: '/ws/:ws/dashboard/infrastructure-metrics/:id',
        element: <Single />,
    },
    {
        key: 'infrastructure single metric 2',
        path: '/ws/:ws/dashboard/infrastructure-metrics/:id/:metric',
        element: <Single />,
    },
    {
        key: 'spend',
        path: '/ws/:ws/dashboard/spend',
        element: <SpendOverview />,
    },
    {
        key: 'spend single 1',
        path: '/ws/:ws/dashboard/spend/:id',
        element: <SingleSpend />,
    },
    {
        key: 'spend single metric 1',
        path: '/ws/:ws/dashboard/spend/:id/:metric',
        element: <SingleSpend />,
    },
    {
        key: 'spend',
        path: '/ws/:ws/dashboard/spend-metrics',
        element: <SpendMetrics />,
    },
    {
        key: 'spend',
        path: '/ws/:ws/dashboard/spend-accounts',
        element: <SpendAccounts />,
    },
    {
        key: 'spend single',
        path: '/ws/:ws/dashboard/spend-accounts/:id',
        element: <SingleSpend />,
    },
    {
        key: 'spend single metric',
        path: '/ws/:ws/dashboard/spend-accounts/:id/:metric',
        element: <SingleSpend />,
    },
    {
        key: 'spend single',
        path: '/ws/:ws/dashboard/spend-metrics/:id',
        element: <SingleSpend />,
    },
    {
        key: 'spend single metric',
        path: '/ws/:ws/dashboard/spend-metrics/:id/:metric',
        element: <SingleSpend />,
    },
    {
        key: 'spend single 2',
        path: '/ws/:ws/dashboard/spend/spend-details/:id',
        element: <SingleSpend />,
    },
    {
        key: 'spend single metric 2',
        path: '/ws/:ws/dashboard/spend/spend-details/:id/:metric',
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
        path: '/ws/:ws/settings/about',
        element: <Settings />,
    },
    {
        key: 'settings Jobs',
        path: '/ws/:ws/settings/jobs',
        element: <SettingsJobs />,
    },
    {
        key: 'settings APi Keys',
        path: '/ws/:ws/settings/api-keys',
        element: <SettingsWorkspaceAPIKeys />,
    },
    // {
    //     key: 'settings variables',
    //     path: '/ws/:ws/settings/variables',
    //     element: <SettingsParameters />,
    // },
    {
        key: 'settings Authentications',
        path: '/ws/:ws/settings/authentication',
        element: <SettingsMembers />,
    },
    {
        key: 'security overview',
        path: '/ws/:ws/security-overview',
        element: <SecurityOverview />,
    },
    {
        key: 'Compliance',
        path: '/ws/:ws/compliance',
        element: <Compliance />,
    },

    {
        key: 'benchmark summary',
        path: '/ws/:ws/compliance/old/:benchmarkId',
        element: <BenchmarkSummary />,
    },
    {
        key: 'benchmark summary 2',
        path: '/ws/:ws/compliance/:benchmarkId',
        element: <NewBenchmarkSummary />,
    },
    {
        key: 'allControls',
        path: '/ws/:ws/compliance/library',
        element: <Library />,
    },
    {
        key: 'allControls',
        path: '/ws/:ws/compliance/library/parameters',
        element: <SettingsParameters />,
    },
    // {
    //     key: 'allBenchmarks',
    //     path: '/ws/:ws/compliance/benchmarks',
    //     element: <AllBenchmarks />,
    // },
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
        key: 'Incidents control',
        path: '/ws/:ws/incidents',
        element: <Findings />,
    },
    // {
    //     key: 'Resource summary',
    //     path: '/ws/:ws/incidents/resource-summary',
    //     element: <Findings />,
    // },
    {
        key: ' summary',
        path: '/ws/:ws/incidents/summary',
        element: <Findings />,
    },

    // {
    //     key: 'Drift Events',
    //     path: '/ws/:ws/incidents/drift-events',
    //     element: <Findings />,
    // },
    {
        key: 'Account Posture',
        path: '/ws/:ws/incidents/account-posture',
        element: <Findings />,
    },
    // {
    //     key: 'Control Summary',
    //     path: '/ws/:ws/incidents/control-summary',
    //     element: <Findings />,
    // },
    {
        key: 'incidents',
        path: '/ws/:ws/incidents/summary/:controlId',
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
    // {
    //     key: 'query',
    //     path: '/ws/:ws/query',
    //     element: <Query />,
    // },
    // {
    //     key: 'bootstrap',
    //     path: '/ws/:ws/bootstrap',
    //     element: <Boostrap />,
    // },
    // {
    //     key: 'new-ws',
    //     path: '/ws/new-ws',
    //     element: <Boostrap />,
    // },
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
        key: 'resource collection infrastructure single 2',
        path: '/ws/:ws/resource-collection/:resourceId/infrastructure-details/:id',
        element: <Single />,
    },
    {
        key: 'resource collection infrastructure single metric 2',
        path: '/ws/:ws/resource-collection/:resourceId/infrastructure-details/:id/:metric',
        element: <Single />,
    },
    {
        key: 'request a demo',
        path: '/ws/requestdemo',
        element: <RequestDemo />,
    },

    {
        key: 'Search',
        path: '/ws/:ws/search',
        element: <Search />,
    },
    // {
    //     key: 'test',
    //     path: '/ws/:ws/test',
    //     element: <Test />,
    // },
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
