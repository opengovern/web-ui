import React, { useState } from 'react'
import {
    Badge,
    Bold,
    Button,
    Card,
    Flex,
    List,
    ListItem,
    Table,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    Title,
} from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { RadioGroup } from '@headlessui/react'
import { useAuthApiV1WorkspaceRoleBindingsList } from '../../api/auth.gen'
import Spinner from '../../components/Spinner'
import DrawerPanel from '../../components/DrawerPanel'
import { GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding } from '../../api/api'

const MemberInvite: React.FC<any> = () => {
    return (
        <List className="mt-4">
            <ListItem key="lb" />
            <ListItem key="lb">
                <Flex justifyContent="start" className="truncate space-x-4">
                    <Text className="font-medium text-gray-800">
                        New Member Info
                    </Text>
                </Flex>
            </ListItem>
            <ListItem key="lb">
                <Flex justifyContent="start" className="truncate space-x-4">
                    <Text className="font-medium text-gray-800">Email*</Text>
                    <input className="font-medium text-gray-800" />
                </Flex>
            </ListItem>
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
                    <Button>Add</Button>
                </Flex>
            </ListItem>
            <ListItem key="lb">
                <Card>
                    <Title>New Members</Title>
                    <Table>
                        <TableHead>
                            <TableHeaderCell>Email Address</TableHeaderCell>
                            <TableHeaderCell>Role</TableHeaderCell>
                        </TableHead>
                        <TableRow>
                            <TableCell>Email Address</TableCell>
                            <TableCell>Role</TableCell>
                        </TableRow>
                    </Table>
                </Card>
            </ListItem>
        </List>
    )
}

export default MemberInvite
