import React, { useState } from 'react'
import { Button, Card, Flex, Text, Title } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useAuthApiV1KeysList } from '../../../api/auth.gen'
import Spinner from '../../../components/Spinner'
import DrawerPanel from '../../../components/DrawerPanel'
import CreateAPIKey from './CreateAPIKey'
import APIKeyRecord from './APIKeyRecord'
import Notification from '../../../components/Notification'

export default function SettingsWorkspaceAPIKeys() {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const [notification, setNotification] = useState<string>('')

    const { response, isLoading, sendNow } = useAuthApiV1KeysList()

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

    return isLoading ? (
        <Flex justifyContent="center" className="mt-56">
            <Spinner />
        </Flex>
    ) : (
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
