import { useEffect, useState } from 'react'
import { Flex, Metric } from '@tremor/react'
import {
    BuildingOfficeIcon,
    FolderIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { Link, useParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import jwtDecode from 'jwt-decode'
import Menu from '../../components/Menu'
import SettingsEntitlement from './Entitlement'
import SettingsMembers from './Members'
import SettingsWorkspaceAPIKeys from './APIKeys'
import SettingsProfile from './Profile'
import SettingsOrganization from './Organization'
import SettingsGitRepositories from './GitRepositories'
import { useWorkspaceApiV1WorkspaceCurrentList } from '../../api/workspace.gen'
import Spinner from '../../components/Spinner'
import { isDemo } from '../../utilities/demo'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const navigation = [
    {
        name: 'Workspace',
        page: '',
        icon: FolderIcon,
        role: ['admin', 'editor', 'viewer'],
    },
    {
        name: 'Entitlement',
        page: 'entitlement',
        component: <SettingsEntitlement />,
        role: ['admin', 'editor', 'viewer'],
    },
    {
        name: 'Members',
        page: 'members',
        component: <SettingsMembers />,
        role: ['admin'],
    },
    {
        name: 'API Keys',
        page: 'apikeys',
        component: <SettingsWorkspaceAPIKeys />,
        role: ['admin'],
    },
    {
        name: 'Git Repositories',
        page: 'gitrepositories',
        component: <SettingsGitRepositories />,
        role: ['admin'],
    },
    {
        name: 'Organization',
        page: '',
        icon: BuildingOfficeIcon,
        role: ['admin', 'editor', 'viewer'],
    },
    {
        name: 'Organization Info',
        page: 'org',
        component: <SettingsOrganization />,
        role: ['admin', 'editor', 'viewer'],
    },
    {
        name: 'Personal',
        page: '',
        icon: UserIcon,
        role: ['admin', 'editor', 'viewer'],
    },
    {
        name: 'Profile',
        page: 'profile',
        component: <SettingsProfile />,
        role: ['admin', 'editor', 'viewer'],
    },
]

export default function Settings() {
    const [decodedToken, SetDecodedToken] = useState()
    const [tokenLoading, setTokenLoading] = useState(true)
    const { getAccessTokenSilently } = useAuth0()
    const { response: curWorkspace, isLoading } =
        useWorkspaceApiV1WorkspaceCurrentList({
            ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
        })
    const workspace = useParams<{ ws: string }>().ws
    const currentSubPage = useParams<{ settingsPage: string }>().settingsPage

    useEffect(() => {
        getAccessTokenSilently().then((e) => {
            const decoded: any = jwtDecode(e)
            SetDecodedToken(decoded)
            setTokenLoading(false)
        })
    }, [])

    const getRole = () => {
        if (decodedToken) {
            if (curWorkspace?.id)
                return (
                    decodedToken['https://app.kaytu.io/workspaceAccess'][
                        curWorkspace.id
                    ] || 'viewer'
                )
        }
        return 'viewer'
    }

    return (
        <Menu currentPage="settings">
            {isLoading || tokenLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : (
                <Flex alignItems="start">
                    <Flex className="w-fit">
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="gap-y-5"
                        >
                            <Metric className="text-gray-800">Settings</Metric>
                            <nav className="w-56">
                                <ul className="space-y-1.5">
                                    {navigation.map((item) => {
                                        if (
                                            !item.role.includes(getRole()) &&
                                            item.role.length > 0
                                        ) {
                                            return null
                                        }
                                        return (
                                            <li key={item.name}>
                                                {item.page === '' ? (
                                                    <div className="text-gray-500 font-semibold group flex gap-x-3 p-1">
                                                        {item.icon && (
                                                            <item.icon className="h-6 w-6 shrink-0" />
                                                        )}
                                                        {item.name}
                                                    </div>
                                                ) : (
                                                    <Link
                                                        to={`/${workspace}/settings/${item.page}`}
                                                        className={classNames(
                                                            item.page ===
                                                                currentSubPage ||
                                                                (!currentSubPage &&
                                                                    item.page ===
                                                                        'entitlement')
                                                                ? 'bg-blue-100 rounded-lg text-gray-800'
                                                                : 'text-gray-500',
                                                            'font-medium group flex gap-x-3 py-2 px-10'
                                                        )}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                )}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </nav>
                        </Flex>
                    </Flex>
                    <main className="w-full pl-6">
                        <Metric className="text-gray-800 mb-1 opacity-0">
                            Settings
                        </Metric>
                        {navigation
                            .filter(
                                (item) =>
                                    item.page === currentSubPage ||
                                    (!currentSubPage &&
                                        item.page === 'entitlement')
                            )
                            .map((item) => item.component)}
                    </main>
                </Flex>
            )}
        </Menu>
    )
}
