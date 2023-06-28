import React, { useState } from 'react'
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
import { useAuthApiV1WorkspaceRoleBindingsList } from '../../api/auth.gen'
import Spinner from '../../components/Spinner'
import DrawerPanel from '../../components/DrawerPanel'
import { GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding } from '../../api/api'

interface MemberDetailsProps {
    user?: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding
}
const MemberDetails: React.FC<MemberDetailsProps> = ({ user }) => {
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

    return (
        <List className="mt-4">
            <ListItem key="lb" />
            <ListItem key="lb">
                <Flex justifyContent="start" className="truncate space-x-4">
                    <Text className="font-medium text-gray-800">
                        Member Info
                    </Text>
                </Flex>
            </ListItem>
            {items.map((item) => {
                return (
                    <ListItem key="lb">
                        <Flex
                            justifyContent="start"
                            className="truncate space-x-4"
                        >
                            <Text className="font-medium text-gray-800">
                                {item.title}
                            </Text>
                        </Flex>
                        <Text>{item.value}</Text>
                    </ListItem>
                )
            })}
            <ListItem key="lb">
                <Flex
                    justifyContent="between"
                    alignItems="start"
                    className="truncate space-x-4"
                >
                    <Text className="font-medium text-gray-800">Role</Text>

                    <div className="space-y-5 sm:mt-0">
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
            <ListItem key="lb">
                <Flex justifyContent="end" className="truncate space-x-4">
                    <Button>Delete</Button>
                    <Button>Update Changes</Button>
                </Flex>
            </ListItem>
        </List>
    )
}

export default MemberDetails
