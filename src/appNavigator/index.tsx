import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Assets from '../pages/Assets'
import NotFound from '../pages/Errors'
import { AuthenticationGuard } from '../components/Auth0/authentication-guard'
import { CallbackPage } from '../pages/Callback'

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
            <Route path="/" element={<Navigate to="/demo" replace />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route
                key="assets"
                path="/:ws/assets"
                element={<AuthenticationGuard component={Assets} />}
            />
            <Route
                key="workspace"
                path="/:ws"
                element={<NavigateToWorkspacePage page="/assets" />}
            />
            <Route key="*" path="*" element={<NotFound error={404} />} />
        </Routes>
    )
}

export default AppNavigator
