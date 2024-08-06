import { useEffect, useState } from 'react'
import { Flex } from '@tremor/react'
import {
    AdjustmentsVerticalIcon,
    BugAntIcon,
    FolderIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import { useAtomValue } from 'jotai'
import SettingsEntitlement from './Entitlement'
import SettingsMembers from './Members'
import SettingsWorkspaceAPIKeys from './APIKeys'
import SettingsProfile from './Profile'
import SettingsOrganization from './Organization'
import { useWorkspaceApiV1WorkspaceCurrentList } from '../../api/workspace.gen'

import { tokenAtom } from '../../store'
import SettingsJobs from './Jobs'
import SettingsCustomization from './Customization'
import { Auth0AppMetadata } from '../../types/appMetadata'
import TopHeader from '../../components/Layout/Header'
import SettingsParameters from './Parameters'

const navigation = [
    {
        name: 'Workspace',
        icon: FolderIcon,
        role: ['admin', 'editor', 'viewer'],
        children: [
            {
                name: 'Summary',
                page: 'summary',
                role: ['admin', 'editor', 'viewer'],
            },
            {
                name: 'Members',
                page: 'members',
                role: ['admin'],
            },
            {
                name: 'API Keys',
                page: 'apikeys',
                role: ['admin'],
            },
            {
                name: 'Customization',
                page: 'customization',
                role: ['admin'],
            },
        ],
    },
    // {
    //     name: 'Organization',
    //     icon: BuildingOfficeIcon,
    //     role: ['admin', 'editor', 'viewer'],
    //     children: [
    //         {
    //             name: 'Organization Info',
    //             page: 'org',
    //             role: ['admin', 'editor', 'viewer'],
    //         },
    //     ],
    // },
    {
        name: 'Debug',
        icon: BugAntIcon,
        role: ['admin', 'editor', 'viewer'],
        children: [
            {
                name: 'Jobs',
                page: 'jobs',
                role: ['admin', 'editor', 'viewer'],
            },
        ],
    },
    {
        name: 'Metadata',
        icon: AdjustmentsVerticalIcon,
        role: ['admin', 'editor', 'viewer'],
        children: [
            {
                name: 'Parameters',
                page: 'parameters',
                role: ['admin'],
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
                page: 'profile',
                role: ['admin', 'editor', 'viewer'],
            },
        ],
    },
]

export default function Settings() {
    const [selectedTab, setSelectedTab] = useState(<SettingsEntitlement />)
    const token = useAtomValue(tokenAtom)
    const decodedToken =
        token === undefined || token === ''
            ? undefined
            : jwtDecode<Auth0AppMetadata>(token)

    const { response: curWorkspace, isLoading } =
        useWorkspaceApiV1WorkspaceCurrentList()
    const workspace = useParams<{ ws: string }>().ws

    const [searchParams, setSearchParams] = useSearchParams()
    const currentSubPage = searchParams.get('sp')

    useEffect(() => {
        switch (currentSubPage) {
            case 'summary':
                setSelectedTab(<SettingsEntitlement />)
                break
            case 'members':
                setSelectedTab(<SettingsMembers />)
                break
            case 'apikeys':
                setSelectedTab(<SettingsWorkspaceAPIKeys />)
                break
            case 'org':
                setSelectedTab(<SettingsOrganization />)
                break
            case 'profile':
                setSelectedTab(<SettingsProfile />)
                break
            case 'jobs':
                setSelectedTab(<SettingsJobs />)
                break
            case 'parameters':
                setSelectedTab(<SettingsParameters />)
                break
            case 'customization':
                setSelectedTab(<SettingsCustomization />)
                break
            default:
                setSelectedTab(<SettingsEntitlement />)
                break
        }
    }, [currentSubPage])

    const getRole = () => {
        if (decodedToken) {
            if (curWorkspace?.id) {
                if (curWorkspace?.name === 'main') {
                    return 'admin'
                }
                if (decodedToken['https://app.kaytu.io/workspaceAccess']) {
                    return (
                        decodedToken['https://app.kaytu.io/workspaceAccess'][
                            curWorkspace.id
                        ] || 'viewer'
                    )
                }
            }
        }
        return 'viewer'
    }

    return (
        <>
            <TopHeader />
            <Flex alignItems="start" justifyContent="start">
                <Flex flexDirection="col" alignItems="start" className="w-fit">
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
                                            className="text-gray-800 dark:text-gray-100 font-semibold group gap-x-3 mb-2"
                                        >
                                            {item.icon && (
                                                <item.icon className="h-5 w-5 shrink-0" />
                                            )}
                                            {item.name}
                                        </Flex>
                                        {item.children.map((child: any) => (
                                            <Link
                                                to={`/ws/${workspace}/settings?sp=${child.page}`}
                                                className={`${
                                                    child.page ===
                                                        currentSubPage ||
                                                    (!currentSubPage &&
                                                        child.page ===
                                                            'summary')
                                                        ? 'bg-kaytu-100 dark:bg-kaytu-800  rounded-lg text-gray-800 dark:text-gray-100'
                                                        : 'text-gray-600 dark:text-gray-300'
                                                } group flex gap-x-3 py-2 px-8 font-medium`}
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
                <Flex
                    flexDirection="col"
                    justifyContent="center"
                    className="w-full"
                >
                    <Flex className="w-full h-full pl-6 max-w-7xl">
                        {selectedTab}
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}
