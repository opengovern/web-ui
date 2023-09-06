import { useEffect, useState } from 'react'
import { Flex } from '@tremor/react'
import {
    BuildingOfficeIcon,
    FolderIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { Link, useLocation, useParams } from 'react-router-dom'
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
import Header from '../../components/Header'

const navigation = [
    {
        name: 'Workspace',
        icon: FolderIcon,
        role: ['admin', 'editor', 'viewer'],
        children: [
            {
                name: 'Entitlement',
                page: '#entitlement',
                role: ['admin', 'editor', 'viewer'],
            },
            {
                name: 'Members',
                page: '#members',
                role: ['admin'],
            },
            {
                name: 'API Keys',
                page: '#apikeys',
                role: ['admin'],
            },
            {
                name: 'Git Repositories',
                page: '#gitrepositories',
                role: ['admin'],
            },
        ],
    },
    {
        name: 'Organization',
        icon: BuildingOfficeIcon,
        role: ['admin', 'editor', 'viewer'],
        children: [
            {
                name: 'Organization Info',
                page: '#org',
                role: ['admin', 'editor', 'viewer'],
            },
        ],
    },
    {
        name: 'Personal',
        icon: UserIcon,
        role: ['admin', 'editor', 'viewer'],
        children: [
            {
                name: 'Profile',
                page: '#profile',
                role: ['admin', 'editor', 'viewer'],
            },
        ],
    },
]

export default function Settings() {
    const [selectedTab, setSelectedTab] = useState(<SettingsEntitlement />)
    const [decodedToken, SetDecodedToken] = useState()
    const [tokenLoading, setTokenLoading] = useState(true)
    const { getAccessTokenSilently } = useAuth0()
    const { response: curWorkspace, isLoading } =
        useWorkspaceApiV1WorkspaceCurrentList()
    const workspace = useParams<{ ws: string }>().ws
    const currentSubPage = useLocation().hash

    useEffect(() => {
        getAccessTokenSilently().then((e) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decoded: any = jwtDecode(e)
            SetDecodedToken(decoded)
            setTokenLoading(false)
        })
    }, [])

    useEffect(() => {
        switch (currentSubPage) {
            case '#entitlement':
                setSelectedTab(<SettingsEntitlement />)
                break
            case '#members':
                setSelectedTab(<SettingsMembers />)
                break
            case '#apikeys':
                setSelectedTab(<SettingsWorkspaceAPIKeys />)
                break
            case '#gitrepositories':
                setSelectedTab(<SettingsGitRepositories />)
                break
            case '#org':
                setSelectedTab(<SettingsOrganization />)
                break
            case '#profile':
                setSelectedTab(<SettingsProfile />)
                break
            default:
                setSelectedTab(<SettingsEntitlement />)
                break
        }
    }, [currentSubPage])

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
            <Header />
            {isLoading || tokenLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : (
                <Flex alignItems="start">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="w-fit"
                    >
                        <nav className="w-56 text-sm">
                            <ul className="space-y-1.5">
                                {navigation.map((item: any) => {
                                    if (
                                        !item.role.includes(getRole()) &&
                                        item.role.length > 0
                                    ) {
                                        return null
                                    }
                                    return (
                                        <li key={item.name}>
                                            <Flex
                                                justifyContent="start"
                                                className="text-gray-800 font-semibold group gap-x-3 mb-2"
                                            >
                                                {item.icon && (
                                                    <item.icon className="h-5 w-5 shrink-0" />
                                                )}
                                                {item.name}
                                            </Flex>
                                            {item.children.map((child: any) => (
                                                <Link
                                                    to={`/${workspace}/settings${child.page}`}
                                                    className={`${
                                                        child.page ===
                                                            currentSubPage ||
                                                        (!currentSubPage &&
                                                            child.page ===
                                                                '#entitlement')
                                                            ? 'bg-kaytu-100 rounded-lg text-gray-800'
                                                            : 'text-gray-600'
                                                    } group flex gap-x-3 py-2 px-10 font-medium`}
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </li>
                                    )
                                })}
                            </ul>
                        </nav>
                    </Flex>
                    <Flex className="w-full h-full pl-6">{selectedTab}</Flex>
                </Flex>
            )}
        </Menu>
    )
}
