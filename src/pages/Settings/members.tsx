import React, { useState } from 'react'
import {
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
import { useAuthApiV1WorkspaceRoleBindingsList } from '../../api/auth.gen'
import Spinner from '../../components/Spinner'
import DrawerPanel from '../../components/DrawerPanel'
import MemberDetails from './member_details'
import MemberInvite from './member_invite'

const SettingsMembers: React.FC<any> = () => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const [drawerParam, setDrawerParam] = useState<string>('')
    const {
        response,
        isLoading,
        sendNow: refreshRoleBindings,
    } = useAuthApiV1WorkspaceRoleBindingsList()
    if (isLoading) {
        return (
            <Flex justifyContent="center" className="mt-56">
                <Spinner />
            </Flex>
        )
    }

    const userDetail = (userId: string) => {
        setDrawerParam(userId)
        setDrawerOpen(true)
    }

    const openInviteMember = () => {
        setDrawerParam('openInviteMember')
        setDrawerOpen(true)
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

    return (
        <>
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
                    />
                )}
            </DrawerPanel>
            <Card key="summary">
                <div className="flex">
                    <Title className="flex-auto">All members</Title>
                    <Button
                        className="float-right"
                        onClick={() => {
                            openInviteMember()
                        }}
                    >
                        Invite member
                    </Button>
                </div>
                <List className="mt-4">
                    {response?.map((item) => (
                        <ListItem key={item.userName}>
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
                            <ChevronRightIcon
                                cursor="pointer"
                                onClick={() => {
                                    if (item.userId) {
                                        userDetail(item.userId)
                                    }
                                }}
                                className="h-6 w-6 shrink-0"
                            />
                        </ListItem>
                    ))}
                </List>
            </Card>
        </>
    )
}

export default SettingsMembers
