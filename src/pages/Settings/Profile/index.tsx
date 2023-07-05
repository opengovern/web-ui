import React from 'react'
import { Card, Flex, List, ListItem, Text, Title } from '@tremor/react'
import { useAuth0 } from '@auth0/auth0-react'

const SettingsProfile: React.FC<any> = () => {
    const { user } = useAuth0()
    return (
        <Card className="flex-1 flex-grow">
            <Title>Profile</Title>

            {user?.picture && (
                <img
                    className="my-3 rounded-lg"
                    src={user?.picture}
                    alt={user.name}
                />
            )}

            <List className="mt-4">
                <ListItem key="lb">
                    <Flex>
                        <Text className="w-1/2 text-md text-gray-900 font-bold my-5">
                            First Name
                        </Text>
                        <Text className="w-1/2 text-md">{user?.name}</Text>
                    </Flex>
                </ListItem>
                <ListItem key="lb">
                    <Flex>
                        <Text className="w-1/2 text-md text-gray-900 font-bold my-5">
                            Last Name
                        </Text>
                        <Text className="w-1/2 text-md">
                            {user?.family_name}
                        </Text>
                    </Flex>
                </ListItem>
                <ListItem key="lb">
                    <Flex justifyContent="between">
                        <Text className="w-1/2 text-md text-gray-900 font-bold my-5">
                            Email
                        </Text>
                        <Text className="w-1/2 text-md">{user?.email}</Text>
                    </Flex>
                </ListItem>
                <ListItem key="lb">
                    <Flex>
                        <Text className="w-1/2 text-md text-gray-900 font-bold my-5">
                            Member Since
                        </Text>
                        <Text className="w-1/2 text-md">
                            {new Date(
                                Date.parse(
                                    user?.updated_at || Date.now().toString()
                                )
                            ).toLocaleDateString()}
                        </Text>
                    </Flex>
                </ListItem>
                <ListItem key="lb">
                    <Flex>
                        <Text className="w-1/2 text-md text-gray-900 font-bold my-5">
                            Last Login
                        </Text>
                        <Text className="w-1/2 text-md">
                            {new Date(
                                Date.parse(
                                    user?.updated_at || Date.now().toString()
                                )
                            ).toLocaleDateString()}
                        </Text>
                    </Flex>
                </ListItem>
            </List>
        </Card>
    )
}

export default SettingsProfile
