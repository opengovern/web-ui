import { Card, List, ListItem, Text, Title } from '@tremor/react'
import { useAuth0 } from '@auth0/auth0-react'

export default function SettingsProfile() {
    const { user } = useAuth0()
    return (
        <Card>
            <Title className="font-semibold">Profile</Title>
            {user?.picture && (
                <img
                    className="my-3 rounded-lg"
                    src={user?.picture}
                    alt={user.name}
                />
            )}
            <List className="mt-4">
                <ListItem className="my-1">
                    <Text className="w-1/2">First Name</Text>
                    <Text className="w-1/2 text-gray-800">
                        {user?.given_name}
                    </Text>
                </ListItem>
                <ListItem className="my-1">
                    <Text className="w-1/2">Last Name</Text>
                    <Text className="w-1/2 text-gray-800">
                        {user?.family_name}
                    </Text>
                </ListItem>
                <ListItem className="my-1">
                    <Text className="w-1/2">Email</Text>
                    <Text className="w-1/2 text-gray-800">{user?.email}</Text>
                </ListItem>
                <ListItem className="my-1">
                    <Text className="w-1/2">Member Since</Text>
                    <Text className="w-1/2 text-gray-800">
                        {new Date(
                            Date.parse(
                                user?.updated_at || Date.now().toString()
                            )
                        ).toLocaleDateString()}
                    </Text>
                </ListItem>
                <ListItem className="my-1">
                    <Text className="w-1/2">Last Login</Text>
                    <Text className="w-1/2 text-gray-800">
                        {new Date(
                            Date.parse(
                                user?.updated_at || Date.now().toString()
                            )
                        ).toLocaleDateString()}
                    </Text>
                </ListItem>
            </List>
        </Card>
    )
}
