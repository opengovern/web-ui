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
    Text,
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
        <List className="mt-4">
            <ListItem key="lb" />
            <ListItem key="lb">
                <Flex justifyContent="start" className="truncate space-x-4">
                    <Text className="font-medium text-gray-800">
                        Properties
                    </Text>
                </Flex>
            </ListItem>
            <ListItem key="lb">
                <Flex justifyContent="start" className="truncate space-x-4">
                    <Text className="font-medium text-gray-800">
                        API Key Name
                    </Text>
                    <input type="input" className="font-medium text-gray-800" />
                </Flex>
            </ListItem>
            <ListItem key="lb">
                <Flex justifyContent="end" className="truncate space-x-4">
                    <Button>Create API Key</Button>
                    <Button>Cancel</Button>
                </Flex>
            </ListItem>
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
