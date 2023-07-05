import React, { useEffect, useState } from 'react'
import {
    Button,
    Card,
    Flex,
    List,
    ListItem,
    Subtitle,
    Text,
    TextInput,
    Title,
} from '@tremor/react'
import { DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/24/solid'
import clipboardCopy from 'clipboard-copy'
import {
    useAuthApiV1KeyCreateCreate,
    useAuthApiV1KeyDeleteDelete,
    useAuthApiV1KeysList,
    useAuthApiV1UserDetail,
} from '../../../api/auth.gen'
import Spinner from '../../../components/Spinner'
import DrawerPanel from '../../../components/DrawerPanel'
import { GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey } from '../../../api/api'
import InformationModal from '../../../components/Modal/InformationModal'
import ConfirmModal from '../../../components/Modal/ConfirmModal'
import Notification from '../../../components/Notification'

interface CreateAPIKeyProps {
    close: () => void
}

const CreateAPIKey: React.FC<CreateAPIKeyProps> = ({ close }) => {
    const [apiKeyName, setApiKeyName] = useState<string>('')
    const [role, setRole] = useState<string>('viewer')
    const [roleValue, setRoleValue] = useState<
        'admin' | 'editor' | 'viewer' | undefined
    >()

    const {
        response,
        isLoading,
        isExecuted,
        error,
        sendNow: callCreate,
    } = useAuthApiV1KeyCreateCreate(
        { name: apiKeyName, roleName: roleValue },
        {},
        false
    )

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

    useEffect(() => {
        if (role === 'viewer' || role === 'editor' || role === 'admin') {
            setRoleValue(role)
        }
    }, [role])

    return (
        <Flex flexDirection="col" justifyContent="between" className="h-full">
            <InformationModal
                title={error === undefined ? 'Successful' : 'Failed'}
                description={
                    error === undefined ? (
                        <Flex flexDirection="col" justifyContent="start">
                            API key created, copy the key and keep it safe:
                            <Card className="w-full">
                                <Flex
                                    flexDirection="row"
                                    justifyContent="between"
                                >
                                    <div className="w-full break-all">
                                        {response?.token}
                                    </div>
                                    <DocumentDuplicateIcon
                                        className="h-5 w-5 text-blue-600 cursor-pointer"
                                        onClick={() =>
                                            clipboardCopy(response?.token || '')
                                        }
                                    />
                                </Flex>
                            </Card>
                        </Flex>
                    ) : (
                        `Failed to create the API Key`
                    )
                }
                successful={error === undefined}
                open={!isLoading && isExecuted}
                okButton="Done"
                onClose={() => {
                    close()
                }}
            />
            <List className="mt-4 h-full">
                <ListItem key="lb">
                    <Flex justifyContent="start" className="truncate space-x-4">
                        <Subtitle className="text-gray-900 py-2">
                            Properties
                        </Subtitle>
                    </Flex>
                </ListItem>
                <ListItem key="lb">
                    <Flex
                        justifyContent="between"
                        className="truncate space-x-4"
                    >
                        <Text className="w-1/3 text-base font-medium text-gray-800 py-2">
                            API Key Name *
                        </Text>
                        <TextInput
                            className="w-2/3"
                            onChange={(p) => {
                                setApiKeyName(p.target.value)
                            }}
                        />
                    </Flex>
                </ListItem>
                <ListItem key="lb">
                    <Flex
                        justifyContent="between"
                        alignItems="start"
                        className="truncate space-x-4"
                    >
                        <Text className="w-1/3 text-base font-medium text-gray-800 py-2">
                            Role *
                        </Text>

                        <div className="w-2/3 space-y-5 sm:mt-0">
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
            </List>
            <Flex justifyContent="end" className="truncate p-1 space-x-4">
                <Button
                    variant="secondary"
                    onClick={() => {
                        close()
                    }}
                >
                    Cancel
                </Button>
                <Button
                    disabled={apiKeyName.length === 0}
                    onClick={() => {
                        callCreate()
                    }}
                    loading={isExecuted && isLoading}
                >
                    Create API Key
                </Button>
            </Flex>
        </Flex>
    )
}

interface APIKeyRecordProps {
    item: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey
    refresh: () => void
    showNotification: (text: string) => void
}

const APIKeyRecord: React.FC<APIKeyRecordProps> = ({
    item,
    refresh,
    showNotification,
}) => {
    const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false)
    const { response, isLoading } = useAuthApiV1UserDetail(
        item.creatorUserID || ''
    )
    const {
        response: responseDelete,
        isLoading: deleteIsLoading,
        isExecuted: deleteIsExecuted,
        error,
        sendNow: callDelete,
    } = useAuthApiV1KeyDeleteDelete((item.id || 0).toString(), {}, false)

    const fixRole = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Admin'
            case 'editor':
                return 'Editor'
            case 'viewer':
                return 'Viewer'
            default:
                return role
        }
    }

    useEffect(() => {
        if (!deleteIsLoading && deleteIsExecuted) {
            showNotification('API Key successfully deleted')
            refresh()
        }
    }, [deleteIsLoading])

    return (
        <>
            <ConfirmModal
                title="Delete API Key"
                description={`Are you sure you want to delete key ${item.name}?`}
                open={deleteConfirmation}
                yesButton="Delete"
                noButton="Cancel"
                onConfirm={callDelete}
                onClose={() => setDeleteConfirmation(false)}
            />
            <InformationModal
                title="Delete Failed"
                description="Failed to delete API Key"
                successful={false}
                open={error !== undefined}
            />
            <Flex
                justifyContent="start"
                flexDirection="row"
                className="mb-4 py-2 border-b"
            >
                <Text className="text-sm mt-1 w-1/4">{item.name}</Text>
                <Flex
                    alignItems="start"
                    justifyContent="start"
                    flexDirection="col"
                    className="w-1/4"
                >
                    <Text className="text-sm font-medium">
                        {fixRole(item.roleName || '')}
                    </Text>
                    <Text className="text-xs">
                        {item.maskedKey?.replace('...', '*******')}
                    </Text>
                </Flex>

                {isLoading ? (
                    <Flex justifyContent="start" className="w-1/4">
                        <Spinner />
                    </Flex>
                ) : (
                    <Text className="text-base w-1/4">
                        {response?.userName}
                    </Text>
                )}

                <Flex
                    justifyContent="between"
                    flexDirection="row"
                    className="w-1/4"
                >
                    <Text className="text-base">
                        {new Date(
                            Date.parse(item.createdAt || Date.now().toString())
                        ).toLocaleDateString()}
                    </Text>
                    {deleteIsLoading && deleteIsExecuted ? (
                        <Spinner />
                    ) : (
                        <TrashIcon
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => {
                                setDeleteConfirmation(true)
                            }}
                        />
                    )}
                </Flex>
            </Flex>
        </>
    )
}

