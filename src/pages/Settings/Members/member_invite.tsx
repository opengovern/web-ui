import React, { useEffect, useState } from 'react'
import {
    Badge,
    Bold,
    Button,
    Card,
    Flex,
    List,
    ListItem,
    Subtitle,
    Table,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    TextInput,
    Title,
} from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { RadioGroup } from '@headlessui/react'
import {
    useAuthApiV1UserInviteCreate,
    useAuthApiV1WorkspaceRoleBindingsList,
} from '../../../api/auth.gen'
import Spinner from '../../../components/Spinner'
import DrawerPanel from '../../../components/DrawerPanel'
import { GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding } from '../../../api/api'

interface MemberInviteProps {
    close: (refresh: boolean) => void
}
const MemberInvite: React.FC<MemberInviteProps> = ({ close }) => {
    const [email, setEmail] = useState<string>('')
    const [role, setRole] = useState<string>('viewer')
    const [roleValue, setRoleValue] = useState<'viewer' | 'editor' | 'admin'>(
        'viewer'
    )

    const {
        isExecuted,
        isLoading,
        sendNow: createInvite,
    } = useAuthApiV1UserInviteCreate(
        { email: email || '', roleName: roleValue },
        {},
        false
    )

    useEffect(() => {
        if (role === 'viewer' || role === 'editor' || role === 'admin') {
            setRoleValue(role)
        }
    }, [role])

    useEffect(() => {
        if (isExecuted && !isLoading) {
            close(true)
        }
    }, [isLoading])

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

    return (
        <List className="mt-4">
            <ListItem key="title">
                <Flex justifyContent="start" className="truncate space-x-4">
                    <Subtitle className="text-gray-800 py-2">
                        New Member Info
                    </Subtitle>
                </Flex>
            </ListItem>
            <ListItem key="email">
                <Flex
                    justifyContent="between"
                    className="truncate space-x-4 py-2"
                >
                    <Text className="font-medium text-gray-800">Email*</Text>
                    <TextInput
                        className="font-medium w-1/2 text-gray-800"
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                </Flex>
            </ListItem>
            <ListItem key="role">
                <Flex
                    justifyContent="between"
                    alignItems="start"
                    className="truncate space-x-4"
                >
                    <Text className="font-medium text-gray-800">Role*</Text>

                    <div className="space-y-5 sm:mt-0 w-1/2">
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
            <ListItem key="buttons">
                <Flex justifyContent="end" className="truncate space-x-4">
                    <Button
                        loading={isExecuted && isLoading}
                        onClick={() => close(false)}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        loading={isExecuted && isLoading}
                        disabled={email.length === 0}
                        onClick={() => createInvite()}
                    >
                        Add
                    </Button>
                </Flex>
            </ListItem>
        </List>
    )
}

export default MemberInvite
