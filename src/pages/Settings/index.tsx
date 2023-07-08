import React, { useEffect, useState } from 'react'
import { Flex, Metric } from '@tremor/react'
import {
    BuildingOfficeIcon,
    FolderIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { Link, useParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import jwtDecode from 'jwt-decode'
import LoggedInLayout from '../../components/LoggedInLayout'
import SettingsMetadata from './Metadata'
import SettingsMembers from './Members'
import SettingsWorkspaceAPIKeys from './APIKeys'
import SettingsProfile from './Profile'
import SettingsOrganization from './Organization'
import SettingsQueries from './Queries'
import {
    useWorkspaceApiV1WorkspacesList,
    useWorkspaceApiV1WorkspaceCurrentList,
} from '../../api/workspace.gen'
import Spinner from '../../components/Spinner'

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
        name: 'Metadata',
        page: 'metadata',
        component: <SettingsMetadata />,
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
        name: 'Queries',
        page: 'queries',
        component: <SettingsQueries />,
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

const Settings: React.FC<any> = () => {
    const [decodedToken, SetDecodedToken] = useState()
    const [tokenLoading, setTokenLoading] = useState(true)
    const { getAccessTokenSilently } = useAuth0()
    const { response: curWorkspace, isLoading } =
        useWorkspaceApiV1WorkspaceCurrentList()
    const workspace = useParams<{ ws: string }>().ws
    const currentSubPage = useParams<{ settingsPage: string }>().settingsPage

    useEffect(() => {
        getAccessTokenSilently().then((e) => {
            const decoded: any = jwtDecode(e)
            SetDecodedToken(decoded)
            setTokenLoading(false)
        })
    })

    const getRole = () => {
        if (decodedToken) {
            if (curWorkspace?.id)
                return decodedToken['https://app.kaytu.io/workspaceAccess'][
                    curWorkspace.id
                ]
        }
        return 'viewer'
    }

    if (isLoading && tokenLoading) {
        return <Spinner />
    }

    return (
        <LoggedInLayout currentPage="settings">
            <Flex flexDirection="row" alignItems="start">
                <Flex flexDirection="row" className="w-fit">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="gap-y-5"
                    >
                        <Metric className="text-gray-800">Settings</Metric>
                        <nav className="flex flex-col w-56">
                            <ul className="flex flex-col gap-y-7">
                                <li>
                                    <ul className="space-y-1.5">
                                        {navigation.map((item) => {
                                            if (
                                                !item.role.includes(
                                                    getRole()
                                                ) &&
                                                item.role.length > 0
                                            ) {
                                                return null
                                            }
                                            return (
                                                <li key={item.name}>
                                                    {item.page === '' ? (
                                                        <div
                                                            className={classNames(
                                                                'text-gray-500 font-semibold group flex gap-x-3 p-1'
                                                            )}
                                                        >
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
                                                                            'metadata')
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
                                </li>
                            </ul>
                        </nav>
                    </Flex>
                </Flex>
                <main className="w-full pl-6">
                    {/* <Metric className="text-gray-800 mb-1 opacity-0">
                        placeholder :D
                    </Metric> */}
                    {navigation
                        .filter(
                            (item) =>
                                item.page === currentSubPage ||
                                (!currentSubPage && item.page === 'metadata')
                        )
                        .map((item) => item.component)}
                </main>
            </Flex>
        </LoggedInLayout>
    )
}

export default Settings
