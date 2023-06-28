import React, { useState } from 'react'
import {
    Bold,
    Button,
    Card,
    Col,
    Flex,
    Grid,
    List,
    ListItem,
    Subtitle,
    Text,
    TextInput,
    Title,
} from '@tremor/react'
import { ChevronRightIcon, TrashIcon } from '@heroicons/react/24/outline'
import {
    useAuthApiV1KeysList,
    useAuthApiV1UserDetail,
    useAuthApiV1WorkspaceRoleBindingsList,
} from '../../api/auth.gen'
import Spinner from '../../components/Spinner'
import DrawerPanel from '../../components/DrawerPanel'
import { GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey } from '../../api/api'

const CreateAPIKey: React.FC<any> = () => {
    return (
        <List className="mt-4 h-full">
            <ListItem key="lb">
                <Flex justifyContent="start" className="truncate space-x-4">
                    <Subtitle className="text-gray-900 py-2">
                        Properties
                    </Subtitle>
                </Flex>
            </ListItem>
            <ListItem key="lb">
                <Flex justifyContent="between" className="truncate space-x-4">
                    <Text className="w-1/3 text-base font-medium text-gray-800 py-2">
                        API Key Name*
                    </Text>
                    <TextInput className="w-2/3" />
                </Flex>
            </ListItem>
            <ListItem key="lb">
                <Flex
                    justifyContent="between"
                    alignItems="start"
                    className="truncate space-x-4"
                >
                    <Text className="w-1/3 text-base font-medium text-gray-800 py-2">
                        Role*
                    </Text>

                    <div className="w-2/3 space-y-5 sm:mt-0">
                        <div className="relative flex items-start">
                            <div className="absolute flex h-6 items-center">
                                <input
                                    id="public-access"
                                    name="privacy"
                                    aria-describedby="public-access-description"
                                    type="radio"
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    defaultChecked
                                />
                            </div>
                            <div className="pl-7 text-sm leading-6">
                                <div className="font-medium text-gray-900">
                                    Admin
                                </div>
                                <p
                                    id="public-access-description"
                                    className="text-gray-500"
                                >
                                    Have full access
                                </p>
                            </div>
                        </div>
                        <div className="relative flex items-start">
                            <div className="absolute flex h-6 items-center">
                                <input
                                    id="restricted-access"
                                    name="privacy"
                                    aria-describedby="restricted-access-description"
                                    type="radio"
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                            </div>
                            <div className="pl-7 text-sm leading-6">
                                <div className="font-medium text-gray-900">
                                    Editor
                                </div>
                                <p
                                    id="restricted-access-description"
                                    className="text-gray-500"
                                >
                                    Can view, edit and delete data
                                </p>
                            </div>
                        </div>
                        <div className="relative flex items-start">
                            <div className="absolute flex h-6 items-center">
                                <input
                                    id="private-access"
                                    name="privacy"
                                    aria-describedby="private-access-description"
                                    type="radio"
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                            </div>
                            <div className="pl-7 text-sm leading-6">
                                <div className="font-medium text-gray-900">
                                    Viewer
                                </div>
                                <p
                                    id="private-access-description"
                                    className="text-gray-500"
                                >
                                    Member can only view the data
                                </p>
                            </div>
                        </div>
                    </div>
                </Flex>
            </ListItem>

            <Button variant="secondary">Cancel</Button>
            <Button>Create API Key</Button>
        </List>
    )
}

interface APIKeyRecordProps {
    item: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey
}
const APIKeyRecord: React.FC<APIKeyRecordProps> = ({ item }) => {
    const { response, isLoading } = useAuthApiV1UserDetail(
        item.creatorUserID || ''
    )

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

    return (
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
                <Text className="text-xs">{item.maskedKey}</Text>
            </Flex>

            {isLoading ? (
                <Flex justifyContent="start" className="w-1/4">
                    <Spinner />
                </Flex>
            ) : (
                <Text className="text-base w-1/4">{response?.userName}</Text>
            )}

            <Flex
                justifyContent="between"
                flexDirection="row"
                className="w-1/4"
            >
                <Text className="text-base">
                    {new Date(
                        Date.parse(item.createdAt || Date.now().toString())
                    ).toLocaleDateString('en-US')}
                </Text>
                <TrashIcon className="w-4 h-4" />
            </Flex>
        </Flex>
    )
}

const SettingsWorkspaceAPIKeys: React.FC<any> = () => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const { response, isLoading } = useAuthApiV1KeysList()

    if (isLoading) {
        return (
            <Flex justifyContent="center" className="mt-56">
                <Spinner />
            </Flex>
        )
    }

    const openCreateMenu = () => {
        setDrawerOpen(true)
    }

    return (
        <>
            <DrawerPanel
                open={drawerOpen}
                title="Create new API Key"
                onClose={() => {
                    setDrawerOpen(false)
                }}
            >
                <CreateAPIKey />
            </DrawerPanel>
            <Card key="summary" className="top-10">
                <div className="flex mb-6">
                    <Title className="flex-auto">API Keys</Title>
                    <Button
                        className="float-right"
                        onClick={() => {
                            openCreateMenu()
                        }}
                    >
                        Create API Key
                    </Button>
                </div>
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
                    <APIKeyRecord item={item} />
                ))}
            </Card>
        </>
    )
}

export default SettingsWorkspaceAPIKeys
