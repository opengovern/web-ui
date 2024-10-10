import React, { useState } from 'react'
import { Button, Card, Flex, Text, Title } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useAuthApiV1KeyDeleteDelete, useAuthApiV1KeysList } from '../../../api/auth.gen'
import Spinner from '../../../components/Spinner'
import DrawerPanel from '../../../components/DrawerPanel'
import CreateAPIKey from './CreateAPIKey'
import APIKeyRecord from './APIKeyRecord'
import Notification from '../../../components/Notification'
import TopHeader from '../../../components/Layout/Header'
import {
    Alert,
    Box,
    Header,
    Link,
    Modal,
    SpaceBetween,
    Table,
} from '@cloudscape-design/components'
import KButton from '@cloudscape-design/components/button'
import { TrashIcon } from '@heroicons/react/24/outline'
export default function SettingsWorkspaceAPIKeys() {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const [deletModalOpen, setDeleteModalOpen] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<any>()

   const {
       response: responseDelete,
       isLoading: deleteIsLoading,
       isExecuted: deleteIsExecuted,
       error,
       sendNow: callDelete,
   } = useAuthApiV1KeyDeleteDelete((selectedItem?.id || 0).toString(), {}, false)


    const { response, isLoading, sendNow } = useAuthApiV1KeysList()

    if (isLoading) {
        return (
            <Flex justifyContent="center" className="mt-56">
                <Spinner />
            </Flex>
        )
    }
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

    const openCreateMenu = () => {
        setDrawerOpen(true)
    }

    return isLoading ? (
        <Flex justifyContent="center" className="mt-56">
            <Spinner />
        </Flex>
    ) : (
        <>
            {/* <TopHeader /> */}

            <Modal
                visible={drawerOpen}
                header="Create new API Key"
                onDismiss={() => {
                    setDrawerOpen(false)
                }}
            >
                <CreateAPIKey
                    close={() => {
                        setDrawerOpen(false)
                        sendNow()
                    }}
                />
            </Modal>
            <Modal
                visible={deletModalOpen}
                header="Delete API Key"
                onDismiss={() => {
                    setDeleteModalOpen(false)
                }}
                footer={
                    <Flex className="gap-2 w-full" flexDirection="row">
                        <KButton
                            onClick={() => {
                                setDeleteModalOpen(false)
                            }}
                        >
                            Cancel
                        </KButton>
                        <KButton
                            onClick={() => {
                                callDelete()
                            }}
                            variant="primary"
                        >
                            Delete
                        </KButton>
                    </Flex>
                }
            >
                <>{`Are you sure you want to delete key ${selectedItem?.name}?`}</>
                {error && error !== '' && (
                    <>
                        <Alert header="failed" type="error">
                            Failed to delete API Key
                        </Alert>
                    </>
                )}
            </Modal>
            <Table
                className="mt-2"
                columnDefinitions={[
                    {
                        id: 'name',
                        header: 'Key Name',
                        cell: (item: any) => item.name,
                    },
                    {
                        id: 'role',
                        header: 'Role Name & Key',
                        cell: (item: any) => (
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
                        ),
                    },
                    {
                        id: 'created_by',
                        header: 'Created by',
                        cell: (item: any) => item.creatorUserID?.split("|")[1] || '',
                    },
                    {
                        id: 'create_date',
                        header: 'Create Date',
                        cell: (item: any) => (
                            <Flex
                                justifyContent="start"
                                className="truncate w-full"
                            >
                                {new Date(
                                    Date.parse(
                                        item.createdAt || Date.now().toString()
                                    )
                                ).toLocaleDateString()}
                            </Flex>
                        ),
                    },
                    {
                        id: 'action',
                        header: 'Actions',
                        cell: (item: any) => (
                            <>
                                <KButton
                                    loading={
                                        deleteIsLoading && deleteIsExecuted
                                    }
                                    disabled={
                                        deleteIsExecuted && deleteIsLoading
                                    }
                                    onClick={() => {
                                        setSelectedItem(item)
                                        setDeleteModalOpen(true)
                                    }}
                                >
                                    <TrashIcon
                                        className="h-5 w-5"
                                        color="rose"
                                    />
                                </KButton>
                            </>
                        ),
                    },
                ]}
                columnDisplay={[
                    { id: 'name', visible: true },
                    { id: 'role', visible: true },
                    { id: 'created_by', visible: true },
                    { id: 'created_date', visible: true },
                    { id: 'action', visible: true },

                    // { id: 'action', visible: true },
                ]}
                loading={isLoading}
                // @ts-ignore
                items={response ? response: []}
                empty={
                    <Box
                        margin={{ vertical: 'xs' }}
                        textAlign="center"
                        color="inherit"
                    >
                        <SpaceBetween size="m">
                            <b>No resources</b>
                            {/* <Button>Create resource</Button> */}
                        </SpaceBetween>
                    </Box>
                }
                header={
                    <Header
                        actions={
                            <>
                                <KButton
                                    className="float-right"
                                    variant='primary'
                                    onClick={() => {
                                        openCreateMenu()
                                    }}
                                >
                                    Create API Key
                                </KButton>
                            </>
                        }
                        className="w-full"
                    >
                        API Keys{' '}
                    </Header>
                }
            />
            {/* <Card key="summary">
                <Flex className="mb-6">
                    <Title className="font-semibold">API Keys</Title>
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
                    <Text className="w-1/4">Key Name</Text>
                    <Text className="w-1/4">Role Name & Key</Text>
                    <Text className="w-1/4">Created by</Text>
                    <Text className="w-1/4">Create Date</Text>
                </Flex>
                {response?.map((item) => (
                    <APIKeyRecord
                        item={item}
                        refresh={() => {
                            sendNow()
                        }}
                    />
                ))}
            </Card> */}
        </>
    )
}
