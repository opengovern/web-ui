import { useEffect, useState } from 'react'
import {
    Badge,
    Button,
    Flex,
    List,
    ListItem,
    MultiSelect,
    MultiSelectItem,
    Text,
    TextInput,
} from '@tremor/react'
import { ChevronDoubleDownIcon, TrashIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import { useSetAtom } from 'jotai'
import {
    useAuthApiV1UserRoleBindingDelete,
    useAuthApiV1UserRoleBindingUpdate,
} from '../../../../api/auth.gen'
import { GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding } from '../../../../api/api'
import ConfirmModal from '../../../../components/Modal/ConfirmModal'
import { notificationAtom } from '../../../../store'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'
import {
    useIntegrationApiV1ConnectionsDelete,
    useIntegrationApiV1ConnectionsSummariesList,
} from '../../../../api/integration.gen'
import KButton from '@cloudscape-design/components/button'
import { Modal, Toggle } from '@cloudscape-design/components'

interface IMemberDetails {
    user?: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding
    close: () => void
}

export default function MemberDetails({ user, close }: IMemberDetails) {
    const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false)
    const [role, setRole] = useState<string>(user?.role_name || 'viewer')
    const [isActive, setIsActive] = useState<boolean>(user?.is_active == true ? true :false)

    const [password, setPassword] = useState<string>('')
    const [roleValue, setRoleValue] = useState<'viewer' | 'editor' | 'admin'>(
        'viewer'
    )
    const [scopedConnectionIDs, setScopedConnectionIDs] = useState<string[]>(
        user?.scopedConnectionIDs || []
    )
    const setNotification = useSetAtom(notificationAtom)

    const {
        isExecuted,
        isLoading,
        sendNow: updateRole,
    } = useAuthApiV1UserRoleBindingUpdate(
        {
            email_address: user?.email || '',
            role: roleValue,
            is_active: isActive
        },
        {},
        false
    )

    const {
        isExecuted: deleteExecuted,
        isLoading: deleteLoading,
        sendNow: deleteRole,
    } = useAuthApiV1UserRoleBindingDelete(user?.id || 0, {}, false)

    useEffect(() => {
        if (role === 'viewer' || role === 'editor' || role === 'admin') {
            setRoleValue(role)
        }
    }, [role])

    useEffect(() => {
        if ((isExecuted && !isLoading) || (deleteExecuted && !deleteLoading)) {
            if (isExecuted) {
                setNotification({
                    text: 'User successfully updated',
                    type: 'success',
                })
            } else {
                setNotification({
                    text: 'User successfully deleted',
                    type: 'success',
                })
            }
            close()
        }
    }, [isLoading, deleteLoading])

    if (user === undefined) {
        return <div />
    }

    const lastActivity = () => {
        if (user.last_activity === undefined) {
            return 'Never'
        }

        return dateTimeDisplay(user.last_activity)
    }

    const items = [
        {
            title: 'Email',
            value: user.email,
        },
        {
            title: 'Member Since',
            value: dateTimeDisplay(user.created_at || Date.now().toString()),
        },
        {
            title: 'Last Activity',
            value: lastActivity(),
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

    const multiSelectCount = () => {
        return (
            <div className="bg-gray-200 w-9 h-9 text-center pt-2 -ml-3 rounded-l-lg">
                {scopedConnectionIDs.length}
            </div>
        )
    }

    return (
        <>
            <Modal
                visible={deleteConfirmation}
                header="Delete user"
                footer={
                    <Flex justifyContent="end" className="gap-2">
                        <KButton onClick={() => setDeleteConfirmation(false)}>
                            Cancel
                        </KButton>
                        <KButton
                            loading={deleteExecuted && deleteLoading}
                            disabled={isExecuted && isLoading}
                            onClick={deleteRole}
                            variant="primary"
                        >
                            Delete
                        </KButton>
                    </Flex>
                }
                onDismiss={() => setDeleteConfirmation(false)}
            >
                <>{`Are you sure you want to delete ${user.userName}?`}</>
            </Modal>
            {/* <ConfirmModal
                title="Delete user"
                description={`Are you sure you want to delete ${user.userName}?`}
                open={deleteConfirmation}
                yesButton="Delete"
                noButton="Cancel"
                onConfirm={deleteRole}
                onClose={() => setDeleteConfirmation(false)}
            /> */}
            <Flex
                flexDirection="col"
                justifyContent="between"
                className="h-full"
            >
                <List className="pt-4">
                    <ListItem key="title" className="py-4">
                        <Flex
                            justifyContent="start"
                            className="truncate space-x-4"
                        >
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
                                    className="truncate space-x-4 w-fit"
                                >
                                    <Text className="font-medium text-gray-500">
                                        {item.title}
                                    </Text>
                                </Flex>
                                <Text className="text-gray-900">
                                    {item.value}
                                </Text>
                            </ListItem>
                        )
                    })}
                    <ListItem key={'is_active'} className="py-4">
                        <Flex
                            justifyContent="start"
                            className="truncate space-x-4 w-fit"
                        >
                            <Text className="font-medium text-gray-500">
                                User Status
                            </Text>
                        </Flex>
                        <div className="relative flex items-start">
                            <Toggle
                                onChange={({ detail }) =>
                                    setIsActive(detail.checked)
                                }
                                checked={isActive}
                            >
                                {isActive ? 'Active' : 'Inactive'}
                            </Toggle>
                        </div>
                    </ListItem>
                    {/* <ListItem key="password">
                        <Flex
                            justifyContent="between"
                            className="truncate space-x-4 py-2"
                        >
                            <Text className="font-medium text-gray-800">
                                Password
                                <span className="text-red-600 font-semibold">
                                    *
                                </span>
                            </Text>
                            <TextInput
                                type="password"
                                placeholder="password"
                                className="font-medium w-1/2 text-gray-800"
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                            />
                        </Flex>
                    </ListItem> */}
                    <ListItem key="item" className="py-4">
                        <Flex
                            justifyContent="between"
                            alignItems="start"
                            className="truncate space-x-4"
                        >
                            <Text className="font-medium text-gray-500">
                                Role
                            </Text>

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
                                                    checked={
                                                        item.value === role
                                                    }
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
                    {/*
                    <ListItem key="item" className="py-4">
                        <Flex
                            justifyContent="between"
                            alignItems="start"
                            className="truncate space-x-4"
                        >
                            <Text className="font-medium text-gray-500">
                                Scoped account access
                            </Text>

                            <Flex
                                flexDirection="col"
                                className="w-2/3"
                                justifyContent="start"
                                alignItems="end"
                            >
                                <MultiSelect
                                    disabled={isConnectionListLoading}
                                    className="w-96 absolute"
                                    value={scopedConnectionIDs}
                                    onValueChange={(value) =>
                                        setScopedConnectionIDs(value)
                                    }
                                    placeholder="All connections"
                                    icon={multiSelectCount}
                                >
                                    {connectionList?.connections?.map(
                                        (connection) => (
                                            <MultiSelectItem
                                                value={connection.id || ''}
                                            >
                                                <Flex
                                                    justifyContent="end"
                                                    className="truncate w-full"
                                                >
                                                    <div className="truncate p-1">
                                                        <Text className="truncate font-medium text-gray-800">
                                                            {
                                                                connection.providerConnectionID
                                                            }
                                                        </Text>
                                                        <Text className="truncate text-xs text-gray-400">
                                                            {
                                                                connection.providerConnectionName
                                                            }
                                                        </Text>
                                                    </div>
                                                </Flex>
                                            </MultiSelectItem>
                                        )
                                    )}
                                </MultiSelect>
                            </Flex>
                        </Flex>
                    </ListItem>
                    */}
                </List>
                <Flex justifyContent="end" className="truncate space-x-4">
                    <KButton onClick={() => setDeleteConfirmation(true)}>
                        <TrashIcon className="h-5 w-5" color="rose" />
                    </KButton>
                    <KButton
                        loading={isExecuted && isLoading}
                        disabled={deleteExecuted && deleteLoading}
                        onClick={() => updateRole()}
                        variant="primary"
                    >
                        Update Changes
                    </KButton>
                </Flex>
            </Flex>
        </>
    )
}
