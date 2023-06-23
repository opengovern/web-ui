import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Assets from '../pages/Assets'
import NotFound from '../pages/Errors'
import { AuthenticationGuard } from '../components/Auth0/authentication-guard'
import { CallbackPage } from '../pages/Callback'
import Settings from '../pages/Settings'
import Workspaces from '../pages/Workspaces'
import { setWorkspace } from '../api/ApiConfig'

interface NavigateToWorkspacePageProps {
    page: string
}
const NavigateToWorkspacePage = ({ page }: NavigateToWorkspacePageProps) => {
    const workspace = useParams<{ ws: string }>().ws

    const path = `/${workspace}${page}`
    return <Navigate to={path} replace />
}

const AppNavigator = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/workspaces" replace />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route
                key="assets"
                path="/:ws/assets"
                element={<AuthenticationGuard component={Assets} />}
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
        </Routes>
    )
}

export default AppNavigator
