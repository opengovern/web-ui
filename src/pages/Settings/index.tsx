import React from 'react'
import { Flex, Metric } from '@tremor/react'
import {
    BuildingOfficeIcon,
    HomeIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { Link, useParams } from 'react-router-dom'
import LoggedInLayout from '../../components/LoggedInLayout'
import SettingsMetadata from './Metadata'
import SettingsMembers from './Members'
import SettingsWorkspaceAPIKeys from './APIKeys'
import SettingsProfile from './Profile'
import SettingsOrganization from './Organization'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const navigation = [
    {
        name: 'Workspace',
        page: '',
        icon: HomeIcon,
    },
    {
        name: 'Metadata',
        page: 'metadata',
        component: <SettingsMetadata />,
    },
    {
        name: 'Members',
        page: 'members',
        component: <SettingsMembers />,
    },
    {
        name: 'API Keys',
        page: 'apikeys',
        component: <SettingsWorkspaceAPIKeys />,
    },
    {
        name: 'Organization',
        page: '',
        icon: BuildingOfficeIcon,
    },
    {
        name: 'Organization Info',
        page: 'org',
        component: <SettingsOrganization />,
    },
    {
        name: 'Personal',
        page: '',
        icon: UserIcon,
    },
    {
        name: 'Profile',
        page: 'profile',
        component: <SettingsProfile />,
    },
]

const Settings: React.FC<any> = () => {
    const workspace = useParams<{ ws: string }>().ws
    const currentSubPage = useParams<{ settingsPage: string }>().settingsPage

    return (
        <LoggedInLayout currentPage="settings">
            <Flex flexDirection="row" className="h-full">
                <aside className="h-full w-64 border-r border-gray-200">
                    <Flex
                        flexDirection="row"
                        className="inset-y-0 h-full w-full"
                    >
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="grow h-full gap-y-5 overflow-y-auto overflow-x-hidden px-6"
                        >
                            <Metric className="text-gray-800">Settings</Metric>
                            <nav className="flex flex-1 flex-col w-52">
                                <ul className="flex flex-col gap-y-7">
                                    <li>
                                        <ul className="-mx-2 space-y-1.5">
                                            {navigation.map((item) => (
                                                <li key={item.name}>
                                                    {item.page === '' ? (
                                                        <div
                                                            className={classNames(
                                                                'text-gray-400 font-semibold group flex gap-x-3 p-1'
                                                            )}
                                                        >
                                                            {item.icon && (
                                                                <item.icon
                                                                    className="h-6 w-6 shrink-0"
                                                                    aria-hidden="true"
                                                                />
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
                                                                    ? 'bg-blue-100 rounded-lg'
                                                                    : '',
                                                                'text-gray-600 font-semibold group flex gap-x-3 py-2 px-10'
                                                            )}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </Flex>
                    </Flex>
                </aside>
                <main className="w-full h-full pl-6">
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
