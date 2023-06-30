import React, { useEffect, useState } from 'react'
import {
    Badge,
    Bold,
    Button,
    Card,
    Flex,
    List,
    ListItem,
    Text,
    Title,
} from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { RadioGroup } from '@headlessui/react'
import {
    useAuthApiV1UserRoleBindingDelete,
    useAuthApiV1UserRoleBindingUpdate,
    useAuthApiV1WorkspaceRoleBindingsList,
} from '../../api/auth.gen'
import Spinner from '../../components/Spinner'
import DrawerPanel from '../../components/DrawerPanel'
import { GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding } from '../../api/api'
import ConfirmModal from '../../components/Modal/ConfirmModal'

interface IMemberDetails {
    user?: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding
    close: () => void
}
const MemberDetails: React.FC<IMemberDetails> = ({ user, close }) => {
    const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false)
    const [role, setRole] = useState<string>(user?.roleName || 'viewer')
    const [roleValue, setRoleValue] = useState<'viewer' | 'editor' | 'admin'>(
        'viewer'
    )

    const {
        isExecuted,
        isLoading,
        sendNow: updateRole,
    } = useAuthApiV1UserRoleBindingUpdate(
        { userId: user?.userId || '', roleName: roleValue },
        {},
        false
    )

    const {
        isExecuted: deleteExecuted,
        isLoading: deleteLoading,
        sendNow: deleteRole,
    } = useAuthApiV1UserRoleBindingDelete(
        { userId: user?.userId || '' },
        {},
        false
    )

    const loading =
        (isExecuted && isLoading) || (deleteExecuted && deleteLoading)

    useEffect(() => {
        if (role === 'viewer' || role === 'editor' || role === 'admin') {
            setRoleValue(role)
        }
    }, [role])

    useEffect(() => {
        if ((isExecuted && !isLoading) || (deleteExecuted && !deleteLoading)) {
            close()
        }
    }, [isLoading, deleteLoading])

    if (user === undefined) {
        return <div />
    }

    const items = [
        {
            title: 'Email',
            value: user.email,
        },
        {
            title: 'Member Since',
            value: new Date(
                Date.parse(user.createdAt || Date.now().toString())
            ).toLocaleDateString('en-US'),
        },
        {
            title: 'Last Activity',
            value: new Date(
                Date.parse(user.lastActivity || Date.now().toString())
            ).toLocaleDateString('en-US'),
        },
        {
            title: 'Status',
            value: <Badge>{user.status}</Badge>,
        },
    ]

    const roleItems = [
        {
            value: 'admin',
            title: 'Admin',
            description: 'Have full access',
        },
        {
            value: 'editor',
            title: 'Editor',
            description: 'Can view, edit and delete data',
        },
        {
            value: 'viewer',
            title: 'Viewer',
            description: 'Member can only view the data',
        },
    ]

    return (
        <>
            <ConfirmModal
                title={`Are you sure you want to delete ${user.userName}?`}
                open={deleteConfirmation}
                onConfirm={deleteRole}
                onClose={() => setDeleteConfirmation(false)}
            />
            <List className="mt-4 h-full">
                <ListItem key="title" className="py-4">
                    <Flex justifyContent="start" className="truncate space-x-4">
                        <Text className="font-medium text-gray-800">
                            Member Info
                        </Text>
                    </Flex>
                </ListItem>
                {items.map((item) => {
                    return (
                        <ListItem key={item.title} className="py-4">
                            <Flex
                                justifyContent="start"
                                className="truncate space-x-4"
                            >
                                <Text className="font-medium text-gray-500">
                                    {item.title}
                                </Text>
                            </Flex>
                            <Text className="text-gray-900">{item.value}</Text>
                        </ListItem>
                    )
                })}
                <ListItem key="item" className="py-4">
                    <Flex
                        justifyContent="between"
                        alignItems="start"
                        className="truncate space-x-4"
                    >
                        <Text className="font-medium text-gray-500">Role</Text>

                        <div className="space-y-5 sm:mt-0">
                            {roleItems.map((item) => {
                                return (
                                    <div className="relative flex items-start">
                                        <div className="absolute flex h-6 items-center">
                                            <input
                                                name="roles"
                                                type="radio"
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                onClick={() => {
                                                    setRole(item.value)
                                                }}
                                                checked={item.value === role}
                                            />
                                        </div>
                                        <div className="pl-7 text-sm leading-6">
                                            <div className="font-medium text-gray-900">
                                                {item.title}
                                            </div>
                                            <p className="text-gray-500">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Flex>
                </ListItem>
                <ListItem key="buttons">
                    <Flex justifyContent="end" className="truncate space-x-4">
                        <Button
                            loading={loading}
                            onClick={() => setDeleteConfirmation(true)}
                            variant="secondary"
                        >
                            Delete
                        </Button>
                        <Button loading={loading} onClick={() => updateRole()}>
                            Update Changes
                        </Button>
                    </Flex>
                </ListItem>
            </List>
        </>
    )
}

export default MemberDetails