export default function SettingsWorkspaceAPIKeys() {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const { response, isLoading, sendNow } = useAuthApiV1KeysList()
    const [notification, setNotification] = useState<string>('')

    if (isLoading) {
        return (
            <Flex justifyContent="center" className="mt-56">
                <Spinner />
            </Flex>
        )
    }

    const openCreateMenu = () => {
        setNotification('')
        setDrawerOpen(true)
    }

    return (
        <>
            {notification && <Notification text={notification} />}

            <DrawerPanel
                open={drawerOpen}
                title="Create new API Key"
                onClose={() => {
                    setDrawerOpen(false)
                }}
            >
                <CreateAPIKey
                    close={() => {
                        setDrawerOpen(false)
                        sendNow()
                    }}
                />
            </DrawerPanel>
            <Card key="summary">
                <Flex className="mb-6">
                    <Title className="flex-auto">API Keys</Title>
                    <Button
                        className="float-right"
                        onClick={() => {
                            openCreateMenu()
                        }}
                        icon={PlusIcon}
                    >
                        Create API Key
                    </Button>
                </Flex>
                <Flex
                    justifyContent="start"
                    flexDirection="row"
                    className="mb-6"
                >
                    <Text className="text-xs w-1/4">Key Name</Text>
                    <Text className="text-xs w-1/4">Role Name & Key</Text>
                    <Text className="text-xs w-1/4">Created by</Text>
                    <Text className="text-xs w-1/4">Create Date</Text>
                </Flex>
                {response?.map((item) => (
                    <APIKeyRecord
                        item={item}
                        refresh={() => {
                            sendNow()
                        }}
                        showNotification={setNotification}
                    />
                ))}
            </Card>
        </>
    )
}
