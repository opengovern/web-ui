import {
    Button,
    Card,
    Divider,
    Flex,
    Select,
    SelectItem,
    Text,
    Title,
} from '@tremor/react'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import jwtDecode from 'jwt-decode'
import { useAuthApiV1UserPreferencesUpdate } from '../../../api/auth.gen'
import { GithubComKaytuIoKaytuEnginePkgAuthApiTheme } from '../../../api/api'
import { colorBlindModeAtom, tokenAtom } from '../../../store'
import { applyTheme, currentTheme, parseTheme } from '../../../utilities/theme'
import { Auth0AppMetadata } from '../../../types/appMetadata'

export default function SettingsProfile() {
    const { user } = useAuth0()
    const token = useAtomValue(tokenAtom)
    const [colorBlindMode, setColorBlindMode] = useAtom(colorBlindModeAtom)

    const decodedToken =
        token === undefined || token === ''
            ? undefined
            : jwtDecode<Auth0AppMetadata>(token)

    const memberSince = decodedToken?.['https://app.kaytu.io/memberSince']
    const lastLogin = decodedToken?.['https://app.kaytu.io/userLastLogin']

    const [enableColorBlindMode, setEnableColorBlindMode] =
        useState<boolean>(colorBlindMode)
    const [theme, setTheme] =
        useState<GithubComKaytuIoKaytuEnginePkgAuthApiTheme>(currentTheme())

    const { response, isLoading, isExecuted, error, sendNow } =
        useAuthApiV1UserPreferencesUpdate(
            {
                enableColorBlindMode,
                theme,
            },
            {},
            false
        )
    useEffect(() => {
        if (!isLoading && isExecuted) {
            applyTheme(theme)
            setColorBlindMode(enableColorBlindMode)
        }
    }, [isLoading])

    return (
        <Card>
            {user?.picture && (
                <img
                    className="my-3 rounded-lg"
                    src={user?.picture}
                    alt={user.name}
                />
            )}
            <Title className="font-semibold">Profile Information</Title>
            <Flex flexDirection="col">
                <Divider className="my-1 py-1" />
                <Flex flexDirection="row" justifyContent="between">
                    <Text className="w-1/2">First Name</Text>
                    <Text className="w-1/2 text-gray-800">
                        {user?.given_name}
                    </Text>
                </Flex>
                <Divider className="my-1 py-1" />
                <Flex flexDirection="row" justifyContent="between">
                    <Text className="w-1/2">Last Name</Text>
                    <Text className="w-1/2 text-gray-800">
                        {user?.family_name}
                    </Text>
                </Flex>
                <Divider className="my-1 py-1" />
                <Flex flexDirection="row" justifyContent="between">
                    <Text className="w-1/2">Email</Text>
                    <Text className="w-1/2 text-gray-800">{user?.email}</Text>
                </Flex>
                <Divider className="my-1 py-1" />
                <Flex flexDirection="row" justifyContent="between">
                    <Text className="w-1/2">Member Since</Text>
                    <Text className="w-1/2 text-gray-800">{memberSince}</Text>
                </Flex>
                <Divider className="my-1 py-1" />
                <Flex flexDirection="row" justifyContent="between">
                    <Text className="w-1/2">Last Online</Text>
                    <Text className="w-1/2 text-gray-800">{lastLogin}</Text>
                </Flex>
            </Flex>
            <Title className="font-semibold mt-10">Personalization</Title>
            <Flex flexDirection="col">
                <Divider className="my-1 py-1" />
                <Flex flexDirection="row" justifyContent="between">
                    <Text className="w-1/2">Color Theme</Text>
                    <Select
                        disabled={isExecuted && isLoading}
                        value={theme}
                        onValueChange={(v) => {
                            setTheme(parseTheme(v))
                        }}
                        className="w-1/2"
                    >
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </Select>
                </Flex>
                <Divider className="my-1 py-1" />
                <Flex flexDirection="row" justifyContent="between">
                    <Text className="w-1/2">Accessibility Mode (WAI-ARIA)</Text>
                    <Select
                        disabled={isExecuted && isLoading}
                        value={String(enableColorBlindMode)}
                        onValueChange={(v) => {
                            setEnableColorBlindMode(v === 'true')
                        }}
                        className="w-1/2"
                    >
                        <SelectItem value="true">Enabled</SelectItem>
                        <SelectItem value="false">Disabled</SelectItem>
                    </Select>
                </Flex>
                <Flex flexDirection="row" justifyContent="end" className="mt-2">
                    <Button
                        loading={isExecuted && isLoading}
                        variant="secondary"
                        onClick={() => sendNow()}
                    >
                        Save
                    </Button>
                </Flex>
            </Flex>
        </Card>
    )
}
