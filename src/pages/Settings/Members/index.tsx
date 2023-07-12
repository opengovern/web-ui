import { useState } from 'react'
import { Button, Card, Flex, List, ListItem, Text, Title } from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useAuthApiV1WorkspaceRoleBindingsList } from '../../../api/auth.gen'
import Spinner from '../../../components/Spinner'
import DrawerPanel from '../../../components/DrawerPanel'
import MemberDetails from './MemberDetails'
import MemberInvite from './MemberInvite'
import Notification from '../../../components/Notification'

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

export default function SettingsMembers() {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const [drawerParam, setDrawerParam] = useState<string>('')
    const [notification, setNotification] = useState<string>('')

    const {
        response,
        isLoading,
        sendNow: refreshRoleBindings,
    } = useAuthApiV1WorkspaceRoleBindingsList()

    const userDetail = (userId: string) => {
        setNotification('')
        setDrawerParam(userId)
        setDrawerOpen(true)
    }
    const openInviteMember = () => {
        setNotification('')
        setDrawerParam('openInviteMember')
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
                title={
                    drawerParam === 'openInviteMember'
                        ? 'Invite New Members'
                        : response?.find((item) => item.userId === drawerParam)
                              ?.userName
                }
                onClose={() => {
                    setDrawerOpen(false)
                }}
            >
                {drawerParam === 'openInviteMember' ? (
                    <MemberInvite
                        close={(refresh: boolean) => {
                            setDrawerOpen(false)
                            if (refresh) {
                                refreshRoleBindings()
                            }
                        }}
                        notification={setNotification}
                    />
                ) : (
                    <MemberDetails
                        user={response?.find(
                            (item) => item.userId === drawerParam
                        )}
                        close={() => {
                            setDrawerOpen(false)
                            refreshRoleBindings()
                        }}
                        notification={setNotification}
                    />
                )}
            </DrawerPanel>
            <Card key="summary">
                <Flex>
                    <Title className="flex-auto">All members</Title>
                    <Button
                        className="float-right"
                        onClick={() => {
                            openInviteMember()
                        }}
                    >
                        Invite member
                    </Button>
                </Flex>
                <List className="mt-4">
                    {response?.map((item) => (
                        <ListItem
                            key={item.userName}
                            onClick={() => {
                                if (item.userId) {
                                    userDetail(item.userId)
                                }
                            }}
                            className="cursor-pointer"
                        >
                            <Flex
                                justifyContent="start"
                                className="truncate space-x-4"
                            >
                                <div className="truncate p-1">
                                    <Text className="truncate font-medium text-gray-800">
                                        {item.userName}
                                    </Text>
                                    <Text className="truncate text-xs text-gray-400">
                                        {item.email}
                                    </Text>
                                </div>
                            </Flex>
                            <Text>{fixRole(item.roleName || '')}</Text>
                            <ChevronRightIcon className="h-6 w-6 shrink-0" />
                        </ListItem>
                    ))}
                </List>
            </Card>
        </>
    )
}
